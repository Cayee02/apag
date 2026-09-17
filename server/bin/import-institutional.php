<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__) . '/bootstrap.php';
$source = $argv[1] ?? '';
if (!is_file($source)) throw new RuntimeException('Selecciona el archivo de contenido institucional.');
$provided = json_decode(file_get_contents($source), true, 512, JSON_THROW_ON_ERROR);
$schema = cms_schema();
$texts = [];
foreach ($provided['texts'] as $key => $value) {
    if (!isset($schema['fields'][$key]) || !is_string($value)) throw new CmsValidation('Campo de contenido no válido.');
    $texts[$key] = $value;
}
foreach (['home', 'about', 'services'] as $group) cms_validate_texts(array_replace(cms_default_content()['texts'], $texts), $group);
$services = cms_validate_services(['title' => array_column($provided['services'], 'title'), 'description' => array_column($provided['services'], 'description')]);
$album = array_values(array_filter($schema['albums'], fn($item) => $item['id'] === 'maquinaria_apag'))[0];
$current = cms_content();
cms_update_content($current['revision'], function ($saved) use ($texts, $services, $album, $schema) {
    $saved['texts'] = array_replace($saved['texts'], $texts);
    $saved['services'] = $services;
    $saved['institutional_approvals'] = ['mission' => false, 'vision' => false];
    if (!in_array($album['id'], array_column($saved['albums'], 'id'), true)) {
        if (count($saved['albums']) >= 12) throw new CmsValidation('Libera un espacio de álbum antes de importar las fotos.');
        $saved['albums'][] = $album;
    }
    foreach (['about', 'services', 'organic'] as $slot) {
        $saved['images'][$slot] = $schema['images'][$slot];
        unset($saved['images'][$slot]['label']);
    }
    return $saved;
});
echo "Contenido institucional importado con backup; contacto, privacidad y álbumes anteriores conservados.\n";
