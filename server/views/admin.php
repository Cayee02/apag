<!doctype html>
<html lang="es-PY">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title><?= $authenticated ? cms_escape($sections[$section]) . ' · ' : '' ?>Administración | APAG</title>
  <link rel="icon" href="<?= cms_escape($base) ?>/images/optimized/apag-icon.png">
  <link rel="stylesheet" href="<?= cms_escape($base) ?>/admin-assets/admin.css">
  <script src="<?= cms_escape($base) ?>/admin-assets/admin.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#panel">Saltar al panel</a>
  <header class="admin-header">
    <a class="brand" href="<?= cms_escape($base) ?>/admin"><img src="<?= cms_escape($base) ?>/images/optimized/apag-132.webp" width="52" height="52" alt="APAG"><span>Administración<small>Tu sitio, siempre al día.</small></span></a>
    <div class="header-actions"><a class="site-link" href="<?= cms_escape($base) ?>/" target="_blank" rel="noopener">Ver la web ↗</a>
    <?php if ($authenticated): ?><form method="post" action="<?= cms_escape($base) ?>/admin"><input type="hidden" name="csrf" value="<?= cms_escape($csrf) ?>"><input type="hidden" name="action" value="logout"><button class="button-secondary" type="submit">Cerrar sesión</button></form><?php endif; ?></div>
  </header>
  <?php if (!$authenticated): ?>
    <main id="panel" class="login-card" tabindex="-1">
      <span class="eyebrow">Un espacio para cultivar tu web</span>
      <h1><?= $configured ? 'Bienvenido a APAG.' : 'Preparando tu acceso.' ?></h1>
      <p><?= $configured ? 'Inicia sesión para actualizar el contenido del sitio.' : 'El panel está listo. El responsable técnico debe activar la cuenta antes del primer ingreso.' ?></p>
      <?php if ($error): ?><p class="notice error" role="alert"><?= cms_escape($error) ?></p><?php endif; ?>
      <?php if ($configured): ?>
      <form method="post" action="<?= cms_escape($base) ?>/admin" class="form-stack">
        <input type="hidden" name="csrf" value="<?= cms_escape($csrf) ?>"><input type="hidden" name="action" value="login">
        <label>Usuario<input name="username" autocomplete="username" maxlength="60" required></label>
        <label>Contraseña<input name="password" type="password" autocomplete="current-password" maxlength="128" required></label>
        <button class="button" type="submit">Entrar al panel →</button>
      </form>
      <?php endif; ?>
    </main>
  <?php else: ?>
    <div class="admin-layout">
      <nav class="admin-nav" aria-label="Secciones del panel">
        <p class="eyebrow">Contenido del sitio</p>
        <?php foreach ($sections as $key => $label): ?><a href="<?= cms_escape($base) ?>/admin?section=<?= cms_escape($key) ?>"<?= $section === $key ? ' aria-current="page"' : '' ?>><?= cms_escape($label) ?><span aria-hidden="true">↗</span></a><?php endforeach; ?>
      </nav>
      <main id="panel" class="admin-main" tabindex="-1">
        <div class="page-heading"><div><span class="eyebrow">Panel APAG</span><h1><?= cms_escape($sections[$section]) ?></h1></div><span class="revision">Edición <?= (int) $content['revision'] ?></span></div>
        <?php if ($flash): ?><p class="notice success" role="status"><?= cms_escape($flash) ?></p><?php endif; ?>
        <?php if ($error): ?><p class="notice error" role="alert"><?= cms_escape($error) ?></p><?php endif; ?>
        <?php if (in_array($section, ['home', 'about', 'services', 'gallery', 'contact', 'privacy'], true)): ?>
          <p class="page-intro">Actualiza el contenido y guarda para verlo en la web. Publica únicamente información confirmada por APAG.</p>
          <form method="post" action="<?= cms_escape($base) ?>/admin?section=<?= cms_escape($section) ?>" class="editor-form" data-dirty-form>
            <input type="hidden" name="csrf" value="<?= cms_escape($csrf) ?>"><input type="hidden" name="action" value="save">
            <input type="hidden" name="revision" value="<?= $error && isset($_POST['revision']) && is_string($_POST['revision']) ? cms_escape($_POST['revision']) : (int) $content['revision'] ?>">
            <div class="editor-card form-stack">
            <?php foreach (cms_schema()['fields'] as $key => $field): if ($field['group'] !== $section) continue;
              $posted = $_POST['texts'][$key] ?? null;
              $value = $error && is_string($posted) ? $posted : $content['texts'][$key];
              $isInput = in_array($field['kind'] ?? '', ['email', 'phone'], true);
            ?>
              <label><?= cms_escape($field['label']) ?>
              <?php if ($isInput): ?><input name="texts[<?= cms_escape($key) ?>]" type="<?= ($field['kind'] ?? '') === 'email' ? 'email' : 'tel' ?>" value="<?= cms_escape($value) ?>" maxlength="<?= (int) $field['max'] ?>" required>
              <?php else: ?><textarea name="texts[<?= cms_escape($key) ?>]" maxlength="<?= (int) $field['max'] ?>" rows="<?= $field['max'] > 1000 ? 5 : 2 ?>" required><?= cms_escape($value) ?></textarea><?php endif; ?>
              <small>Hasta <?= (int) $field['max'] ?> caracteres<?= in_array($field['kind'] ?? '', ['hero', 'manifesto'], true) ? ' · separa las ' . (int) ($field['lines'] ?? 2) . ' líneas del título con saltos de línea' : (($field['kind'] ?? '') === 'paragraphs' ? ' · separa los párrafos con una línea vacía' : '') ?>.</small></label>
            <?php endforeach; ?>
            </div>
            <?php if ($section === 'privacy'): ?><div class="editor-card"><h2>Publicación de la política</h2><p>El formulario requiere una política aprobada y el correo configurado. Guarda borradores sin marcar la casilla; solo el texto publicado estará visible para los visitantes.</p><label class="checkbox-label"><input type="checkbox" name="privacy_approved" value="1"<?= ($content['privacy_approved'] ?? false) ? ' checked' : '' ?>> Publicar este texto revisado y aprobado por APAG</label></div><?php endif; ?>
            <?php if ($section === 'about'): ?><div class="editor-card form-stack"><h2>Aprobación institucional</h2><p>La misión y la visión cargadas son propuestas. Mantén las casillas sin marcar hasta que APAG apruebe cada texto; la web mostrará su estado pendiente.</p><?php foreach (['mission' => 'Misión', 'vision' => 'Visión'] as $approvalKey => $approvalLabel): $isApproved = $error ? ($_POST[$approvalKey . '_approved'] ?? '') === '1' : ($content['institutional_approvals'][$approvalKey] ?? false); ?><label class="checkbox-label"><input type="checkbox" name="<?= $approvalKey ?>_approved" value="1"<?= $isApproved ? ' checked' : '' ?>> <?= $approvalLabel ?> revisada y aprobada por APAG</label><?php endforeach; ?></div><?php endif; ?>
            <?php if ($section === 'services'):
              $items = $content['services'];
              if ($error && isset($_POST['services']['title'], $_POST['services']['description']) && is_array($_POST['services']['title']) && is_array($_POST['services']['description'])) {
                  $items = [];
                  foreach (array_slice(array_values($_POST['services']['title']), 0, 24) as $i => $title) {
                      $description = array_values($_POST['services']['description'])[$i] ?? '';
                      if (is_string($title) && is_string($description)) $items[] = ['title' => $title, 'description' => $description];
                  }
              }
              while (count($items) < min(24, max(3, count($content['services']) + 1))) $items[] = ['title' => '', 'description' => ''];
            ?>
              <section class="editor-card"><h2>Listado de servicios</h2><p>Los servicios con título y descripción se publican en esta página y los tres primeros aparecen en Inicio. Los espacios vacíos no se publican.</p>
                <div class="service-editors" data-service-list>
                <?php foreach ($items as $item): ?><div class="service-editor" data-service-row>
                  <label>Título<input name="services[title][]" value="<?= cms_escape($item['title']) ?>" maxlength="120"></label>
                  <label>Descripción<textarea name="services[description][]" maxlength="3000" rows="3"><?= cms_escape($item['description']) ?></textarea></label>
                  <button type="button" class="button-secondary" data-remove-service hidden>Quitar servicio</button>
                </div><?php endforeach; ?>
                </div>
                <button type="button" class="button-secondary" data-add-service hidden>+ Añadir servicio</button><p class="field-help" data-service-status role="status"></p>
                <template data-service-template><div class="service-editor" data-service-row><label>Título<input name="services[title][]" maxlength="120"></label><label>Descripción<textarea name="services[description][]" maxlength="3000" rows="3"></textarea></label><button type="button" class="button-secondary" data-remove-service>Quitar servicio</button></div></template>
              </section>
            <?php endif; ?>
            <div class="save-bar"><span data-save-status>Los cambios se publican al guardar.</span><button class="button" type="submit">Guardar cambios →</button></div>
          </form>
        <?php elseif ($section === 'albums'): ?>
          <?php require __DIR__ . '/albums.php'; ?>
        <?php elseif ($section === 'images'): ?>
          <p class="page-intro">Conserva la composición actual y reemplaza cada fotografía cuando tengas material autorizado. Para la portada recomendamos al menos 1920 × 1080 px. JPG, PNG o WebP, hasta 10 MB.</p>
          <div class="image-editors">
          <?php foreach (cms_schema()['images'] as $slot => $definition):
            $image = $content['images'][$slot] ?? [];
            $src = $base . '/' . ($image['src'] ?? $definition['src']);
          ?>
            <section class="editor-card image-editor"><h2><?= cms_escape($definition['label']) ?></h2><img class="image-preview" src="<?= cms_escape($src) ?>" alt="<?= cms_escape($image['alt'] ?? $definition['alt']) ?>" loading="lazy">
              <form method="post" enctype="multipart/form-data" action="<?= cms_escape($base) ?>/admin?section=images" class="form-stack" data-dirty-form>
                <input type="hidden" name="csrf" value="<?= cms_escape($csrf) ?>"><input type="hidden" name="action" value="image"><input type="hidden" name="revision" value="<?= (int) $content['revision'] ?>"><input type="hidden" name="slot" value="<?= cms_escape($slot) ?>">
                <label>Nueva fotografía<input type="file" name="photo" accept="image/jpeg,image/png,image/webp"><small>Déjalo vacío para actualizar solo la descripción.</small></label>
                <label>Descripción para accesibilidad<textarea name="alt" maxlength="300" rows="2"<?= $slot === 'hero' ? '' : ' required' ?>><?= cms_escape($image['alt'] ?? $definition['alt']) ?></textarea><small><?= $slot === 'hero' ? 'Puedes dejarla vacía si la foto es decorativa.' : 'Describe lo que se ve en la foto, sin repetir su leyenda.' ?></small></label>
                <button class="button" type="submit">Guardar fotografía</button>
              </form>
              <?php if ($image): ?><form method="post" action="<?= cms_escape($base) ?>/admin?section=images" class="reset-form" data-reset-image><input type="hidden" name="csrf" value="<?= cms_escape($csrf) ?>"><input type="hidden" name="action" value="reset-image"><input type="hidden" name="revision" value="<?= (int) $content['revision'] ?>"><input type="hidden" name="slot" value="<?= cms_escape($slot) ?>"><button class="button-secondary" type="submit">Restaurar fotografía inicial</button></form><?php endif; ?>
            </section>
          <?php endforeach; ?>
          </div>
        <?php elseif ($section === 'account'): ?>
          <p class="page-intro">Actualiza tu contraseña de acceso. Las demás sesiones se cerrarán al cambiarla.</p>
          <form method="post" action="<?= cms_escape($base) ?>/admin?section=account" class="editor-card form-stack account-form">
            <input type="hidden" name="csrf" value="<?= cms_escape($csrf) ?>"><input type="hidden" name="action" value="password">
            <label>Contraseña actual<input type="password" name="old_password" autocomplete="current-password" required></label>
            <label>Nueva contraseña<input type="password" name="new_password" autocomplete="new-password" minlength="12" maxlength="72" required><small>Usa al menos 12 caracteres.</small></label>
            <label>Repite la nueva contraseña<input type="password" name="confirm_password" autocomplete="new-password" minlength="12" maxlength="72" required></label>
            <button class="button" type="submit">Actualizar contraseña</button>
          </form>
        <?php endif; ?>
      </main>
    </div>
  <?php endif; ?>
  <footer class="admin-footer">APAG · Una web que crece contigo.</footer>
</body>
</html>
