<?php
declare(strict_types=1);
require_once __DIR__ . '/mail.php';

const CONTACT_UNAVAILABLE = 'El formulario no está disponible en este momento. Puedes escribirnos por correo o llamarnos.';

function contact_policy_version(array $content): string {
    return hash('sha256', $content['texts']['privacy.title'] . "\n" . $content['texts']['privacy.body']);
}

function contact_ready(array $content): bool {
    return ($content['privacy_approved'] ?? false) === true &&
        $content['texts']['privacy.body'] !== '[CONTENIDO PENDIENTE APAG]' && contact_mail_ready(contact_mail_settings($content));
}

function contact_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $directory = cms_storage() . '/contact-sessions';
    if (!is_dir($directory)) mkdir($directory, 0700, true);
    session_save_path($directory); session_name('apag_contact');
    session_start([
        'use_strict_mode' => true, 'use_only_cookies' => true, 'cookie_httponly' => true,
        'cookie_secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || getenv('APAG_HTTPS') === 'true',
        'cookie_samesite' => 'Strict', 'cookie_path' => cms_base() . '/', 'cookie_lifetime' => 0,
    ]);
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
    $_SESSION['forms'] ??= [];
    $_SESSION['forms'] = array_filter($_SESSION['forms'], fn($form) => microtime(true) - $form['issued'] <= 3600);
}

function contact_new_form(array $content): array {
    $id = bin2hex(random_bytes(16));
    $version = contact_policy_version($content);
    $_SESSION['forms'][$id] = ['issued' => microtime(true), 'state' => 'ready', 'policy' => $version];
    if (count($_SESSION['forms']) > 10) $_SESSION['forms'] = array_slice($_SESSION['forms'], -10, null, true);
    return ['csrf' => $_SESSION['csrf'], 'form_id' => $id, 'policy_version' => $version];
}

