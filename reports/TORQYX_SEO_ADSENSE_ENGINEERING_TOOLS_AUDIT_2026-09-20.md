# TORQYX SEO, AdSense ve Mühendislik Araçları Denetim Raporu

**Tarih / Date:** 20 Eylül 2026 / 20 September 2026  
**Alan adı / Domain:** https://torqyx.com  
**Diller / Languages:** Türkçe (`tr`) ve İngilizce (`en`)

---

## 1. Yönetici özeti — Türkçe

TORQYX teknik olarak yayınlanabilir ve sağlıklı durumda. GitHub `main` dalı Vercel production projesine bağlı; son deploy hazır ve `torqyx.com` alan adına alias verilmiş durumda. `robots.txt`, `ads.txt`, `sitemap.xml`, Türkçe/İngilizce ana sayfalar ve içerik detay sayfaları HTTP 200 döndürüyor. Son kontrollerde AdSense denetimi hatasız, kırık iç bağlantı sayısı sıfır ve 155 testin tamamı başarılı.

Google görünürlüğü ve AdSense açısından üç konu açık kalıyor:

1. AdSense site incelemesi ve ads.txt yeniden taraması Google tarafında henüz tamamlanmış değil.
2. CMP/Privacy & Messaging production akışı henüz “hazır” sayılmamalı. Kod reklam gösterimini bilinçli şekilde kapalı tutuyor; bu doğru. Ancak doğrulama scripti global yükleniyor ve reklam açılmadan önce rıza akışı gerçek bir Google-certified CMP ile test edilmeli.
3. Araç sayfalarında `HowTo` ve bazı yerlerde `FAQPage` JSON-LD kullanılıyor. Güncel Google belgelerinde bu rich-result türlerinin genel siteler için değeri sınırlı veya kaldırılmış durumda.

En yüksek getirili büyüme yolu çok sayıda sığ sayfa üretmek değil, mevcut araçları “hesap + varsayım + örnek + sınır + kaynak + rapor” paketine dönüştürmektir. İlk ürün dalgası olarak GD&T/tolerans zinciri, gelişmiş mukavemet/yorulma, VDI 2230 bolted-joint ve pompa/NPSH araçları önerilir.

