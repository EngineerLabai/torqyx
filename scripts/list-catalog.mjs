import fs from 'fs';

const text = fs.readFileSync('tools/_shared/catalog.ts', 'utf8');
const idMatches = [...text.matchAll(/id:\s*["']([^"']+)["']/g)].map(m => m[1]);
console.log('Unique tool IDs:', JSON.stringify([...new Set(idMatches)], null, 2));
