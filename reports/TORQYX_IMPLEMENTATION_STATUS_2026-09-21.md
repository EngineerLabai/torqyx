# TORQYX implementation status — 2026-09-21

## Türkçe

Bu uygulama turunda SEO, AdSense güvenliği, yapılandırılmış veri, locale URL'leri ve ilk özgün mühendislik aracı birlikte ele alındı.

### Tamamlananlar

- Root layout içindeki global `adsbygoogle.js` yükleyicisi kaldırıldı. AdSense ownership metadata etiketi ve `ads.txt` korunuyor.
- Reklam script'i yalnızca production + `NEXT_PUBLIC_ADSENSE_ENABLED=true` + `NEXT_PUBLIC_ADSENSE_CMP_READY=true` + consent + izinli blog yolu koşullarında yükleniyor.
- `EngineeringApplication` kaldırıldı; araç şemaları `UtilitiesApplication` veya referans araçları için `ReferenceApplication` kullanıyor.
- Araç sayfalarından `HowTo` ve `FAQPage` JSON-LD kaldırıldı. Görünür açıklamalar, FAQ içerikleri ve rehber bölümleri korunuyor.
- Tool schema URL'leri `/tr/...` veya `/en/...` canonical URL'leri ile merkezi locale helper üzerinden üretiliyor.
- Paylaşım durumlu Tolerance Lab URL'leri canonical temel araca dönüyor ve `noindex, follow` kullanıyor.
- `/tr/tools/tolerance-lab` ve `/en/tools/tolerance-lab` eklendi.
- Tolerance Lab V1: nominal/üst-alt sapma/yön, mm-inç dönüşümü, worst-case, asimetrik tolerans, RSS tahmini, hassasiyet katkısı, SVG zincir görünümü, rapor/yazdırma, paylaşım, GD&T kapsam notu ve TR/EN dokümantasyon.
- Saf hesap motoru `lib/engineering/tolerance/stack.ts` altında tutuldu; sınır, geçersiz girdi ve birim dönüşümü testleri eklendi.
- H1 audit, `permanentRedirect` ile yalnızca yönlendirme yapan sayfaları yanlış eksik olarak raporlamayacak şekilde düzeltildi.

### Doğrulama

- `npm test`: 19 test dosyası / 160 test başarılı.
- `npm run type-check`: başarılı.
- `npm run build`: başarılı; 567 route üretildi.
- `npm run adsense:audit`: thin-content blokları yok.
- Local production smoke: Tolerance Lab TR/EN 200, locale canonical doğru, paylaşım state'i noindex.
- Local JSON-LD smoke: `EngineeringApplication`, `HowTo` ve `FAQPage` yok.
- Lighthouse mobile harness gerçek ölçüm üretti; skorlar yaklaşık 0.68–0.75. LCP 7.1–11.3 s aralığında olduğu için mevcut assertion bütçeleri geçilmedi. Bu sonuç uydurulmuş değildir; ayrı bir performans optimizasyon işidir.

### Manuel olarak bekleyenler

1. AdSense / Privacy & Messaging panelinde Google-certified CMP production akışını kurun ve TR/EN consent, revoke ve privacy linklerini test edin.
2. CMP gerçekten çalıştığı doğrulanmadan Vercel'de `NEXT_PUBLIC_ADSENSE_CMP_READY=true` veya `NEXT_PUBLIC_ADSENSE_ENABLED=true` yapmayın.
3. AdSense panelinde site incelemesi `Ready` olmadan reklam yayını açmayın.
4. Search Console sitemap, URL inspection ve AdSense site review sonuçlarını bekleyip raporlayın; kod bunları otomatik olarak tamamlayamaz.
5. Lighthouse LCP iyileştirmesi için özellikle calculator route'larında client bundle/hydration ve root shell ayrıştırılmalı.

## English

This implementation pass addressed SEO, AdSense safety, structured data, locale URLs, and the first original engineering product together.

### Completed

- Removed the global `adsbygoogle.js` loader from the root layout. Publisher metadata and `ads.txt` remain available for ownership verification.
- Ad serving remains gated by production mode, explicit env flags, CMP readiness, consent, and the allowed blog path.
- Removed `EngineeringApplication`; tool schemas now use `UtilitiesApplication` or `ReferenceApplication` where truthful.
- Removed `HowTo` and `FAQPage` JSON-LD from emitted pages while preserving visible guidance and FAQ content.
- Centralized locale-aware tool schema URLs so TR and EN entities point to their matching canonical URL.
- Share-state Tolerance Lab URLs canonicalize to the base tool and are marked `noindex, follow`.
- Added `/tr/tools/tolerance-lab` and `/en/tools/tolerance-lab`.
- Tolerance Lab V1 includes signed linear stacks, asymmetric deviations, mm/in conversion, worst-case, RSS estimate, sensitivity contribution, SVG chain view, report/print, sharing, GD&T scope notes, and TR/EN docs.
- Kept the math engine pure under `lib/engineering/tolerance/stack.ts` with boundary, invalid-input, and unit-conversion tests.

### Verification

- `npm test`: 19 test files / 160 tests passed.
- `npm run type-check`: passed.
- `npm run build`: passed; 567 routes generated.
- `npm run adsense:audit`: no thin-content blockers.
- Local production smoke: both Tolerance Lab locales returned 200 with correct canonicals; share state returned noindex.
- Local JSON-LD smoke: no `EngineeringApplication`, `HowTo`, or `FAQPage` emitted.
- Lighthouse mobile harness produced real measurements; scores were approximately 0.68–0.75. LCP measured 7.1–11.3 s, so the current assertion budgets failed. This is a measured performance backlog, not a fabricated score.

### Manual actions still required

The Google panels, CMP consent flow, AdSense review, Search Console re-crawl, and final Vercel environment flag changes require the site owner account and must be completed manually after production verification.
