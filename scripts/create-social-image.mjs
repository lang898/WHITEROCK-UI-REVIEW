import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const site = JSON.parse(await readFile('data/site.config.json', 'utf8'));
await sharp('public/assets/owner/countertops/waterfall-kitchen-island.jpg')
  .resize(site.ogImageWidth, site.ogImageHeight, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(path.join('public', site.ogImage));
console.log(`Social image: ${site.ogImageWidth} x ${site.ogImageHeight}`);
