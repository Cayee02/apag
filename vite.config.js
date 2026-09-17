import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { createSeoSettings, seoPlugin } from './src/build/seo.js';
import { renderAlbums } from './src/build/albums.js';
import { renderContent, servicesMarkup } from './src/build/content.js';

const pages = { 'index.html': 'inicio', 'servicios.html': 'servicios', 'nosotros.html': 'nosotros', 'galeria.html': 'galeria', 'contacto.html': 'contacto' };

function sharedMarkup() {
  return {
    name: 'apag-shared-markup',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const page = pages[context.filename.split(/[\\/]/).at(-1)];
        const schema = JSON.parse(readFileSync(resolve(import.meta.dirname, 'server/schema.json'), 'utf8'));
        const preloader = readFileSync(resolve(import.meta.dirname, 'src/partials/preloader.html'), 'utf8');
        const criticalStyles = readFileSync(resolve(import.meta.dirname, 'src/css/preloader.css'), 'utf8');
        const bootstrap = readFileSync(resolve(import.meta.dirname, 'src/js/core/preloader-bootstrap.js'), 'utf8');
        const fieldLines = readFileSync(resolve(import.meta.dirname, 'public/images/graphics/field-lines.svg'), 'utf8')
          .replace('<svg ', '<svg class="field-lines" data-field-lines aria-hidden="true" focusable="false" ');
        const header = readFileSync(resolve(import.meta.dirname, 'src/partials/header.html'), 'utf8')
          .replaceAll(`data-nav="${page}"`, `data-nav="${page}" aria-current="page"`);
        const footer = readFileSync(resolve(import.meta.dirname, 'src/partials/footer.html'), 'utf8');
        const contactForm = readFileSync(resolve(import.meta.dirname, 'src/partials/contact-form.html'), 'utf8');
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
        const assembled = html.replace('</head>', `<style data-apag-preloader>${criticalStyles}</style><script data-apag-preloader>${bootstrap}</script></head>`)
          .replace('%APAG_HEADER%', preloader + header).replace('%APAG_FOOTER%', footer)
          .replace('%APAG_FIELD_LINES%', fieldLines)
          .replace('%APAG_CONTACT_FORM%', contactForm)
          .replace('%APAG_ALBUMS%', renderAlbums(schema.albums))
          .replace('%APAG_SERVICES_PREVIEW%', servicesMarkup(schema.services.slice(0, 3)))
          .replace('%APAG_SERVICES_ALL%', servicesMarkup(schema.services))
          .replace(/%APAG_([A-Z_]+)%/g, (token, key) => {
            if (!(key in tokens)) throw new Error(`Token APAG desconocido: ${token}`);
            return escapeHtml(tokens[key]);
          });
        return renderContent(assembled, schema);
      },
    },
  };
}

export default defineConfig(({ mode, command }) => {
  const environment = loadEnv(mode, process.cwd(), 'APAG_');
  const settings = createSeoSettings({ siteUrl: environment.APAG_SITE_URL, indexable: command === 'build' && environment.APAG_INDEXABLE === 'true' });
  return {
  base: './',
  plugins: [sharedMarkup(), seoPlugin(settings, () => JSON.parse(readFileSync(resolve(import.meta.dirname, 'src/data/contact.json'), 'utf8')))],
  server: { proxy: {
    '/api/contacto': { target: 'http://127.0.0.1:8080', changeOrigin: false },
    '/privacidad.html': { target: 'http://127.0.0.1:8080', changeOrigin: false },
    '/assets/': { target: 'http://127.0.0.1:8080', changeOrigin: false },
  } },
  build: {
    rolldownOptions: {
      input: {
        inicio: resolve(import.meta.dirname, 'index.html'),
        servicios: resolve(import.meta.dirname, 'servicios.html'),
        nosotros: resolve(import.meta.dirname, 'nosotros.html'),
        contacto: resolve(import.meta.dirname, 'contacto.html'),
        galeria: resolve(import.meta.dirname, 'galeria.html'),
        error404: resolve(import.meta.dirname, '404.html'),
        privacidad: resolve(import.meta.dirname, 'privacidad.html'),
      },
    },
  },
  };
});
