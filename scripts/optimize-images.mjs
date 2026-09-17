import sharp from 'sharp';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const output = resolve('public/images/optimized');
await mkdir(output, { recursive: true });
const images = [
  { name: 'campo', source: 'public/images/hero/campo.jpg', widths: [480, 960, 1440] },
  { name: 'campo2', source: 'public/images/hero/campo2.png', widths: [480, 960, 1440] },
  { name: 'campo3', source: 'public/images/hero/campo3.png', widths: [480, 960, 1440] },
  { name: 'maquinaria1', source: 'public/images/hero/Maquinaria.png', widths: [480, 960, 1440] },
  { name: 'maquinaria2', source: 'public/images/hero/Maquinaria2.png', widths: [480, 960, 1440] },
  { name: 'maquinaria3', source: 'public/images/hero/Maquinaria3.png', widths: [480, 960, 1440] },
  { name: 'maquinaria4', source: 'public/images/hero/Maquinaria4.png', widths: [480, 960, 1440] },
  { name: 'apag', source: 'public/images/logo/apag.png', widths: [132, 264] },
];
const report = [];
await sharp('public/images/logo/apag.png').resize({ width: 64 }).toFile(resolve(output, 'apag-icon.png'));
for (const image of images) {
  const metadata = await sharp(image.source).metadata();
  const original = await stat(image.source);
  const variants = await Promise.all(image.widths.map(async (width) => {
    const file = `${image.name}-${width}.webp`;
    const result = await sharp(image.source).rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: image.name === 'apag' ? 90 : 82, effort: 5 })
      .toFile(resolve(output, file));
    return { file, width: result.width, height: result.height, bytes: result.size };
  }));
  report.push({ source: image.source, width: metadata.width, height: metadata.height, originalBytes: original.size, variants });
  console.log(`${image.name}: ${metadata.width}×${metadata.height}, original ${Math.round(original.size / 1024)} KB → ${variants.map((variant) => `${variant.width}px: ${Math.round(variant.bytes / 1024)} KB`).join(', ')}`);
}
await writeFile('docs/IMAGE_OPTIMIZATION.json', JSON.stringify(report, null, 2) + '\n');
