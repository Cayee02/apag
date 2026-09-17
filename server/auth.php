<?php
declare(strict_types=1);

function cms_admin_record(): array {
    return cms_locked('admin', fn($path) => cms_read_json($path, []), false);
}

function cms_session(): void {
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || getenv('APAG_HTTPS') === 'true';
    $sessionDirectory = cms_storage() . '/sessions';
    if (!is_dir($sessionDirectory)) mkdir($sessionDirectory, 0700, true);
    session_save_path($sessionDirectory);
    session_name('apag_admin');
    session_start([
        'use_strict_mode' => true, 'use_only_cookies' => true,
        'cookie_httponly' => true, 'cookie_secure' => $secure,
        'cookie_samesite' => 'Strict', 'cookie_path' => cms_base() . '/admin',
        'cookie_lifetime' => 0,
    ]);
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
}

function cms_csrf_valid(mixed $value): bool {
    return is_string($value) && hash_equals($_SESSION['csrf'] ?? '', $value);
}

function cms_authenticated(): bool {
    $record = cms_admin_record();
    $now = time();
    if (!$record || !isset($_SESSION['admin_version']) || !hash_equals($record['version'], $_SESSION['admin_version']) ||
        $now - ($_SESSION['last_seen'] ?? 0) > 1800 || $now - ($_SESSION['signed_in'] ?? 0) > 28800) {
        unset($_SESSION['admin_version'], $_SESSION['last_seen'], $_SESSION['signed_in']);
        return false;
    }
    $_SESSION['last_seen'] = $now;
    return true;
}

function cms_login(string $username, string $password): bool {
    $key = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
    return cms_locked('login-attempts', function ($path) use ($key, $username, $password) {
        $attempts = cms_read_json($path, []);
        $now = time();
        $attempts = array_filter($attempts, fn($attempt) => $now - $attempt['start'] < 900);
        if (($attempts[$key]['count'] ?? 0) >= 5) throw new CmsValidation('Demasiados intentos. Espera 15 minutos antes de volver a intentar.');
        $record = cms_admin_record();
        // The dummy hash keeps unknown usernames on the same password verification path.
        $hash = $record['password_hash'] ?? '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi';
        $validPassword = password_verify($password, $hash);
        $valid = $record && hash_equals($record['username'], $username) && $validPassword;
        if (!$valid) {
            $attempts[$key] = ['start' => $attempts[$key]['start'] ?? $now, 'count' => ($attempts[$key]['count'] ?? 0) + 1];
            if (count($attempts) > 1000) $attempts = array_slice($attempts, -1000, null, true);
        } else unset($attempts[$key]);
        cms_atomic_json($path, $attempts);
        if ($valid) {
            session_regenerate_id(true);
            $_SESSION = ['csrf' => bin2hex(random_bytes(32)), 'admin_version' => $record['version'], 'signed_in' => $now, 'last_seen' => $now];
        }
        return (bool) $valid;
    });
}

function cms_validate_password(string $password): void {
    if (mb_strlen($password) < 12 || strlen($password) > 72) throw new CmsValidation('Usa al menos 12 caracteres y acorta la contraseña si supera el límite permitido.');
}

function cms_change_password(string $old, string $new, string $confirmation): void {
    cms_validate_password($new);
    if ($new !== $confirmation) throw new CmsValidation('Las contraseñas nuevas no coinciden.');
    $version = cms_locked('admin', function ($path) use ($old, $new) {
        $record = cms_read_json($path, []);
        if (!$record || !password_verify($old, $record['password_hash'])) throw new CmsValidation('La contraseña actual no es correcta.');
        $record['password_hash'] = password_hash($new, PASSWORD_DEFAULT);
        $record['version'] = bin2hex(random_bytes(24));
        cms_atomic_json($path, $record);
        return $record['version'];
    });
    session_regenerate_id(true);
    $_SESSION['admin_version'] = $version;
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

function cms_logout(): void {
    $_SESSION = [];
    $parameters = session_get_cookie_params();
    setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => $parameters['path'], 'secure' => $parameters['secure'], 'httponly' => true, 'samesite' => 'Strict']);
    session_destroy();
}
