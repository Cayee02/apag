<?php
declare(strict_types=1);

function cms_album_text(mixed $value, int $max, bool $required = false): string {
    if (!is_string($value) || !mb_check_encoding($value, 'UTF-8')) throw new CmsValidation('Revisa el texto del álbum o de la fotografía.');
    $value = trim($value);
    if (($required && $value === '') || mb_strlen($value) > $max || preg_match('/[\x00-\x1F\x7F]/', $value)) throw new CmsValidation('Revisa la longitud y el contenido del texto.');
    return $value;
}

function cms_album_index(array $albums, string $id): int {
    foreach ($albums as $index => $album) if ($album['id'] === $id) return $index;
    throw new CmsValidation('El álbum ya no está disponible. Recarga el panel.');
}

function cms_photo_index(array $photos, string $id): int {
    foreach ($photos as $index => $photo) if ($photo['id'] === $id) return $index;
    throw new CmsValidation('La fotografía ya no está disponible. Recarga el panel.');
}

function cms_albums_markup(array $albums): string {
    $html = ''; $base = cms_base();
    $image = function (array $photo, string $class = '') use ($base): string {
        $srcset = isset($photo['srcset']) ? ' srcset="' . cms_escape(implode(', ', array_map(fn($candidate) => $base . '/' . $candidate, explode(', ', $photo['srcset'])))) . '" sizes="' . ($class ? '(max-width: 767px) 90vw, 55vw' : '(max-width: 480px) 90vw, (max-width: 1024px) 43vw, 28vw') . '"' : '';
        return '<img class="' . $class . '" src="' . cms_escape($base . '/' . $photo['src']) . '"' . $srcset . ' width="' . (int) $photo['width'] . '" height="' . (int) $photo['height'] . '" alt="' . cms_escape($photo['alt']) . '" loading="lazy" decoding="async">';
    };
    foreach ($albums as $album) {
        if (!$album['photos']) continue;
        $html .= '<details class="album" data-album="' . cms_escape($album['id']) . '"><summary>' . $image($album['photos'][0], 'album-cover') . '<div class="album-info"><span class="album-count">' . count($album['photos']) . ' fotografías</span><h3>' . cms_escape($album['title']) . '</h3><p>' . cms_escape($album['description']) . '</p><span class="album-toggle">Explorar álbum</span></div></summary><div class="album-photos">';
        foreach ($album['photos'] as $photo) {
            $caption = $photo['caption'] ?: $photo['alt'];
            $html .= '<figure class="album-photo"><a href="' . cms_escape($base . '/' . $photo['full']) . '" data-photo-link data-caption="' . cms_escape($caption) . '" aria-label="' . cms_escape('Ampliar: ' . $photo['alt']) . '">' . $image($photo) . '</a><figcaption>' . cms_escape($caption) . '</figcaption></figure>';
        }
        $html .= '</div></details>';
    }
    return $html ?: '<p class="album-empty">Próximamente compartiremos más fotografías.</p>';
}

function cms_album_action(string $action): void {
    $revision = cms_revision();
    $id = cms_post_string('album_id', 80);
    $prepared = null; $title = ''; $description = ''; $alt = ''; $caption = '';
    if ($action === 'album-save') {
        $title = cms_album_text($_POST['album_title'] ?? null, 100, true);
        $description = cms_album_text($_POST['album_description'] ?? '', 400);
    }
    if (in_array($action, ['photo-add', 'photo-save'], true)) {
        $alt = cms_album_text($_POST['alt'] ?? null, 300, true);
        $caption = cms_album_text($_POST['caption'] ?? '', 180);
    }
    $photoId = cms_post_string('photo_id', 80);
    $direction = cms_post_string('direction', 8);
    if ($action === 'photo-move' && !in_array($direction, ['up', 'down'], true)) throw new CmsValidation('Selecciona un orden válido.');
    if ($action === 'photo-add') {
        $current = cms_content();
        if ($current['revision'] !== $revision) throw new CmsConflict('Hay cambios más recientes. Recarga la página antes de guardar de nuevo.');
        $index = cms_album_index($current['albums'], $id);
        if (count($current['albums'][$index]['photos']) >= 40) throw new CmsValidation('Cada álbum admite hasta 40 fotografías.');
        $prepared = cms_upload_image(is_array($_FILES['photo'] ?? null) ? $_FILES['photo'] : [], 'album', $alt);
    }
    try {
        cms_update_content($revision, function ($current) use ($action, $id, $title, $description, $alt, $caption, $photoId, $prepared, $direction) {
            if ($action === 'album-save' && $id === '') {
                if (count($current['albums']) >= 12) throw new CmsValidation('Puedes crear hasta 12 álbumes.');
                $current['albums'][] = ['id' => bin2hex(random_bytes(12)), 'title' => $title, 'description' => $description, 'photos' => []];
                return $current;
            }
            $index = cms_album_index($current['albums'], $id);
            if ($action === 'album-save') {
                $current['albums'][$index]['title'] = $title; $current['albums'][$index]['description'] = $description;
            } elseif ($action === 'album-delete') {
                array_splice($current['albums'], $index, 1);
            } elseif ($action === 'photo-add') {
                if (count($current['albums'][$index]['photos']) >= 40) throw new CmsValidation('Cada álbum admite hasta 40 fotografías.');
                $photo = $prepared; $files = $photo['files']; unset($photo['files']);
                $photo['full'] = 'media/' . basename($files[count($files) - 1]);
                $photo['id'] = bin2hex(random_bytes(12)); $photo['caption'] = $caption;
                $current['albums'][$index]['photos'][] = $photo;
            } else {
                $position = cms_photo_index($current['albums'][$index]['photos'], $photoId);
                if ($action === 'photo-save') {
                    $current['albums'][$index]['photos'][$position]['alt'] = $alt;
                    $current['albums'][$index]['photos'][$position]['caption'] = $caption;
                } elseif ($action === 'photo-delete') {
                    array_splice($current['albums'][$index]['photos'], $position, 1);
                } elseif ($action === 'photo-move') {
                    $target = $position + ($direction === 'up' ? -1 : 1);
                    if ($target < 0 || $target >= count($current['albums'][$index]['photos'])) throw new CmsValidation('La fotografía ya está en ese extremo del álbum.');
                    $swap = $current['albums'][$index]['photos'][$target];
                    $current['albums'][$index]['photos'][$target] = $current['albums'][$index]['photos'][$position];
                    $current['albums'][$index]['photos'][$position] = $swap;
                } else throw new CmsValidation('Acción de álbum no válida.');
            }
            return $current;
        });
    } catch (Throwable $error) {
        foreach ($prepared['files'] ?? [] as $file) if (is_file($file)) unlink($file);
        throw $error;
    }
}
