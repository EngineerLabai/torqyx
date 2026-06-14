# AdSense Readiness

Run the local readiness checks before requesting another AdSense review:

```bash
npm run adsense:audit
npm test
npm run build
```

## Current Safety Defaults

- Site ownership stays verifiable through the `google-adsense-account` meta tag and `public/ads.txt`.
- AdSense JavaScript is disabled unless `NEXT_PUBLIC_ADSENSE_ENABLED="true"`.
- Ads are limited to article routes and require the site's advertising consent.
- Error, report, form, premium-preview, and other behavioral pages do not load AdSense.
- Fallback tool guides redirect to the real tool page.
- Thin blog posts, fallback guides, and templated material details are excluded from the sitemap or marked `noindex`.

## Required AdSense Account Steps

These steps cannot be completed from the repository:

1. In AdSense, open **Privacy & messaging**.
2. Configure Google's European regulations message or another Google-certified TCF CMP.
3. Verify the message covers EEA, UK, and Switzerland traffic.
4. Confirm `torqyx.com` ownership and `ads.txt` status in AdSense.
5. Request review while `NEXT_PUBLIC_ADSENSE_ENABLED="false"`.
6. Enable ads only after approval and CMP verification.

## Content Publication Rules

Content remains hidden from public indexes, listings, related-content links, and the sitemap until it has no draft or placeholder markers and reaches its body-word threshold:

- Blog posts: 250 words
- Guides: 220 words
- Glossary terms: 80 words

Improve thin content with original calculations, worked examples, assumptions, limitations, and cited references before publishing.
