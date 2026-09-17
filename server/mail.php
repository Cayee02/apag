<?php
declare(strict_types=1);

function contact_mail_settings(array $content): array {
    $defaults = require __DIR__ . '/config.example.php';
    $configuration = getenv('APAG_MAIL_CONFIG') ?: __DIR__ . '/config.local.php';
    $local = is_file($configuration) ? require $configuration : [];
    if (!is_array($local)) throw new RuntimeException('Configuración de correo inválida.');
    $settings = array_replace($defaults, array_intersect_key($local, $defaults));
    foreach (array_keys($defaults) as $key) {
        $value = getenv('APAG_' . strtoupper($key));
        if ($value !== false && $value !== '') $settings[$key] = $value;
    }
    $settings['mail_to'] = $settings['mail_to'] ?: $content['texts']['contact.email'];
    $settings['smtp_port'] = (int) $settings['smtp_port'];
    return $settings;
}

function contact_mail_ready(array $settings): bool {
    $host = $settings['smtp_host'];
    $loopback = in_array($host, ['127.0.0.1', 'localhost', '::1'], true);
    return is_string($host) && $host !== '' && !preg_match('/[\s;\/\\\\]/', $host) &&
        $settings['smtp_port'] >= 1 && $settings['smtp_port'] <= 65535 &&
        filter_var($settings['mail_from'], FILTER_VALIDATE_EMAIL) && filter_var($settings['mail_to'], FILTER_VALIDATE_EMAIL) &&
        (in_array($settings['smtp_encryption'], ['tls', 'ssl'], true) || ($loopback && $settings['smtp_encryption'] === 'none')) &&
        ($settings['smtp_encryption'] === 'none' || extension_loaded('openssl')) &&
        ($loopback || ($settings['smtp_username'] !== '' && $settings['smtp_password'] !== '')) &&
        contact_mail_autoloader() !== null;
}

function contact_mail_autoloader(): ?string {
    foreach ([__DIR__ . '/vendor/autoload.php', dirname(__DIR__) . '/vendor/autoload.php'] as $path) {
        if (is_file($path)) return $path;
    }
    return null;
}

function contact_send_mail(array $data, array $settings, string $id, string $policyVersion): void {
    require_once contact_mail_autoloader();
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPDebug = 0;
    $mail->Host = $settings['smtp_host'];
    $mail->Port = $settings['smtp_port'];
    $mail->SMTPAuth = $settings['smtp_username'] !== '';
    $mail->Username = $settings['smtp_username'];
    $mail->Password = $settings['smtp_password'];
    $mail->SMTPSecure = match ($settings['smtp_encryption']) { 'tls' => $mail::ENCRYPTION_STARTTLS, 'ssl' => $mail::ENCRYPTION_SMTPS, default => '' };
    $mail->SMTPAutoTLS = $settings['smtp_encryption'] !== 'none';
    $mail->Timeout = 8;
    $mail->getSMTPInstance()->Timelimit = 10;
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->setFrom($settings['mail_from'], $settings['mail_from_name']);
    $mail->addAddress($settings['mail_to'], 'APAG');
    $mail->addReplyTo($data['email'], trim($data['first_name'] . ' ' . $data['last_name']));
    $mail->isHTML(false);
    $mail->Subject = '[APAG] ' . $data['subject'];
    $mail->Body = "Consulta desde el sitio APAG\n\n" .
        'Nombre: ' . trim($data['first_name'] . ' ' . $data['last_name']) . "\n" .
        'Correo: ' . $data['email'] . "\n" . 'Teléfono: ' . ($data['phone'] ?: 'No indicado') . "\n" .
        'Asunto: ' . $data['subject'] . "\n\nMensaje:\n" . $data['message'] . "\n\n" .
        "Aceptación de política: sí\nVersión de política: " . $policyVersion . "\n" .
        'Fecha UTC: ' . gmdate('Y-m-d H:i:s') . "\nReferencia: " . $id . "\n";
    $mail->send();
}
