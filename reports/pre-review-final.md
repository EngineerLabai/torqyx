# AdSense Pre-Review Final Verification Report (AŞAMA C)

- **Verification Date (UTC):** 2026-11-28T11:07:42Z
- **Live Target:** `https://torqyx.com` (Deployed through commit `546f6df`)
- **Methodology:** Automated live crawl of all **249** URLs in `https://torqyx.com/sitemap.xml`, internal anchor targets, RSS/feed endpoints, `ads.txt`, `robots.txt`, redirect variants (`redirect: "manual"`), JSON-LD `@graph` parsing, HTML language/mojibake/SSR checks, and local quality gates (`Vitest`, `ESLint`, `tsc`, `seo:links`, `next build`).

---

## C1. Before / After Comparison (`888c010` vs `546f6df`)

| Audit Check | Before (`888c010`) | After (`546f6df`) | Delta |
|---|---|---|---|
| **Sitemap total URLs** | `249` | `249` | Unchanged |
| **Non-200 URLs in sitemap (`redirect: "manual"`)** | `0` | `0` | Clean |
| **Forbidden/noindex URLs in sitemap** | `0` | `0` | Clean |
| **Canonical mismatches** | `0` | `0` | Clean |
| **Non-reciprocal / noindex `hreflang` issues** | `18` | `0` | **-18 fixed** |
| **Broken / redirecting internal links (307)** | `18` (`2` `/tables` + `16` `/guide`) | `0` | **-18 fixed** |
| **`/tags/` links in sitemap HTML** | `0` | `0` | Clean |
| **`/guide` subpath internal links** | `16` | `0` | **-16 fixed** |
| **Decoded Title `> 60` chars / `$Re` in `<title>`** | `2` broken `$Re` glossary titles | `0` | **-2 fixed** |
| **`/tr/changelog/feed.xml` & `<link rel="alternate">`** | `404` / missing tag | `308 -> /changelog/feed.xml` (`200`) + tag emitted | **Fixed** |
| **Duplicate titles / descriptions / legacy templates** | `0` | `0` | Clean |
| **EN guide mojibake (`╬╝`, `¤ü`, `┬░C`, `Ôëê`)** | `4` guides (`pompa`, `titanyum`, `yuzey`, `tolerans`) | `0` | **-4 fixed** |
| **SSR `"Kartlar yükleniyor..."` (`material-cards`)** | `1` page | `0` | **Fixed** |
| **JSON-LD gaps (`BreadcrumbList` / `Person` / `dateModified`)** | `25+` missing `BreadcrumbList` | `0` | **Fixed** |
| **Reference tables inbound sitemap links** | `1–2` | `3–4` (Kama TR/EN: `3/3`, Cıvata TR/EN: `3/4`) | **Strengthened** |
| **Pre-consent `pagead2` / `.adsbygoogle` count** | `0` | `0` | Clean |
| **`https://torqyx.com/ads.txt`** | `200 text/plain` exact match | `200 text/plain` exact match | Clean |
| **`https://www.torqyx.com/` redirect status** | `307` (Vercel Edge) | `307` (Vercel Edge) | **ATLANDI** (Vercel Domain Dashboard setting) |

---

## C2. GO / NO-GO Checklist & Live Command Evidence

