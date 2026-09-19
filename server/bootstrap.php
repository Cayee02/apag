<?php
declare(strict_types=1);

require_once __DIR__ . '/storage.php';
require_once __DIR__ . '/render.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/images.php';
require_once __DIR__ . '/albums.php';

function cms_base(): string {
    $configured = getenv('APAG_BASE_PATH');
    $path = $configured !== false ? $configured : (in_array(PHP_SAPI, ['cli', 'cli-server'], true) ? '' : dirname($_SERVER['SCRIPT_NAME'] ?? '/index.php'));
    return $path === '' || $path === '/' || $path === '.' ? '' : '/' . trim($path, '/');
}

function cms_public_directory(): string {
    return getenv('APAG_PUBLIC_DIR') ?: dirname(__DIR__) . '/public';
}

function cms_headers(): void {
    header('Cache-Control: private, no-store, no-cache, max-age=0');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
}

function cms_serve_file(string $file, string $type, bool $immutable = false): void {
    header('Content-Type: ' . $type);
    header('Cache-Control: ' . ($immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600'));
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'HEAD') readfile($file);
}

function cms_handle_request(): void {
    cms_headers();
    try {
        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        if (!is_string($uri) || str_contains($uri, '\\') || str_contains($uri, "\0")) { http_response_code(400); return; }
        $base = cms_base();
        if ($base && !str_starts_with($uri, $base . '/') && $uri !== $base) { http_response_code(404); return; }
        $path = substr($uri, strlen($base)) ?: '/';
        if ($path === '/admin' || $path === '/admin/') {
            require_once __DIR__ . '/admin.php';
            cms_admin_request(); return;
        }
        if ($path === '/contacto.html' || $path === '/api/contacto') {
            require_once __DIR__ . '/contact.php';
            require_once __DIR__ . '/contact-view.php';
            contact_handle_request($path === '/api/contacto'); return;
        }
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if (!in_array($method, ['GET', 'HEAD'], true)) { http_response_code(405); header('Allow: GET, HEAD'); return; }
        if (preg_match('~^/media/([a-f0-9]{32}-[0-9]+\.webp)$~', $path, $match)) {
            $file = cms_storage() . '/media/' . $match[1];
            if (is_file($file)) { cms_serve_file($file, 'image/webp', true); return; }
        }
        if (in_array($path, ['/admin-assets/admin.css', '/admin-assets/admin.js'], true)) {
            $type = str_ends_with($path, '.css') ? 'text/css' : 'text/javascript';
            cms_serve_file(__DIR__ . $path, $type . '; charset=utf-8'); return;
        }
        $adminFonts = ['manrope-600.woff2' => 'manrope-latin-600-normal-', 'inter-400.woff2' => 'inter-latin-400-normal-', 'inter-600.woff2' => 'inter-latin-600-normal-'];
        if (str_starts_with($path, '/admin-assets/') && isset($adminFonts[basename($path)])) {
            $files = glob(cms_public_directory() . '/assets/' . $adminFonts[basename($path)] . '*.woff2');
            if ($files) { cms_serve_file($files[0], 'font/woff2'); return; }
        }
        $pages = ['/' => 'index.html', '/index.php' => 'index.html', '/index.html' => 'index.html', '/servicios.html' => 'servicios.html', '/nosotros.html' => 'nosotros.html', '/galeria.html' => 'galeria.html', '/privacidad.html' => 'privacidad.html'];
        if (isset($pages[$path])) { $page = $pages[$path]; }
        else {
            $root = realpath(cms_public_directory());
            $file = $root ? realpath($root . $path) : false;
            $types = ['css' => 'text/css', 'js' => 'text/javascript', 'woff' => 'font/woff', 'woff2' => 'font/woff2', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'svg' => 'image/svg+xml', 'txt' => 'text/plain', 'xml' => 'application/xml'];
            $extension = $file ? strtolower(pathinfo($file, PATHINFO_EXTENSION)) : '';
            if ($root && $file && str_starts_with($file, $root . DIRECTORY_SEPARATOR) && is_file($file) && isset($types[$extension])) {
                cms_serve_file($file, $types[$extension] . (in_array($extension, ['css', 'js', 'txt', 'xml'], true) ? '; charset=utf-8' : ''), str_starts_with($path, '/assets/')); return;
            }
            http_response_code(404); $page = '404.html';
        }
        $template = cms_public_directory() . '/' . $page;
        if (!is_file($template)) throw new RuntimeException('Compila el frontend antes de iniciar PHP.');
        $content = cms_content();
        $publicContent = $content;
        if ($page === 'privacidad.html' && !($content['privacy_approved'] ?? false)) {
            $publicContent['texts']['privacy.title'] = cms_schema()['fields']['privacy.title']['value'];
            $publicContent['texts']['privacy.body'] = '[CONTENIDO PENDIENTE APAG]';
        }
        $html = cms_render(file_get_contents($template), $publicContent);
        if ($page === 'privacidad.html' && !($content['privacy_approved'] ?? false)) {
            $html = preg_replace('/(<meta name="robots" content=")[^"]*(">)/', '$1noindex, nofollow$2', $html);
        }
        if ($page === '404.html') {
            // A missing nested URL must still resolve navigation and built resources.
            $html = preg_replace_callback('/\b(src|href)="\.\/([^"]*)"/', fn($match) => $match[1] . '="' . cms_escape($base . '/' . $match[2]) . '"', $html);
            $html = preg_replace_callback('/\bsrcset="([^"]+)"/', fn($match) => 'srcset="' . str_replace('./', cms_escape($base . '/'), $match[1]) . '"', $html);
        }
        header('Content-Type: text/html; charset=utf-8');
        if ($method !== 'HEAD') echo $html;
    } catch (Throwable $error) {
        error_log('APAG CMS: ' . $error->getMessage());
        http_response_code(500);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'No se pudo cargar la página. Inténtalo de nuevo en unos minutos.';
    }
}
