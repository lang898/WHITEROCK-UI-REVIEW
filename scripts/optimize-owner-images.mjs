import { access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ownerDirectory = path.resolve('public/assets/owner/vietnam');
const imageNames = ['factory-01', 'factory-02', 'factory-03', 'factory-04', 'factory-05', 'factory-06'];
const widths = [720, 1280];

for (const name of imageNames) {
  const source = path.join(ownerDirectory, `${name}.jpg`);
  await access(source);

  for (const width of widths) {
    await sharp(source)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 68, effort: 6 })
      .toFile(path.join(ownerDirectory, `${name}-${width}.webp`));
  }
}

console.log(`Generated ${imageNames.length * widths.length} responsive owner-photo WebP files.`);
