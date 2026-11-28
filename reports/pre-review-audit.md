# Pre-Review Live Audit Report (AŞAMA A)

- **Audit Date (UTC):** 2026-11-25T20:22:07Z / 2026-11-26
- **Target Host:** `https://torqyx.com` (Commit at audit time: `888c010`)
- **Scope:** Full read-only scan of all **249** URLs in `https://torqyx.com/sitemap.xml` plus trust, reference, guide, feed, redirect, and noindex probe URLs (total 255+ pages + 92 linked internal URLs, `redirect: "manual"`).

---

## Summary Table of Findings

| ID | Category | Priority | Observed Metric / Evidence | Status / Action |
|---|---|---|---|---|
| **A1** | Sitemap HTTP Status (`249` URLs) | **TEMİZ** | `non200Count = 0` (249/249 HTTP `200 OK`) | Pass |
| **A1** | Canonical & H1 Count (`249` URLs) | **TEMİZ** | `canonicalMismatch = 0`, `h1Anomalies = 0` | Pass |
| **A1** | Title `> 60` chars / Broken LaTeX in Title | **ORTA** | 2 glossary titles render raw `$Re < 2300$` / `$Re >` in `<title>` (`laminar-flow`, `turbulent-flow`). 5 other `>60` raw HTML hits are `&amp;` encoding (decoded length `57–59` <= 60). | Fix in **B4** |
| **A1** | Hreflang Reciprocity (`18` mismatches) | **ORTA** | 18 indexed pages in sitemap (`/tr/glossary`, 11 TR glossary terms, `/en/glossary/backlash`, 3 TR blog posts, `/tr/tools/gear-design/calculators`, `/tr/tools/gear-design/simulations`) emit `hreflang` toward counterpart URLs marked `noindex` (excluded from sitemap). | Fix in **B6 / B3** (remove hreflang to non-indexable alternates) |
| **A2** | Forbidden URLs in `sitemap.xml` | **TEMİZ** | `noindexInSitemap = 0`, `/tags/` = `0`, `/categories/` = `0`, `/report` = `0` | Pass (4 `/guide` subpath URLs in sitemap return `200 OK` with full MDX guides) |
| **A3** | Duplicate / Template Titles & Descriptions | **TEMİZ** | `dupTitles = 0`, `dupDescs = 0`, `dupLastSentences = 0`, legacy template `"Get fast results..."` = `0` | Pass |
| **A4** | Broken / Redirect Internal Links | **ORTA** | **18** `307` redirect links in sitemap HTML: **2** to `/tables` (`rulman-toleranslari-iso-286-sistemi` TR & EN) + **16** to fallback `/tools/.../guide` subpaths on `bolt-calculator/guide` & `pipe-pressure-loss/guide`. `0` 404s, `0` `/tags/` links, `0` unlocalized links, `0` `href="&"`/`href="$"`. | Fix in **B3** (`/tables` -> `/reference`, `buildGuideHref` -> `/tools/...`) |
| **A4** | `rel="alternate"` `feed.xml` & Changelog Feed | **DÜŞÜK** | `/changelog/feed.xml` returns `200 application/rss+xml`. `/tr/changelog/feed.xml` returns `404`. `/tr/changelog` does not emit `<link rel="alternate" type="application/rss+xml">` in HTML `<head>`. | Inspect `alternatesTypes` in `B2` |
| **A5** | Reference Table Pages (`TR + EN`) | **DÜŞÜK** | All 4 pages (`kama` & `cıvata` TR+EN) HTTP `200`, in sitemap, `index`, valid canonical/hreflang, `2573–2767` words, worked examples, tool CTAs. `civata` TR has `1` inbound sitemap link (2+ EN); `390px` Playwright runtime binary missing locally, `overflow-x-auto` verified in code. | Improve inbound links in **B7** |
| **A6** | 3 Re-indexed Guides (`TR + EN`) | **TEMİZ** | All 6 HTTP `200`, in sitemap, `index`, `TechArticle` (`author: Person`, `dateModified`). Word counts: `titanyum` TR `1485` / EN `1562`, `yuzey-isleme` TR `1505` / EN `1722`, `makine-ogesi` TR `1499` / EN `1721`. | Clean EN mojibake in **B9** |
| **A7** | Trust Pages (`14` URLs TR+EN) | **TEMİZ** | 14/14 HTTP `200`, in sitemap, `index`, footer accessible, `0` forbidden terms (`Engineering Team`/`ekibi`/`peer-review`/`hakemli`/`editoryal kurul`/`working group`), `mailto:infotorqyx@gmail.com` valid, Google/ads cookies documented, independent engineer identity consistent. | Optional minor test count note (`415`->`431`) skipped per scope freeze |
| **A8** | Ad Safety & Redirect Variants | **ORTA** | Pre-consent `pagead2` / `.adsbygoogle` = `0/249`; `google-adsense-account` meta = `249/249`; `/ads.txt` = `200 text/plain` exact match. `http://torqyx.com` = `308`, `http://www.torqyx.com` = `308`, **but `https://www.torqyx.com` = `307` (Vercel Edge domain config)**. | Vercel domain setting (`ATLANDI` in code + noted for Dashboard) |
| **A9** | Mojibake & Broken Math on EN Guides | **KRİTİK** | 4 EN guide files contain corrupted CP437/Windows-1252 UTF-8 mojibake (`╬╝`, `╬ö`, `¤ü`, `¤â`, `╬▒+╬▓`, `┬░C`, `Ôëê`) + raw unrendered LaTeX fragments (`fracP_...`, `mathbf214`, `implies`, `dots`): `pompa-turleri-secim-rehberi.en.mdx`, `titanyum-alasimlari-rehberi.en.mdx`, `yuzey-isleme-yontemleri-rehberi.en.mdx`, `tolerans-zinciri-ve-gdt-rehberi.en.mdx`. | Fix in **B9** |
| **A9** | SSR `"Kartlar yükleniyor..."` | **ORTA** | `/tr/tools/material-cards` emits `Kartlar yükleniyor...` in SSR HTML (`Client.tsx` loads `./material-data` via `useEffect`). Remaining EN `ö`/`ü`/`Ü` hits are valid terms (`Wöhler`, `für`, `TÜV`, `Türkiye`). | Fix in **B9** |
| **A10** | Performance & Images | **TEMİZ** | `w=3840` images = `0/249`. Homepage hero has `fetchPriority="high"` & responsive `sizes`. Blog images use `loading="lazy"`, explicit `1200x675` dimensions, `w=1920` max. | Pass |
| **A11** | `robots.txt` vs `noindex` | **TEMİZ** | `robots.txt` HTTP `200`; `noindex` routes (`/tags/`, `/categories/`, `/tools/.../report`, `/quality-tools`, `/project-hub`) are NOT blocked in `robots.txt`. | Pass |
| **B8** | JSON-LD Verification | **ORTA** | Guides (`TechArticle`), Blogs (`BlogPosting`), Reference Tables (`TechArticle`) all have `author: Person` + `dateModified`. Tool pages have `WebApplication` + `BreadcrumbList`. Missing `BreadcrumbList` on index/hub/trust pages (`/tools`, `/blog`, `/guides`, `/faq`, `/hakkinda`, `/iletisim`, `/gizlilik`, `/cerez-politikasi`, `/kullanim-sartlari`, `/sorumluluk-reddi`, `/metodoloji`, `/changelog`, `/tr`, `/en`, `/reference`, `/tools/gear-design`) and missing `WebApplication` on 2 `/tools/.../guide` subpaths (`Article`). | Evaluate lightweight `BreadcrumbList` additions in **B8** |

