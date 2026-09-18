import assert from 'node:assert/strict';
import { access, cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { findPhp } from './php-runtime.mjs';

await access('dist-php/public/index.php');
await access('dist-php/app/vendor/autoload.php');
await access('dist-php/guia_deploy.md');
await assert.rejects(access('dist-php/app/config.local.php'), 'El paquete no debe incluir configuración SMTP local');
await assert.rejects(access('dist-php/storage/admin.json'), 'El paquete no debe incluir cuentas locales');
const root = process.cwd();
const temporary = await mkdtemp(join(root, '.tmp-cms-package-'));
let child;
try {
  const publicDirectory = join(temporary, 'public_html');
  await cp('dist-php/public', publicDirectory, { recursive: true });
  await cp('dist-php/app', join(temporary, 'app'), { recursive: true });
  const listener = createServer();
  listener.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  const port = listener.address().port;
  await new Promise((done) => listener.close(done));
  const environment = { ...process.env };
  for (const name of ['APAG_PUBLIC_DIR', 'APAG_STORAGE_DIR', 'APAG_BASE_PATH', 'APAG_MAIL_CONFIG']) delete environment[name];
  child = spawn(await findPhp(), ['-S', `127.0.0.1:${port}`, '-t', publicDirectory, join(publicDirectory, 'index.php')], {
    cwd: temporary, env: environment, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let serverError;
  child.on('error', (error) => { serverError = error; });
  child.stdout.resume(); child.stderr.resume();
  const base = `http://127.0.0.1:${port}`;
  let response;
  for (let attempt = 0; attempt < 40; attempt++) {
    if (serverError) throw serverError;
    try { response = await fetch(base + '/', { signal: AbortSignal.timeout(2000) }); break; }
    catch { await delay(100); }
  }
  assert(response, 'El servidor de prueba debe iniciar');
  assert.equal(response.status, 200, 'El paquete debe renderizar Inicio desde public_html');
  const html = await response.text();
  assert(html.includes('data-cms="home.title"'), 'Plantilla del CMS renderizada');
  assert(!html.includes('%APAG_'), 'Sin tokens sin resolver');
  const stylesheet = html.match(/href="\.\/(assets\/[^"\s]+\.css)"/)[1];
  assert.equal((await fetch(base + '/' + stylesheet)).status, 200, 'Estilos del paquete accesibles');
  const sitemap = await fetch(base + '/sitemap.xml');
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get('content-type'), /application\/xml/);
  assert.equal(((await sitemap.text()).match(/<loc>/g) ?? []).length, 5);
  assert.equal((await fetch(base + '/robots.txt')).status, 200);
  assert.equal((await fetch(base + '/galeria.html')).status, 200);
  assert.equal((await fetch(base + '/admin')).status, 200);
  for (const path of ['/app/config.local.php', '/storage/admin.json', '/ruta/inexistente']) {
    assert.equal((await fetch(base + path)).status, 404, `No publicar rutas privadas/inexistentes: ${path}`);
  }
  await access(join(temporary, 'storage/.htaccess'));
  console.log('OK paquete PHP: public_html, CMS, CSS, sitemap/robots, Galería/panel y rutas privadas con datos aislados');
  console.log('Pendiente: Apache/NGINX, DNS, TLS y SMTP reales en SiteGround');
} finally {
  if (child && child.exitCode === null && child.pid) {
    const ended = once(child, 'exit'); child.kill(); await ended;
  }
  if (dirname(resolve(temporary)) !== root) throw Error('Directorio temporal fuera del proyecto');
  await rm(temporary, { recursive: true, force: true });
}