| Criterion | Status | Live Evidence / Command Output |
|---|---|---|
| **Sitemap `!= 200` URL = `0`** | **GO** | `post-audit.mjs`: `"sitemapCount": 249, "non200Count": 0` |
| **Sitemap noindex / redirect / 404 = `0`** | **GO** | `post-audit.mjs`: `"noindexInSitemapCount": 0, "forbiddenPathsCount": 0, "canonicalMismatchCount": 0` |
| **Unique Title & Description (dups = `0`, `$Re` = `0`)** | **GO** | `post-audit.mjs`: `"dupTitlesCount": 0, "dupDescsCount": 0, "dupLastSentencesCount": 0, "legacyTemplatesCount": 0, "longTitlesCount": 0, "dollarInTitle": [], "longDescsCount": 0` |
| **Broken / Redirect internal links = `0`; `/tags/`, `/guide`, language-less = `0`** | **GO** | `post-audit.mjs`: `"brokenOrRedirectLinksCount": 0, "tagLinksCount": 0, "guideSubpathLinksCount": 0, "badHrefsCount": 0` & `/tools/bolt-calculator` -> `308 -> /tr/tools/bolt-calculator` |
| **`rel="alternate"` RSS & `/tr/changelog/feed.xml`** | **GO** | `"changelogAlternateFeeds": [{"href":"https://torqyx.com/changelog/feed.xml","type":"application/rss+xml"}]`, `"trChangelogFeedRedirect": {"status": 308, "location": "/changelog/feed.xml"}`, `"changelogFeedStatus": {"status": 200, "ct": "application/rss+xml; charset=utf-8"}` |
| **3 Guides indexable & in sitemap** | **GO** | Live `fetch`: `/tr/guides/titanyum-alasimlari-rehberi` (`200`, `1485w`), `/tr/guides/yuzey-isleme-yontemleri-rehberi` (`200`, `1505w`), `/tr/guides/makine-ogesi-omru-yorulma-rehberi` (`200`, `1499w`); EN counterparts `1562–1722w`; `robots=""`; `TechArticle` with `author:Person` & `dateModified`. *(Not: İçerik hacmi kuralı gereği metin şişirmesi yapılmadığı için TR `<main>` kelimesi 1485–1505 bandında tutulmuştur.)* |
| **Reference Tables indexable, linked, and tested** | **GO** | `refInbound`: Kama TR (`inbound: 3`, `2586w`), Kama EN (`inbound: 3`, `2689w`), Cıvata TR (`inbound: 3`, `2654w`), Cıvata EN (`inbound: 4`, `2767w`). Vitest: `parallel-key-table.test.ts` (`7 passed`), `bolt-torque-table.test.ts` (`8 passed`). *(Not: Yerel Playwright Chromium ikilisi kurulu olmadığı için 390px canlı piksel testi `ATLANDI`; `overflow-x-auto` kapsayıcısı kodda ve 1280px canlı testte `0px` taşma ile doğrulandı.)* |
| **Trust pages `200` & forbidden phrases = `0`** | **GO** | `post-audit.mjs`: all 14 trust URLs (`hakkinda`/`about`, `metodoloji`/`methodology`, `sorumluluk-reddi`/`disclaimer`, `iletisim`/`contact`, `gizlilik`/`privacy`, `cerez-politikasi`/`cookies`, `kullanim-sartlari`/`terms`) returned `200`; `"forbiddenTrustCount": 0`; `mailto:infotorqyx@gmail.com` present. |
| **Pre-consent ads = `0` & `ads.txt` = `200 text/plain`** | **GO** | `"preConsentAdsCount": 0, "missingAdsenseMetaCount": 0`, `"adsTxt": {"status": 200, "ct": "text/plain; charset=utf-8", "body": "google.com, pub-8444187117761223, DIRECT, f08c47fec0942fa0"}` |
| **`www` / `http` permanent redirects (`308/301`)** | **KISMİ (ATLANDI — Vercel Ayarı)** | `"redirects": {"httpApex": 308, "httpWww": 308, "www": 307}`. **Neden:** `https://www.torqyx.com` isteği Next.js `proxy.ts` (kodda `301`) katmanına ulaşmadan Vercel Edge (`server: Vercel`) domain yönlendirmesi tarafından `307` ile karşılanmaktadır. **Öneri:** Vercel Dashboard -> Project Settings -> Domains altında `www.torqyx.com` redirect tipini `308 Permanent` yapın. |
| **Language leakage & mojibake = `0`** | **GO** | `"mojibakePagesCount": 0`, `"ssrLoadingPagesCount": 0`, `"boltDbHasMixedStainlessEn": false`, `"boltDbHasA2StainlessEn": true`, `"boltDbHasA2PaslanmazTr": true` |
| **Tests, Lint, Type-Check, Build clean** | **GO** | `npm test`: `35 files, 431 passed`; `npm run lint`: `0 errors, 0 warnings`; `npm run type-check`: `0 errors`; `npm run seo:links`: `0 broken`; `npm run build`: `899/899` pages built. |

**Overall Verdict:** **GO FOR ADSENSE REVIEW** *(Optional recommendation: switch `www.torqyx.com` -> `torqyx.com` redirect from `307` to `308` in Vercel Dashboard).*

---

## C3. Google Search Console Priority 10 URLs ("Dizine eklenmesini iste")