function contact_validate(array $input): array {
    $limits = ['first_name' => [2, 80], 'last_name' => [0, 80], 'email' => [3, 254], 'phone' => [0, 30], 'subject' => [3, 160], 'message' => [20, 4000]];
    $labels = ['first_name' => 'nombre', 'last_name' => 'apellido', 'email' => 'correo', 'phone' => 'teléfono', 'subject' => 'asunto', 'message' => 'mensaje'];
    $data = []; $errors = [];
    foreach ($limits as $key => [$minimum, $maximum]) {
        $value = $input[$key] ?? '';
        if (!is_string($value) || !mb_check_encoding($value, 'UTF-8')) {
            $data[$key] = ''; $errors[$key] = 'Revisa el ' . $labels[$key] . '.'; continue;
        }
        $value = trim(str_replace(["\r\n", "\r"], "\n", $value));
        $data[$key] = $value;
        if (mb_strlen($value) < $minimum || mb_strlen($value) > $maximum || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value) || ($key !== 'message' && preg_match('/[\r\n]/', $value))) {
            $errors[$key] = 'El ' . $labels[$key] . ' debe tener ' . ($minimum ? "entre $minimum y $maximum" : "hasta $maximum") . ' caracteres.';
        }
    }
    if (!isset($errors['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Escribe un correo válido.';
    if ($data['phone'] !== '' && (!preg_match('/^\+?[0-9 ()\-]+$/', $data['phone']) || strlen(preg_replace('/\D/', '', $data['phone'])) < 7 || strlen(preg_replace('/\D/', '', $data['phone'])) > 15)) $errors['phone'] = 'Escribe un teléfono válido, con código de país si corresponde.';
    $data['privacy_consent'] = ($input['privacy_consent'] ?? null) === '1';
    if (!$data['privacy_consent']) $errors['privacy_consent'] = 'Debes leer y aceptar la política de privacidad.';
    return [$data, $errors];
}

function contact_reserve_attempt(): int {
    $secret = cms_locked('contact-secret', function ($path) {
        $record = cms_read_json($path, []);
        if (!$record) { $record = ['key' => bin2hex(random_bytes(32))]; cms_atomic_json($path, $record); }
        return $record['key'];
    });
    $key = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $secret);
    return cms_locked('contact-rate', function ($path) use ($key) {
        $now = time();
        $attempts = array_filter(cms_read_json($path, []), fn($item) => $now - $item['start'] < 900);
        $record = $attempts[$key] ?? ['start' => $now, 'last' => 0, 'count' => 0];
        if ($record['count'] >= 5) return max(1, 900 - ($now - $record['start']));
        if ($now - $record['last'] < 60) return 60 - ($now - $record['last']);
        $attempts[$key] = ['start' => $record['start'], 'last' => $now, 'count' => $record['count'] + 1];
        if (count($attempts) > 1000) $attempts = array_slice($attempts, -1000, null, true);
        cms_atomic_json($path, $attempts);
        return 0;
    });
}

function contact_submit(array $input, array $content): array {
    [$values, $errors] = contact_validate($input);
    $response = ['ok' => false, 'values' => $values, 'errors' => $errors, 'status' => 422, 'message' => 'Revisa los campos marcados antes de enviar.'];
    $csrf = $input['csrf'] ?? null; $id = $input['form_id'] ?? null;
    if (!is_string($csrf) || !hash_equals($_SESSION['csrf'], $csrf) || !is_string($id) || !isset($_SESSION['forms'][$id])) {
        return array_replace($response, ['status' => 403, 'message' => 'El formulario venció. Revisa los datos e inténtalo de nuevo.'], contact_new_form($content));
    }
    $form = $_SESSION['forms'][$id];
    $fingerprint = hash_hmac('sha256', json_encode($values, JSON_THROW_ON_ERROR), $_SESSION['csrf']);
    $tokens = ['csrf' => $_SESSION['csrf'], 'form_id' => $id, 'policy_version' => $form['policy']];
    if ($form['state'] === 'sent') {
        if (!hash_equals($form['fingerprint'], $fingerprint)) return array_replace($response, ['status' => 409, 'errors' => [], 'message' => 'El envío anterior ya se completó. Revisa esta nueva consulta y vuelve a enviarla.'], contact_new_form($content));
        return ['ok' => true, 'errors' => [], 'status' => 200, 'message' => 'Tu consulta fue enviada. Gracias por contactar con APAG.', 'values' => []] + contact_new_form($content);
    }
    if ($form['state'] === 'processing') return array_replace($response, ['status' => 409, 'errors' => [], 'message' => 'Tu consulta ya se está enviando. Espera un momento.'], $tokens);
    if ($form['state'] === 'failed') return array_replace($response, ['status' => 503, 'errors' => [], 'message' => 'No pudimos enviar la consulta. Tus datos siguen en el formulario; inténtalo más tarde.'], contact_new_form($content));
    $trap = $input['website'] ?? '';
    if (!is_string($trap) || trim($trap) !== '') return array_replace($response, ['status' => 422, 'errors' => [], 'message' => 'No pudimos procesar la consulta. Utiliza el correo o los teléfonos de APAG.'], $tokens);
    if (!contact_ready($content)) return array_replace($response, ['status' => 503, 'errors' => [], 'message' => CONTACT_UNAVAILABLE], $tokens);
    $policy = $input['policy_version'] ?? null;
    if (!is_string($policy) || !hash_equals(contact_policy_version($content), $policy) || !hash_equals($form['policy'], $policy)) {
        $response['errors']['privacy_consent'] = 'La política fue actualizada. Léela y vuelve a aceptarla.';
        $response['values']['privacy_consent'] = false;
        return array_replace($response, ['status' => 409, 'message' => 'La política de privacidad cambió. Revisa su versión actual.'], contact_new_form($content));
    }
    if ($errors) return $response + $tokens;
    $elapsed = microtime(true) - $form['issued'];
    if ($elapsed < 2) return array_replace($response, ['status' => 429, 'errors' => [], 'retry_after' => (int) ceil(2 - $elapsed), 'message' => 'Espera unos segundos antes de enviar la consulta.'], $tokens);
    if ($elapsed > 1800) return array_replace($response, ['status' => 403, 'errors' => [], 'message' => 'El formulario venció. Revisa los datos e inténtalo de nuevo.'], contact_new_form($content));
    $retry = contact_reserve_attempt();
    if ($retry) return array_replace($response, ['status' => 429, 'errors' => [], 'retry_after' => $retry, 'message' => 'Espera ' . $retry . ' segundos antes de enviar otra consulta.'], $tokens);
    $_SESSION['forms'][$id]['state'] = 'processing';
    $_SESSION['forms'][$id]['fingerprint'] = $fingerprint;
    session_write_close();
    try {
        contact_send_mail($values, contact_mail_settings($content), $id, $policy);
        $sent = true;
    } catch (Throwable $failure) {
        // Do not log submitted personal data, passwords or SMTP server responses.
        error_log('APAG contact: SMTP delivery failed; reference=' . $id);
        $sent = false;
    }
    contact_session();
    $_SESSION['forms'][$id]['state'] = $sent ? 'sent' : 'failed';
    if (!$sent) return array_replace($response, ['status' => 503, 'errors' => [], 'message' => 'No pudimos enviar la consulta. Tus datos siguen en el formulario; inténtalo más tarde.'], contact_new_form($content));
    return ['ok' => true, 'errors' => [], 'status' => 200, 'message' => 'Tu consulta fue enviada. Gracias por contactar con APAG.', 'values' => []] + contact_new_form($content);
}
