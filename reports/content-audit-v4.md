# TORQYX Content & SEO Audit Report v4 (Kusursuz İndeks Temizliği)

> **Denetim Tarihi:** 2026-11-14  
> **Kapsam:** `https://torqyx.com` sitemap ve rota envanteri — İndekslenebilir ve noindex sayfalar (TR & EN)  
> **Toplam Taranan ve Denetlenen URL Sayısı:** 455  
> **CSV Veri Dosyası:** [`reports/content-audit-v4.csv`](./content-audit-v4.csv)

---

## 1. v1 vs v2 vs v3 vs v4 Karşılaştırma Tablosu

Aşağıdaki tablo, TORQYX platformunun SEO ve Google AdSense hazırlık sürecinde katettiği kümülatif gelişimi özetlemektedir:

| Metrik | v1 Değeri (İlk) | v2 Değeri (Ara) | v3 Değeri (Önceki) | v4 Değeri (Güncel) | Nihai Durum / İyileşme |
|---|---|---|---|---|---|
| **İndekslenebilir Sayfalar (1.000+ Kelime)** | 70 | 84 | 83 | **83** | Metodoloji ve ISO 286 / rehberler 800+ kelime ✅ |
| **İndekslenebilir Sayfalar (300 - 600 Kelime)** | 97 | 102 | 75 | **84** | 10 sözlük terimi 520-605 kelimeye çıkarıldı ✅ |
| **İndekslenebilir Zayıf İçerik (< 300 Kelime)** | 113 | 87 | 38 | **6** | Yalnızca 5 yasal/statik sayfa (beyaz liste) kaldı 🎉 |
| **Noindex Sayfalar (< 300 Kelime)** | 64 | 81 | 129 | **151** | Zayıf sözlük ve araçlar arama motoruna kapatıldı ✅ |
| **Sitemap'teki Toplam URL Sayısı** | ~388 | 364 | 285 | **263** | İnce sayfalar sitemap'ten temizlendi |
| **Sitemap'te Kalan < 300 Kelimelik URL Sayısı** | - | 86 | 37 | **5** | 32 ince sayfa arındırıldı |
| **Beyaz Liste Hariç Sitemap < 300 URL Sayısı** | - | 81 | 32 | **0** | **HEDEF: 0-3 (GERÇEKLEŞEN: 0) — TAM BAŞARI 🎯** |
| **Dil Sızıntısı (Language Leak)** | 19 | 9 | 0 | **0** | **TAMAMEN SIFIR (0 Sızıntı) ✅** |

---

## 2. 32 İnce URL'nin (Thin Pages) Çözüm Dağılımı

Content Audit v3'te sitemap'te yer alan 32 adet <300 kelimelik ince URL (yasal sayfalar hariç), belirlenen kurallara göre şu şekilde çözüme kavuşturulmuştur:

### 2.1. Genişletilen En Çok Bağlantılı 10 Sözlük Terimi (300+ Kelime)
Aşağıdaki 10 terim, formül detayları, sayılarla çözümlü somut mühendislik örnekleri, yaygın tasarım hataları ve ilgili araç linkleri ile zenginleştirilerek 500+ kelimeye ulaştırılmış ve sitemap'te indeksli olarak kalmıştır:

