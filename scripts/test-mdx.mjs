import fs from 'node:fs';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node scripts/test-mdx.mjs <file>");
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
try {
  await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    },
  });
  const words = content.trim().split(/\s+/).length;
  console.log(`[PASS] ${filePath} (${words} words) compiled cleanly!`);
} catch (err) {
  console.error(`[FAIL] ${filePath}:`, err.message);
  process.exit(1);
}
