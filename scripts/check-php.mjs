import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, access } from 'node:fs/promises';
import { join, resolve, dirname, basename } from 'node:path';
import { createServer } from 'node:net';
import { randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { findPhp } from './php-runtime.mjs';

const root = process.cwd();
await access(resolve('dist/index.html'));
const php = await findPhp();
const temporary = await mkdtemp(join(root, '.tmp-cms-'));
const children = [];
let logs = '';
const password = randomBytes(18).toString('base64url');
const username = 'cms-test';
const schema = JSON.parse(await readFile('server/schema.json', 'utf8'));
const texts = Object.fromEntries(Object.entries(schema.fields).map(([key, field]) => [key, field.value]));

async function phpFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await phpFiles(path));
    else if (entry.name.endsWith('.php')) files.push(path);
  }
  return files;
}
function execute(args, environment, input) {
  const result = spawnSync(php, args, { encoding: 'utf8', input, env: { ...process.env, ...environment } });
  assert.equal(result.status, 0, result.stderr + result.stdout);
  return result.stdout;
}
async function freePort() {
  const socket = createServer();
  await new Promise((resolveListen) => socket.listen(0, '127.0.0.1', resolveListen));
  const port = socket.address().port;
  await new Promise((resolveClose) => socket.close(resolveClose));
  return port;
}
async function startServer(environment, prefix = '') {
  const port = await freePort();
  const child = spawn(php, ['-d', 'upload_max_filesize=10M', '-d', 'post_max_size=12M', '-d', 'memory_limit=256M', '-S', '127.0.0.1:' + port, '-t', 'dist', 'server/router.php'], { env: { ...process.env, ...environment } });
  children.push(child);
  child.stdout.on('data', (chunk) => { logs += chunk; });
  child.stderr.on('data', (chunk) => { logs += chunk; });
  const origin = 'http://127.0.0.1:' + port;
  for (let count = 0; count < 60; count++) {
    try { await fetch(origin + prefix + '/'); return origin; } catch { await delay(100); }
  }
  throw Error('PHP no arrancó. ' + logs);
}
function client(origin, prefix = '') {
  const cookies = new Map();
  return async function request(path, body) {
    const headers = {};
    if (cookies.size) headers.Cookie = [...cookies].map(([key, value]) => key + '=' + value).join('; ');
    const response = await fetch(origin + prefix + path, { method: body ? 'POST' : 'GET', body, headers, redirect: 'manual' });
    for (const cookie of response.headers.getSetCookie()) {
      const [pair] = cookie.split(';'); const index = pair.indexOf('=');
      cookies.set(pair.slice(0, index), pair.slice(index + 1));
    }
    return { status: response.status, headers: response.headers, text: await response.text() };
  };
}
const csrfFrom = (response) => response.text.match(/name="csrf" value="([a-f0-9]+)"/)?.[1];
function form(action, csrf, fields = {}) {
  return new URLSearchParams({ action, csrf, ...fields });
}
function textForm(section, csrf, revision, values = texts, services = []) {
  const body = form('save', csrf, { revision: String(revision) });
  for (const [key, field] of Object.entries(schema.fields)) if (field.group === section) body.append('texts[' + key + ']', values[key]);
  for (const service of services) { body.append('services[title][]', service.title); body.append('services[description][]', service.description); }
  return body;
}

