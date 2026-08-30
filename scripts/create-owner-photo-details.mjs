import { access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ownerDirectory = path.resolve('public/assets/owner/vietnam');

const treatments = [
  { source: 'factory-01.jpg', output: 'factory-01-entrance-color', extract: { left: 560, top: 365, width: 900, height: 520 }, saturation: 0.72 },
  { source: 'vanity-05.jpg', output: 'vanity-05-entrance-color', extract: { left: 45, top: 330, width: 940, height: 300 }, saturation: 0.76 },
  { source: 'factory-02.jpg', output: 'factory-02-equipment-color', extract: { left: 520, top: 255, width: 900, height: 675 }, saturation: 0.84, brightness: 1.02 },
  { source: 'factory-03.jpg', output: 'factory-03-equipment-muted', extract: { left: 280, top: 205, width: 980, height: 735 }, saturation: 0.58, brightness: 1.04 },
  { source: 'factory-03.jpg', output: 'factory-03-equipment-bw', extract: { left: 280, top: 205, width: 980, height: 735 }, monochrome: true },
  { source: 'factory-04.jpg', output: 'factory-04-product-detail', extract: { left: 110, top: 205, width: 1060, height: 620 }, saturation: 0.98 },
  { source: 'factory-05.jpg', output: 'factory-05-product-detail', extract: { left: 90, top: 365, width: 1320, height: 640 }, saturation: 0.96 },
  { source: 'factory-06.jpg', output: 'factory-06-product-detail', extract: { left: 20, top: 250, width: 1500, height: 816 }, saturation: 0.96 },
  { source: 'vanity-01.jpg', output: 'vanity-01-workshop-color', extract: { left: 52, top: 72, width: 404, height: 240 }, saturation: 0.82, brightness: 1.02 },
  { source: 'vanity-02.jpg', output: 'vanity-02-workshop-color', extract: { left: 55, top: 62, width: 380, height: 240 }, saturation: 0.9 },
  { source: 'vanity-03.jpg', output: 'vanity-03-yard-color', extract: { left: 0, top: 0, width: 499, height: 333 }, saturation: 0.84, brightness: 1.01 },
  { source: 'vanity-04.jpg', output: 'vanity-04-workshop-color', extract: { left: 45, top: 70, width: 410, height: 235 }, saturation: 0.84 },
  { source: 'legacy-production-hall-original.jpg', output: 'production-hall-overview', extract: { left: 0, top: 0, width: 595, height: 339 }, saturation: 0.86, brightness: 1.02 },
  { source: 'legacy-vanity-qc-wide-original.jpg', output: 'vanity-qc-overview', extract: { left: 450, top: 160, width: 1350, height: 760 }, saturation: 0.96, brightness: 1.01 },
  { source: 'legacy-vanity-qc-line-original.jpg', output: 'vanity-qc-line', extract: { left: 140, top: 850, width: 1260, height: 945 }, saturation: 0.97, brightness: 1.01 }
];

function treatmentPipeline(source, treatment) {
  let pipeline = sharp(source).rotate().extract(treatment.extract);
  if (treatment.monochrome) {
    pipeline = pipeline.grayscale().linear(1.06, -4).sharpen({ sigma: 0.8 });
  } else {
    pipeline = pipeline
      .modulate({ saturation: treatment.saturation ?? 0.94, brightness: treatment.brightness ?? 1 })
      .sharpen({ sigma: 0.7 });
  }
  return pipeline;
}

for (const treatment of treatments) {
  const source = path.join(ownerDirectory, treatment.source);
  await access(source);

  const jpg = path.join(ownerDirectory, `${treatment.output}.jpg`);
  await treatmentPipeline(source, treatment).jpeg({ quality: 84, mozjpeg: true }).toFile(jpg);

  for (const width of [480, 720, 1280]) {
    const quality = width <= 480 ? 48 : width <= 720 ? 58 : 68;
    await treatmentPipeline(source, treatment)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(path.join(ownerDirectory, `${treatment.output}-${width}.webp`));
  }

  if (treatment.output === 'factory-06-product-detail') {
    for (const width of [480, 1280]) {
      await treatmentPipeline(source, treatment)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: width === 480 ? 38 : 46, effort: 6 })
        .toFile(path.join(ownerDirectory, `${treatment.output}-${width}.avif`));
    }

    const mobileHero = sharp(source)
      .rotate()
      .extract({ left: 650, top: 0, width: 650, height: 1066 })
      .modulate({ saturation: 0.94 })
      .sharpen({ sigma: 0.7 })
      .resize({ width: 420, withoutEnlargement: true });
    await mobileHero.clone().avif({ quality: 28, effort: 6 }).toFile(path.join(ownerDirectory, 'factory-06-hero-mobile.avif'));
    await mobileHero.webp({ quality: 44, effort: 6 }).toFile(path.join(ownerDirectory, 'factory-06-hero-mobile.webp'));
  }
}

const factorySix = path.join(ownerDirectory, 'factory-06.jpg');
const desktopHero = () => sharp(factorySix)
  .rotate()
  .extract({ left: 0, top: 450, width: 1600, height: 400 })
  .modulate({ saturation: 0.96, brightness: 1.02 })
  .sharpen({ sigma: 0.7 });

await desktopHero().jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(ownerDirectory, 'factory-06-hero-detail.jpg'));
await desktopHero().resize({ width: 1280 }).webp({ quality: 72, effort: 6 }).toFile(path.join(ownerDirectory, 'factory-06-hero-detail-1280.webp'));
await desktopHero().resize({ width: 1280 }).avif({ quality: 48, effort: 6 }).toFile(path.join(ownerDirectory, 'factory-06-hero-detail-1280.avif'));

const factoryFour = path.join(ownerDirectory, 'factory-04.jpg');
const mobileHero = () => sharp(factoryFour)
  .rotate()
  .extract({ left: 360, top: 350, width: 480, height: 503 })
  .modulate({ saturation: 0.98, brightness: 1.02 })
  .sharpen({ sigma: 0.7 });

await mobileHero().jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(ownerDirectory, 'factory-04-hero-detail-mobile.jpg'));
await mobileHero().webp({ quality: 68, effort: 6 }).toFile(path.join(ownerDirectory, 'factory-04-hero-detail-mobile.webp'));
await mobileHero().avif({ quality: 46, effort: 6 }).toFile(path.join(ownerDirectory, 'factory-04-hero-detail-mobile.avif'));

const machineTreatments = [
  { source: 'factory-02.jpg', output: 'factory-02-machine-detail', extract: { left: 600, top: 430, width: 650, height: 487 }, saturation: 0.42, brightness: 1.02 },
  { source: 'factory-03.jpg', output: 'factory-03-machine-detail', extract: { left: 500, top: 370, width: 600, height: 450 }, monochrome: true }
];

for (const treatment of machineTreatments) {
  const source = path.join(ownerDirectory, treatment.source);
  const jpg = path.join(ownerDirectory, `${treatment.output}.jpg`);
  await treatmentPipeline(source, treatment).jpeg({ quality: 84, mozjpeg: true }).toFile(jpg);
  for (const width of [720, 1280]) {
    await treatmentPipeline(source, treatment)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width === 720 ? 60 : 70, effort: 6 })
      .toFile(path.join(ownerDirectory, `${treatment.output}-${width}.webp`));
  }
}

console.log(`Generated ${treatments.length + machineTreatments.length} editorial crops plus dedicated desktop and mobile close-up hero assets.`);
