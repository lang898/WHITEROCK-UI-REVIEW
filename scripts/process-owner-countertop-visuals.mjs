import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceDirectory = path.resolve('source-assets/owner-countertops');
const publicDirectory = path.resolve('public/assets/owner/countertops');
const importDirectory = process.argv[2] ? path.resolve(process.argv[2]) : null;

const visuals = [
  { source: '01_097222c1-22c2-42c8-b34d-16af7359daed.webp', slug: 'rosso-console-top' },
  { source: '01_1727fb00-026f-4b33-868b-cfd9f5721c20.webp', slug: 'fluted-travertine-dining-top' },
  { source: '01_233b3636-4880-4c34-821b-97ddba9cbf8a.webp', slug: 'white-marble-dining-top' },
  { source: '01_a0d2ae9f-cfa2-4c2a-89f9-23c1fc149a42.webp', slug: 'sculptural-breccia-top' },
  { source: '02_69c11f33-be52-435f-a01c-315c8c2a24d7.webp', slug: 'breccia-block-dining-top' },
  { source: '03_940c56e6-d93b-4329-b8af-0d81d0555110.webp', slug: 'mixed-marble-column-top' },
  { source: '04_20bc36e3-9382-42ea-8338-7534709ad934.webp', slug: 'organic-marble-coffee-top' },
  { source: '04_b0316d4d-d539-469c-9746-59693fe8ef9b.webp', slug: 'oval-travertine-coffee-top' },
  { source: '05_1b895ae0-6fa3-4633-a254-1e36fc704815.webp', slug: 'rectangular-travertine-top' },
  { source: '05_c6809547-0fa6-46b1-b3d5-2b214cb8208e.webp', slug: 'rectangular-breccia-top' },
  { source: 'Advantages_of_Having_Carrara_Marble_Slabs.webp', slug: 'carrara-kitchen-island' },
  { source: 'marble-island.jpg', slug: 'waterfall-kitchen-island' },
  { source: 'BellamySquareCoffeeTable_WhiteMarble5_2000x.jpg', slug: 'marble-coffee-top-living-room' },
  { source: '微信图片_20250521180816.jpg', slug: 'carrara-white-quarry-overview' },
  { source: '微信图片_20250521180938.jpg', slug: 'carrara-white-quarry-workface' },
];

await mkdir(sourceDirectory, { recursive: true });
await mkdir(publicDirectory, { recursive: true });

if (importDirectory) {
  for (const visual of visuals) {
    const incoming = path.join(importDirectory, visual.source);
    await access(incoming);
    await sharp(incoming)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(path.join(sourceDirectory, `${visual.slug}-master.jpg`));
  }
}

const pipelineFor = (visual) => sharp(path.join(sourceDirectory, `${visual.slug}-master.jpg`))
  .rotate()
  .sharpen({ sigma: 0.35 });

for (const visual of visuals) {
  await access(path.join(sourceDirectory, `${visual.slug}-master.jpg`));

  await pipelineFor(visual)
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(publicDirectory, `${visual.slug}.jpg`));

  for (const width of [720, 1280]) {
    await pipelineFor(visual)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width === 720 ? 68 : 74, effort: 6 })
      .toFile(path.join(publicDirectory, `${visual.slug}-${width}.webp`));
  }

  await pipelineFor(visual)
    .resize({ width: 1280, withoutEnlargement: true })
    .avif({ quality: 50, effort: 6 })
    .toFile(path.join(publicDirectory, `${visual.slug}-1280.avif`));
}

console.log(`Processed ${visuals.length} owner-supplied countertop visuals.`);
