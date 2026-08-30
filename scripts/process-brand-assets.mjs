import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceDirectory = path.resolve('source-assets/brand');
const publicDirectory = path.resolve('public/assets/brand');
const importDirectory = process.argv[2] ? path.resolve(process.argv[2]) : null;
const masterPath = path.join(sourceDirectory, 'whiterock-logo-source.png');

await mkdir(sourceDirectory, { recursive: true });
await mkdir(publicDirectory, { recursive: true });

if (importDirectory) {
  const incoming = path.join(importDirectory, 'WHITEROCK LOGO_R1.png');
  await access(incoming);
  await sharp(incoming).png().toFile(masterPath);
}

await access(masterPath);

async function transparentGrayLogo(input, extract) {
  let pipeline = sharp(input).ensureAlpha();
  if (extract) pipeline = pipeline.extract(extract);
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });

  for (let index = 0; index < data.length; index += 4) {
    const luminance = Math.round((data[index] + data[index + 1] + data[index + 2]) / 3);
    const alpha = Math.max(0, Math.min(255, (245 - luminance) * 2.4));
    data[index] = 86;
    data[index + 1] = 86;
    data[index + 2] = 84;
    data[index + 3] = alpha;
  }

  return sharp(data, { raw: info }).trim({ threshold: 2 });
}

await (await transparentGrayLogo(masterPath))
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDirectory, 'whiterock-logo-gray.png'));

await (await transparentGrayLogo(masterPath, { left: 90, top: 35, width: 420, height: 390 }))
  .resize(256, 256, { fit: 'contain' })
  .png({ compressionLevel: 9 })
  .toFile(path.join(publicDirectory, 'whiterock-mark-gray.png'));

await (await transparentGrayLogo(masterPath, { left: 90, top: 35, width: 420, height: 390 }))
  .resize(128, 128, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(path.resolve('public/favicon.png'));

console.log('Processed WHITEROCK logo source for header, footer, and favicon use.');
