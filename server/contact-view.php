<?php
declare(strict_types=1);

function contact_form_markup(string $markup, array $state): string {
    $ready = $state['ready']; $values = $state['values'] ?? []; $errors = $state['errors'] ?? [];
    $markup = preg_replace_callback('/<form\b[^>]*data-contact-form\s[^>]*>/', function ($match) use ($ready) {
        $tag = cms_attribute($match[0], 'data-ready', $ready ? 'true' : 'false');
        return cms_attribute($tag, 'action', cms_base() . '/contacto.html#formulario');
    }, $markup);
    $markup = preg_replace_callback('/<fieldset\b[^>]*data-form-fields[^>]*>/', fn($match) => $ready ? preg_replace('/\sdisabled\b/', '', $match[0]) : $match[0], $markup);
    $markup = preg_replace_callback('/<input\b[^>]*name="([a-z_]+)"[^>]*>/', function ($match) use ($state, $values, $errors) {
        $key = $match[1]; $tag = $match[0];
        if (in_array($key, ['csrf', 'form_id', 'policy_version'], true)) return cms_attribute($tag, 'value', $state[$key]);
        if ($key === 'website') return $tag;
        if ($key === 'privacy_consent') {
            $tag = preg_replace('/\schecked\b/', '', $tag);
            if ($values[$key] ?? false) $tag = substr($tag, 0, -1) . ' checked>';
        } else $tag = cms_attribute($tag, 'value', $values[$key] ?? '');
        return cms_attribute($tag, 'aria-invalid', isset($errors[$key]) ? 'true' : 'false');
    }, $markup);
    $markup = preg_replace_callback('/(<textarea\b[^>]*name="message"[^>]*>)[\s\S]*?(<\/textarea>)/', fn($match) =>
        cms_attribute($match[1], 'aria-invalid', isset($errors['message']) ? 'true' : 'false') . cms_escape($values['message'] ?? '') . $match[2], $markup);
    $markup = preg_replace_callback('/(<span\b[^>]*data-form-error="([a-z_]+)"[^>]*>)[\s\S]*?(<\/span>)/', fn($match) =>
        $match[1] . cms_escape($errors[$match[2]] ?? '') . $match[3], $markup);
    $notice = cms_escape($state['message'] ?? ($ready ? '' : CONTACT_UNAVAILABLE));
    if ($errors) {
        $ids = ['first_name' => 'contact-first-name', 'last_name' => 'contact-last-name', 'email' => 'contact-email', 'phone' => 'contact-phone', 'subject' => 'contact-subject', 'message' => 'contact-message', 'privacy_consent' => 'contact-consent'];
        $notice .= '<ul>';
        foreach ($errors as $key => $message) $notice .= '<li><a href="#' . $ids[$key] . '">' . cms_escape($message) . '</a></li>';
        $notice .= '</ul>';
    }
    $markup = preg_replace_callback('/(<div\b[^>]*data-form-notice[^>]*>)[\s\S]*?(<\/div>)/', function ($match) use ($state, $notice) {
        $status = $state['status'] ?? 200;
        $tag = cms_attribute($match[1], 'role', $status >= 400 ? 'alert' : 'status');
        $tag = cms_attribute($tag, 'data-kind', ($state['ok'] ?? false) ? 'success' : ($status >= 400 ? 'error' : 'info'));
        return $tag . $notice . $match[2];
    }, $markup);
    return $markup;
}

function contact_page_html(array $content, ?array $response = null): string {
    contact_session();
    $state = $response ?? contact_new_form($content);
    if ($response === null && isset($_SESSION['contact_flash'])) {
        $state['message'] = $_SESSION['contact_flash']; $state['ok'] = true;
        unset($_SESSION['contact_flash']);
    }
    $state['ready'] = contact_ready($content);
    $html = cms_render(file_get_contents(cms_public_directory() . '/contacto.html'), $content);
    return cms_blocks($html, 'data-contact-form-slot', fn($key, $opening, $inside, $closing) => $opening . contact_form_markup($inside, $state) . $closing);
}

function contact_handle_request(bool $api): void {
    header('Cache-Control: private, no-store, no-cache, max-age=0');
    if ($api) header('X-Robots-Tag: noindex, nofollow');
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, ['GET', 'POST', 'HEAD'], true)) {
        http_response_code(405); header('Allow: GET, POST, HEAD'); return;
    }
    contact_session(); $content = cms_content();
    if ($method === 'HEAD') { header('Content-Type: ' . ($api ? 'application/json' : 'text/html') . '; charset=utf-8'); return; }
    $response = null;
    if ($method === 'POST') {
        if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768 || $_FILES) {
            $response = ['ok' => false, 'status' => 413, 'message' => 'La consulta supera el tamaño permitido. El formulario no admite archivos adjuntos.', 'values' => [], 'errors' => []] + contact_new_form($content);
        } else {
            $type = explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0];
            if (!in_array($type, ['application/x-www-form-urlencoded', 'multipart/form-data'], true)) {
                $response = ['ok' => false, 'status' => 415, 'message' => 'Formato no admitido. Utiliza el formulario de Contacto.', 'values' => [], 'errors' => []] + contact_new_form($content);
            } else $response = contact_submit($_POST, $content);
        }
        if (!$api && $response['ok']) {
            $_SESSION['contact_flash'] = $response['message'];
            header('Location: ' . cms_base() . '/contacto.html#formulario', true, 303); return;
        }
        http_response_code($response['status']);
        if (isset($response['retry_after'])) header('Retry-After: ' . $response['retry_after']);
    }
    if ($api) {
        $response ??= ['ok' => true, 'status' => 200, 'message' => contact_ready($content) ? '' : CONTACT_UNAVAILABLE, 'errors' => []] + contact_new_form($content);
        $response['ready'] = contact_ready($content);
        $response['clear_consent'] = ($response['values']['privacy_consent'] ?? true) === false;
        $response['policy_url'] = cms_base() . '/privacidad.html';
        unset($response['values']);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo contact_page_html($content, $response);
    }
}
