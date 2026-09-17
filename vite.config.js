import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const pages = { 'index.html': 'inicio', 'servicios.html': 'servicios', 'nosotros.html': 'nosotros', 'contacto.html': 'contacto' };

function sharedMarkup() {
  return {
    name: 'apag-shared-markup',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const page = pages[context.filename.split(/[\\/]/).at(-1)];
        const header = readFileSync(resolve(import.meta.dirname, 'src/partials/header.html'), 'utf8')
          .replaceAll(`data-nav="${page}"`, `data-nav="${page}" aria-current="page"`);
        const footer = readFileSync(resolve(import.meta.dirname, 'src/partials/footer.html'), 'utf8');
        return html.replace('%APAG_HEADER%', header).replace('%APAG_FOOTER%', footer);
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [sharedMarkup()],
  build: {
    rolldownOptions: {
      input: {
        inicio: resolve(import.meta.dirname, 'index.html'),
        servicios: resolve(import.meta.dirname, 'servicios.html'),
        nosotros: resolve(import.meta.dirname, 'nosotros.html'),
        contacto: resolve(import.meta.dirname, 'contacto.html'),
      },
    },
  },
});
