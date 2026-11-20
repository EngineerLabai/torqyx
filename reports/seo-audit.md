# TORQYX Canlı SEO Denetim Raporu (Live SEO Audit)

> **Denetim Tarihi:** 2026-11-19 17:22:20 UTC  
> **Hedef:** `https://torqyx.com/sitemap.xml` ve Canlı Sayfa Envanteri  
> **Taranan Sitemap URL Sayısı:** 236  
> **CSV Veri Dosyası:** [`reports/seo-audit.csv`](./seo-audit.csv)  

---

## 1. Genel SEO Sağlık Özeti

| Metrik | Değer | Durum / Hedef |
|---|---|---|
| **Toplam İncelenen Sitemap URL** | **236** | Canlı sitemap ile %100 senkron |
| **Birebir Aynı Meta Description Sayısı** | **0 sayfa** | Kusursuz (0 tekrar) ✅ |
| **Son Cümlesi Tekrar Eden Meta Description** | **58 sayfa** | Şablon kalıbı incelenmeli ⚠️ |
| **Boş Meta Description** | **0** | Tüm sayfalarda mevcut ✅ |
| **H1 Eksik (0) veya Birden Fazla (>1)** | **2 sayfa** | H1 etiketleri optimize edilmeli ⚠️ |
| **HTML'de "Yükleniyor" Metni İçeren Sayfa** | **2 sayfa** | İstemci tarafı render beklemesi var ⚠️ |
| **İç Linki 0-2 Olan İndekslenebilir Sayfalar** | **35 sayfa** | İç link mimarisi güçlendirilmeli |
| **Kırık İç Linkler (404 Dönen Hedefler)** | **7 adet** | Hemen düzeltilmeli ❌ |
| **Tags / Categories İç Linkleri** | **64 adet** | Sitemap/noindex ile uyumsuz linkler ⚠️ |
| **Dilsiz veya Hatalı Rota Linkleri** | **0 adet** | Tüm linkler yerelleştirilmiş ✅ |
| **Hatalı Karakterli Linkler (`href="&"` / `href="$"`)** | **0 adet** | Temiz ✅ |
| **`feed.xml` Durumu** | **HTTP 404** | Feed bulunamadı / devre dışı |

---

## 2. En Çok Tekrar Eden Meta Description Kalıpları

✅ **Hiçbir sayfada birebir kopya meta description bulunmamaktadır.**


### 2.2. Son Cümlesi Ortak Olan Meta Description Kalıpları (3 Kalıp, 58 Sayfa)

> Bazı araç ve sözlük sayfalarında son cümle aynı çağrı veya tanım şablonuyla bitmektedir:

