# İçerik Triyaj ve İyileştirme Raporu (Triage Report)

Bu rapor, `reports/content-audit.csv` denetim sonuçlarına göre AI Engineers Lab (TORQYX) sitesindeki tüm indekslenebilir sayfaların üç gruba (A, B, C) ayrılması ve uygulanan indeksleme/menü/içerik kararlarının belgelenmesidir.

Tarih: 2026-11-06  
Test Durumu: **31 test dosyası / 398 testin tamamı geçmektedir (Vitest PASS).**

---

## Yönetici Özeti (Executive Summary)

| Grup | Kriter | Sayfa Sayısı | Uygulanan Politika |
| :--- | :--- | :--- | :--- |
| **Grup A** | <150 kelime VEYA "yarım ürün" sayfaları (`quality-tools/*`, `fixture-tools/*`, `project-hub/*`, `materials` listesi, `standards` listesi, `community`) + Jenerik EN sözlük terimleri | **110** | **noindex, follow** (bayrak kontrollü), sitemap'ten çıkarıldı, menülerden kaldırıldı, iç linkler dofollow bırakıldı. |
| **Grup B** | 150–300 kelime arası işlevsel mühendislik araçları | **8** | **İndeksli kaldı** (`index, follow`, sitemap'te yer alıyor). Genişletilmek üzere içerik hazırlama kuyruğuna alındı. |
| **Grup C** | 1000+ kelime kapsamlı teknik rehber ve makaleler | **71** | **Dokunulmadı** (yüksek kaliteli derin içerik, `index, follow`). |
| **Diğer** | 301–999 kelime arası standart araç ve makaleler | **262** | İndeksli ve aktif. |
| **Toplam** | Taranan tüm sayfalar | **451** | - |

---

## Grup A: Noindex & Menüden Çıkarılan Sayfalar (<150 Kelime veya Yarım Ürün / Şablon)

### Uygulanan Değişiklikler:
1. **Merkezi Bayrak Sistemi (`config/indexing.ts`):**
   ```typescript
   export const INDEXING_CONFIG = {
     indexQualityTools: false,
     indexFixtureTools: false,
     indexProjectHub: false,
     indexMaterialsList: false,
     indexStandards: false,
     indexCommunity: false,
     indexGenericGlossaryTerms: false,
     showSalesPolicy: false,
   } as const;
   ```
2. **Metadata `noindex, follow` Entegrasyonu:**
   - `app/quality-tools/**` (index + 5 alt araç layout'u)
   - `app/fixture-tools/**` (index + locating + base-plate + clamping layout'ları)
   - `app/project-hub/**` (index + 4 modül layout'u)
   - `app/[locale]/materials/page.tsx`
   - `app/standards/page.tsx` ve `app/standards/[category]/page.tsx`
   - `app/community/page.tsx`
   - `app/glossary/[slug]/page.tsx` (şablon içeren 50 EN terim için `NOINDEX_FOLLOW_ROBOTS`)
3. **Sitemap (`app/sitemap.ts`):**
   - Grup A sayfaları sitemap çıktısından tamamen çıkarıldı.
   - Jenerik EN terimler `isContentIndexable` filtresi ile sitemap'e dahil edilmedi.
4. **Header ve Footer Menüleri (`components/layout/SiteShell.tsx`):**
   - MegaMenu: `fixture-tools`, `project-hub`, `quality-tools`, `standards` kaldırıldı.
   - Doğrudan linkler: `standards`, `quality` gizlendi.
   - Sidebar: `fixture-tools`, `project-hub`, `quality-tools`, `standards`, `salesPolicy` gizlendi.
   - Mobil menü: `salesPolicy` gizlendi.
   - Footer: `standards`, `qualityTools`, `salesPolicy` bağlantıları gizlendi.
5. **İç Linkler (Dofollow Kuralı):**
   - Sitenin içinden (hesap araçları ve blog yazılarından) bu sayfalara giden iç bağlantılar silinmedi, normal dofollow link olarak bırakıldı. Tarayıcı botları linki takip eder ancak hedef sayfada `noindex, follow` direktifiyle karşılaşarak sayfayı dizine eklemez.

### Grup A Sayfa Listesi (110 Sayfa):

| # | URL | Dil | Kelime | Neden / Kategori |
| :- | :-- | :-: | :---: | :--- |
| 1 | `https://torqyx.com/tr/tools/bolt-database` | tr | 0 | Thin content (<150 kelime) |
| 2 | `https://torqyx.com/tr/tools/heat-energy` | tr | 0 | Thin content (<150 kelime) |
| 3 | `https://torqyx.com/tr/tools/machine-elements` | tr | 0 | Thin content (<150 kelime) |
| 4 | `https://torqyx.com/tr/tools/strength-statics` | tr | 0 | Thin content (<150 kelime) |
| 5 | `https://torqyx.com/tr/materials` | tr | 16 | Materials Listesi |
| 6 | `https://torqyx.com/en/materials` | en | 18 | Materials Listesi |
| 7 | `https://torqyx.com/en/blog/haftalik-blog-planlama` | en | 19 | Thin content (<150 kelime) |
| 8 | `https://torqyx.com/en/blog/icerik-altyapisina-hizli-giris` | en | 19 | Thin content (<150 kelime) |
| 9 | `https://torqyx.com/en/blog/teknik-icerik-basliklari` | en | 19 | Thin content (<150 kelime) |
| 10 | `https://torqyx.com/en/tools/gear-design` | en | 41 | Thin content (<150 kelime) |
| 11 | `https://torqyx.com/tr/project-hub/part-tracking` | tr | 71 | Project Hub (Yarım Ürün) |
| 12 | `https://torqyx.com/tr/project-hub/project-tools` | tr | 73 | Project Hub (Yarım Ürün) |
| 13 | `https://torqyx.com/en/fixture-tools` | en | 74 | Fixture Tools (Yarım Ürün) |
| 14 | `https://torqyx.com/en/project-hub/part-tracking` | en | 76 | Project Hub (Yarım Ürün) |
| 15 | `https://torqyx.com/en/standards` | en | 78 | Standards Listesi / Tablolar |
| 16 | `https://torqyx.com/tr/fixture-tools` | tr | 78 | Fixture Tools (Yarım Ürün) |
| 17 | `https://torqyx.com/en/project-hub/project-tools` | en | 80 | Project Hub (Yarım Ürün) |
| 18 | `https://torqyx.com/tr/standards` | tr | 80 | Standards Listesi / Tablolar |
| 19 | `https://torqyx.com/tr/project-hub/rfq` | tr | 81 | Project Hub (Yarım Ürün) |
| 20 | `https://torqyx.com/tr/quality-tools/5n1k` | tr | 85 | Quality Tools (Yarım Ürün) |
| 21 | `https://torqyx.com/en/quality-tools/5n1k` | en | 87 | Quality Tools (Yarım Ürün) |
| 22 | `https://torqyx.com/en/project-hub/rfq` | en | 87 | Project Hub (Yarım Ürün) |
| 23 | `https://torqyx.com/en/project-hub` | en | 90 | Project Hub (Yarım Ürün) |
| 24 | `https://torqyx.com/tr/project-hub` | tr | 95 | Project Hub (Yarım Ürün) |
| 25 | `https://torqyx.com/tr/support` | tr | 101 | Thin content (<150 kelime) |
| 26 | `https://torqyx.com/en/support` | en | 109 | Thin content (<150 kelime) |
| 27 | `https://torqyx.com/en/glossary/backlash` | en | 113 | Thin content (<150 kelime) |
| 28 | `https://torqyx.com/tr/changelog` | tr | 113 | Thin content (<150 kelime) |
| 29 | `https://torqyx.com/tr/tags/flow` | tr | 118 | Thin content (<150 kelime) |
| 30 | `https://torqyx.com/en/glossary/machining` | en | 123 | Jenerik Şablonlu EN Sözlük Terimi |
| 31 | `https://torqyx.com/en/glossary/gdt` | en | 124 | Jenerik Şablonlu EN Sözlük Terimi |
| 32 | `https://torqyx.com/en/glossary/iso` | en | 124 | Jenerik Şablonlu EN Sözlük Terimi |
| 33 | `https://torqyx.com/en/glossary/resistance` | en | 124 | Jenerik Şablonlu EN Sözlük Terimi |
| 34 | `https://torqyx.com/en/glossary/astm` | en | 125 | Jenerik Şablonlu EN Sözlük Terimi |
| 35 | `https://torqyx.com/en/glossary/cnc` | en | 127 | Jenerik Şablonlu EN Sözlük Terimi |
| 36 | `https://torqyx.com/en/glossary/surface-finishing` | en | 127 | Jenerik Şablonlu EN Sözlük Terimi |
| 37 | `https://torqyx.com/en/glossary/corrosion-resistance` | en | 128 | Jenerik Şablonlu EN Sözlük Terimi |
| 38 | `https://torqyx.com/en/glossary/clearance` | en | 128 | Jenerik Şablonlu EN Sözlük Terimi |
| 39 | `https://torqyx.com/en/glossary/rolling` | en | 128 | Jenerik Şablonlu EN Sözlük Terimi |
| 40 | `https://torqyx.com/en/glossary/datum` | en | 129 | Jenerik Şablonlu EN Sözlük Terimi |
| 41 | `https://torqyx.com/en/glossary/concentricity` | en | 129 | Jenerik Şablonlu EN Sözlük Terimi |
| 42 | `https://torqyx.com/en/glossary/hardness` | en | 129 | Jenerik Şablonlu EN Sözlük Terimi |
| 43 | `https://torqyx.com/en/glossary/interference` | en | 129 | Jenerik Şablonlu EN Sözlük Terimi |
| 44 | `https://torqyx.com/en/glossary/tolerance` | en | 129 | Jenerik Şablonlu EN Sözlük Terimi |
| 45 | `https://torqyx.com/en/glossary/laminar-flow` | en | 130 | Jenerik Şablonlu EN Sözlük Terimi |
| 46 | `https://torqyx.com/en/glossary/yield-strength` | en | 130 | Jenerik Şablonlu EN Sözlük Terimi |
| 47 | `https://torqyx.com/en/glossary/parallelism` | en | 131 | Jenerik Şablonlu EN Sözlük Terimi |
| 48 | `https://torqyx.com/en/glossary/youngs-modulus` | en | 131 | Jenerik Şablonlu EN Sözlük Terimi |
| 49 | `https://torqyx.com/en/glossary/additive-manufacturing` | en | 132 | Jenerik Şablonlu EN Sözlük Terimi |
| 50 | `https://torqyx.com/en/glossary/stress` | en | 132 | Jenerik Şablonlu EN Sözlük Terimi |
| 51 | `https://torqyx.com/en/glossary/viscosity` | en | 132 | Jenerik Şablonlu EN Sözlük Terimi |
| 52 | `https://torqyx.com/en/glossary/din` | en | 133 | Jenerik Şablonlu EN Sözlük Terimi |
| 53 | `https://torqyx.com/en/glossary/resonance` | en | 134 | Jenerik Şablonlu EN Sözlük Terimi |
| 54 | `https://torqyx.com/en/quality-tools/kaizen` | en | 134 | Quality Tools (Yarım Ürün) |
| 55 | `https://torqyx.com/en/glossary/asme` | en | 135 | Jenerik Şablonlu EN Sözlük Terimi |
| 56 | `https://torqyx.com/en/glossary/cavitation` | en | 135 | Jenerik Şablonlu EN Sözlük Terimi |
| 57 | `https://torqyx.com/en/glossary/runout` | en | 138 | Jenerik Şablonlu EN Sözlük Terimi |
| 58 | `https://torqyx.com/en/glossary/strain` | en | 138 | Jenerik Şablonlu EN Sözlük Terimi |
| 59 | `https://torqyx.com/en/glossary/tensile-strength` | en | 138 | Jenerik Şablonlu EN Sözlük Terimi |
| 60 | `https://torqyx.com/tr/quality-tools/kaizen` | tr | 140 | Quality Tools (Yarım Ürün) |
| 61 | `https://torqyx.com/tr/tags/torque` | tr | 140 | Thin content (<150 kelime) |
| 62 | `https://torqyx.com/en/glossary/bending-moment` | en | 141 | Jenerik Şablonlu EN Sözlük Terimi |
| 63 | `https://torqyx.com/en/glossary/power-factor` | en | 141 | Jenerik Şablonlu EN Sözlük Terimi |
| 64 | `https://torqyx.com/en/quality-tools` | en | 141 | Quality Tools (Yarım Ürün) |
| 65 | `https://torqyx.com/en/glossary/hydraulic-diameter` | en | 144 | Jenerik Şablonlu EN Sözlük Terimi |
| 66 | `https://torqyx.com/en/glossary/factor-of-safety` | en | 147 | Jenerik Şablonlu EN Sözlük Terimi |
| 67 | `https://torqyx.com/en/glossary/thermal-conductivity` | en | 147 | Jenerik Şablonlu EN Sözlük Terimi |
| 68 | `https://torqyx.com/tr/iletisim` | tr | 147 | Thin content (<150 kelime) |
| 69 | `https://torqyx.com/tr/tags/icerik` | tr | 147 | Thin content (<150 kelime) |
| 70 | `https://torqyx.com/en/glossary/coefficient-of-friction` | en | 148 | Jenerik Şablonlu EN Sözlük Terimi |
| 71 | `https://torqyx.com/tr/tags/pressure` | tr | 148 | Thin content (<150 kelime) |
| 72 | `https://torqyx.com/en/glossary/torque` | en | 150 | Jenerik Şablonlu EN Sözlük Terimi |
| 73 | `https://torqyx.com/en/glossary/reynolds-number` | en | 151 | Jenerik Şablonlu EN Sözlük Terimi |
| 74 | `https://torqyx.com/en/glossary/shear-stress` | en | 155 | Jenerik Şablonlu EN Sözlük Terimi |
| 75 | `https://torqyx.com/en/glossary/head-loss` | en | 156 | Jenerik Şablonlu EN Sözlük Terimi |
| 76 | `https://torqyx.com/tr/quality-tools` | tr | 157 | Quality Tools (Yarım Ürün) |
| 77 | `https://torqyx.com/tr/quality-tools/5why` | tr | 160 | Quality Tools (Yarım Ürün) |
| 78 | `https://torqyx.com/en/quality-tools/5why` | en | 166 | Quality Tools (Yarım Ürün) |
| 79 | `https://torqyx.com/en/quality-tools/poka-yoke` | en | 172 | Quality Tools (Yarım Ürün) |
| 80 | `https://torqyx.com/tr/fixture-tools/base-plate` | tr | 173 | Fixture Tools (Yarım Ürün) |
| 81 | `https://torqyx.com/en/fixture-tools/base-plate` | en | 179 | Fixture Tools (Yarım Ürün) |
| 82 | `https://torqyx.com/tr/quality-tools/poka-yoke` | tr | 179 | Quality Tools (Yarım Ürün) |
| 83 | `https://torqyx.com/en/glossary/welding` | en | 186 | Jenerik Şablonlu EN Sözlük Terimi |
| 84 | `https://torqyx.com/en/glossary/density` | en | 187 | Jenerik Şablonlu EN Sözlük Terimi |
| 85 | `https://torqyx.com/en/glossary/buckling` | en | 188 | Jenerik Şablonlu EN Sözlük Terimi |
| 86 | `https://torqyx.com/en/glossary/fatigue` | en | 191 | Jenerik Şablonlu EN Sözlük Terimi |
| 87 | `https://torqyx.com/en/glossary/ansi` | en | 199 | Jenerik Şablonlu EN Sözlük Terimi |
| 88 | `https://torqyx.com/en/glossary/casting` | en | 199 | Jenerik Şablonlu EN Sözlük Terimi |
| 89 | `https://torqyx.com/en/glossary/forging` | en | 199 | Jenerik Şablonlu EN Sözlük Terimi |
| 90 | `https://torqyx.com/en/glossary/voltage` | en | 201 | Jenerik Şablonlu EN Sözlük Terimi |
| 91 | `https://torqyx.com/tr/fixture-tools/clamping` | tr | 204 | Fixture Tools (Yarım Ürün) |
| 92 | `https://torqyx.com/en/glossary/grinding` | en | 206 | Jenerik Şablonlu EN Sözlük Terimi |
| 93 | `https://torqyx.com/en/fixture-tools/clamping` | en | 208 | Fixture Tools (Yarım Ürün) |
| 94 | `https://torqyx.com/en/glossary/ductility` | en | 208 | Jenerik Şablonlu EN Sözlük Terimi |
| 95 | `https://torqyx.com/en/glossary/turbulent-flow` | en | 208 | Jenerik Şablonlu EN Sözlük Terimi |
| 96 | `https://torqyx.com/tr/standards/fluids` | tr | 269 | Standards Listesi / Tablolar |
| 97 | `https://torqyx.com/en/standards/fluids` | en | 279 | Standards Listesi / Tablolar |
| 98 | `https://torqyx.com/tr/standards/fits` | tr | 289 | Standards Listesi / Tablolar |
| 99 | `https://torqyx.com/en/standards/fits` | en | 291 | Standards Listesi / Tablolar |
| 100 | `https://torqyx.com/tr/project-hub/devreye-alma` | tr | 324 | Project Hub (Yarım Ürün) |
| 101 | `https://torqyx.com/tr/fixture-tools/locating` | tr | 329 | Fixture Tools (Yarım Ürün) |
| 102 | `https://torqyx.com/en/fixture-tools/locating` | en | 337 | Fixture Tools (Yarım Ürün) |
| 103 | `https://torqyx.com/en/project-hub/devreye-alma` | en | 348 | Project Hub (Yarım Ürün) |
| 104 | `https://torqyx.com/tr/standards/materials` | tr | 369 | Materials Listesi |
| 105 | `https://torqyx.com/en/standards/materials` | en | 384 | Materials Listesi |
| 106 | `https://torqyx.com/en/categories/materials` | en | 421 | Materials Listesi |
| 107 | `https://torqyx.com/tr/quality-tools/8d` | tr | 433 | Quality Tools (Yarım Ürün) |
| 108 | `https://torqyx.com/en/quality-tools/8d` | en | 443 | Quality Tools (Yarım Ürün) |
| 109 | `https://torqyx.com/tr/standards/threads` | tr | 569 | Standards Listesi / Tablolar |
| 110 | `https://torqyx.com/en/standards/threads` | en | 580 | Standards Listesi / Tablolar |

---

## Grup B: 150–300 Kelime Arası İşlevsel Araçlar (İçerik Hazırlanacaklar Listesi)

Bu gruptaki sayfalar teknik hesaplama fonksiyonu çalışan, kullanıcıya interaktif değer sunan ancak metinsel dokümantasyonu 150–300 kelime arasında kalan araçlardır.  
**Politika:** İndekste kalmaya devam etmektedir (`index, follow`, sitemap aktif). Prompt 6'da metinleri 400+ kelimeye genişletilmek üzere aşağıdaki kuyruğa alınmıştır.

| # | URL | Dil | Kelime | Açıklama / Genişletme İhtiyacı |
| :- | :-- | :-: | :---: | :--- |
| 1 | `https://torqyx.com/en/tools/material-cards` | en | 196 | Formül açıklaması, pratik mühendislik örneği ve standart referansı genişletilecek. |
| 2 | `https://torqyx.com/en/tools/gear-design/calculators/weight-optimization` | en | 264 | Formül açıklaması, pratik mühendislik örneği ve standart referansı genişletilecek. |
| 3 | `https://torqyx.com/en/tools/gear-design/calculators/contact-ratio-calculator` | en | 267 | Formül açıklaması, pratik mühendislik örneği ve standart referansı genişletilecek. |
| 4 | `https://torqyx.com/en/tools/gear-design/calculators/helix-axial-calculator` | en | 270 | Formül açıklaması, pratik mühendislik örneği ve standart referansı genişletilecek. |
| 5 | `https://torqyx.com/en/tools/gear-design/calculators/force-torque-calculator` | en | 272 | Formül açıklaması, pratik mühendislik örneği ve standart referansı genişletilecek. |
| 6 | `https://torqyx.com/en/tools/gear-design/simulations` | en | 283 | Formül açıklaması, pratik mühendislik örneği ve standart referansı genişletilecek. |
| 7 | `https://torqyx.com/en/tools/gear-design/calculators/module-calculator` | en | 285 | Formül açıklaması, pratik mühendislik örneği ve standart referansı genişletilecek. |
| 8 | `https://torqyx.com/en/tools/gear-design/calculators/backlash-calculator` | en | 295 | Formül açıklaması, pratik mühendislik örneği ve standart referansı genişletilecek. |

---

## Grup C: 1000+ Kelime Kapsamlı İçerikler (Dokunulmayanlar)

Bu gruptaki sayfalar Google AdSense ve teknik SEO açısından güçlü, derinlemesine mühendislik bilgisi içeren ve yüksek kelime sayısına sahip blog ve rehber yazılarıdır.  
**Politika:** Kesinlikle dokunulmamıştır. İndeksli ve sitemap'te öncelikli olarak yer almaktadır.

Toplam Grup C Sayfa Sayısı: **71**

### Öne Çıkan Grup C İçerikleri (İlk 25):

| # | URL | Dil | Kelime Sayısı | İçerik Türü |
| :- | :-- | :-: | :---: | :--- |
| 1 | `https://torqyx.com/tr/tools/gear-design` | tr | 2696 | Araç / Dokümantasyon |
| 2 | `https://torqyx.com/en/blog` | en | 1818 | Araç / Dokümantasyon |
| 3 | `https://torqyx.com/tr/glossary` | tr | 1755 | Araç / Dokümantasyon |
| 4 | `https://torqyx.com/tr/blog` | tr | 1750 | Araç / Dokümantasyon |
| 5 | `https://torqyx.com/en/guides/tolerans-zinciri-ve-gdt-rehberi` | en | 1562 | Rehber |
| 6 | `https://torqyx.com/en/guides/press-fit-baglantilari-tolerans-secimi` | en | 1521 | Rehber |
| 7 | `https://torqyx.com/en/guides/isi-yalitimi-termal-genlesme-rehberi` | en | 1455 | Rehber |
| 8 | `https://torqyx.com/en/glossary` | en | 1441 | Araç / Dokümantasyon |
| 9 | `https://torqyx.com/en/blog/rulman-omru-l10-iso-281` | en | 1418 | Blog Makalesi |
| 10 | `https://torqyx.com/en/guides/yuzey-isleme-yontemleri-rehberi` | en | 1402 | Rehber |
| 11 | `https://torqyx.com/tr/tags/muhendislik-hesabi` | tr | 1399 | Araç / Dokümantasyon |
| 12 | `https://torqyx.com/tr/blog/rulman-omru-l10-iso-281` | tr | 1360 | Blog Makalesi |
| 13 | `https://torqyx.com/en/guides/makine-ogesi-omru-yorulma-rehberi` | en | 1356 | Rehber |
| 14 | `https://torqyx.com/en/guides/cnc-makineleme-malzeme-secimi` | en | 1355 | Rehber |
| 15 | `https://torqyx.com/tr/tools/bolt-calculator` | tr | 1343 | Araç / Dokümantasyon |
| 16 | `https://torqyx.com/en/guides/doner-ekipman-dengeleme-titresim-kontrolu` | en | 1324 | Rehber |
| 17 | `https://torqyx.com/en/guides/viskozite-siniflandirmasi-rehberi` | en | 1316 | Rehber |
| 18 | `https://torqyx.com/en/guides/kama-tasarimi-101` | en | 1305 | Rehber |
| 19 | `https://torqyx.com/en/guides/titanyum-alasimlari-rehberi` | en | 1297 | Rehber |
| 20 | `https://torqyx.com/en/tools/bearing-life` | en | 1296 | Araç / Dokümantasyon |
| 21 | `https://torqyx.com/tr/guides/press-fit-baglantilari-tolerans-secimi` | tr | 1296 | Rehber |
| 22 | `https://torqyx.com/en/guides/tolerans-zinciri-analizi-kotu-durum-ve-rss` | en | 1258 | Rehber |
| 23 | `https://torqyx.com/en/guides/helisel-yay-tasarimi-ve-kuvvet-grafigi-en-13906` | en | 1236 | Rehber |
| 24 | `https://torqyx.com/en/guides/kiris-egilme-ve-sehim-hesabi-euler-bernoulli` | en | 1236 | Rehber |
| 25 | `https://torqyx.com/en/guides/malzeme-secimi-rehberi` | en | 1232 | Rehber |

*(Geriye kalan 46 sayfa da aynı şekilde indeksli ve yüksek kelime sayısıyla korunmaktadır.)*

---

## Ek Düzenlemeler ve Gizlemeler

1. **"Premium beta / Request access" Bloğu:**
   - `/app/premium/page.tsx` ve `/app/pricing/page.tsx` sayfaları zaten kalıcı olarak `/tools` sayfasına yönlendirilmektedir.
   - Sitede hiçbir ödeme duvarı, aktif satınalma formu veya beta bekleme listesi linki bırakılmamıştır.
2. **"Sales, Refunds & Delivery" (`/satis-iade-teslimat`):**
   - Gerçek bir ücretli ürün yayına girene kadar hem header megaMenu/sidebar'dan hem de footer bağlantılarından gizlendi (`INDEXING_CONFIG.showSalesPolicy: false`).
   - AdSense incelemesinde "satış yapılmayan sitede yanıltıcı satış/iade politikası linki bulunması" riski ortadan kaldırıldı.
3. **Vitest Doğrulaması:**
   - `tests/sitemap.test.ts` ve tüm 31 test dosyası başarıyla çalıştırıldı ve geçti.
