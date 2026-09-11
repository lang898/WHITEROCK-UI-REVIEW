import { access, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('public/assets');
const sourceExtensions = new Set(['.jpg', '.jpeg', '.png']);

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (sourceExtensions.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

const sources = await walk(root);
let generated = 0;

for (const source of sources) {
  const extension = path.extname(source);
  const base = source.slice(0, -extension.length);
  const webp = `${base}.webp`;
  const avif = `${base}.avif`;
  const webp1280 = `${base}-1280.webp`;
  const avif1280 = `${base}-1280.avif`;
  const metadata = await sharp(source).metadata();

  if (!(await exists(webp))) {
    await sharp(source).rotate().webp({ quality: 76, effort: 6 }).toFile(webp);
    generated += 1;
  }
  if (!(await exists(avif))) {
    await sharp(source).rotate().avif({ quality: 58, effort: 6 }).toFile(avif);
    generated += 1;
  }

  if ((metadata.width || 0) > 1280) {
    if (!(await exists(webp1280))) {
      await sharp(source).rotate().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 72, effort: 6 }).toFile(webp1280);
      generated += 1;
    }
    if (!(await exists(avif1280))) {
      await sharp(source).rotate().resize({ width: 1280, withoutEnlargement: true }).avif({ quality: 54, effort: 6 }).toFile(avif1280);
      generated += 1;
    }
  }
}

console.log(`Scanned ${sources.length} source images and generated ${generated} missing WebP/AVIF variants.`);
