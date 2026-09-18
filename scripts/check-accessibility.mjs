import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pages = ['index.html', 'servicios.html', 'nosotros.html', 'galeria.html', 'contacto.html', 'privacidad.html', '404.html'];
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
for (const page of pages) {
  const html = await readFile(`dist/${page}`, 'utf8');
  assert(/^es(?:-|$)/i.test(attribute(html.match(/<html\b[^>]*>/)[0], 'lang')), `${page}: idioma de lectura`);
  assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${page}: un contenido principal`);
  assert(/<main\b[^>]*id="contenido"[^>]*tabindex="-1"/.test(html), `${page}: destino de salto enfocable`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.notEqual(attribute(tag, 'alt'), undefined, `${page}: imagen sin alternativa textual`);
  }
  for (const [tag] of html.matchAll(/<(?:nav|dialog|iframe)\b[^>]*>/g)) {
    assert(attribute(tag, 'aria-label') || attribute(tag, 'aria-labelledby') || attribute(tag, 'title'), `${page}: región sin nombre accesible`);
  }
  for (const [tag] of html.matchAll(/<(?:input|textarea|select)\b[^>]*>/g)) {
    if (attribute(tag, 'type') === 'hidden') continue;
    const id = attribute(tag, 'id');
    const labels = [...html.matchAll(/<label\b[^>]*>/g)].map(([label]) => attribute(label, 'for'));
    assert(id && labels.includes(id), `${page}: campo sin etiqueta vinculada (${id ?? 'sin ID'})`);
  }
  for (const [button, attributes, content] of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    const text = content.replace(/<[^>]+>/g, '').trim();
    assert(text || attribute(attributes, 'aria-label') || attribute(attributes, 'aria-labelledby'), `${page}: botón sin nombre`);
    assert(attribute(button, 'type'), `${page}: tipo de botón explícito`);
  }
}

const css = await readFile('src/css/variables.css', 'utf8');
const palette = Object.fromEntries([...css.matchAll(/--([a-z0-9-]+):\s*(#[a-f0-9]{6});/gi)].map(([, key, value]) => [key, value]));
function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => parseInt(value, 16) / 255)
    .map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}
for (const [foreground, background] of [['text', 'paper'], ['muted', 'paper'], ['green-900', 'paper'], ['white', 'green-950'], ['white', 'green-900'], ['green-950', 'yellow']]) {
  assert(contrast(palette[foreground], palette[background]) >= 4.5, `Contraste de texto: ${foreground}/${background}`);
}
assert(contrast(palette['green-700'], palette.paper) >= 3, 'Contraste del foco sobre fondo claro');
assert(contrast(palette.yellow, palette['green-950']) >= 3, 'Contraste del foco sobre fondo oscuro');
const formCss = await readFile('src/css/contact-form.css', 'utf8');
const border = formCss.match(/\.form-field input, \.form-field textarea[^\n]*border: 1px solid (#[a-f0-9]{6})/i)[1];
assert(contrast(border, palette.paper) >= 3, 'Contraste del borde de campos');
console.log('OK accesibilidad estática: idioma, landmarks, salto al contenido, alt, etiquetas, botones y contraste de la paleta');
console.log('Pendiente: revisión de teclado, lector de pantalla, zoom y composición en navegador');
