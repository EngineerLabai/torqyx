import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { glossaryPart1 } from './glossary-data-1.mjs';
import { glossaryPart2 } from './glossary-data-2.mjs';

const allTerms = { ...glossaryPart1, ...glossaryPart2 };
const GLOSSARY_DIR = path.join(process.cwd(), 'content', 'glossary');

console.log(`Loaded ${Object.keys(allTerms).length} glossary terms.`);

let writtenFiles = 0;

for (const [slug, data] of Object.entries(allTerms)) {
  // Turkish file
  const trPath = path.join(GLOSSARY_DIR, `${slug}.tr.mdx`);
  const trContent = `---
title: ${JSON.stringify(data.tr.title)}
description: ${JSON.stringify(data.tr.description)}
date: "2026-05-09"
tags: ${JSON.stringify(data.tags)}
category: ${JSON.stringify(data.category)}
draft: false
readingTime: 4
---

${data.tr.body.trim()}
`;
  fs.writeFileSync(trPath, trContent, 'utf8');
  writtenFiles++;

  // English file
  const enCategory = data.category === 'İmalat' ? 'Manufacturing' :
                     data.category === 'Standartlar' ? 'Standards' :
                     data.category === 'Mekanik' ? 'Mechanical' :
                     data.category === 'Akışkanlar' ? 'Fluids' :
                     data.category === 'Tolerans' ? 'Tolerance' :
                     data.category === 'Malzeme' ? 'Materials' :
                     data.category === 'Elektrik' ? 'Electrical' :
                     data.category === 'Termal' ? 'Thermal' : 'Engineering';

  const enPath = path.join(GLOSSARY_DIR, `${slug}.en.mdx`);
  const enContent = `---
title: ${JSON.stringify(data.en.title)}
description: ${JSON.stringify(data.en.description)}
date: "2026-05-09"
tags: ${JSON.stringify(data.tags)}
category: ${JSON.stringify(enCategory)}
draft: false
readingTime: 4
---

${data.en.body.trim()}
`;
  fs.writeFileSync(enPath, enContent, 'utf8');
  writtenFiles++;
}

console.log(`Successfully written ${writtenFiles} glossary MDX files.`);
