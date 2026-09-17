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
        const preloader = readFileSync(resolve(import.meta.dirname, 'src/partials/preloader.html'), 'utf8');
        const criticalStyles = readFileSync(resolve(import.meta.dirname, 'src/css/preloader.css'), 'utf8');
        const bootstrap = readFileSync(resolve(import.meta.dirname, 'src/js/core/preloader-bootstrap.js'), 'utf8');
        const header = readFileSync(resolve(import.meta.dirname, 'src/partials/header.html'), 'utf8')
          .replaceAll(`data-nav="${page}"`, `data-nav="${page}" aria-current="page"`);
        const footer = readFileSync(resolve(import.meta.dirname, 'src/partials/footer.html'), 'utf8');
        const contact = JSON.parse(readFileSync(resolve(import.meta.dirname, 'src/data/contact.json'), 'utf8'));
        const tokens = {
          EMAIL: contact.email,
          ADDRESS: contact.address,
          PHONE_PRIMARY: contact.phones[0].label,
          PHONE_PRIMARY_HREF: contact.phones[0].href,
          PHONE_SECONDARY: contact.phones[1].label,
          PHONE_SECONDARY_HREF: contact.phones[1].href,
        };
        const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
        return html.replace('</head>', `<style data-apag-preloader>${criticalStyles}</style><script data-apag-preloader>${bootstrap}</script></head>`)
          .replace('%APAG_HEADER%', preloader + header).replace('%APAG_FOOTER%', footer)
          .replace(/%APAG_([A-Z_]+)%/g, (token, key) => {
            if (!(key in tokens)) throw new Error(`Token APAG desconocido: ${token}`);
            return escapeHtml(tokens[key]);
          });
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
