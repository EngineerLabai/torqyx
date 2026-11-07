import fs from 'fs';
import path from 'path';

function getSlugs(folder) {
  const dir = path.join(process.cwd(), 'content', folder);
  const files = fs.readdirSync(dir);
  const slugs = new Set();
  for (const f of files) {
    if (f.endsWith('.tr.mdx') || f.endsWith('.en.mdx')) {
      slugs.add(f.replace(/\.(tr|en)\.mdx$/, ''));
    }
  }
  return [...slugs].sort();
}

console.log('GUIDES:', getSlugs('guides'));
console.log('GLOSSARY:', getSlugs('glossary'));
