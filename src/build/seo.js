export const pageFiles = ['index.html', 'servicios.html', 'nosotros.html', 'galeria.html', 'contacto.html'];

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const decodeHtml = (value) => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export function createSeoSettings({ siteUrl = '', indexable = false } = {}) {
  let baseUrl = '';
  if (siteUrl.trim()) {
    const url = new URL(siteUrl.trim());
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      throw new Error('APAG_SITE_URL debe ser una URL HTTP(S) sin credenciales, query ni fragmentos.');
    }
    baseUrl = url.href.endsWith('/') ? url.href : url.href + '/';
  }
  if (indexable && !baseUrl) throw new Error('Configura APAG_SITE_URL antes de habilitar la indexación.');
  return { baseUrl, indexable };
}

export function pageUrl(settings, file) {
  return settings.baseUrl ? new URL(file === 'index.html' ? './' : file, settings.baseUrl).href : '';
}

export function createRobots(settings) {
  // Crawlers must be able to read the draft's noindex metadata.
  return 'User-agent: *\nAllow: /\n' +
    (settings.baseUrl ? `\nSitemap: ${new URL('sitemap.xml', settings.baseUrl).href}\n` : '');
}

export function createSitemap(settings) {
  if (!settings.baseUrl) return '';
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    pageFiles.map((file) => `  <url><loc>${escapeHtml(pageUrl(settings, file))}</loc></url>`).join('\n') + '\n</urlset>\n';
}

export function addSeoMetadata(html, file, settings, contact) {
  const title = decodeHtml(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'APAG');
  const description = decodeHtml(html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? 'Asociación de Productores Agrícolas del Guairá.');
  const url = pageUrl(settings, file);
  const isError = file === '404.html';
  const metadata = [
    ['name', 'robots', settings.indexable && !isError ? 'index, follow' : 'noindex, nofollow'],
    ['property', 'og:title', title], ['property', 'og:description', description],
    ['property', 'og:type', 'website'], ['property', 'og:site_name', 'APAG'], ['property', 'og:locale', 'es_PY'],
    ['name', 'twitter:card', settings.baseUrl ? 'summary_large_image' : 'summary'],
    ['name', 'twitter:title', title], ['name', 'twitter:description', description],
  ];
  if (url && !isError) metadata.push(['property', 'og:url', url]);
  if (settings.baseUrl) {
    const image = new URL('images/optimized/campo-1440.webp', settings.baseUrl).href;
    metadata.push(['property', 'og:image', image], ['property', 'og:image:width', '1440'], ['property', 'og:image:height', '810'],
      ['property', 'og:image:alt', 'Campo de cultivo al atardecer'], ['name', 'twitter:image', image]);
  }
  const organization = {
    '@type': 'Organization', name: 'Asociación de Productores Agrícolas del Guairá', alternateName: 'APAG',
    email: contact.email, telephone: contact.phones.map((phone) => phone.href.replace('tel:', '')),
  };
  const graph = [organization];
  if (settings.baseUrl) {
    organization['@id'] = settings.baseUrl + '#organization';
    organization.url = settings.baseUrl;
    organization.logo = new URL('images/optimized/apag-264.webp', settings.baseUrl).href;
    graph.push({ '@type': 'WebSite', '@id': settings.baseUrl + '#website', url: settings.baseUrl, name: 'APAG', publisher: { '@id': organization['@id'] } });
  }
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  const tags = metadata.map(([attribute, key, value]) => `<meta ${attribute}="${key}" content="${escapeHtml(value)}">`).join('\n');
  const canonical = url && !isError ? `<link rel="canonical" href="${escapeHtml(url)}">\n` : '';
  return html.replace(/<meta\b[^>]*(?:name|property)="(?:robots|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/g, '')
    .replace(/<link\b[^>]*rel="canonical"[^>]*>\s*/g, '')
    .replace('</head>', `${tags}\n${canonical}<script type="application/ld+json">${json}</script>\n</head>`);
}

export function seoPlugin(settings, getContact) {
  return {
    name: 'apag-seo',
    transformIndexHtml(html, context) {
      return addSeoMetadata(html, context.filename.split(/[\\/]/).at(-1), settings, getContact());
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: createRobots(settings) });
      const sitemap = createSitemap(settings);
      if (sitemap) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = request.url?.split('?')[0];
        if (!['/robots.txt', '/sitemap.xml'].includes(path)) return next();
        const body = path === '/robots.txt' ? createRobots(settings) : createSitemap(settings);
        response.statusCode = body ? 200 : 404;
        response.setHeader('Content-Type', path === '/robots.txt' ? 'text/plain; charset=utf-8' : 'application/xml; charset=utf-8');
        response.end(body);
      });
    },
  };
}
