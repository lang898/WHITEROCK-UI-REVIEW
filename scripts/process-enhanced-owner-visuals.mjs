import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceDirectory = path.resolve('source-assets/owner-enhanced');
const publicDirectory = path.resolve('public/assets/owner/enhanced');
const importDirectory = process.argv[2] ? path.resolve(process.argv[2]) : null;

const visuals = [
  { number: '01', slug: 'vanity-production-detail', extract: { left: 500, top: 150, width: 900, height: 675 } },
  { number: '02', slug: 'vanity-production-hall' },
  { number: '03', slug: 'vanity-inspection-sequence-a' },
  { number: '04', slug: 'edge-processing-line' },
  { number: '05', slug: 'vanity-workshop-overhead' },
  { number: '06', slug: 'vanity-inspection-sequence-b' },
  { number: '07', slug: 'edge-polisher-close' },
  { number: '08', slug: 'edge-line-operation' },
  { number: '09', slug: 'manual-polishing-bay' },
  { number: '10', slug: 'material-staging-hall' },
  { number: '11', slug: 'factory-exterior' },
  { number: '12', slug: 'edge-line-wide' },
  { number: '13', slug: 'quality-inspection-team' },
  { number: '14', slug: 'production-hall-aisle' },
  { number: '15', slug: 'edge-line-workstation' },
  { number: '16', slug: 'cnc-cutting-line' },
  { number: '17', slug: 'manual-profile-polishing' },
];

await mkdir(sourceDirectory, { recursive: true });
await mkdir(publicDirectory, { recursive: true });

if (importDirectory) {
  for (const visual of visuals) {
    const incoming = path.join(importDirectory, `${visual.number}.png`);
    await access(incoming);
    await sharp(incoming)
      .rotate()
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(path.join(sourceDirectory, `${visual.slug}-enhanced-master.jpg`));
  }
}

function pipelineFor(visual) {
  let pipeline = sharp(path.join(sourceDirectory, `${visual.slug}-enhanced-master.jpg`)).rotate();
  if (visual.extract) pipeline = pipeline.extract(visual.extract);
  return pipeline.sharpen({ sigma: 0.45 });
}

for (const visual of visuals) {
  await access(path.join(sourceDirectory, `${visual.slug}-enhanced-master.jpg`));
  const baseName = `${visual.slug}-enhanced`;

  await pipelineFor(visual)
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(publicDirectory, `${baseName}.jpg`));

  for (const width of [720, 1280]) {
    await pipelineFor(visual)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width === 720 ? 64 : 72, effort: 6 })
      .toFile(path.join(publicDirectory, `${baseName}-${width}.webp`));
  }

  await pipelineFor(visual)
    .resize({ width: 1280, withoutEnlargement: true })
    .avif({ quality: 48, effort: 6 })
    .toFile(path.join(publicDirectory, `${baseName}-1280.avif`));

  if (visual.number === '16') {
    for (const format of ['jpg', 'webp', 'avif']) {
      const mobilePipeline = pipelineFor(visual).resize({
        width: 720,
        height: 960,
        fit: 'cover',
        position: 'centre',
      });

      if (format === 'jpg') {
        await mobilePipeline.jpeg({ quality: 84, mozjpeg: true })
          .toFile(path.join(publicDirectory, `${baseName}-mobile.jpg`));
      } else if (format === 'webp') {
        await mobilePipeline.webp({ quality: 70, effort: 6 })
          .toFile(path.join(publicDirectory, `${baseName}-mobile.webp`));
      } else {
        await mobilePipeline.avif({ quality: 46, effort: 6 })
          .toFile(path.join(publicDirectory, `${baseName}-mobile.avif`));
      }
    }
  }
}

console.log(`Processed ${visuals.length} unique owner-supplied enhanced visuals.`);