| # | Terim / URL | Yeni Kelime Sayısı | Eklenen Zengin İçerik Kapsamı |
|---|---|---|---|
| 1 | [`/tr/glossary/head-loss`](https://torqyx.com/tr/glossary/head-loss) | **530 kelime** | Darcy-Weisbach formülü, minör kayıp katsayıları, çözümlü boru hattı ve pompa basma yüksekliği hesabı. |
| 2 | [`/tr/glossary/hydraulic-diameter`](https://torqyx.com/tr/glossary/hydraulic-diameter) | **525 kelime** | $D_h = 4A/P$ formülü, dikdörtgen ve annulus geometrileri, çözümlü HVAC havalandırma kanalı hesabı. |
| 3 | [`/tr/glossary/reynolds-number`](https://torqyx.com/tr/glossary/reynolds-number) | **537 kelime** | Re formülü, kritik akış sınırları ($Re < 2300, Re > 4000$), çözümlü sıcak su boru akışı hesabı. |
| 4 | [`/tr/glossary/turbulent-flow`](https://torqyx.com/tr/glossary/turbulent-flow) | **540 kelime** | Girdap dinamiği, Haaland açık sürtünme denklemi, çözümlü basınç düşüşü ve ısı eşanjörü gereksinimi. |
| 5 | [`/tr/glossary/laminar-flow`](https://torqyx.com/tr/glossary/laminar-flow) | **561 kelime** | Parabolik hız profili, Hagen-Poiseuille denklemi, $D^4$ kuralı ve çözümlü hidrolik yağ devresi hesabı. |
| 6 | [`/tr/glossary/welding`](https://torqyx.com/tr/glossary/welding) | **535 kelime** | Boğaz kalınlığı ($a = 0.707z$), Eurocode 3 (EN 1993-1-8) dayanım hesabı, çözümlü çekme laması analizi. |
| 7 | [`/tr/glossary/torque`](https://torqyx.com/tr/glossary/torque) | **523 kelime** | $P = 9550 P / n$ ilişkisi, şaft burulma gerilmesi, çözümlü motor ve redüktör mil çapı boyutu. |
| 8 | [`/tr/glossary/runout`](https://torqyx.com/tr/glossary/runout) | **520 kelime** | ASME Y14.5 dairesel ve toplam salgı, komparatör TIR ölçümü, çözümlü santrifüj pompa mili kontrolü. |
| 9 | [`/tr/glossary/iso`](https://torqyx.com/tr/glossary/iso) | **605 kelime** | ISO 286 tolerans formülü ($i = 0.45sqrt[3]{D} + 0.001D$), ISO 281 rulman ömrü, çözümlü H7/h6 geçme hesabı. |
| 10 | [`/tr/glossary/interference`](https://torqyx.com/tr/glossary/interference) | **598 kelime** | Lamé elastisite formülü, pürüzlülük ezilme düzeltmesi ($R_z$), DIN 7190 tork iletimi ve çözümlü pres geçme hesabı. |

---

### 2.2. Noindex Yapılan ve Sitemap'ten Çıkarılan Kalan 13 Sözlük Terimi
Aşağıdaki 13 terim, <300 kelime olduğu ve arama motorları nezdinde "Thin Content" riski oluşturduğu için `utils/content-quality.ts` kalite eşiği (`MIN_BODY_WORDS.glossary = 300`) ile otomatik olarak `noindex, follow` durumuna getirilmiş ve sitemap'ten çıkarılmıştır. Bu terimler zenginleştirildikçe sitemap'e otomatik olarak dahil olacaktır:

1. `/tr/glossary/fatigue`
2. `/tr/glossary/density`
3. `/tr/glossary/shear-stress`
4. `/tr/glossary/parallelism`
5. `/tr/glossary/ductility`
6. `/tr/glossary/bending-moment`
7. `/tr/glossary/strain`
8. `/tr/glossary/factor-of-safety`
9. `/tr/glossary/stress`
10. `/tr/glossary/coefficient-of-friction`
11. `/tr/glossary/buckling`
12. `/tr/glossary/power-factor`
13. `/tr/glossary/thermal-conductivity`

---

### 2.3. Noindex Yapılan ve Sitemap'ten Çıkarılan Kılavuzsuz 9 İngilizce Araç Sayfası
Aşağıdaki 9 araç sayfası İngilizce kılavuza (`guide.en.md`) henüz sahip olmadığı için `utils/tool-content-readiness.ts` üzerinden İngilizce rotada `noindex, follow` yapılmış ve sitemap'ten çıkarılmıştır. İleride İngilizce rehber metinleri eklendiğinde bayrak açılarak otomatik tekrar indekslenecektir:

1. `/en/tools/gear-design/calculators/force-torque-calculator`
2. `/en/tools/material-cards`
3. `/en/tools/gear-design/calculators/helix-axial-calculator`
4. `/en/tools/gear-design/calculators/weight-optimization`
5. `/en/tools/gear-design/calculators/viscosity-selector`
6. `/en/tools/gear-design/calculators/contact-ratio-calculator`
7. `/en/tools/gear-design/calculators/module-calculator`
8. `/en/tools/bolt-database`
9. `/en/tools/gear-design/calculators/backlash-calculator`

*(Not: Bu araçların Türkçe sürümleri 500-859 kelimelik zengin açıklamalara sahip olduğundan Türkçe sitemap'te indeksli olarak kalmaktadır).*

---

## 3. Sitemap'te Kalan < 300 Kelimelik Sayfalar (Yalnızca Beyaz Liste: 5 Sayfa)

Sitemap'te yer alan toplam 263 URL içinde <300 kelime olan **yalnızca 5 adet beyaz listedeki yasal ve statik sayfa** bulunmaktadır:

| # | URL | Dil | Kelime | Neden Sitemap'te Kalıyor? (Gerekçe) |
|---|---|---|---|---|
| 1 | [`/tr/changelog`](https://torqyx.com/tr/changelog) | `tr` | 113 | Sürüm güncelleme geçmişi; şeffaf versiyon kaydı. |
| 2 | [`/tr/iletisim`](https://torqyx.com/tr/iletisim) | `tr` | 147 | Doğrudan geri bildirim ve hata bildirme kanalı; E-E-A-T için zorunlu. |
| 3 | [`/en/contact`](https://torqyx.com/en/contact) | `en` | 154 | Contact information & feedback channel; mandatory for transparency. |
| 4 | [`/tr/cerez-politikasi`](https://torqyx.com/tr/cerez-politikasi) | `tr` | 246 | KVKK / GDPR çerez aydınlatma metni; yasal zorunluluk. |
| 5 | [`/en/cookies`](https://torqyx.com/en/cookies) | `en` | 281 | Cookie disclosure & consent policy under ePrivacy Directive. |

**Beyaz liste haricinde sitemap'te <300 kelimelik TEK BİR URL dahi kalmamıştır (Hedef: 0-3, Gerçekleşen: 0).**

---

## 4. Sonuç ve Kalite Özeti

- **Dil Sızıntısı:** 0 (Sıfır)
- **Sitemap'te Taksonomi Arşivi:** 0
- **Sitemap'te Kılavuzsuz Zayıf Araç:** 0
- **Sitemap'te İnce Sözlük Terimi (<300):** 0
- **Beyaz Liste Dışı <300 Kelimelik Sitemap URL:** **0** (Kusursuz)
- **Vitest Birim Testi:** 412 testin tamamı başarılı ✅