try {
  for (const file of await phpFiles('server')) execute(['-l', file]);
  const unitDirectory = join(temporary, 'unit'); await mkdir(unitDirectory);
  const fixtureDirectory = join(temporary, 'fixtures'); await mkdir(fixtureDirectory);
  process.stdout.write(execute(['server/tests.php', fixtureDirectory], { APAG_STORAGE_DIR: unitDirectory, APAG_PUBLIC_DIR: resolve('dist'), APAG_BASE_PATH: '' }));
  const storage = join(temporary, 'http');
  const environment = { APAG_STORAGE_DIR: storage, APAG_PUBLIC_DIR: resolve('dist'), APAG_BASE_PATH: '' };
  const origin = await startServer(environment);
  const anonymous = client(origin);
  const initial = await anonymous('/admin');
  assert.equal(initial.status, 200); assert(initial.text.includes('Preparando tu acceso.'));
  assert(initial.headers.get('cache-control').includes('no-store'));
  const cookie = initial.headers.getSetCookie()[0];
  assert(cookie.includes('HttpOnly') && cookie.includes('SameSite=Strict') && cookie.includes('path=/admin'));
  execute(['server/bin/create-admin.php'], environment, JSON.stringify({ username, password }));
  const account = JSON.parse(await readFile(join(storage, 'admin.json'), 'utf8'));
  assert(!JSON.stringify(account).includes(password)); assert(account.password_hash.startsWith('$2y$'));
  const loginPage = await anonymous('/admin');
  const loginCsrf = csrfFrom(loginPage); assert(loginCsrf);
  const unauthenticated = await anonymous('/admin?section=home', textForm('home', loginCsrf, 0));
  assert.equal(unauthenticated.status, 401);
  assert.equal((await anonymous('/admin', form('login', 'invalid', { username, password }))).status, 403);
  assert.equal((await anonymous('/admin', form('login', loginCsrf, { username, password }))).status, 303);
  const dashboard = await anonymous('/admin'); assert(dashboard.text.includes('Cerrar sesión'));
  assert(dashboard.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
  const csrf = csrfFrom(dashboard);
  assert.notEqual(csrf, loginCsrf);
  assert.equal((await anonymous('/admin?section=home', textForm('home', loginCsrf, 0))).status, 403);
  const updatedTexts = { ...texts, 'home.intro': 'Texto actualizado <script>alert(1)</script> & APAG' };
  assert.equal((await anonymous('/admin?section=home', textForm('home', csrf, 0, updatedTexts))).status, 303);
  let home = await (await fetch(origin + '/')).text();
  assert(home.includes('Texto actualizado &lt;script&gt;alert(1)&lt;/script&gt; &amp; APAG'));
  assert(home.includes('Cultivamos producción.<br>Fortalecemos productores.<br><span>Construimos futuro.</span>'));
  assert.equal((await anonymous('/admin?section=home', textForm('home', csrf, 0))).status, 409);
  assert.equal((await anonymous('/admin?section=contact', textForm('contact', csrf, 1, { ...texts, 'contact.email': 'invalid' }))).status, 422);
  const contactTexts = { ...texts, 'contact.email': 'nuevo@example.test', 'contact.primary_label': 'Teléfono actualizado', 'contact.primary_number': '+595981234567' };
  assert.equal((await anonymous('/admin?section=contact', textForm('contact', csrf, 1, contactTexts))).status, 303);
  const contactHtml = await (await fetch(origin + '/contacto.html')).text();
  assert(contactHtml.includes('href="mailto:nuevo@example.test"'));
  assert(contactHtml.includes('href="tel:+595981234567"'));
  assert(contactHtml.includes('Teléfono actualizado'));
  assert(contactHtml.includes('"email":"nuevo@example.test"'));
  assert(!contactHtml.includes('asociacion.prod.agric.guaira@gmail.com'));
  const services = [{ title: 'Servicio confirmado de prueba', description: 'Descripción validada' }, { title: '<script>prueba</script>', description: 'Texto & seguro' }];
  assert.equal((await anonymous('/admin?section=services', textForm('services', csrf, 2, texts, services))).status, 303);
  const serviceHtml = await (await fetch(origin + '/servicios.html')).text();
  assert(serviceHtml.includes('Servicio confirmado de prueba'));
  assert(serviceHtml.includes('&lt;script&gt;prueba&lt;/script&gt;'));
  assert(!serviceHtml.includes('Listado oficial de servicios'));
  assert((await (await fetch(origin + '/')).text()).includes('Servicio confirmado de prueba'));
  const imageUpload = new FormData();
  for (const [key, value] of Object.entries({ action: 'image', csrf, revision: '3', slot: 'hero', alt: 'Campo de prueba' })) imageUpload.set(key, value);
  imageUpload.set('photo', new Blob([await readFile(join(fixtureDirectory, 'valid.png'))], { type: 'application/x-php' }), '../../evil.php');
  assert.equal((await anonymous('/admin?section=images', imageUpload)).status, 303);
  const saved = JSON.parse(await readFile(join(storage, 'content.json'), 'utf8'));
  assert.equal(saved.revision, 4); assert(saved.images.hero.src.startsWith('media/'));
  const mediaResponse = await fetch(origin + '/' + saved.images.hero.src);
  assert.equal(mediaResponse.status, 200); assert.equal(mediaResponse.headers.get('content-type'), 'image/webp');
  home = await (await fetch(origin + '/')).text();
  assert(home.includes('src="/' + saved.images.hero.src + '"'));
  assert.equal((home.match(/class="hero-photo"/g) ?? []).length, 1);
  const invalidUpload = new FormData();
  for (const [key, value] of Object.entries({ action: 'image', csrf, revision: '4', slot: 'hero', alt: '' })) invalidUpload.set(key, value);
  invalidUpload.set('photo', new Blob(['<?php echo "bad";'], { type: 'image/jpeg' }), 'bad.jpg');
  assert.equal((await anonymous('/admin?section=images', invalidUpload)).status, 422);
  assert.equal((await anonymous('/admin?section=images', form('reset-image', csrf, { revision: '4', slot: 'hero' }))).status, 303);
  assert((await (await fetch(origin + '/')).text()).includes('src="./images/hero/campo.jpg"'));
  // Album workflows exercise real authenticated uploads without touching project storage.
  const albumForm = (action, revision, fields = {}) => form(action, csrf, { revision: String(revision), ...fields });
  const albumsPage = await anonymous('/admin?section=albums');
  assert.equal(albumsPage.status, 200); assert(albumsPage.text.includes('Crear un álbum'));
  assert(albumsPage.text.includes('>Galería</h1>'));
  const galleryPage = await fetch(origin + '/galeria.html');
  assert.equal(galleryPage.status, 200);
  let galleryHtml = await galleryPage.text();
  assert(galleryHtml.includes('data-photo-viewer'));
  assert.equal((galleryHtml.match(/data-nav="galeria" aria-current="page"/g) ?? []).length, 2);
  home = await (await fetch(origin + '/')).text();
  assert(home.includes('href="./galeria.html"'));
  assert(!home.includes('data-cms-albums') && !home.includes('data-photo-viewer'), 'Álbumes y visor fuera de Inicio');
  assert.equal((await anonymous('/admin?section=albums', form('album-save', 'invalid', { revision: '5', album_title: 'No autorizado' }))).status, 403);
  assert.equal((await anonymous('/admin?section=albums', albumForm('album-save', 5, { album_title: 'Álbum de prueba', album_description: 'Descripción confirmada' }))).status, 303);
  let albumContent = JSON.parse(await readFile(join(storage, 'content.json'), 'utf8'));
  const albumId = albumContent.albums.at(-1).id;
  assert.equal(albumContent.revision, 6);
  assert(!(await (await fetch(origin + '/galeria.html')).text()).includes('Álbum de prueba'), 'No publica álbumes vacíos');
  const photoUpload = (revision, id = albumId) => {
    const body = new FormData();
    for (const [key, value] of Object.entries({ action: 'photo-add', csrf, revision: String(revision), album_id: id, alt: 'Cultivo de prueba', caption: 'Foto de prueba' })) body.set(key, value);
    return body;
  };
  let photoBody = photoUpload(6);
  photoBody.set('photo', new Blob([await readFile(join(fixtureDirectory, 'polyglot.jpg'))], { type: 'image/jpeg' }), 'campo.jpg');
  assert.equal((await anonymous('/admin?section=albums', photoBody)).status, 303);
  albumContent = JSON.parse(await readFile(join(storage, 'content.json'), 'utf8'));
  let albumPhoto = albumContent.albums.at(-1).photos[0];
  assert.equal(albumContent.revision, 7); assert(!albumPhoto.files);
  assert.equal((await fetch(origin + '/' + albumPhoto.full)).status, 200);
  assert(!Buffer.from(await (await fetch(origin + '/' + albumPhoto.full)).arrayBuffer()).includes(Buffer.from('APAG_PAYLOAD')));
  galleryHtml = await (await fetch(origin + '/galeria.html')).text();
  assert(galleryHtml.includes('Álbum de prueba') && galleryHtml.includes('data-photo-link'));
  assert(!(await (await fetch(origin + '/')).text()).includes('Álbum de prueba'), 'Fotos nuevas se publican únicamente en Galería');
  const mediaCount = (await readdir(join(storage, 'media'))).length;
  photoBody = photoUpload(6);
  photoBody.set('photo', new Blob([await readFile(join(fixtureDirectory, 'valid.png'))]), 'otra.png');
  const conflict = await anonymous('/admin?section=albums', photoBody);
  assert.equal(conflict.status, 409); assert(conflict.text.includes('name="revision" value="6"'));
  assert.equal((await readdir(join(storage, 'media'))).length, mediaCount, 'Conflicto no deja imágenes nuevas');
  assert.equal((await anonymous('/admin?section=albums', albumForm('photo-save', 7, { album_id: albumId, photo_id: albumPhoto.id, alt: 'Cultivo "seguro"', caption: '<script>foto</script>' }))).status, 303);
  galleryHtml = await (await fetch(origin + '/galeria.html')).text();
  assert(galleryHtml.includes('&lt;script&gt;foto&lt;/script&gt;')); assert(!galleryHtml.includes('<script>foto</script>'));
  assert.equal((await anonymous('/admin?section=albums', albumForm('photo-delete', 8, { album_id: 'miradas_del_campo', photo_id: albumPhoto.id }))).status, 422, 'No elimina fotos de otro álbum');
  assert.equal((await anonymous('/admin?section=albums', albumForm('photo-move', 8, { album_id: 'miradas_del_campo', photo_id: 'tractor', direction: 'up' }))).status, 303);
  albumContent = JSON.parse(await readFile(join(storage, 'content.json'), 'utf8'));
  assert.equal(albumContent.albums[0].photos[0].id, 'tractor', 'Orden y portada del álbum actualizados');
  assert.equal((await anonymous('/admin?section=albums', albumForm('photo-delete', 9, { album_id: albumId, photo_id: albumPhoto.id }))).status, 303);
  assert(!(await (await fetch(origin + '/galeria.html')).text()).includes('Álbum de prueba'));
  assert.equal((await anonymous('/admin?section=albums', albumForm('album-delete', 10, { album_id: albumId }))).status, 303);
  assert.equal(JSON.parse(await readFile(join(storage, 'content.json'), 'utf8')).albums.length, schema.albums.length);
  assert.equal((await anonymous('/admin?section=albums', albumForm('photo-add', 11, { album_id: 'miradas_del_campo', alt: 'Imagen' }))).status, 422, 'Archivo requerido');
  assert.equal((home.match(/class="field-gallery"/g) ?? []).length, 1, 'Galería original conservada');
  const initialAbout = await fetch(origin + '/nosotros.html');
  assert.equal((await initialAbout.text()).split('Propuesta pendiente de aprobación por APAG').length - 1, 2);
  const approvalForm = textForm('about', csrf, 11);
  approvalForm.set('mission_approved', '1');
  assert.equal((await anonymous('/admin?section=about', approvalForm)).status, 303);
  assert.equal((await (await fetch(origin + '/nosotros.html')).text()).split('Propuesta pendiente de aprobación por APAG').length - 1, 1);
  const placeholderApproval = textForm('about', csrf, 12, { ...texts, 'about.vision': '[CONTENIDO PENDIENTE APAG]' });
  placeholderApproval.set('vision_approved', '1');
  assert.equal((await anonymous('/admin?section=about', placeholderApproval)).status, 422);
  console.log('OK PHP HTTP álbumes: creación, publicación, subida optimizada, edición, orden/portada, retiro, CSRF, conflictos y aislamiento');
  for (const path of ['/storage/content.json', '/app/schema.json', '/server/bin/create-admin.php', '/.env', '/media/../../storage/admin.json']) {
    const response = await fetch(origin + path); assert.equal(response.status, 404, path); assert(!(await response.text()).includes('password_hash'));
  }
  const missing = await fetch(origin + '/nested/missing');
  assert.equal(missing.status, 404); const missingHtml = await missing.text();
  assert(missingHtml.includes('href="/index.html"')); assert(missingHtml.includes('src="/images/optimized/apag-132.webp"'));
  assert.equal((await fetch(origin + '/contacto.html', { method: 'HEAD' })).status, 200);
  assert.equal((await fetch(origin + '/', { method: 'POST' })).status, 405);
  const secondClient = client(origin); const secondLogin = await secondClient('/admin');
  assert.equal((await secondClient('/admin', form('login', csrfFrom(secondLogin), { username, password }))).status, 303);
  const newPassword = randomBytes(18).toString('base64url');
  assert.equal((await anonymous('/admin?section=account', form('password', csrf, { old_password: password, new_password: newPassword, confirm_password: newPassword }))).status, 303);
  assert(!(await secondClient('/admin')).text.includes('Cerrar sesión'));
  const freshAccount = await anonymous('/admin?section=account'); const freshCsrf = csrfFrom(freshAccount);
  assert(freshAccount.text.includes('Cerrar sesión')); assert.notEqual(freshCsrf, csrf);
  assert.equal((await anonymous('/admin', form('logout', freshCsrf))).status, 303);
  assert(!(await anonymous('/admin')).text.includes('Cerrar sesión'));
  const rateClient = client(origin); const ratePage = await rateClient('/admin'); const rateCsrf = csrfFrom(ratePage);
  for (let attempt = 0; attempt < 5; attempt++) assert.equal((await rateClient('/admin', form('login', rateCsrf, { username, password: 'incorrect' }))).status, 422);
  const blocked = await rateClient('/admin', form('login', rateCsrf, { username, password: newPassword }));
  assert(blocked.text.includes('Demasiados intentos'));
  const secondOrigin = await startServer({ ...environment, APAG_BASE_PATH: '/apag' }, '/apag');
  const nestedHome = await fetch(secondOrigin + '/apag/'); assert.equal(nestedHome.status, 200);
  const nestedMissing = await fetch(secondOrigin + '/apag/unknown/nested'); assert.equal(nestedMissing.status, 404);
  assert((await nestedMissing.text()).includes('href="/apag/index.html"'));
  assert.equal((await fetch(secondOrigin + '/apag/images/optimized/apag-icon.png')).status, 200);
  assert.equal((await fetch(secondOrigin + '/apag/admin-assets/admin.css')).status, 200);
  assert.equal((await fetch(secondOrigin + '/apag/admin-assets/manrope-600.woff2')).status, 200);
  const nestedGallery = await fetch(secondOrigin + '/apag/galeria.html');
  assert.equal(nestedGallery.status, 200);
  assert((await nestedGallery.text()).includes('href="/apag/images/optimized/campo3-1440.webp"'), 'Fotografías de álbum en subcarpeta');
  assert(!/Fatal error|Parse error|Warning:/.test(logs), logs);
  console.log('OK PHP HTTP: acceso, CSRF, publicación inmediata, contacto/schema, servicios, subida real, restauración, 404/subcarpeta, contraseña, logout y límite de intentos');
} finally {
  await Promise.all(children.map((child) => new Promise((resolveExit) => {
    if (child.exitCode !== null) { resolveExit(); return; }
    child.once('exit', resolveExit); child.kill();
  })));
  if (dirname(temporary) !== root || !basename(temporary).startsWith('.tmp-cms-')) throw Error('Limpieza fuera de la carpeta temporal del proyecto.');
  await rm(temporary, { recursive: true, force: true });
}