Google’ın kendi yönergeleri özgün, güvenilir, kullanıcı odaklı içerik ile taranabilir bağlantıları önerir; bunlar sıralama garantisi vermez. [Google Search Essentials](https://developers.google.com/search/docs/essentials) ve [people-first content rehberi](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## 2. Current executive summary — English

TORQYX is technically publishable and operationally healthy. The GitHub `main` branch is connected to Vercel production; the latest deployment is ready and aliased to `torqyx.com`. `robots.txt`, `ads.txt`, `sitemap.xml`, Turkish/English home pages, and content detail pages return HTTP 200. The latest repository checks show no AdSense audit failures, zero broken internal links, and 155 passing tests.

Three items remain open:

1. AdSense site review and the refreshed ads.txt crawl have not completed on Google’s side.
2. The CMP/Privacy & Messaging flow is not production-ready yet. Ad serving is deliberately gated off, which is correct; the global verification script still requires a real consent-flow review before ads are enabled.
3. Tool pages emit `HowTo` and, on some pages, `FAQPage` JSON-LD. Current Google documentation gives these formats limited or no general rich-result value.

The best growth path is not many shallow pages. It is complete engineering workflows: calculation, assumptions, worked example, limitations, references, and reproducible report output. First priority should be tolerance stack-up/GD&T, advanced strength/fatigue, VDI 2230 bolted joints, and pump/system-curve/NPSH analysis.

See [Google Search Essentials](https://developers.google.com/search/docs/essentials) and [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

---

## 3. Kanıtlanmış mevcut durum — Verified current state

| Alan / Area | Kanıt / Evidence | Durum / Status |
|---|---|---|
| GitHub/Vercel | `EngineerLabai/torqyx` → Vercel `aiengineerlabs-projects/torqyx`; son deploy `9b04de5` sonrası hazır | Yeşil / Green |
| Kanonik host / Canonical host | `torqyx.xyz`, `torqyx.vercel.app` ve Vercel hostları `torqyx.com` adresine yönleniyor | Yeşil / Green |
| robots | API, dashboard, login, saved calculations ve health disallow; sitemap tanımlı | Yeşil / Green |
| ads.txt | `google.com, pub-8444187117761223, DIRECT, f08c47fec0942fa0` canlıda 200 | Teknik yeşil; panel cache olabilir |
| Sitemap | Canlı XML 200; son kontrolde 404 URL, tekrar yok; hreflang/x-default var | Yeşil / Green |
| Dil yapısı / Language | `/tr/...` ve `/en/...`, görünür `lang`, canonical/hreflang altyapısı | Yeşil / Green |
| İçerik / Content | 43 blog, 36 rehber, 102 sözlük girdisi etkin kalite eşiğini geçiyor | Yeşil / Green |
| İç bağlantılar / Links | Kırık bağlantı 0; generic anchor uyarısı 0; 35 sayfa düşük kaynak bağlantısında | Orta / Medium |
| Test/build | 155/155 test, production build başarılı, 566 rota | Yeşil / Green |
| Search Console | Mülkiyet doğrulandı, sitemap gönderildi, `/tr` ve `/en` indeksleme isteği gönderildi | İzleme / Monitor |
| AdSense | Site “İnceleme gerekli”; ads.txt paneli önce “Bulunamadı” gösterdi | İzleme / Monitor |

Canlı URL kontrolleri / Live URL checks:

- `https://torqyx.com/tr` → 200
- `https://torqyx.com/en` → 200
- `https://torqyx.com/robots.txt` → 200
- `https://torqyx.com/ads.txt` → 200
- `https://torqyx.com/sitemap.xml` → 200
- `https://torqyx.com/tr/glossary/viscosity` → 200, yeni teknik içerik görünür
- `https://torqyx.com/tr/guides/pompa-turleri-secim-rehberi` → 200, yeni teknik içerik görünür

---

## 4. Kritik riskler ve eksiklikler — Türkçe

### P0 — AdSense CMP ve doğrulama scripti

Reklam gösterimi production, enable bayrağı, CMP hazır bayrağı, gerçek publisher ID, advertising consent ve indekslenebilir blog yolu ile sınırlandırılmış. Bu güvenli tasarım korunmalı.

Ancak `NEXT_PUBLIC_ADSENSE_SITE_VERIFICATION=true` iken `adsbygoogle.js` layout seviyesinde tüm sayfalarda yükleniyor. Google, reklam tag’i yüklenmiş bir sayfanın reklam göstermese bile cookie/benzeri tanımlayıcılar bakımından gizlilik açıklamasına ihtiyaç duyabileceğini belirtiyor. [AdSense cookies](https://support.google.com/adsense/answer/7549925).

Yapılması gerekenler:

1. AdSense `Privacy & messaging` içinde Google-certified CMP mesajını oluştur.
2. Kabul, reddetme ve özel tercih akışlarını Türkiye/EEA/UK/İsviçre trafiğinde test et.
3. CMP’nin Google TCF sinyalini ürettiğini ve advertising consent olmadan kişiselleştirilmiş reklam isteği gitmediğini doğrula.
4. Site `Ready` olmadan production reklamını açma.
5. Site doğrulaması tamamlandıktan sonra global verification scriptinin gerekip gerekmediğini yeniden değerlendir; meta tag ve ads.txt zaten ownership sinyali sağlıyor.

Google, yeni bir siteye review tamamlanıp `Ready` olmadan reklam gösterilemeyeceğini söylüyor. [AdSense site yönetimi](https://support.google.com/adsense/answer/12131223?hl=en) ve [Google CMP](https://support.google.com/adsense/answer/16918505?hl=en-GB).

### P0 — ads.txt cache durumu

Canlı dosya doğru olmasına rağmen AdSense panelinde eski “Bulunamadı” durumu görülebilir. Google ads.txt değişikliklerinin birkaç gün, düşük reklam isteğinde daha uzun sürebileceğini belirtiyor. Dosya sabit kaldıktan sonra panelde `Check for updates` bir kez kullanılmalı; sürekli satır değiştirerek yeni hata üretilmemeli. [Google ads.txt rehberi](https://support.google.com/adsense/answer/12171612?hl=en).

### P1 — Güncel olmayan HowTo/FAQ yapılandırmaları

Araç head dosyalarında `HowTo`, bazı sayfalarda `FAQPage` JSON-LD üretiliyor. Google’ın 2026 güncellemelerinde How-to rich result desteğinin kaldırıldığı, FAQ rich result’ın ise genel siteler için artık geniş biçimde gösterilmediği belirtiliyor. Görünür kullanım adımları ve SSS metni kullanıcı için kalabilir; schema tarafında bunlara trafik garantisi gözüyle bakılmamalı. [Google Search güncellemeleri](https://developers.google.com/search/updates).

Canlı araç HTML’inde bir `HowTo` URL’si locale’siz `/tools/...` adresine işaret ediyor; sayfanın canonical adresi `/tr/tools/...` veya `/en/tools/...` olmalı. Bu ceza sinyali değildir, fakat schema tutarlılığı için düzeltilmelidir.

### P1 — Tool structured data kategorisi

Araç şemasında `applicationCategory: "EngineeringApplication"` kullanılıyor. Bu değer Google’ın SoftwareApplication dokümantasyonundaki desteklenen kategori listesinde yer almıyor. Sahte rating, review veya fiyat eklenmemeli. Ya doğru ve desteklenen bir kategori kullanılmalı ya da alan kaldırılmalı; markup görünür sayfayla aynı bilgiyi taşımalı. [SoftwareApplication](https://developers.google.com/search/docs/appearance/structured-data/software-app) ve [genel structured data kuralları](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

### P1 — Gerçek uzmanlık sinyali

Görünür ekip satırı “TORQYX Engineering Team” olarak şeffaf ama genel. Bu, sahte kişi/sertifika yazmaktan daha doğru. Uzun vadede doğrulanabilen gerçek reviewer adı, uzmanlık alanı, inceleme tarihi, yöntem/kaynak ve gerçek profesyonel profil eklenebilir. Gerçek bilgi yoksa ekip adı korunmalı. [Helpful content rehberi](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

### P1 — Search Console indeksleme kuyruğu

Son Search Console gözleminde yaklaşık 415 URL indekslenmiş, 204 URL indekslenmemişti. Ana gruplar redirected page, noindex, crawled-but-not-indexed, proper canonical alternate, soft 404, not found ve Google’ın farklı canonical seçtiği URL’lerdi.

Amaç bütün URL’leri zorla indeksletmek değil:

- değerli araç/rehber/sözlük sayfaları indekslenebilir;
- az içerikli veya tekrarlı tag/kategori arşivleri noindex/404;
- geçerli yönlendirmeler sitemap’ten çıkarılmış;
- olmayan URL’ler gerçek 404;
- diller canonical + hreflang ile bağlı olmalı.

Google sitemap’in keşfe yardımcı olduğunu ancak indeksleme garantisi vermediğini belirtir. [Search Essentials](https://developers.google.com/search/docs/essentials) ve [çok dilli siteler](https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites).

### P2 — İç bağlantı yoğunluğu

Kırık bağlantının sıfır olması güçlü. Ancak 35 sayfa düşük kaynak bağlantısı sayısında ve ortalama benzersiz hedef sayısı 2,19. Önemli sayfalar şu zincirde yer almalı:

`rehber/blog → glossary → calculator → reference/methodology`

“Buraya tıkla” yerine “Boru basınç kaybı hesaplayıcı” gibi hedefi anlatan anchor kullanılmalı. [Google link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).

### P2 — CSP ve Lighthouse

Canlı güvenlik başlıkları iyi; CSP şu an Report-Only. AdSense/CMP açıldığında gerekli üçüncü taraf hostlar allowlist’e eklenmeden CSP enforce edilmemeli.

Yerel Lighthouse koşusu locale’li tool URL’lerinde 404 aldığı için tüm performans değerleri `n/a` çıktı. Bu site performans puanı değil, test harness problemidir. Local route setup düzeltilmeli veya staging URL üzerinde ölçüm yapılmalı. Search Console’da henüz saha Core Web Vitals verisi bulunmuyor.

### P3 — Türkçe/İngilizce kapsamı

Bazı blog slug’larının İngilizce eşleniği eksik. Bu, mevcut Türkçe sayfanın teknik indekslenmesini bozmaz; ancak İngilizce organik büyümeyi sınırlar. Önemli yazılar gerçek İngilizce uyarlamalarla tamamlanmalı; yalnızca başlık ve boilerplate çevirisi yapılmamalı.

### AdSense yerleşimi

Reklamı blog eligibility’si ve rıza koşullarına bağlamak; hesaplayıcı form/sonuç ekranlarını reklamla doldurmamak doğru. Reklamlar gezinme, buton veya indirme linkleriyle karışmamalı ve sayfanın tek amacı reklam göstermek olmamalı. [AdSense policies](https://support.google.com/adsense/answer/48182?hl=en) ve [site readiness](https://support.google.com/adsense/answer/7299563?hl=en).

## 5. Critical findings and gaps — English

### P0 — AdSense CMP and verification script

Ad serving is gated by production, the enable flag, CMP readiness, a real publisher ID, advertising consent, and an indexable blog path. This is the correct safety design.

When `NEXT_PUBLIC_ADSENSE_SITE_VERIFICATION=true`, however, `adsbygoogle.js` is loaded from the root layout on every page. Google notes that a page may need cookie/privacy disclosure even when an ad tag is loaded without an ad being displayed. [How AdSense uses cookies](https://support.google.com/adsense/answer/7549925).

Required sequence:

1. Create the Google-certified CMP message in AdSense Privacy & Messaging.
2. Test accept, reject, and custom choices for Turkey/EEA/UK/Switzerland traffic.
3. Verify the Google TCF signal and confirm no personalized ad request is sent without advertising consent.
4. Keep production ad serving disabled until the site is `Ready`.
5. After ownership verification, reassess whether the global verification script is still needed; the meta tag and ads.txt already provide ownership signals.

Google states that ads may be served only after the review has passed and the site has `Ready` status. [AdSense site management](https://support.google.com/adsense/answer/12131223?hl=en) and [Google CMP](https://support.google.com/adsense/answer/16918505?hl=en-GB).

### P0 — ads.txt cache

The live file is correct while the AdSense UI may still show the previous “Not found” state. Google says ads.txt changes can take days, and longer for sites with few ad requests. Use `Check for updates` once the file is stable; do not repeatedly rotate the line. [Ads.txt guide](https://support.google.com/adsense/answer/12171612?hl=en).

### P1 — Outdated/low-value HowTo and FAQ markup

Tool heads emit `HowTo` and some emit `FAQPage` JSON-LD. Google’s 2026 documentation updates state that How-to rich results are no longer supported and FAQ rich results are no longer broadly shown for general websites. Keep visible instructions and FAQ copy for users, but do not depend on these schemas for traffic. Review or remove the markup. [Google Search documentation updates](https://developers.google.com/search/updates).

One live tool also showed a locale-less HowTo URL while the page itself is locale-prefixed. Schema URLs should match the page’s canonical language URL.

### P1 — Tool structured-data category

The tool schema uses `applicationCategory: "EngineeringApplication"`, which is not among the supported SoftwareApplication categories listed by Google. Do not invent ratings, reviews, or prices. Use truthful WebApplication/SoftwareApplication data that matches visible content. [SoftwareApplication](https://developers.google.com/search/docs/appearance/structured-data/software-app) and [general structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

### P1 — Real expertise signals

The visible author line uses the transparent but generic “TORQYX Engineering Team”. That is better than inventing a person or credential. Long term, add real reviewers, relevant expertise, review dates, methodology, sources, and genuine professional profiles where available. [Helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

### P1 — Search Console indexing queue

The latest observed Search Console snapshot showed roughly 415 indexed and 204 not-indexed URLs. The goal is not to force every URL into Google. Valuable tools, guides, and references should be indexable; thin/repeated taxonomy pages should remain noindex/404; redirects should leave the sitemap; and language versions should use canonical plus hreflang. Google does not guarantee indexing merely because a URL is in a sitemap. [Search Essentials](https://developers.google.com/search/docs/essentials) and [multilingual sites](https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites).

### P2 — Internal-link depth

Broken links are at zero, which is strong. The source audit still shows 35 low-link pages and 2.19 average unique targets. Build a deliberate chain: `guide/blog → glossary → calculator → reference/methodology`, using descriptive anchor text. [Google link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable).

### P2 — CSP and Lighthouse

Security headers are present and CSP is currently Report-Only. Before enforcing CSP, add only the exact AdSense/CMP/analytics hosts required by the final consent design and review violation reports first.

The local Lighthouse run returned 404 for locale-prefixed tool URLs, so all performance values were `n/a`. This is a test-harness problem, not a valid live performance score. Fix the local route setup or measure a staging URL. Search Console has no field Core Web Vitals data yet.

### P3 — Language coverage and ad placement

Some Turkish blog slugs have no English equivalent. Turkish indexing is not broken, but English organic growth is limited. Translate high-impression articles as real English adaptations.

Keep ads away from calculator inputs, result actions, navigation, and download controls. AdSense requires original content, transparency, navigability, and non-deceptive placement. [AdSense program policies](https://support.google.com/adsense/answer/48182?hl=en) and [site readiness](https://support.google.com/adsense/answer/7299563?hl=en).

---

## 6. Yeni mühendislik araçları — Türkçe ürün planı

### Önceliklendirme

- **SEO fırsatı:** Tek sorguya değil, bir arama ailesine hizmet etmesi.
- **TORQYX uyumu:** Mevcut mekanik, malzeme, standart ve rapor altyapısına yakınlığı.
- **Güven:** Varsayımların ve sınırların açıklanabilir olması.
- **AdSense uygunluğu:** Aracın yanında özgün eğitim içeriği üretilebilmesi.
- **Risk:** Yanlış sonucun güvenlik veya üretim kararı doğurması.

| Öncelik | Araç | Fırsat ve ilk kapsam | Risk |
|---|---|---|---|
| P0 | Tolerans zinciri + GD&T | Worst-case/RSS, datum zinciri, açıklık-girişim, ölçüm planı, rapor | Orta |
| P0 | Gelişmiş kiriş/mil/mukavemet | Çoklu yük, mesnet, kesit, birleşik gerilme, grafik | Yüksek |
| P0 | VDI 2230 bolted-joint Lite | Ön yük, tork, rijitlik, yük paylaşımı, ayırma marjı | Yüksek |
| P1 | Pompa sistem eğrisi + NPSH | Sistem eğrisi, çalışma noktası, NPSH available/required | Yüksek |
| P1 | Rulman seçimi ve güvenilirlik | C/P, güvenilirlik, statik yük, hız, yağlama | Orta-yüksek |
| P1 | Yorulma/S-N/Goodman | Ortalama gerilme, S-N, Miner için sınırlı ön değerlendirme | Yüksek |
| P1 | Kaynak bağlantısı ve yorulma | Fillet/CJP, boğaz, yük bileşenleri, kontrol planı | Yüksek |
| P1 | Dişli rating / ISO 6336-lite | Eğilme/temas ön boyutlandırması, servis faktörü, yağlama | Çok yüksek |
| P2 | CNC hız/ilerleme | Torna, freze, delme, kılavuz; malzeme/takım koşulları | Orta |
| P2 | Isıl genleşme + ısı geçişi | Serbest/kısıtlı genleşme, bağlantı kuvveti, yalıtım | Orta |
| P2 | Malzeme/korozyon uyumluluğu | Ortam, galvanik çift, kaplama, sıcaklık, bakım | Orta-yüksek |
| P3 | Elektrik güç/gerilim düşümü | DC/AC üç faz, kablo düşümü, güç faktörü | Orta |

### P0.1 — Tolerans zinciri + GD&T

Mevcut datum, tolerans, paralellik, konsantriklik, runout ve press-fit içerikleri bu ürün için hazır bir SEO kümesi oluşturuyor.

**Girdiler:** nominal ölçüler, limit veya ± toleranslar, zincir yönleri, fonksiyonel açıklık/girişim, datum sırası ve worst-case/RSS tercihi.  
**Çıktılar:** minimum/maksimum açıklık, katkı tablosu, kritik ölçüler, yöntem karşılaştırması, ölçüm planı ve paylaşılabilir rapor.  
**İçerik:** “tolerans zinciri nasıl hesaplanır”, “worst-case vs RSS”, “GD&T datum seçimi” ve “press-fit tolerans seçimi”.  
**Sınır:** İstatistiksel sonuçlar üretim dağılımı doğrulanmadan garanti gibi sunulmamalı. ISO 286/ISO 1101 referanslanabilir; ücretli standardın tabloları izinsiz kopyalanmamalı.

### P0.2 — Gelişmiş mukavemet paketi

Basit gerilme, eğilme/sehim, mil burulma ve statik araçlarının üstüne bir “Load Case Builder” eklenebilir. İlk sürüm; konsol ve basit mesnetli kiriş, noktasal/yayılı yük, dairesel/dikdörtgen kesit, birleşik eğilme-kayma-burulma, von Mises ve burkulma ön kontrolü içermeli. Kritik tasarım kararı doğurabileceği için profesyonel doğrulama ve model sınırları görünür olmalı.

### P0.3 — VDI 2230 bolted-joint Lite

Mevcut cıvata aracı ön yük/tork tarafında başlangıç veriyor. Yeni katman; cıvata ve sıkılan parçanın rijitliği, dış yük paylaşımı, sürtünme aralığı, ayırma riski ve sıkma yöntemi duyarlılığını raporlamalı. İlk sürüm “VDI 2230 referanslı ön değerlendirme” olarak adlandırılmalı; tam standarda uygunluk iddiası yalnızca tüm yöntem ve doğrulama belgelenirse kullanılmalı.

### P1.1 — Pompa sistem eğrisi + NPSH

Mevcut boru basınç kaybı, viskozite, Reynolds ve kavitasyon içerikleriyle doğal bir kümedir. Girdi; çap, uzunluk, fittings, yoğunluk/viskozite, statik yükseklik ve pompa eğrisi noktaları olmalı. Çıktı; sistem eğrisi, çalışma kesişimi ve NPSH marjı olmalı. Üretici pompa eğrisi olmadan sonuç “ön kontrol” olarak etiketlenmeli.

### P1.2 — Yorulma/S-N/Goodman

Bu araç güçlü uzmanlık sinyali üretir; ancak malzeme, yüzey, çentik, sıcaklık ve yük spektrumuna çok duyarlıdır. İlk sürüm tamamen tersinir/ortalama gerilmeli yük, Goodman/Soderberg karşılaştırması ve açık veri kaynağı ile sınırlanmalı. “Ömür garantisi” ifadesi kullanılmamalı; her sonuçta model geçerlilik aralığı yazmalı.

### P1.3 — Dişli rating / ISO 6336-lite

Mevcut modül, oran, temas oranı, helis kuvveti ve tork araçları hazır bir yolculuk oluşturuyor. İlk sürüm modül/diş sayısı/helis, tork/devir, yüz genişliği, malzeme/ısıl işlem ve servis faktöründen yaklaşık diş dibi/temas kontrolü üretmeli. Tam ISO 6336 veya AGMA rating iddiası, katsayı ve validasyon tamamen belgelenmeden yapılmamalı.

## 7. New engineering tools — English product plan

### Recommended order

1. **Tolerance stack-up + GD&T** — strongest immediate fit with the existing glossary and fixture content.
2. **Advanced beam/shaft/strength load cases** — upgrades the existing stress, bending, torsion, and statics tools.
3. **VDI 2230 bolted-joint Lite** — turns the existing bolt calculator into a higher-value workflow.
4. **Pump system curve + NPSH** — connects pressure loss, viscosity, Reynolds, and cavitation content.
5. **Fatigue/S-N/Goodman** — strong expertise signal, but requires careful validation.
6. **Bearing selection/reliability/lubrication** — expands the current L10 calculator.
7. **Weld joint and weld fatigue** — extends the fillet-weld tool.
8. **Gear rating / ISO 6336-lite** — high-value cluster with the highest validation burden.
9. **CNC speed/feed and drilling/tapping** — practical manufacturing search cluster.
10. **Thermal expansion/heat transfer**, then material/corrosion compatibility and optional electrical tools.

Every tool should ship with:

- one canonical URL in both languages;
- visible explanation beside the form;
- unit-aware validation;
- formulas and assumptions;
- at least one reproducible worked example;
- limitations and “when not to use this model”;
- references with method and revision/date;
- related glossary, guide, and calculator links;
- shareable reports without indexable query-string duplicates;
- tests for normal, boundary, invalid, and unit-conversion cases.

Do not copy paid standard tables or long copyrighted passages. Cite the method and edition, use licensed references where needed, and publish TORQYX’s own explanation, assumptions, and implementation tests.

### SEO packaging for each tool

Use one canonical tool page plus one guide page, not dozens of near-identical parameter URLs. The title should describe the task and engineering context, for example “Tolerance Stack-Up Calculator — Worst-Case and RSS”. The description should state what the tool calculates and what it does not calculate. Visible sections should include use case, inputs, method, example, assumptions, limitations, references, and related tools.

Use structured data only for content that is visible and accurate. Do not invent rating counts, reviews, prices, or unsupported application categories. Every tool should link to two related tools, one glossary term, one reference/methodology page, and one guide. Keep ads away from interactive form controls and result actions; monetize supporting articles before calculator surfaces.

---

## 8. 90 günlük uygulama planı — Türkçe

### Hafta 1–2: risk temizliği

- CMP’yi AdSense Privacy & Messaging üzerinden gerçek production akışıyla test et.
- ads.txt sabit kaldıktan sonra bir kez `Check for updates` çalıştır.
- Tool schema URL’lerini locale canonical ile eşleştir.
- Güncel olmayan HowTo/FAQ JSON-LD’yi azalt veya kaldır.
- Lighthouse local route testini düzelt; mobile staging ölçümünü CI’a ekle.
- Gerçek reviewer bilgisi yoksa mevcut ekip adını koru.

### Hafta 3–6: ilk ürün dalgası

- Tolerans zinciri + GD&T MVP.
- VDI 2230 bolted-joint Lite MVP.
- Her araç için TR/EN guide, glossary, example, limitations ve references.
- Rich Results Test, URL Inspection ve boundary/unit testleri.

### Hafta 7–10: derinlik ve uzmanlık

- Pump system curve + NPSH.
- Sınırları açık bir Fatigue/S-N/Goodman sürümü.
- Bearing selection/reliability genişletmesi.
- Search Console sorgu ve landing-page performans karşılaştırması.

### Hafta 11–13: ölçüm ve yayın politikası

- Kullanım hataları ve hesap geri bildirimlerini topla.
- En çok gösterim alan Türkçe içeriğe gerçek İngilizce eşdeğer yaz.
- CWV field data oluştuğunda LCP, INP ve CLS’yi ölç.
- AdSense `Ready` olmadan reklam yayını açma.
- Her yeni araç için aynı içerik/kaynak/sınır/test checklist’ini zorunlu kıl.

## 9. 90-day implementation plan — English

### Weeks 1–2: risk cleanup

- Test the real CMP flow in AdSense Privacy & Messaging.
- Run `Check for updates` once after ads.txt remains stable.
- Make tool structured-data URLs match localized canonical URLs.
- Reduce or remove outdated HowTo/FAQ JSON-LD.
- Fix the local Lighthouse route harness and add mobile staging measurements.
- Keep the transparent team identity unless real reviewer information is available.

### Weeks 3–6: first product wave

- Ship tolerance stack-up + GD&T MVP.
- Ship VDI 2230 bolted-joint Lite MVP.
- Add a real TR/EN guide, glossary entry, worked example, limitations, and references for each.
- Run Rich Results Test, URL Inspection, boundary tests, and unit-conversion tests.

### Weeks 7–10: depth and expertise

- Ship pump system curve + NPSH.
- Ship a constrained Fatigue/S-N/Goodman version.
- Extend bearing selection/reliability.
- Compare Search Console queries and landing-page performance.

### Weeks 11–13: measurement and publishing policy

- Collect real calculation errors and user feedback.
- Add English equivalents for the highest-impression Turkish content.
- Measure LCP, INP, and CLS once field data exists.
- Do not enable ads before AdSense `Ready`.
- Make the content, source, limitation, and test checklist mandatory for every new tool.

---

## 10. Son karar / Final decision

**Şu anda yayın engeli / Current publishing blocker:** Yok / None.  
**AdSense reklamını açma / Enable AdSense ads:** Hayır / No; CMP ve `Ready` tamamlanmadan açılmamalı.  
**En acil teknik düzeltme / Most urgent technical fix:** Tool schema canonical URL’leri ve eski HowTo/FAQ şemaları.  
**En iyi ilk ürün / Best first product:** Tolerans zinciri + GD&T.  
**En yüksek uzmanlık getirisi / Highest expertise upside:** Yorulma/S-N ve VDI 2230; doğrulama yükü daha yüksek.  
**En büyük SEO riski / Largest SEO risk:** Birbirine benzeyen sığ araç sayfaları üretmek.  
**En büyük AdSense riski / Largest AdSense risk:** CMP tamamlanmadan global script/reklam davranışını yanlış yapılandırmak.
