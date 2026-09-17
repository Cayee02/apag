<?php
declare(strict_types=1);

function cms_prepare_image(string $file, string $slot, string $alt): array {
    if ($slot !== 'album' && !isset(cms_schema()['images'][$slot])) throw new CmsValidation('Selecciona una fotografía válida.');
    if (!mb_check_encoding($alt, 'UTF-8') || mb_strlen($alt) > 300 || ($slot !== 'hero' && trim($alt) === '')) throw new CmsValidation('Describe brevemente la imagen (hasta 300 caracteres).');
    $size = filesize($file);
    if ($size === false || $size > 10 * 1024 * 1024 || $size === 0) throw new CmsValidation('La imagen debe pesar hasta 10 MB.');
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file);
    $dimensions = @getimagesize($file);
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true) || !$dimensions || $dimensions['mime'] !== $mime) throw new CmsValidation('Usa una imagen JPG, PNG o WebP válida.');
    [$width, $height] = $dimensions;
    if ($width < 320 || $height < 200 || $width > 10000 || $height > 10000 || $width * $height > 20000000) throw new CmsValidation('La imagen debe medir al menos 320 × 200 px y no superar 20 megapíxeles.');
    if (!extension_loaded('gd') || !function_exists('imagewebp')) throw new RuntimeException('GD con WebP es necesario para gestionar fotografías.');
    $image = match ($mime) {
        'image/jpeg' => @imagecreatefromjpeg($file),
        'image/png' => @imagecreatefrompng($file),
        'image/webp' => @imagecreatefromwebp($file),
    };
    if (!$image) throw new CmsValidation('No se pudo leer la imagen.');
    if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
        $orientation = @exif_read_data($file)['Orientation'] ?? 1;
        if (in_array($orientation, [2, 4, 5, 7], true)) imageflip($image, in_array($orientation, [2, 5, 7], true) ? IMG_FLIP_HORIZONTAL : IMG_FLIP_VERTICAL);
        $angle = match ($orientation) { 3 => 180, 5, 6 => -90, 7, 8 => 90, default => 0 };
        if ($angle) { $rotated = imagerotate($image, $angle, 0); imagedestroy($image); $image = $rotated; }
        $width = imagesx($image); $height = imagesy($image);
    }
    $directory = cms_storage() . '/media';
    if (!is_dir($directory)) mkdir($directory, 0700, true);
    $id = bin2hex(random_bytes(16)); $files = []; $variants = [];
    $targets = $slot === 'hero' ? [480, 960, 1440, 1920] : [480, 960, 1440];
    try {
        foreach (array_unique(array_map(fn($target) => min($target, $width), $targets)) as $target) {
            $targetHeight = max(1, (int) round($height * $target / $width));
            $scaled = imagecreatetruecolor($target, $targetHeight);
            imagealphablending($scaled, false); imagesavealpha($scaled, true);
            imagecopyresampled($scaled, $image, 0, 0, 0, 0, $target, $targetHeight, $width, $height);
            $name = $id . '-' . $target . '.webp'; $path = $directory . '/' . $name;
            $files[] = $path;
            if (!imagewebp($scaled, $path, $slot === 'hero' ? 88 : 84)) { imagedestroy($scaled); throw new RuntimeException('No se pudo guardar la imagen.'); }
            imagedestroy($scaled); chmod($path, 0600);
            $variants[$target] = ['src' => 'media/' . $name, 'width' => $target, 'height' => $targetHeight];
        }
    } catch (Throwable $error) {
        foreach ($files as $path) if (is_file($path)) unlink($path);
        throw $error;
    } finally { imagedestroy($image); }
    $preferred = $slot === 'hero' ? max(array_keys($variants)) : (isset($variants[960]) ? 960 : max(array_keys($variants)));
    return $variants[$preferred] + ['alt' => trim($alt), 'srcset' => implode(', ', array_map(fn($variant) => $variant['src'] . ' ' . $variant['width'] . 'w', $variants)), 'files' => $files];
}

function cms_upload_image(array $upload, string $slot, string $alt): array {
    if (!isset($upload['error']) || !is_int($upload['error']) || $upload['error'] !== UPLOAD_ERR_OK || !isset($upload['tmp_name']) || !is_string($upload['tmp_name']) || !is_uploaded_file($upload['tmp_name'])) {
        throw new CmsValidation('La subida no se completó. Selecciona una imagen de hasta 10 MB e inténtalo otra vez.');
    }
    return cms_prepare_image($upload['tmp_name'], $slot, $alt);
}
