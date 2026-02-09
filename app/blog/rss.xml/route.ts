import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getContentList } from "@/utils/content";
import { BRAND_NAME } from "@/config/brand";
import { SITE_URL } from "@/utils/seo";
import { withLocalePrefix } from "@/utils/locale-path";
import { getMessages } from "@/utils/messages";
import { isLocale, type Locale } from "@/utils/locale";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const resolveLocale = (): Locale => {
  const headerLocale = headers().get("x-locale");
  return isLocale(headerLocale) ? headerLocale : "tr";
};

export async function GET() {
  const locale = resolveLocale();
  const posts = await getContentList("blog", { includeDrafts: false, locale });
  const siteUrl = SITE_URL.replace(/\/$/, "");
  const feedUrl = `${siteUrl}${withLocalePrefix("/blog/rss.xml", locale)}`;
  const listHref = `${siteUrl}${withLocalePrefix("/blog", locale)}`;
  const copy = getMessages(locale).pages.blog;

  const items = posts
    .map((post) => {
      const url = `${siteUrl}${withLocalePrefix(`/blog/${post.slug}`, locale)}`;
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
    <link>${listHref}</link>
    <description>${escapeXml(copy.description)}</description>
    <language>${locale === "en" ? "en-US" : "tr-TR"}</language>
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

