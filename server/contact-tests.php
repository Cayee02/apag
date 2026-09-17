<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/contact.php';
require __DIR__ . '/contact-view.php';
function ensure(bool $condition, string $message): void { if (!$condition) throw new RuntimeException($message); }
$valid = ['first_name' => ' José ', 'last_name' => "O'Leary", 'email' => 'persona@example.test', 'phone' => '+595 989 123 456', 'subject' => 'Consulta de prueba', 'message' => "Quiero información confirmada sobre APAG.\nMuchas gracias.", 'privacy_consent' => '1'];
[$data, $errors] = contact_validate($valid);
ensure(!$errors && $data['first_name'] === 'José', 'Trim y nombres con acentos');
foreach (['first_name' => [], 'email' => "x@example.test\r\nBcc: x@example.test", 'subject' => "Consulta\nBcc: algo", 'message' => 'Breve', 'phone' => '123+456789', 'privacy_consent' => '0'] as $key => $value) {
    [, $errors] = contact_validate(array_replace($valid, [$key => $value]));
    ensure(isset($errors[$key]), 'Validación independiente de ' . $key);
}
[, $errors] = contact_validate(array_replace($valid, ['last_name' => '', 'phone' => '']));
ensure(!$errors, 'Apellido y teléfono opcionales');
$content = cms_default_content();
ensure(!contact_ready($content), 'Pendiente por defecto');
ensure(!contact_mail_ready(['smtp_host' => 'smtp.example.test', 'smtp_port' => 25, 'smtp_encryption' => 'none', 'smtp_username' => '', 'smtp_password' => '', 'mail_from' => 'sender@example.test', 'mail_to' => 'to@example.test']), 'No SMTP externo en texto claro');
$policy = contact_policy_version($content);
$content['texts']['contact.address'] = 'Otra dirección';
ensure(contact_policy_version($content) === $policy, 'Contacto no invalida aceptación de política');
$content['texts']['privacy.body'] = 'Texto de prueba distinto';
ensure(contact_policy_version($content) !== $policy, 'Cambio de política invalida versión');
$legacy = cms_default_content(); unset($legacy['privacy_approved'], $legacy['texts']['privacy.body'], $legacy['texts']['privacy.title']);
cms_locked('content', fn($path) => cms_atomic_json($path, $legacy));
ensure(cms_content()['texts']['privacy.body'] === '[CONTENIDO PENDIENTE APAG]' && cms_content()['privacy_approved'] === false, 'Compatibilidad de contenido anterior');
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
ensure(contact_reserve_attempt() === 0 && contact_reserve_attempt() > 0, 'Intervalo mínimo entre intentos');
cms_locked('contact-rate', function ($path) {
    $rates = cms_read_json($path, []);
    foreach ($rates as &$rate) { $rate['count'] = 5; $rate['last'] = time() - 61; }
    unset($rate); cms_atomic_json($path, $rates);
});
ensure(contact_reserve_attempt() > 0, 'Límite de cinco intentos por ventana');
$template = file_get_contents(cms_public_directory() . '/contacto.html');
$markup = contact_form_markup($template, ['ready' => true, 'csrf' => str_repeat('a', 64), 'form_id' => str_repeat('b', 32), 'policy_version' => $policy, 'status' => 422, 'message' => 'Revisa', 'values' => ['first_name' => '<img src=x>', 'message' => '</textarea><script>bad</script>', 'privacy_consent' => true], 'errors' => ['first_name' => 'Nombre inválido']]);
ensure(str_contains($markup, 'data-ready="true"') && !str_contains($markup, '<fieldset disabled'), 'Formulario listo en HTML sin JS');
ensure(!str_contains($markup, '<script>bad') && str_contains($markup, '&lt;/textarea&gt;'), 'Datos de error escapados');
ensure(str_contains($markup, 'href="#contact-first-name"') && str_contains($markup, 'aria-invalid="true"'), 'Errores accesibles y foco');
echo "OK formulario PHP: validación, inyección de cabeceras, política, datos anteriores, límites y render seguro\n";
