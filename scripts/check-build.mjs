import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';

const entries = ['index.html', 'servicios.html', 'nosotros.html', 'contacto.html'];
for (const entry of entries) {
  const path = resolve('dist', entry);
  const html = await readFile(path, 'utf8');
  assert(!html.includes('%APAG_'), `${entry}: plantilla sin resolver`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${entry}: requiere un H1`);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 2, `${entry}: navegación activa desktop y móvil`);
  assert(html.includes('id="contenido"'), `${entry}: destino del skip link`);
  assert(html.includes('noindex, nofollow'), `${entry}: borrador no indexable`);
  assert.equal((html.match(/\bdata-preloader\s/g) ?? []).length, 1, `${entry}: un preloader compartido`);
  assert(html.includes('<style data-apag-preloader>'), `${entry}: estilos críticos del preloader`);
  assert(html.includes('<script data-apag-preloader>'), `${entry}: salida independiente del bundle`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${entry}: IDs duplicados`);
  for (const match of html.matchAll(/\b(?:aria-labelledby|aria-controls)="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) {
      assert(ids.includes(id), `${entry}: referencia ARIA inexistente ${id}`);
    }
  }
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
    assert(ids.includes(match[1]), `${entry}: anclaje inexistente ${match[1]}`);
  }
  for (const match of html.matchAll(/\b(?:src|href)="([^"#]+)"/g)) {
    const url = match[1];
    if (/^(?:https?:|mailto:|tel:|data:)/.test(url)) continue;
    await access(resolve(dirname(path), url.split(/[?#]/)[0]));
  }
  console.log(`OK ${entry}: recursos, enlaces, anclajes y referencias ARIA`);
}
const home = await readFile(resolve('dist/index.html'), 'utf8');
assert(home.includes('ce76ac70'), 'El build debe conservar el contrato de diseño');
console.log('OK contrato de diseño conservado en producción');
await import('./check-preloader.mjs');
