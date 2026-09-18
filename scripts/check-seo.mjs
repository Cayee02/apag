import assert from 'node:assert/strict';
import { createSeoSettings, pageUrl, createRobots, createSitemap, addSeoMetadata, seoPlugin } from '../src/build/seo.js';

const contact = { email: 'contacto@example.test', phones: [{ href: 'tel:+595989148592' }] };
const source = '<html><head><title>APAG &amp; comunidad</title><meta name="description" content="Tierra &amp; comunidad"><meta name="robots" content="old"><meta property="og:title" content="old"></head><body></body></html>';
const draft = createSeoSettings();
const draftHtml = addSeoMetadata(source, 'index.html', draft, contact);
assert(draftHtml.includes('content="noindex, nofollow"'));
assert(!draftHtml.includes('rel="canonical"'));
assert(!draftHtml.includes('og:url'));
assert(!draftHtml.includes('og:image"'));
assert.equal((createSitemap(draft).match(/<loc>/g) ?? []).length, 5);
assert(createSitemap(draft).includes('http://127.0.0.1:8080/'));
assert(createRobots(draft).includes('Sitemap: http://127.0.0.1:8080/sitemap.xml'));
assert(createRobots(draft).includes('Disallow: /admin$'));
assert(createRobots(draft).includes('Disallow: /api/'));
assert.equal((draftHtml.match(/property="og:title"/g) ?? []).length, 1);
assert.equal((draftHtml.match(/name="robots"/g) ?? []).length, 1);
assert(draftHtml.includes('APAG &amp; comunidad'));

assert.throws(() => createSeoSettings({ indexable: true }), /APAG_SITE_URL/);
for (const siteUrl of ['ftp://example.test', 'https://user:password@example.test', 'https://example.test/?x=1', 'https://example.test/#a', 'invalid']) {
  assert.throws(() => createSeoSettings({ siteUrl }));
}
const production = createSeoSettings({ siteUrl: 'https://example.test/apag', indexable: true });
assert.equal(production.baseUrl, 'https://example.test/apag/');
assert.equal(pageUrl(production, 'index.html'), production.baseUrl);
assert.equal(pageUrl(production, 'contacto.html'), 'https://example.test/apag/contacto.html');
const html = addSeoMetadata(source, 'contacto.html', production, contact);
assert(html.includes('content="index, follow"'));
assert(html.includes('rel="canonical" href="https://example.test/apag/contacto.html"'));
assert(html.includes('content="https://example.test/apag/images/optimized/campo-1440.webp"'));
const schema = JSON.parse(html.match(/type="application\/ld\+json">([^<]+)<\/script>/)[1]);
assert.equal(schema['@graph'][0].telephone[0], '+595989148592');
assert.equal(schema['@graph'][1].publisher['@id'], 'https://example.test/apag/#organization');
assert(!JSON.stringify(schema).includes('foundingDate'));
const safeHtml = addSeoMetadata(source, 'index.html', draft, { ...contact, email: '</script><script>alert(1)</script>' });
assert(!safeHtml.includes('</script><script>alert'));
assert.equal(JSON.parse(safeHtml.match(/type="application\/ld\+json">([^<]+)<\/script>/)[1])['@graph'][0].email, '</script><script>alert(1)</script>');
const errorHtml = addSeoMetadata(source, '404.html', production, contact);
assert(errorHtml.includes('content="noindex, nofollow"'));
assert(!errorHtml.includes('rel="canonical"'));
assert(!errorHtml.includes('og:url'));
const sitemap = createSitemap(production);
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 5);
assert(sitemap.includes('galeria.html'));
assert(!sitemap.includes('404.html'));
assert(createRobots(production).includes('Sitemap: https://example.test/apag/sitemap.xml'));
assert(createRobots(production).includes('Disallow: /apag/admin/'));
assert(createRobots(production).includes('Disallow: /apag/api/'));
assert(!createRobots(production).includes('127.0.0.1'));
assert(!sitemap.includes('127.0.0.1'));
assert(!sitemap.includes('privacidad.html'));
assert(!sitemap.includes('/admin'));
for (const [settings, expected] of [[draft, ['robots.txt', 'sitemap.xml']], [production, ['robots.txt', 'sitemap.xml']]]) {
  const emitted = [];
  seoPlugin(settings, () => contact).generateBundle.call({ emitFile: (asset) => emitted.push(asset.fileName) });
  assert.deepEqual(emitted, expected);
}
console.log('OK SEO: borrador, dominio/subcarpeta, sitemap, metadatos, JSON-LD seguro y 404');
