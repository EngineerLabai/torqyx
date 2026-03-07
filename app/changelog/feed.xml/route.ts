import { NextResponse } from "next/server";
import { BRAND_NAME } from "@/config/brand";
import { getMessages } from "@/utils/messages";
import { SITE_URL } from "@/utils/seo";
import { getChangelogEntries } from "@/utils/changelog";
import type { Locale } from "@/utils/locale";

export const dynamic = "force-static";

const LOCALE: Locale = "tr";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const markdownToPlainText = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function GET() {
  const copy = getMessages(LOCALE).pages.changelog;
  const entries = await getChangelogEntries(LOCALE, { includeDrafts: false });
  const siteUrl = SITE_URL.replace(/\/$/, "");
  const listUrl = `${siteUrl}/changelog`;
  const feedUrl = `${siteUrl}/changelog/feed.xml`;

  const items = entries
    .map((entry) => {
      const itemUrl = `${listUrl}#${entry.slug}`;
      const description = markdownToPlainText(entry.description);

      return `\n    <item>
      <title>${escapeXml(`v${entry.version} - ${entry.tool}`)}</title>
      <link>${itemUrl}</link>
      <guid>${itemUrl}</guid>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${BRAND_NAME} Changelog`)}</title>
    <link>${listUrl}</link>
    <description>${escapeXml(copy.description)}</description>
    <language>${LOCALE === "en" ? "en-US" : "tr-TR"}</language>
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
