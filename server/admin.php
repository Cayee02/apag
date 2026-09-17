<?php
declare(strict_types=1);

function cms_post_string(string $key, int $max = 8000): string {
    $value = $_POST[$key] ?? '';
    if (!is_string($value) || strlen($value) > $max) throw new CmsValidation('Solicitud no válida.');
    return $value;
}

function cms_revision(): int {
    $value = cms_post_string('revision', 12);
    if (!preg_match('/^[0-9]{1,10}$/', $value)) throw new CmsValidation('Recarga la página antes de guardar.');
    return (int) $value;
}

function cms_admin_redirect(string $section = 'home'): never {
    header('Location: ' . cms_base() . '/admin?section=' . rawurlencode($section), true, 303);
    exit;
}

function cms_admin_request(): void {
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'");
    header('X-Frame-Options: DENY');
    header('Content-Type: text/html; charset=utf-8');
    cms_session();
    $sections = ['home' => 'Inicio', 'about' => 'Sobre APAG', 'services' => 'Servicios', 'gallery' => 'Fotos de Inicio', 'albums' => 'Galería', 'images' => 'Fotografías', 'contact' => 'Contacto', 'privacy' => 'Privacidad', 'account' => 'Mi cuenta'];
    $section = $_GET['section'] ?? 'home';
    if (!is_string($section) || !isset($sections[$section])) $section = 'home';
    $error = ''; $authenticated = cms_authenticated();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, ['GET', 'POST', 'HEAD'], true)) { http_response_code(405); header('Allow: GET, POST, HEAD'); return; }
    if ($method === 'POST') {
        try {
            if (!cms_csrf_valid($_POST['csrf'] ?? null)) { http_response_code(403); throw new CmsValidation('La sesión del formulario venció. Recarga la página e inténtalo de nuevo.'); }
            $action = cms_post_string('action', 30);
            if ($action === 'login') {
                if (!cms_admin_record()) throw new CmsValidation('El acceso administrativo todavía no está activado.');
                if (!cms_login(cms_post_string('username', 60), cms_post_string('password', 128))) throw new CmsValidation('El usuario o la contraseña no son correctos.');
                cms_admin_redirect();
            }
            if (!$authenticated) { http_response_code(401); throw new CmsValidation('Inicia sesión para administrar el sitio.'); }
            if ($action === 'logout') { cms_logout(); cms_admin_redirect(); }
            if ($action === 'save') {
                if (!in_array($section, ['home', 'about', 'services', 'gallery', 'contact', 'privacy'], true)) throw new CmsValidation('Selecciona una sección válida.');
                $input = $_POST['texts'] ?? [];
                if (!is_array($input)) throw new CmsValidation('Contenido no válido.');
                $texts = cms_validate_texts($input, $section);
                $approved = $section === 'privacy' ? ($_POST['privacy_approved'] ?? '') === '1' : null;
                $institutionalApprovals = $section === 'about' ? ['mission' => ($_POST['mission_approved'] ?? '') === '1', 'vision' => ($_POST['vision_approved'] ?? '') === '1'] : null;
                foreach ($institutionalApprovals ?? [] as $key => $isApproved) if ($isApproved && str_contains($texts['about.' . $key], '[CONTENIDO PENDIENTE APAG]')) throw new CmsValidation('Carga el texto aprobado antes de aprobar misión o visión.');
                if ($approved && str_contains($texts['privacy.body'], '[CONTENIDO PENDIENTE APAG]')) throw new CmsValidation('Carga el texto aprobado antes de publicar la política de privacidad.');
                $services = $section === 'services' ? cms_validate_services(is_array($_POST['services'] ?? null) ? $_POST['services'] : []) : null;
                cms_update_content(cms_revision(), function ($current) use ($texts, $services, $approved, $institutionalApprovals) {
                    $current['texts'] = array_replace($current['texts'], $texts);
                    if ($services !== null) $current['services'] = $services;
                    if ($approved !== null) $current['privacy_approved'] = $approved;
                    if ($institutionalApprovals !== null) $current['institutional_approvals'] = $institutionalApprovals;
                    return $current;
                });
            } elseif ($action === 'image' || $action === 'reset-image') {
                $slot = cms_post_string('slot', 40);
                if (!isset(cms_schema()['images'][$slot])) throw new CmsValidation('Selecciona una fotografía válida.');
                $revision = cms_revision();
                if ($action === 'reset-image') {
                    cms_update_content($revision, function ($current) use ($slot) { unset($current['images'][$slot]); return $current; });
                } else {
                    $alt = cms_post_string('alt', 1200);
                    if (!mb_check_encoding($alt, 'UTF-8') || mb_strlen($alt) > 300 || ($slot !== 'hero' && trim($alt) === '')) throw new CmsValidation('Describe brevemente la imagen (hasta 300 caracteres).');
                    $upload = $_FILES['photo'] ?? null;
                    $prepared = null;
                    if (is_array($upload) && ($upload['error'] ?? null) !== UPLOAD_ERR_NO_FILE) $prepared = cms_upload_image($upload, $slot, $alt);
                    try {
                        cms_update_content($revision, function ($current) use ($slot, $alt, $prepared) {
                            $image = $prepared ?? ($current['images'][$slot] ?? []);
                            unset($image['files']); $image['alt'] = trim($alt);
                            $current['images'][$slot] = $image;
                            return $current;
                        });
                    } catch (Throwable $failure) {
                        foreach ($prepared['files'] ?? [] as $file) if (is_file($file)) unlink($file);
                        throw $failure;
                    }
                }
                $section = 'images';
            } elseif (in_array($action, ['album-save', 'album-delete', 'photo-add', 'photo-save', 'photo-delete', 'photo-move'], true)) {
                cms_album_action($action);
                $section = 'albums';
            } elseif ($action === 'password') {
                cms_change_password(cms_post_string('old_password', 128), cms_post_string('new_password', 128), cms_post_string('confirm_password', 128));
                $section = 'account';
            } else throw new CmsValidation('Acción no válida.');
            $_SESSION['flash'] = 'Cambios guardados. Ya están disponibles en la web.';
            if ($action === 'password') $_SESSION['flash'] = 'Contraseña actualizada.';
            cms_admin_redirect($section);
        } catch (CmsConflict $failure) {
            http_response_code(409); $error = $failure->getMessage();
        } catch (CmsValidation $failure) {
            if (http_response_code() < 400) http_response_code(422);
            $error = $failure->getMessage();
        }
    }
    if ($method === 'HEAD') return;
    $configured = (bool) cms_admin_record();
    $content = $authenticated ? cms_content() : null;
    $flash = $_SESSION['flash'] ?? ''; unset($_SESSION['flash']);
    $base = cms_base(); $csrf = $_SESSION['csrf'];
    require __DIR__ . '/views/admin.php';
}
