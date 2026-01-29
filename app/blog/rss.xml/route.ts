import { NextResponse } from "next/server";
import { getContentList } from "@/utils/content";
import { BRAND_NAME } from "@/utils/brand";
import { SITE_URL } from "@/utils/seo";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const posts = await getContentList("blog", { includeDrafts: false });
  const siteUrl = SITE_URL.replace(/\/$/, "");
  const feedUrl = `${siteUrl}/blog/rss.xml`;

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      return `\n    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${BRAND_NAME} Blog`)}</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml("Hesaplama ve analiz odakli blog yazilari.")}</description>
    <language>tr-TR</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
