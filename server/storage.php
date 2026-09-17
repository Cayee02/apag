<?php
declare(strict_types=1);

final class CmsConflict extends RuntimeException {}
final class CmsValidation extends RuntimeException {}

function cms_schema(): array {
    static $schema;
    return $schema ??= json_decode(file_get_contents(__DIR__ . '/schema.json'), true, 512, JSON_THROW_ON_ERROR);
}

function cms_storage(): string {
    $path = getenv('APAG_STORAGE_DIR') ?: dirname(__DIR__) . '/storage';
    if (!is_dir($path) && !mkdir($path, 0700, true) && !is_dir($path)) {
        throw new RuntimeException('No se pudo crear el almacenamiento.');
    }
    $resolved = realpath($path);
    $public = realpath(cms_public_directory());
    if ($resolved && $public) {
        $candidate = PHP_OS_FAMILY === 'Windows' ? strtolower($resolved) : $resolved;
        $root = PHP_OS_FAMILY === 'Windows' ? strtolower($public) : $public;
        if ($candidate === $root || str_starts_with($candidate, $root . DIRECTORY_SEPARATOR)) {
            throw new RuntimeException('El almacenamiento debe estar fuera de la raíz pública.');
        }
    }
    // Also deny direct access if a local Apache document root includes the project.
    $accessRule = $path . '/.htaccess';
    if (!is_file($accessRule) && file_put_contents($accessRule, "Require all denied\n") === false) {
        throw new RuntimeException('No se pudo proteger el almacenamiento.');
    }
    return $path;
}

function cms_default_content(): array {
    $texts = [];
    foreach (cms_schema()['fields'] as $key => $field) $texts[$key] = $field['value'];
    return ['revision' => 0, 'texts' => $texts, 'services' => cms_schema()['services'], 'images' => [], 'albums' => cms_schema()['albums'], 'privacy_approved' => false, 'institutional_approvals' => ['mission' => false, 'vision' => false]];
}

function cms_read_json(string $path, array $fallback): array {
    if (!is_file($path)) return $fallback;
    $value = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($value)) throw new RuntimeException('Archivo de datos inválido.');
    return $value;
}

function cms_atomic_json(string $path, array $value): void {
    $json = json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $temporary = tempnam(dirname($path), '.cms-');
    if ($temporary === false) throw new RuntimeException('No se pudo preparar el guardado.');
    try {
        if (file_put_contents($temporary, $json . "\n") === false) throw new RuntimeException('No se pudo escribir el contenido.');
        chmod($temporary, 0600);
        if (!rename($temporary, $path)) throw new RuntimeException('No se pudo confirmar el guardado.');
    } finally {
        if (is_file($temporary)) unlink($temporary);
    }
}

function cms_locked(string $name, callable $callback, bool $exclusive = true): mixed {
    $directory = cms_storage();
    $lock = fopen($directory . '/' . $name . '.lock', 'c');
    if ($lock === false || !flock($lock, $exclusive ? LOCK_EX : LOCK_SH)) throw new RuntimeException('Almacenamiento no disponible.');
    try { return $callback($directory . '/' . $name . '.json'); }
    finally { flock($lock, LOCK_UN); fclose($lock); }
}

function cms_content(): array {
    return cms_locked('content', fn($path) => cms_read_content($path), false);
}

function cms_read_content(string $path): array {
    $defaults = cms_default_content();
    $saved = cms_read_json($path, $defaults);
    $saved['texts'] = array_replace($defaults['texts'], $saved['texts']);
    return array_replace($defaults, $saved);
}

function cms_update_content(int $revision, callable $change): array {
    return cms_locked('content', function ($path) use ($revision, $change) {
        $current = cms_read_content($path);
        if ($current['revision'] !== $revision) throw new CmsConflict('Hay cambios más recientes. Recarga la página antes de guardar de nuevo.');
        $next = $change($current);
        $next['revision'] = $current['revision'] + 1;
        cms_atomic_json($path . '.bak', $current);
        cms_atomic_json($path, $next);
        return $next;
    });
}

function cms_validate_texts(array $input, string $group): array {
    $result = [];
    foreach (cms_schema()['fields'] as $key => $field) {
        if ($field['group'] !== $group) continue;
        $value = $input[$key] ?? null;
        if (!is_string($value) || !mb_check_encoding($value, 'UTF-8')) throw new CmsValidation('Revisa el campo: ' . $field['label']);
        $value = trim(str_replace(["\r\n", "\r"], "\n", $value));
        if ($value === '' || mb_strlen($value) > $field['max'] || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', $value)) {
            throw new CmsValidation('Revisa la longitud del campo: ' . $field['label']);
        }
        $kind = $field['kind'] ?? '';
        if ($kind === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) throw new CmsValidation('El correo no es válido.');
        if ($kind === 'phone' && !preg_match('/^\+[1-9][0-9]{7,14}$/', $value)) throw new CmsValidation('Usa el teléfono internacional, por ejemplo +595 seguido del número.');
        $lines = $field['lines'] ?? 2;
        if (in_array($kind, ['hero', 'manifesto'], true) && count(explode("\n", $value)) !== $lines) throw new CmsValidation('El título debe tener exactamente ' . $lines . ' líneas.');
        $result[$key] = $value;
    }
    if (!$result) throw new CmsValidation('Sección no válida.');
    return $result;
}

function cms_validate_services(array $input): array {
    $titles = $input['title'] ?? [];
    $descriptions = $input['description'] ?? [];
    if (!is_array($titles) || !is_array($descriptions) || count($titles) !== count($descriptions) || count($titles) > 24) {
        throw new CmsValidation('Puedes publicar hasta 24 servicios.');
    }
    $result = [];
    foreach (array_values($titles) as $index => $title) {
        $description = array_values($descriptions)[$index];
        if (!is_string($title) || !is_string($description)) throw new CmsValidation('Servicio no válido.');
        $title = trim($title); $description = trim($description);
        if ($title === '' && $description === '') continue;
        if ($title === '' || $description === '' || mb_strlen($title) > 120 || mb_strlen($description) > 3000 || !mb_check_encoding($title . $description, 'UTF-8')) {
            throw new CmsValidation('Cada servicio necesita título y descripción dentro de la longitud indicada.');
        }
        $result[] = ['title' => $title, 'description' => $description];
    }
    return $result;
}
