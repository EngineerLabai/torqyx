import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

const repoRoot = process.cwd();
const imagesDir = path.join(repoRoot, 'public', 'images');
const names = [
  'piston-assembly',
  'electric-motor',
  'beam-section',
  'gearbox-cutaway',
  'pump-diagram',
  'thermal-map',
];

async function convert(name) {
  const inPath = path.join(imagesDir, `${name}.svg`);
  const outPath = path.join(imagesDir, `${name}.webp`);
  try {
    await fs.access(inPath);
  } catch {
    console.error(`Missing source SVG: ${inPath}`);
    return { name, ok: false, reason: 'missing' };
  }
  try {
    const buffer = await fs.readFile(inPath);
    await sharp(buffer).webp({ quality: 80 }).toFile(outPath);
    console.log(`Converted ${inPath} -> ${outPath}`);
    return { name, ok: true };
  } catch (err) {
    console.error(`Failed to convert ${inPath}:`, err);
    return { name, ok: false, reason: err.message };
  }
}

(async () => {
  const results = [];
  for (const name of names) {
    // run sequentially to avoid heavy parallel IO
    // Note: sharp is installed in devDependencies
    // run conversion
    // On Windows, import.meta.url path may start with /c:/, normalize
    try {
      const res = await convert(name);
      results.push(res);
    } catch (err) {
      console.error('Error converting', name, err);
      results.push({ name, ok: false, reason: err.message });
    }
  }
  console.log('Summary', results);
  const failed = results.filter(r => !r.ok);
  process.exit(failed.length ? 2 : 0);
})();
