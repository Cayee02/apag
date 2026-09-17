<?php
$albumHidden = function (string $action, string $albumId = '', string $photoId = '') use ($csrf, $content, $error): void {
    $revision = $error && is_string($_POST['revision'] ?? null) ? $_POST['revision'] : (string) $content['revision'];
    foreach (['csrf' => $csrf, 'action' => $action, 'revision' => $revision, 'album_id' => $albumId, 'photo_id' => $photoId] as $key => $value) echo '<input type="hidden" name="' . $key . '" value="' . cms_escape($value) . '">';
};
$albumAction = cms_escape($base) . '/admin?section=albums';
$albumValue = function (string $key, string $fallback, string $albumId = '', string $photoId = '') use ($error): string {
    return cms_escape($error && ($_POST['album_id'] ?? '') === $albumId && ($_POST['photo_id'] ?? '') === $photoId && is_string($_POST[$key] ?? null) ? $_POST[$key] : $fallback);
};
?>
<p class="page-intro">Crea álbumes y añade fotografías para la página Galería. Hasta 12 álbumes y 40 fotos por álbum. Los álbumes vacíos permanecen fuera de la web. La primera foto es la portada del álbum.</p>
<p class="page-intro"><a class="site-link" href="<?= cms_escape($base) ?>/galeria.html" target="_blank" rel="noopener">Ver la galería pública ↗</a></p>
<section class="editor-card"><h2>Crear un álbum</h2>
  <form method="post" action="<?= $albumAction ?>" class="form-stack" data-dirty-form>
    <?php $albumHidden('album-save'); ?>
    <label>Nombre del álbum<input name="album_title" maxlength="100" value="<?= $albumValue('album_title', '') ?>" required></label>
    <label>Descripción breve<textarea name="album_description" maxlength="400" rows="2"><?= $albumValue('album_description', '') ?></textarea></label>
    <button class="button" type="submit"<?= count($content['albums']) >= 12 ? ' disabled' : '' ?>>Crear álbum</button>
  </form>
</section>
<div class="album-editors">
<?php foreach ($content['albums'] as $album): ?>
  <section class="editor-card" id="album-<?= cms_escape($album['id']) ?>"><h2><?= cms_escape($album['title']) ?></h2><p><?= count($album['photos']) ?> fotografías<?= !$album['photos'] ? ' · Aún no aparece en la web' : '' ?></p>
    <form method="post" action="<?= $albumAction ?>" class="form-stack" data-dirty-form>
      <?php $albumHidden('album-save', $album['id']); ?>
      <label>Nombre del álbum<input name="album_title" maxlength="100" value="<?= $albumValue('album_title', $album['title'], $album['id']) ?>" required></label>
      <label>Descripción breve<textarea name="album_description" maxlength="400" rows="2"><?= $albumValue('album_description', $album['description'], $album['id']) ?></textarea></label>
      <button class="button" type="submit">Guardar álbum</button>
    </form>
    <details class="album-upload"<?= $error && ($_POST['action'] ?? '') === 'photo-add' && ($_POST['album_id'] ?? '') === $album['id'] ? ' open' : '' ?>><summary>Añadir una fotografía</summary>
      <form method="post" enctype="multipart/form-data" action="<?= $albumAction ?>" class="form-stack" data-dirty-form>
        <?php $albumHidden('photo-add', $album['id']); ?>
        <label>Fotografía<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required><small>JPG, PNG o WebP, hasta 10 MB. Se optimiza automáticamente.</small></label>
        <label>Descripción para accesibilidad<input name="alt" maxlength="300" value="<?= $albumValue('alt', '', $album['id']) ?>" required><small>Describe lo que se ve en la imagen.</small></label>
        <label>Leyenda y procedencia<input name="caption" maxlength="180" value="<?= $albumValue('caption', '', $album['id']) ?>"><small>Opcional: lugar, actividad o crédito de la fotografía.</small></label>
        <button class="button" type="submit"<?= count($album['photos']) >= 40 ? ' disabled' : '' ?>>Añadir fotografía</button>
      </form>
    </details>
    <div class="album-photo-editors">
    <?php foreach ($album['photos'] as $position => $photo): ?>
      <article class="album-photo-editor"><img src="<?= cms_escape($base . '/' . $photo['src']) ?>" alt="<?= cms_escape($photo['alt']) ?>" loading="lazy"><p class="field-help">Foto <?= $position + 1 ?><?= $position === 0 ? ' · Portada del álbum' : '' ?></p>
        <form method="post" action="<?= $albumAction ?>" class="form-stack" data-dirty-form>
          <?php $albumHidden('photo-save', $album['id'], $photo['id']); ?>
          <label>Descripción para accesibilidad<input name="alt" maxlength="300" value="<?= $albumValue('alt', $photo['alt'], $album['id'], $photo['id']) ?>" required></label>
          <label>Leyenda y procedencia<input name="caption" maxlength="180" value="<?= $albumValue('caption', $photo['caption'], $album['id'], $photo['id']) ?>"></label>
          <button class="button-secondary" type="submit">Guardar textos</button>
        </form>
        <div class="album-photo-tools">
          <form method="post" action="<?= $albumAction ?>"><?php $albumHidden('photo-move', $album['id'], $photo['id']); ?><input type="hidden" name="direction" value="up"><button class="button-secondary" type="submit"<?= $position === 0 ? ' disabled' : '' ?> aria-label="Mover fotografía <?= $position + 1 ?> hacia el inicio">↑</button></form>
          <form method="post" action="<?= $albumAction ?>"><?php $albumHidden('photo-move', $album['id'], $photo['id']); ?><input type="hidden" name="direction" value="down"><button class="button-secondary" type="submit"<?= $position === count($album['photos']) - 1 ? ' disabled' : '' ?> aria-label="Mover fotografía <?= $position + 1 ?> hacia el final">↓</button></form>
          <form method="post" action="<?= $albumAction ?>" data-confirm="¿Quitar esta fotografía del álbum?"><?php $albumHidden('photo-delete', $album['id'], $photo['id']); ?><button class="button-secondary" type="submit">Quitar foto</button></form>
        </div>
      </article>
    <?php endforeach; ?>
    </div>
    <form method="post" action="<?= $albumAction ?>" class="reset-form" data-confirm="¿Eliminar este álbum y retirar sus fotografías de la web?"><?php $albumHidden('album-delete', $album['id']); ?><button class="button-secondary" type="submit">Eliminar álbum</button></form>
  </section>
<?php endforeach; ?>
</div>
