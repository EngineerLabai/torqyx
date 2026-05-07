import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Simple OG generator: creates SVGs and converts to PNG using sharp if available.
// Usage: node scripts/generate-og-images.mjs [path=/,/en,...] [locales=tr,en]

const outDir = path.join(process.cwd(), 'public', 'og');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const routes = process.argv.length > 2 ? process.argv.slice(2) : ['/', '/en'];
const locales = (process.env.OG_LOCALES || 'tr,en').split(',');

function slugifyRoute(route) {
  if (route === '/') return 'home';
  return route.replace(/^\//, '').replace(/\//g, '-');
}

function makeSvg(title, siteName = 'aiengineerslab', tagline = 'Engineering with AI') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0a0a0a" />
  <defs>
    <style>
      .title{font-family: Arial, sans-serif; fill:#fff; font-size:56px; font-weight:700}
      .tag{font-family: Arial, sans-serif; fill:#ccc; font-size:24px}
    </style>
  </defs>
  <g>
    <text x="72" y="120" class="title">${escapeXml(title)}</text>
    <text x="72" y="200" class="tag">${escapeXml(siteName)} — ${escapeXml(tagline)}</text>
    <text x="72" y="580" class="tag">aiengineerslab.com</text>
  </g>
</svg>`;
}

function escapeXml(s){ return String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;', '"':'&quot;'}[c])); }

(async function main(){
  for (const route of routes) {
    for (const locale of locales) {
      const slug = slugifyRoute(route);
      const fileBase = `${slug}-${locale}`;
      const svg = makeSvg(route === '/' ? (locale === 'en' ? 'Home' : 'Ana Sayfa') : route, 'aiengineerslab', 'Engineering with AI');
      const svgPath = path.join(outDir, `${fileBase}.svg`);
      fs.writeFileSync(svgPath, svg);
      console.log('Wrote', svgPath);
      try {
        const pngPath = path.join(outDir, `${fileBase}.png`);
        await sharp(Buffer.from(svg)).png().toFile(pngPath);
        console.log('Rendered', pngPath);
      } catch (err) {
        console.warn('sharp render failed (maybe not installed or incompatible); leaving SVG only', err.message);
      }
    }
  }
})();
