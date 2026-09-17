<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__) . '/bootstrap.php';
try {
    $input = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($input) || !is_string($input['username'] ?? null) || !is_string($input['password'] ?? null)) throw new CmsValidation('Datos de cuenta no válidos.');
    $username = trim($input['username']); $password = $input['password'];
    if (!preg_match('/^[a-zA-Z0-9_.@-]{3,60}$/', $username)) throw new CmsValidation('El usuario debe tener de 3 a 60 letras, números, puntos, guiones o @.');
    cms_validate_password($password);
    cms_locked('admin', function ($path) use ($username, $password, $input) {
        if (is_file($path) && ($input['replace'] ?? false) !== true) throw new CmsValidation('La cuenta ya existe. Usa --reset para reemplazarla.');
        cms_atomic_json($path, ['username' => $username, 'password_hash' => password_hash($password, PASSWORD_DEFAULT), 'version' => bin2hex(random_bytes(24))]);
    });
    echo "Cuenta administrativa activada.\n";
} catch (Throwable $error) {
    fwrite(STDERR, $error->getMessage() . "\n"); exit(1);
}
