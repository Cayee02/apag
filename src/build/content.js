const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function textMarkup(value, kind) {
  const lines = value.split('\n');
  if (kind === 'hero') return lines.map((line, index) => index === lines.length - 1 ? `<span>${escape(line)}</span>` : escape(line) + '<br>').join('');
  if (kind === 'paragraphs') return value.split(/\n\n+/).map((paragraph) => `<p>${escape(paragraph).replaceAll('\n', '<br>')}</p>`).join('');
  if (kind === 'manifesto') {
    const second = lines[1] ?? '', split = second.lastIndexOf(' ');
    return escape(lines[0]) + '<br>' + escape(split < 0 ? '' : second.slice(0, split + 1)) + '<span>' + escape(split < 0 ? second : second.slice(split + 1)) + '</span>';
  }
  return escape(value).replaceAll('\n', '<br>');
}

export function servicesMarkup(services) {
  if (!services.length) return '<p>Consulta con APAG para conocer los servicios disponibles.</p><a class="text-link" href="./contacto.html">Consultar con APAG</a>';
  return '<div class="cms-service-grid">' + services.map((service) => `<article class="cms-service-card"><h3>${escape(service.title)}</h3><p>${escape(service.description)}</p><a class="text-link" href="./contacto.html">Consultar con APAG</a></article>`).join('') + '</div>';
}

export function renderContent(html, schema) {
  return html.replace(/<([a-z][a-z0-9]*)\b([^>]*\bdata-cms="([a-z0-9_.]+)"[^>]*)>[\s\S]*?<\/\1>/gi, (match, tag, attrs, key) => {
    const field = schema.fields[key];
    if (!field) throw new Error(`Campo CMS desconocido: ${key}`);
    return `<${tag}${field.value !== '[CONTENIDO PENDIENTE APAG]' ? attrs.replace('pending-content', '') : attrs}>${textMarkup(field.value, field.kind)}</${tag}>`;
  });
}