| Tekrar | Tekrarlanan Son Cümle | Örnek URL'ler |
|---|---|---|
| **33 sayfa** | `Formüller, birim kontrolü ve ilgili mühendislik hesaplayıcılarıyla hızlı sonuç alın` | [`/tr/tools/basic-engineering`](https://torqyx.com/tr/tools/basic-engineering), [`/tr/tools/unit-converter`](https://torqyx.com/tr/tools/unit-converter) ... |
| **23 sayfa** | `Get fast results with formulas, unit checks, and related engineering calculators` | [`/en/tools/unit-converter`](https://torqyx.com/en/tools/unit-converter), [`/en/tools/param-chart`](https://torqyx.com/en/tools/param-chart) ... |
| **2 sayfa** | `TORQYX hesaplayıcısı ile otomatik hesapla` | [`/tr/blog/darcy-weisbach-boru-basinc-kaybi`](https://torqyx.com/tr/blog/darcy-weisbach-boru-basinc-kaybi), [`/tr/blog/excel-mi-torqyx-mi`](https://torqyx.com/tr/blog/excel-mi-torqyx-mi) |


---

## 3. İç Linki 0-2 Olan İndekslenebilir Sayfalar (Yetim / Zayıf Bağlantılı)

Site genelinde taranan sayfalardan bu sayfalara verilen iç link sayısı 2 veya daha az olan indeksli sayfalar (Crawl Depth ve PageRank aktarımı açısından risk):

| URL | Gelen İç Link (Inbound) | Çıkan İç Link (Outbound) | Kelime | H1 |
|---|:---:|:---:|:---:|---|
| [`/en/faq`](https://torqyx.com/en/faq) | **0** | 19 | 693 | Frequently asked questions |
| [`/tr/faq`](https://torqyx.com/tr/faq) | **0** | 19 | 575 | Sık Sorulan Sorular |
| [`/tr/blog/metrik-ve-inc-vida-adimi-farklari`](https://torqyx.com/tr/blog/metrik-ve-inc-vida-adimi-farklari) | **2** | 25 | 1167 | Metrik ve İnç Vida Adımı Farkları: Hangi |
| [`/tr/blog/din-931-ve-din-933-farki`](https://torqyx.com/tr/blog/din-931-ve-din-933-farki) | **2** | 25 | 1247 | DIN 931 ve DIN 933 Arasındaki Fark Nedir |
| [`/tr/blog/reduktor-seciminde-5-kriter`](https://torqyx.com/tr/blog/reduktor-seciminde-5-kriter) | **1** | 25 | 1191 | Redüktör Seçiminde Dikkat Edilmesi Gerek |
| [`/tr/blog/disli-omrunu-kisaltan-tasarim-hatalari`](https://torqyx.com/tr/blog/disli-omrunu-kisaltan-tasarim-hatalari) | **1** | 29 | 1309 | Dişli Ömrünü Kısaltan 6 Tasarım Hatası |
| [`/tr/blog/tork-katsayisi-k-faktoru-nedir`](https://torqyx.com/tr/blog/tork-katsayisi-k-faktoru-nedir) | **2** | 27 | 1198 | Tork Katsayısı (K Faktörü) Nedir? |
| [`/tr/blog/evolvent-dis-profili-nedir`](https://torqyx.com/tr/blog/evolvent-dis-profili-nedir) | **1** | 25 | 1195 | Evolvent Diş Profili Nedir? Neden Standa |
| [`/tr/blog/dinamik-ve-statik-yuk-kapasitesi-c-ve-c0`](https://torqyx.com/tr/blog/dinamik-ve-statik-yuk-kapasitesi-c-ve-c0) | **1** | 27 | 1224 | Dinamik ve Statik Yük Kapasitesi: C ve C |
| [`/tr/blog/civata-on-yuku-vdi-2230`](https://torqyx.com/tr/blog/civata-on-yuku-vdi-2230) | **2** | 26 | 1539 | Cıvata Ön Yük ve Sıkma Torku Hesabı Rehb |
| [`/tr/blog/rulman-omru-l10-iso-281`](https://torqyx.com/tr/blog/rulman-omru-l10-iso-281) | **2** | 26 | 1794 | Rulman Ömrü (L10) ve Dinamik Yük Kapasit |
| [`/tr/blog/iso-898-1-civata-standartlari`](https://torqyx.com/tr/blog/iso-898-1-civata-standartlari) | **2** | 28 | 934 | ISO 898-1 Cıvata Standartları: Mukavemet |
| [`/tr/blog/darcy-weisbach-boru-basinc-kaybi`](https://torqyx.com/tr/blog/darcy-weisbach-boru-basinc-kaybi) | **2** | 26 | 1306 | Darcy-Weisbach Formülü ile Boru Basınç K |
| [`/tr/blog/excel-mi-torqyx-mi`](https://torqyx.com/tr/blog/excel-mi-torqyx-mi) | **1** | 23 | 1101 | Excel mi, TORQYX mi? Mekanik Mühendisler |
| [`/tr/tools/bolt-calculator/guide`](https://torqyx.com/tr/tools/bolt-calculator/guide) | **1** | 30 | 695 | Cıvata Boyut ve Ön Yük Hesabı: Nasıl Kul |
| [`/tr/tools/pipe-pressure-loss/guide`](https://torqyx.com/tr/tools/pipe-pressure-loss/guide) | **1** | 31 | 667 | Boru Basınç Kaybı Hesabı: Nasıl Kullanıl |
| [`/tr/tools/machine-elements`](https://torqyx.com/tr/tools/machine-elements) | **2** | 29 | 1236 | Makine Elemanları Hızlı Paket |
| [`/tr/tools/production-project`](https://torqyx.com/tr/tools/production-project) | **2** | 27 | 962 | Üretim & Proje Hızlı Paket |
| [`/tr/tools/gear-design/simulations`](https://torqyx.com/tr/tools/gear-design/simulations) | **2** | 27 | 618 | MAAG, FELLOW, Azdırma ve taşlama/döküm s |
| [`/en/blog/din-931-ve-din-933-farki`](https://torqyx.com/en/blog/din-931-ve-din-933-farki) | **2** | 25 | 922 | DIN 931 vs DIN 933: Partial Thread vs Fu |
| [`/en/blog/paslanmaz-celik-civata-mi-galvanizli-mi`](https://torqyx.com/en/blog/paslanmaz-celik-civata-mi-galvanizli-mi) | **2** | 26 | 1173 | Stainless Steel vs Galvanized Bolts: Mat |
| [`/en/blog/tork-anahtari-nasil-dogru-kullanilir`](https://torqyx.com/en/blog/tork-anahtari-nasil-dogru-kullanilir) | **2** | 28 | 1301 | How to Correctly Use a Torque Wrench: As |
| [`/en/blog/zincir-kasnak-sistemi-mi-disli-kutusu-mu`](https://torqyx.com/en/blog/zincir-kasnak-sistemi-mi-disli-kutusu-mu) | **2** | 25 | 1194 | Chain Drives, Belt-Pulley Systems, or Ge |
| [`/en/blog/motor-seciminde-tork-egrisi-nasil-okunur`](https://torqyx.com/en/blog/motor-seciminde-tork-egrisi-nasil-okunur) | **2** | 25 | 1159 | How to Read an Electric Motor Torque-Spe |
| [`/en/blog/saft-boyutlandirma-tork-burulma-gerilmesi`](https://torqyx.com/en/blog/saft-boyutlandirma-tork-burulma-gerilmesi) | **1** | 28 | 1235 | Shaft Sizing: Torsional Stress and Angle |
| [`/en/blog/rulman-toleranslari-iso-286-sistemi`](https://torqyx.com/en/blog/rulman-toleranslari-iso-286-sistemi) | **2** | 29 | 1356 | Bearing Fits and Tolerances: The ISO 286 |
| [`/en/blog/reynolds-sayisi-laminar-turbulansli-akis`](https://torqyx.com/en/blog/reynolds-sayisi-laminar-turbulansli-akis) | **2** | 26 | 943 | What is Reynolds Number? Laminar vs. Tur |
| [`/en/blog/excel-ile-muhendislik-hesabi-yapmanin-7-riski`](https://torqyx.com/en/blog/excel-ile-muhendislik-hesabi-yapmanin-7-riski) | **2** | 25 | 1179 | 7 Dangerous Risks of Using Excel for Mec |
| [`/en/blog/muhendislik-hesaplarinda-guvenlik-katsayisi`](https://torqyx.com/en/blog/muhendislik-hesaplarinda-guvenlik-katsayisi) | **2** | 24 | 1111 | How to Determine the Factor of Safety in |
| [`/en/blog/excel-mi-torqyx-mi`](https://torqyx.com/en/blog/excel-mi-torqyx-mi) | **1** | 24 | 899 | Excel vs. TORQYX: Choosing the Right Cal |
| [`/en/blog/muhendislik-hesaplama-surecleri`](https://torqyx.com/en/blog/muhendislik-hesaplama-surecleri) | **1** | 28 | 677 | Engineering Calculation Workflows |
| [`/en/tools/bolt-calculator/guide`](https://torqyx.com/en/tools/bolt-calculator/guide) | **1** | 30 | 785 | Bolt Sizing and Preload Calculation: How |
| [`/en/tools/pipe-pressure-loss/guide`](https://torqyx.com/en/tools/pipe-pressure-loss/guide) | **1** | 31 | 768 | Pipe Pressure Loss Calculation: How to U |
| [`/en/tools/machine-elements`](https://torqyx.com/en/tools/machine-elements) | **2** | 26 | 719 | Machine Elements Fast Pack |
| [`/en/tools/production-project`](https://torqyx.com/en/tools/production-project) | **2** | 24 | 509 | Production & Operations Fast Pack |


---

## 4. Kırık İç Linkler (404 / 500 Dönen Hedefler)


Aşağıdaki iç linkler sitede bir sayfadan diğerine verilmiş fakat hedef URL HTTP hata kodu döndürmektedir:

| Hedef Kırık URL | Durum Kodu | Kaynak Sayfa (Nereden Bağlantı Verilmiş?) |
|---|:---:|---|
| `https://torqyx.com/tr/sitemap.xml` | **404** | [`/tr/tools`](https://torqyx.com/tr/tools), [`/tr/tools/power-drives`](https://torqyx.com/tr/tools/power-drives), [`/tr/tools/fluids-heat`](https://torqyx.com/tr/tools/fluids-heat) |
| `https://torqyx.com/en/sitemap.xml` | **404** | [`/en/tools/fasteners-strength`](https://torqyx.com/en/tools/fasteners-strength), [`/en/tools`](https://torqyx.com/en/tools), [`/en/tools/fluids-heat`](https://torqyx.com/en/tools/fluids-heat) |
| `https://torqyx.com/tr/glossary/pressure` | **404** | [`/tr/guides/standart-birim-sistemi-rehberi`](https://torqyx.com/tr/guides/standart-birim-sistemi-rehberi), [`/tr/guides/viskozite-siniflandirmasi-rehberi`](https://torqyx.com/tr/guides/viskozite-siniflandirmasi-rehberi) |
| `https://torqyx.com/en/tools/gear-module` | **404** | [`/en/blog/disli-omrunu-kisaltan-tasarim-hatalari`](https://torqyx.com/en/blog/disli-omrunu-kisaltan-tasarim-hatalari) |
| `https://torqyx.com/en/guides/darcy-weisbach-ve-surtunme-faktoru-rehberi` | **404** | [`/en/blog/reynolds-sayisi-laminar-turbulansli-akis`](https://torqyx.com/en/blog/reynolds-sayisi-laminar-turbulansli-akis) |
| `https://torqyx.com/en/guides/boru-capi-seciminde-hiz-ve-basinc-dengesi` | **404** | [`/en/blog/reynolds-sayisi-laminar-turbulansli-akis`](https://torqyx.com/en/blog/reynolds-sayisi-laminar-turbulansli-akis) |
| `https://torqyx.com/en/glossary/pressure` | **404** | [`/en/guides/standart-birim-sistemi-rehberi`](https://torqyx.com/en/guides/standart-birim-sistemi-rehberi), [`/en/guides/viskozite-siniflandirmasi-rehberi`](https://torqyx.com/en/guides/viskozite-siniflandirmasi-rehberi) |


---

## 5. Taksonomi Linkleri (`/tags/` ve `/categories/`)


| Kaynak Sayfa | Hedef Link |
|---|---|
| [`/tr/glossary/head-loss`](https://torqyx.com/tr/glossary/head-loss) | `/tr/categories/akiskanlar` |
| [`/tr/glossary/head-loss`](https://torqyx.com/tr/glossary/head-loss) | `/tr/tags/yuk-kaybi` |
| [`/tr/glossary/head-loss`](https://torqyx.com/tr/glossary/head-loss) | `/tr/tags/basinc-kaybi` |
| [`/tr/glossary/head-loss`](https://torqyx.com/tr/glossary/head-loss) | `/tr/tags/darcy-weisbach` |
| [`/tr/glossary/head-loss`](https://torqyx.com/tr/glossary/head-loss) | `/tr/tags/akiskanlar` |
| [`/tr/glossary/head-loss`](https://torqyx.com/tr/glossary/head-loss) | `/tr/tags/boru` |
| [`/tr/glossary/hydraulic-diameter`](https://torqyx.com/tr/glossary/hydraulic-diameter) | `/tr/categories/akiskanlar` |
| [`/tr/glossary/hydraulic-diameter`](https://torqyx.com/tr/glossary/hydraulic-diameter) | `/tr/tags/hidrolik-cap` |
| [`/tr/glossary/hydraulic-diameter`](https://torqyx.com/tr/glossary/hydraulic-diameter) | `/tr/tags/kanal-akisi` |
| [`/tr/glossary/hydraulic-diameter`](https://torqyx.com/tr/glossary/hydraulic-diameter) | `/tr/tags/akiskanlar` |
| [`/tr/glossary/hydraulic-diameter`](https://torqyx.com/tr/glossary/hydraulic-diameter) | `/tr/tags/reynolds` |
| [`/tr/glossary/hydraulic-diameter`](https://torqyx.com/tr/glossary/hydraulic-diameter) | `/tr/tags/basinc-kaybi` |
| [`/tr/glossary/laminar-flow`](https://torqyx.com/tr/glossary/laminar-flow) | `/tr/categories/akiskanlar` |
| [`/tr/glossary/laminar-flow`](https://torqyx.com/tr/glossary/laminar-flow) | `/tr/tags/laminer-akis` |
| [`/tr/glossary/laminar-flow`](https://torqyx.com/tr/glossary/laminar-flow) | `/tr/tags/reynolds` |
| [`/tr/glossary/laminar-flow`](https://torqyx.com/tr/glossary/laminar-flow) | `/tr/tags/akiskanlar` |
| [`/tr/glossary/laminar-flow`](https://torqyx.com/tr/glossary/laminar-flow) | `/tr/tags/viskozite` |
| [`/tr/glossary/laminar-flow`](https://torqyx.com/tr/glossary/laminar-flow) | `/tr/tags/poiseuille` |
| [`/tr/glossary/interference`](https://torqyx.com/tr/glossary/interference) | `/tr/categories/tolerans` |
| [`/tr/glossary/interference`](https://torqyx.com/tr/glossary/interference) | `/tr/tags/siki-gecme` |


---

## 6. Dilsiz Yollar (`/glossary`, `/tools/...`) ve Hatalı `/guide/` Linkleri

✅ **Tüm iç linkler uygun dil öneki (`/tr/` veya `/en/`) taşımaktadır.**

---

## 7. Özel Karakterli Hatalı Linkler (`href="&"` veya `href="$"`)

✅ **Sayfalarda `href="&"` veya `href="$"` gibi hatalı linkler bulunmamaktadır.**

---

## 8. H1 Başlık Denetimi (0 veya Birden Fazla H1)


| URL | H1 Sayısı | Tespit Edilen Başlıklar |
|---|:---:|---|
| [`/tr/glossary/iso`](https://torqyx.com/tr/glossary/iso) | **0** | `YOK` |
| [`/en/glossary/backlash`](https://torqyx.com/en/glossary/backlash) | **0** | `YOK` |


---

## 9. Sunucu HTML'inde "Yükleniyor" Metni Denetimi


Aşağıdaki sayfalarda sunucu HTML'i içinde "Yükleniyor" metni tespit edildi (CSR/hydration gecikmesi riski):

| URL | Durum |
|---|---|
| [`/tr/tools/torque-power`](https://torqyx.com/tr/tools/torque-power) | "Yükleniyor" içeriyor |
| [`/en/tools/torque-power`](https://torqyx.com/en/tools/torque-power) | "Yükleniyor" içeriyor |


---

## 10. Görsel Boyutlandırma ve Next.js Image Optimizasyonu (`_next/image w=`)

Sayfalarda Next.js Image komponenti tarafından talep edilen en büyük görsel genişlikleri incelenmiştir:
- Maksimum talep edilen görsel genişliği: **3840px**
- Görsel içeren sayfaların tamamında responsive WebP/AVIF formatları ve belirlenmiş genişlik parametreleri kullanılmaktadır.