1. `https://torqyx.com/tr`
2. `https://torqyx.com/en`
3. `https://torqyx.com/tr/guides/titanyum-alasimlari-rehberi`
4. `https://torqyx.com/tr/guides/yuzey-isleme-yontemleri-rehberi`
5. `https://torqyx.com/tr/guides/makine-ogesi-omru-yorulma-rehberi`
6. `https://torqyx.com/tr/referans/kama-olculeri-ve-tolerans-tablosu`
7. `https://torqyx.com/en/reference/parallel-key-size-and-tolerance-table`
8. `https://torqyx.com/tr/referans/civata-sikma-torku-tablosu`
9. `https://torqyx.com/tr/tools/bolt-calculator`
10. `https://torqyx.com/en/tools/shaft-torsion`

---

## C4. Commits & Modified Files Summary

- **`9be13a5`** (`fix(seo): wire alternates.types in metadata and permanently redirect localized changelog feed paths`)
  - Modified: `utils/metadata.ts`, `proxy.ts`
- **`cd626ea`** (`fix(links): replace /tables and fallback /guide links with canonical routes and enforce 308 redirects`)
  - Modified: `content/blog/rulman-toleranslari-iso-286-sistemi.tr.mdx`, `content/blog/rulman-toleranslari-iso-286-sistemi.en.mdx`, `app/(tools)/tools/[...slug]/page.tsx`, `proxy.ts`
- **`a86d621`** (`fix(seo): sanitize glossary title math tokens and trailing punctuation clipping`)
  - Modified: `content/glossary/laminar-flow.tr.mdx`, `content/glossary/turbulent-flow.tr.mdx`, `content/glossary/viscosity.tr.mdx`, `app/glossary/[slug]/page.tsx`, `utils/metadata.ts`
- **`d402435`** (`fix(seo): emit hreflang alternates only when both locales are indexable`)
  - Modified: `app/glossary/page.tsx`, `app/glossary/[slug]/page.tsx`, `app/(blog)/blog/[slug]/page.tsx`, `app/guides/[slug]/page.tsx`, `utils/tool-seo.ts`
- **`0ef325b`** (`feat(seo): add mutual inbound links from bolt and shaft-hub blogs to reference tables`)
  - Modified: `content/blog/civata-on-yuku-vdi-2230.tr.mdx`, `content/blog/civata-on-yuku-vdi-2230.en.mdx`, `content/blog/iso-898-1-civata-standartlari.tr.mdx`, `content/blog/iso-898-1-civata-standartlari.en.mdx`, `content/blog/mil-gobek-baglantisi-kamali-flansli-gecme-cakma.tr.mdx`, `content/blog/mil-gobek-baglantisi-kamali-flansli-gecme-cakma.en.mdx`
- **`61f8963`** (`feat(seo): add BreadcrumbList JSON-LD to index, hub, and trust pages`)
  - Modified: `utils/seo.ts`, `app/(tools)/tools/page.tsx`, `app/(blog)/blog/page.tsx`, `app/reference/page.tsx`, `app/faq/page.tsx`, `app/changelog/page.tsx`, `app/[locale]/(tools)/tools/gear-design/page.tsx`, `app/hakkinda/page.tsx`, `app/metodoloji/page.tsx`, `app/sorumluluk-reddi/page.tsx`, `app/iletisim/page.tsx`, `app/gizlilik/page.tsx`, `app/cerez-politikasi/page.tsx`, `app/[locale]/kullanim-sartlari/page.tsx`
- **`3f3a3a2`** (`fix(i18n): eliminate EN guide mojibake and render material-cards SSR content without loading state`)
  - Modified: `content/guides/pompa-turleri-secim-rehberi.en.mdx`, `content/guides/titanyum-alasimlari-rehberi.en.mdx`, `content/guides/yuzey-isleme-yontemleri-rehberi.en.mdx`, `content/guides/tolerans-zinciri-ve-gdt-rehberi.en.mdx`, `content/blog/rulman-toleranslari-iso-286-sistemi.en.mdx`, `app/(tools)/tools/material-cards/Client.tsx`
- **`546f6df`** (`docs(audit): add AdSense pre-review live audit report (Phase A)`)
  - Added: `reports/pre-review-audit.md`
