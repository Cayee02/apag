import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';

const entries = ['index.html', 'servicios.html', 'nosotros.html', 'galeria.html', 'contacto.html', '404.html', 'privacidad.html'];
for (const entry of entries) {
  const path = resolve('dist', entry);
  const html = await readFile(path, 'utf8');
  assert(!html.includes('%APAG_'), `${entry}: plantilla sin resolver`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${entry}: requiere un H1`);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, ['404.html', 'privacidad.html'].includes(entry) ? 0 : 2, `${entry}: navegación activa correcta`);
  assert(html.includes('id="contenido"'), `${entry}: destino del skip link`);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  assert(['noindex, nofollow', 'index, follow'].includes(robots), `${entry}: política de indexación explícita`);
  if (entry === '404.html') assert.equal(robots, 'noindex, nofollow');
  if (robots === 'index, follow') assert(html.includes('rel="canonical"'), `${entry}: producción requiere canonical`);
  assert(html.includes('property="og:locale" content="es_PY"'), `${entry}: metadatos sociales localizados`);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1] ?? 'null');
  assert.equal(schema?.['@graph']?.[0]?.alternateName, 'APAG', `${entry}: datos estructurados de APAG`);
  assert.equal((html.match(/\bdata-preloader\s/g) ?? []).length, 1, `${entry}: un preloader compartido`);
  assert(html.includes('<style data-apag-preloader>'), `${entry}: estilos críticos del preloader`);
  assert(html.includes('<script data-apag-preloader>'), `${entry}: salida independiente del bundle`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${entry}: IDs duplicados`);
  for (const match of html.matchAll(/\b(?:aria-labelledby|aria-controls|aria-describedby)="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) {
      assert(ids.includes(id), `${entry}: referencia ARIA inexistente ${id}`);
    }
  }
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
    assert(ids.includes(match[1]), `${entry}: anclaje inexistente ${match[1]}`);
  }
  for (const match of html.matchAll(/\s(?:src|href)="([^"#]+)"/g)) {
    const url = match[1];
    if (/^(?:https?:|mailto:|tel:|data:)/.test(url)) continue;
    await access(resolve(dirname(path), url.split(/[?#]/)[0]));
  }
  for (const match of html.matchAll(/\b(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      await access(resolve(dirname(path), url));
    }
  }
  console.log(`OK ${entry}: recursos, enlaces, anclajes y referencias ARIA`);
}
const home = await readFile(resolve('dist/index.html'), 'utf8');
assert(home.includes('ce76ac70'), 'El build debe conservar el contrato de diseño');
assert.equal((home.match(/class="hero-photo"/g) ?? []).length, 1, 'Una sola fotografía en portada');
assert(home.includes('src="./images/hero/campo.jpg"'), 'La portada usa el atardecer original');
assert(!home.includes('data-hero-carousel'), 'El carrusel de portada fue retirado');
console.log('OK contrato de diseño conservado en producción');
await import('./check-preloader.mjs');
await import('./check-seo.mjs');
