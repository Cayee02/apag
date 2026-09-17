import { readFile, writeFile } from 'node:fs/promises';

const content = JSON.parse(await readFile('src/data/institutional.json', 'utf8'));
const schema = JSON.parse(await readFile('server/schema.json', 'utf8'));
const labels = {
  'home.pillars_heading': 'Título de los pilares', 'home.pillars_intro': 'Introducción de los pilares',
  'home.organic_heading': 'Producción orgánica: título', 'home.organic_body': 'Producción orgánica: texto',
  'home.organic_photo_credit': 'Producción orgánica: procedencia de fotografía',
  'home.training_heading': 'Capacitación: título', 'home.training_body': 'Capacitación: texto',
  'home.cta_heading': 'Cierre de Inicio: título', 'home.cta_body': 'Cierre de Inicio: texto',
  'about.presentation_heading': 'Título de presentación', 'about.history_heading': 'Título de propósito y organización',
};
for (const [name, label] of Object.entries({ standards: 'Certificaciones y estándares', fair: 'Comercio justo', marketing: 'Comercialización conjunta', alliances: 'Trabajo interinstitucional', finance: 'Proyectos y financiamiento' })) {
  labels[`services.${name}_heading`] = `${label}: título`;
  labels[`services.${name}_body`] = `${label}: texto`;
}
for (let index = 1; index <= 6; index++) {
  labels[`home.pillar_${index}_title`] = `Pilar ${index}: título`;
  labels[`home.pillar_${index}_body`] = `Pilar ${index}: descripción`;
}
for (const [key, value] of Object.entries(content.texts)) {
  const group = key.split('.')[0];
  schema.fields[key] ??= { group, label: labels[key], max: key.endsWith('_heading') || key.endsWith('_title') ? 180 : 5000 };
  schema.fields[key].value = value;
  if (value.includes('\n\n')) schema.fields[key].kind = 'paragraphs';
}
schema.fields['home.title'].label = 'Título de portada (tres líneas)';
schema.fields['home.title'].lines = 3;
schema.fields['home.description'].max = 600;
schema.fields['about.mission'].label = 'Misión propuesta';
schema.fields['about.vision'].label = 'Visión propuesta';
schema.fields['about.history'].label = 'Propósito y organización';
schema.services = content.services;
const report = JSON.parse(await readFile('docs/IMAGE_OPTIMIZATION.json', 'utf8'));
const descriptions = [
  'Tractor verde visto de frente en un entorno rural',
  'Grupo de personas junto a un tractor y una rastra de discos',
  'Trabajadores cargando caña de azúcar en un remolque junto a un tractor',
  'Maquinaria de cosecha y remolque junto a un cultivo de caña de azúcar',
];
const photos = descriptions.map((alt, index) => {
  const name = `maquinaria${index + 1}`;
  const item = report.find((entry) => entry.variants[0].file.startsWith(name + '-'));
  const preview = item.variants.find((variant) => variant.file === name + '-960.webp');
  const largest = item.variants.reduce((best, variant) => variant.width > best.width ? variant : best);
  return { id: name, src: 'images/optimized/' + preview.file, full: 'images/optimized/' + largest.file, srcset: [...new Map(item.variants.map((variant) => [variant.width, variant])).values()].map((variant) => `images/optimized/${variant.file} ${variant.width}w`).join(', '), width: preview.width, height: preview.height, alt, caption: 'Material del cliente' };
});
const album = { id: 'maquinaria_apag', title: 'Maquinaria y trabajo de campo', description: 'Fotografías compartidas por el cliente.', photos };
const existing = schema.albums.findIndex((item) => item.id === album.id);
if (existing >= 0) schema.albums[existing] = album;
else schema.albums.push(album);
for (const [slot, index] of [['about', 1], ['services', 3], ['organic', 2]]) {
  const photo = photos[index];
  schema.images[slot] = { label: slot === 'organic' ? 'Inicio · producción orgánica' : schema.images[slot].label, src: photo.src, srcset: photo.srcset, alt: photo.alt, width: photo.width, height: photo.height };
}
await writeFile('server/schema.json', JSON.stringify(schema, null, 2) + '\n');
console.log('Contenido institucional, ocho servicios y cuatro fotografías preparados.');