---

## Detailed Evidence & Breakdown

### A1–A2. Sitemap, Canonical, Title, Hreflang
- `sitemap.xml` URL count: **249**
- Non-200 HTTP status count (`redirect: "manual"`): **0**
- Canonical mismatches: **0**
- Title > 60 decoded chars: **0**; Raw HTML > 60 chars due to `&amp;` (5) or raw LaTeX markdown (2):
  - `https://torqyx.com/tr/glossary/laminar-flow`: `Laminer akış - Laminer akış rejimi ($Re < 2300$), | TORQYX`
  - `https://torqyx.com/tr/glossary/turbulent-flow`: `Türbülanslı akış - Türbülanslı akış rejimi ($Re > | TORQYX`
- Non-reciprocal `hreflang` targets (18 pages pointing `hreflang` to `noindex` pages):
  - `/tr/glossary` -> `/en/glossary` (`noindex, follow`)
  - `/tr/glossary/{head-loss,hydraulic-diameter,interference,iso,laminar-flow,reynolds-number,runout,torque,turbulent-flow,welding,youngs-modulus}` -> `/en/glossary/...` (`noindex, follow`)
  - `/en/glossary/backlash` -> `/tr/glossary/backlash` (`noindex, follow`)
  - `/tr/blog/{haftalik-blog-planlama,teknik-icerik-basliklari,icerik-altyapisina-hizli-giris}` -> `/en/blog/...` (`noindex, nofollow`)
  - `/tr/tools/gear-design/{calculators,simulations}` -> `/en/tools/gear-design/...` (`noindex, follow`)

### A4. Redirecting Internal Links (18 Total)
1. `content/blog/rulman-toleranslari-iso-286-sistemi.tr.mdx:54` -> `href="/tables"` (HTTP `307` -> `/tr/reference`)
2. `content/blog/rulman-toleranslari-iso-286-sistemi.en.mdx:85` -> `href="/en/tables"` (HTTP `307` -> `/en/reference`)
3. `lib/tool-guides.ts:236` `buildGuideHref()` generates `/tools/{slug}/guide` links inside `bolt-calculator/guide` and `pipe-pressure-loss/guide` (TR + EN), creating 16 links to `/guide` subpaths that `307` redirect to the tool URL (`shaft-torsion`, `torque-power`, `fillet-weld`, `gear-design/calculators/force-torque-calculator`, `fluids-hvac`, `hydraulic-cylinder`, `unit-converter`).

### A9. EN Mojibake & SSR Loading
- **Corrupted UTF-8 bytes in live EN guides:**
  - `content/guides/pompa-turleri-secim-rehberi.en.mdx` (`╬╝`, `╬ö`, `¤ü`, `╬À_p`, `Ôëê`, `┬░C`)
  - `content/guides/titanyum-alasimlari-rehberi.en.mdx` (`┬░C`, `╬▒+╬▓`, `¤â`, `¤ü`, `Ôëê`)
  - `content/guides/yuzey-isleme-yontemleri-rehberi.en.mdx` (`╬╝`, `╬ö`, `┬░C`, `Ôëê`)
  - `content/guides/tolerans-zinciri-ve-gdt-rehberi.en.mdx` (`┬░C`)
- **SSR loading state:**
  - `/tr/tools/material-cards` renders `Kartlar yükleniyor...` on initial server HTML response (`app/(tools)/tools/material-cards/Client.tsx`).
