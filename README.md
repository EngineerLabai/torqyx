# AI Engineers Lab

This is a Next.js project bootstrapped with `create-next-app`.

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 with your browser to see the result.

## Performance and bundle checks

- Run bundle analyzer:

```bash
ANALYZE=true npm run build
```

- Turbopack note:
  - `@next/bundle-analyzer` does not emit reports on Turbopack builds.
  - For analyzer output, use webpack build mode:

```bash
ANALYZE=true npm run build -- --webpack
```

- Generate i18n status report (artifacts):

```bash
npm run i18n:report
```

- Run text encoding guard (mojibake scan):

```bash
npm run check:encoding
```

- Hotfix notes (perf regression):
  - Command palette is loaded via client-only dynamic import from `components/layout/SiteShell.tsx`, so it is split out of the server-rendered shell path.
  - Search index loading is now demand-based in `components/search/useSearchIndex.ts`; it fetches only when search UI is actively used and reuses a shared in-memory cache.
  - Search matching now normalizes Turkish/English tokens and lightweight stems in `utils/search-index.ts`.
  - Tools library (`components/tools/ToolLibrary.tsx`) now renders incrementally (24 + load more) and avoids eager prefetch storms on card links.
  - Site shell navigation links in mega menu/sidebar/footer use `prefetch={false}` to prevent aggressive background prefetch bursts across dozens of routes.
  - Firebase runtime was split into core vs lazy services in `lib/firebase.ts`; auth stays lightweight and firestore/storage load on demand.
  - Chart.js is lazy-loaded in `components/tools/GenericToolPage.tsx`, `components/tools/report/ReportChart.tsx`, and `components/sanity-check/ChartCanvas.tsx`.
  - `getMessages(locale)` calls were removed from always-mounted shell client components (`components/layout/SiteShell.tsx` path); shell now receives localized copy from `app/layout.tsx`.
  - Dev indicators are disabled in `next.config.ts` to avoid floating dev HUD overlays during debugging.
  - Client errors and web-vitals are collected via `/api/client-errors` and `/api/rum`.
- Runtime health checks:
  - JSON: `/health`
  - Budget dashboard: `/health/performance`

## AI Tool Summary env vars

Server-side AI summary endpoint (`POST /api/ai/tool-summary`) needs:

```bash
AI_PROVIDER=gemini # or groq
GEMINI_API_KEY=...
GROQ_API_KEY=...
```

Notes:
- Keep keys only in server env files (for local: `.env.local`).
- Do not use `NEXT_PUBLIC_` prefix for these keys.
- The summary endpoint is policy-limited to deterministic result summarization (no calculations).

## Yeni içerik nasıl eklenir?

1) `content/_templates` altından uygun MDX şablonunu kopyala.
2) Dosyayı ilgili klasöre koy:
   - Blog: `content/blog/`
   - Guide: `content/guides/`
   - Glossary: `content/glossary/`
3) Frontmatter alanlarını doldur (zorunlu: title, description, date, tags, category, draft).
4) `draft: true` ile başla; hazır olunca `draft: false` yap.
5) Guides için zorunlu bölümleri koru: Problem / Amaç, Varsayımlar, Adım adım yöntem, Sık hatalar, İlgili hesaplayıcılar.
6) Birimler ve varsayımlar için `content/_templates/writing-standard.md` dokümanını uygula.
7) Slug otomatik üretilir (title alanından). Canonical opsiyonel.

## Learn More

- Next.js Documentation: https://nextjs.org/docs
- Learn Next.js: https://nextjs.org/learn

## Deploy

The easiest way to deploy is Vercel: https://vercel.com/new
