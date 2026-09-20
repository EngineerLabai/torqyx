import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

const BLOG_DIR = join(process.cwd(), "content", "blog");
const MIN_PARAGRAPH_WORDS = 40;
const NON_PROSE_BLOCK = /^(?:#{1,6}\s|<|```|~~~|\||>|[-*+]\s|\d+[.)]\s|import\s|export\s)/;

type PublishedBlog = {
  fileName: string;
  content: string;
};

const countWords = (value: string) =>
  value.match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu)?.length ?? 0;

const normalizeParagraph = (value: string) => value.replace(/\s+/g, " ").trim();

const getPublishedBlogs = (): PublishedBlog[] =>
  readdirSync(BLOG_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const source = readFileSync(join(BLOG_DIR, fileName), "utf8");
      const parsed = matter(source);
      return { fileName, content: parsed.content, draft: parsed.data.draft };
    })
    .filter(({ draft }) => draft !== true)
    .map(({ fileName, content }) => ({ fileName, content }));

const getLongProseParagraphs = (content: string) =>
  content
    .split(/\r?\n\s*\r?\n/)
    .map(normalizeParagraph)
    .filter((paragraph) =>
      Boolean(paragraph) &&
      !NON_PROSE_BLOCK.test(paragraph) &&
      countWords(paragraph) >= MIN_PARAGRAPH_WORDS,
    );

describe("published blog content quality", () => {
  it("has no exact duplicate prose paragraphs of 40 words or more", () => {
    const blogs = getPublishedBlogs();
    const paragraphFiles = new Map<string, Set<string>>();

    for (const blog of blogs) {
      for (const paragraph of getLongProseParagraphs(blog.content)) {
        const files = paragraphFiles.get(paragraph) ?? new Set<string>();
        files.add(blog.fileName);
        paragraphFiles.set(paragraph, files);
      }
    }

    const duplicates = [...paragraphFiles.entries()]
      .filter(([, files]) => files.size > 1)
      .map(([paragraph, files]) => ({
        files: [...files].sort(),
        preview: `${paragraph.slice(0, 120)}${paragraph.length > 120 ? "…" : ""}`,
      }));

    expect(blogs.length).toBeGreaterThan(0);
    expect(duplicates).toEqual([]);
  });

  it("keeps bearing-selection copy out of the mil-gobek article", () => {
    const article = readFileSync(
      join(BLOG_DIR, "mil-gobek-baglantisi-kamali-flansli-gecme-cakma.tr.mdx"),
      "utf8",
    );
    const topicLeakMarkers = [
      "Yataklama düzeni tek parça seçimi değildir",
      "Rulman seçimi yalnız bir katalog kodu",
      "Rulman kararını sağlıklı vermek",
    ];

    for (const marker of topicLeakMarkers) {
      expect(article).not.toContain(marker);
    }
  });
});
