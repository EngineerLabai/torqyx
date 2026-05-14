# .com Deployment Readiness

Bu kontrol listesi `aiengineerslab.com` canli yayina alinmadan once uygulanacak kisa ve tekrar edilebilir akistir.

## Environment

Production ortaminda su degerleri ayni canonical domaini gostermeli:

```env
NEXT_PUBLIC_SITE_URL="https://aiengineerslab.com"
SITE_URL="https://aiengineerslab.com"
INDEX_SITE="true"
NEXTAUTH_URL="https://aiengineerslab.com"
```

`INDEX_SITE` degerini sadece DNS, auth callback URL'leri, sitemap ve smoke kontrolleri basarili olduktan sonra `true` yapin. Preview ve staging ortamlarinda `INDEX_SITE=false` kalmali.

## Required Secrets

Vercel veya secilen hostta asagidaki server-only secret'lar tanimli olmali:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`
- `OPENAI_API_KEY`
- `AI_PROVIDER` (`gemini` veya `groq`)
- Secilen providera gore `GEMINI_API_KEY` veya `GROQ_API_KEY`
- Firebase client `NEXT_PUBLIC_FIREBASE_*` degerleri
- Firebase Admin `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`

## Pre-Deploy Checks

```bash
npm run check:secrets
npm run check:encoding
npm run lint
npm test
npm run build
```

## Post-Deploy Checks

Canli deployment uzerinde su URL'leri kontrol edin:

- `https://aiengineerslab.com/robots.txt`
- `https://aiengineerslab.com/sitemap.xml`
- `https://aiengineerslab.com/og?title=TORQYX&locale=tr`
- `https://aiengineerslab.com/tr/tools/bolt-calculator`
- `https://aiengineerslab.com/en/tools/bolt-calculator`
- `https://aiengineerslab.com/health`
- `https://aiengineerslab.com/health/performance`

Runtime smoke icin production build calisir durumdayken:

```bash
npm run smoke:runtime
```

Harici bir canli URL'yi taramak icin:

```bash
$env:SMOKE_BASE_URL="https://aiengineerslab.com"; npm run smoke:runtime
```

## SEO Launch Notes

- `public/robots.txt` ve `app/robots.ts` sitemap olarak `.com` domainini gostermeli.
- `NEXT_PUBLIC_SITE_URL` ve `SITE_URL` farkli domainlere bakmamali.
- Preview domainleri `.vercel.app` uzerinden indexlenmemeli.
- Open Graph gorseli `/og` route'u ile sayfa basligina gore uretilir ve cache header tasir.
- Hata ayiklama bitmeden `INDEX_SITE=true` yapmayin.
