# TORQYX Content & SEO Audit Report v2 (Karşılaştırmalı Denetim)

> **Denetim Tarihi:** 2026-11-07  
> **Kapsam:** Canlı site (`https://torqyx.com`) — İndekslenebilir ve noindex rotalar (TR ve EN)  
> **Taranan Toplam URL:** 455  
> **CSV Veri Dosyası:** [`reports/content-audit-v2.csv`](./content-audit-v2.csv)

## 1. v1 vs v2 Karşılaştırma Tablosu

Yapılan 4 temel iyileştirme sonrasında (Project-Hub ve Community noindex yapılması, Header/Nav sadeleştirmesi, Metodoloji ve Sorumluluk Reddi bağımsız sayfalarının açılması, Satış politikasının footer ve sitemap'ten gizlenip noindex yapılması) elde edilen karşılaştırmalı sonuçlar:

| Metrik | v1 Değeri (Önceki) | v2 Değeri (Güncel) | Değişim / İyileşme |
|---|---|---|---|
| **İndekslenebilir Sayfalar (1.000+ Kelime)** | 70 | **84** | +14 artış ✅ |
| **İndekslenebilir Sayfalar (300 - 600 Kelime)** | 97 | **102** | 5 |
| **İndekslenebilir Kritik İnce İçerik (< 300 Kelime)** | 113 | **87** | **-26 riskli sayfa temizlendi 🎉** |
| **Noindex Sayfalar (1.000+ Kelime)** | 1 | **1** | +0 |
| **Noindex Sayfalar (300 - 600 Kelime)** | 11 | **8** | +-3 |
| **Noindex Sayfalar (< 300 Kelime)** | 64 | **81** | +17 (botlara kapatıldı ✅) |
| **Sitemap'teki Toplam URL Sayısı** | ~388 | **364** | Arındırılmış temiz harita |
| **Sitemap'te Kalan <300 Kelimelik URL Sayısı** | - | **86** | ⚠️ İncelenmeli |
| **Dil Sızıntısı (Language Leak)** | 19 | **9** | 9 (10 azaldı) |

## 2. Sitemap'teki URL'ler ve < 300 Kelimelik Olanların Durumu

* **Sitemap'teki Toplam URL Sayısı:** **364**
* **Sitemap'te Yer Alan ve < 300 Kelime Olan URL Sayısı:** **86**

Aşağıdaki sayfalar sitemap'te yer almaktadır ancak kelime hacmi 300'ün altındadır:

| # | Sitemap URL | Dil | Kelime Sayısı | Durum / Öneri |
|---|---|---|---|---|
| 1 | [/en/glossary/backlash](https://torqyx.com/en/glossary/backlash) | `en` | 113 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 2 | [/tr/changelog](https://torqyx.com/tr/changelog) | `tr` | 113 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 3 | [/tr/tags/flow](https://torqyx.com/tr/tags/flow) | `tr` | 118 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 4 | [/tr/tags/torque](https://torqyx.com/tr/tags/torque) | `tr` | 140 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 5 | [/tr/iletisim](https://torqyx.com/tr/iletisim) | `tr` | 147 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 6 | [/tr/tags/icerik](https://torqyx.com/tr/tags/icerik) | `tr` | 147 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 7 | [/tr/tags/pressure](https://torqyx.com/tr/tags/pressure) | `tr` | 148 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 8 | [/en/contact](https://torqyx.com/en/contact) | `en` | 154 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 9 | [/tr/tags/reynolds](https://torqyx.com/tr/tags/reynolds) | `tr` | 172 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 10 | [/tr/tags/engineering](https://torqyx.com/tr/tags/engineering) | `tr` | 175 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 11 | [/tr/tags/mukavemet](https://torqyx.com/tr/tags/mukavemet) | `tr` | 177 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 12 | [/tr/tags/kaplama](https://torqyx.com/tr/tags/kaplama) | `tr` | 178 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 13 | [/tr/tags/cekme-testi](https://torqyx.com/tr/tags/cekme-testi) | `tr` | 180 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 14 | [/tr/categories/elektrik](https://torqyx.com/tr/categories/elektrik) | `tr` | 181 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 15 | [/tr/tags/elektrik](https://torqyx.com/tr/tags/elektrik) | `tr` | 181 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 16 | [/tr/tags/viskozite](https://torqyx.com/tr/tags/viskozite) | `tr` | 183 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 17 | [/tr/tags/imalat](https://torqyx.com/tr/tags/imalat) | `tr` | 184 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 18 | [/tr/tags/tolerans](https://torqyx.com/tr/tags/tolerans) | `tr` | 184 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 19 | [/tr/tags/kalite](https://torqyx.com/tr/tags/kalite) | `tr` | 185 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 20 | [/tr/tags/kavitasyon](https://torqyx.com/tr/tags/kavitasyon) | `tr` | 187 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 21 | [/tr/tags/korozyon](https://torqyx.com/tr/tags/korozyon) | `tr` | 187 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 22 | [/tr/tags/npsh](https://torqyx.com/tr/tags/npsh) | `tr` | 187 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 23 | [/en/tags/flow](https://torqyx.com/en/tags/flow) | `en` | 189 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 24 | [/tr/tags/yorulma](https://torqyx.com/tr/tags/yorulma) | `tr` | 190 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 25 | [/tr/tags/darcy-weisbach](https://torqyx.com/tr/tags/darcy-weisbach) | `tr` | 191 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 26 | [/tr/tags/yaglama](https://torqyx.com/tr/tags/yaglama) | `tr` | 196 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 27 | [/en/tools/gear-design/calculators/force-torque-calculator](https://torqyx.com/en/tools/gear-design/calculators/force-torque-calculator) | `en` | 198 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 28 | [/tr/tags/talasli-imalat](https://torqyx.com/tr/tags/talasli-imalat) | `tr` | 201 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 29 | [/tr/tags/rulman-secimi](https://torqyx.com/tr/tags/rulman-secimi) | `tr` | 206 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 30 | [/tr/tags/muhendislik-yontemleri](https://torqyx.com/tr/tags/muhendislik-yontemleri) | `tr` | 207 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 31 | [/tr/categories/muhendislik-yontemleri](https://torqyx.com/tr/categories/muhendislik-yontemleri) | `tr` | 208 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 32 | [/tr/tags/basinc-kaybi](https://torqyx.com/tr/tags/basinc-kaybi) | `tr` | 214 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 33 | [/en/tags/pressure](https://torqyx.com/en/tags/pressure) | `en` | 216 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 34 | [/tr/glossary/factor-of-safety](https://torqyx.com/tr/glossary/factor-of-safety) | `tr` | 219 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 35 | [/tr/tags/datum](https://torqyx.com/tr/tags/datum) | `tr` | 219 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 36 | [/en/tools/material-cards](https://torqyx.com/en/tools/material-cards) | `en` | 226 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 37 | [/en/tags/mechanical-design](https://torqyx.com/en/tags/mechanical-design) | `en` | 227 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 38 | [/en/tools/gear-design/calculators/helix-axial-calculator](https://torqyx.com/en/tools/gear-design/calculators/helix-axial-calculator) | `en` | 227 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 39 | [/en/tags/bolted-joint](https://torqyx.com/en/tags/bolted-joint) | `en` | 229 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 40 | [/en/tags/iso-286](https://torqyx.com/en/tags/iso-286) | `en` | 229 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 41 | [/tr/glossary/coefficient-of-friction](https://torqyx.com/tr/glossary/coefficient-of-friction) | `tr` | 231 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 42 | [/tr/glossary/fatigue](https://torqyx.com/tr/glossary/fatigue) | `tr` | 231 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 43 | [/en/tags/mechanical-engineering](https://torqyx.com/en/tags/mechanical-engineering) | `en` | 232 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 44 | [/tr/tags/baglanti-elemanlari](https://torqyx.com/tr/tags/baglanti-elemanlari) | `tr` | 238 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 45 | [/tr/glossary/reynolds-number](https://torqyx.com/tr/glossary/reynolds-number) | `tr` | 239 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 46 | [/en/tools/gear-design/calculators/weight-optimization](https://torqyx.com/en/tools/gear-design/calculators/weight-optimization) | `en` | 240 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 47 | [/tr/glossary/bending-moment](https://torqyx.com/tr/glossary/bending-moment) | `tr` | 242 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 48 | [/tr/glossary/hydraulic-diameter](https://torqyx.com/tr/glossary/hydraulic-diameter) | `tr` | 242 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 49 | [/tr/glossary/head-loss](https://torqyx.com/tr/glossary/head-loss) | `tr` | 242 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 50 | [/tr/glossary/strain](https://torqyx.com/tr/glossary/strain) | `tr` | 243 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 51 | [/en/tools/gear-design/calculators/viscosity-selector](https://torqyx.com/en/tools/gear-design/calculators/viscosity-selector) | `en` | 246 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 52 | [/tr/cerez-politikasi](https://torqyx.com/tr/cerez-politikasi) | `tr` | 246 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 53 | [/en/tags/bearing-selection](https://torqyx.com/en/tags/bearing-selection) | `en` | 247 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 54 | [/en/categories/engineering-methods](https://torqyx.com/en/categories/engineering-methods) | `en` | 248 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 55 | [/tr/glossary/density](https://torqyx.com/tr/glossary/density) | `tr` | 252 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 56 | [/tr/glossary/shear-stress](https://torqyx.com/tr/glossary/shear-stress) | `tr` | 252 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 57 | [/en/tags/engineering](https://torqyx.com/en/tags/engineering) | `en` | 254 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 58 | [/tr/tags/standartlar](https://torqyx.com/tr/tags/standartlar) | `tr` | 254 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 59 | [/tr/glossary/torque](https://torqyx.com/tr/glossary/torque) | `tr` | 255 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 60 | [/tr/tags/tork-ve-aktarma](https://torqyx.com/tr/tags/tork-ve-aktarma) | `tr` | 257 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 61 | [/en/tools/gear-design/calculators/contact-ratio-calculator](https://torqyx.com/en/tools/gear-design/calculators/contact-ratio-calculator) | `en` | 258 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 62 | [/tr/categories/tork-ve-aktarma](https://torqyx.com/tr/categories/tork-ve-aktarma) | `tr` | 259 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 63 | [/tr/glossary/welding](https://torqyx.com/tr/glossary/welding) | `tr` | 260 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 64 | [/tr/categories/general-engineering](https://torqyx.com/tr/categories/general-engineering) | `tr` | 270 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 65 | [/tr/glossary/buckling](https://torqyx.com/tr/glossary/buckling) | `tr` | 272 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 66 | [/en/tools/gear-design/calculators/module-calculator](https://torqyx.com/en/tools/gear-design/calculators/module-calculator) | `en` | 276 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 67 | [/en/tags/torque](https://torqyx.com/en/tags/torque) | `en` | 279 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 68 | [/en/cookies](https://torqyx.com/en/cookies) | `en` | 281 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 69 | [/en/categories/bolts](https://torqyx.com/en/categories/bolts) | `en` | 282 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 70 | [/en/tags/engineering-calculation](https://torqyx.com/en/tags/engineering-calculation) | `en` | 282 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 71 | [/en/categories/general-engineering](https://torqyx.com/en/categories/general-engineering) | `en` | 284 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 72 | [/en/tags/vdi-2230](https://torqyx.com/en/tags/vdi-2230) | `en` | 287 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 73 | [/tr/glossary/thermal-conductivity](https://torqyx.com/tr/glossary/thermal-conductivity) | `tr` | 287 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 74 | [/tr/glossary/parallelism](https://torqyx.com/tr/glossary/parallelism) | `tr` | 289 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 75 | [/tr/glossary/runout](https://torqyx.com/tr/glossary/runout) | `tr` | 289 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 76 | [/tr/glossary/ductility](https://torqyx.com/tr/glossary/ductility) | `tr` | 290 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 77 | [/en/tools/bolt-database](https://torqyx.com/en/tools/bolt-database) | `en` | 291 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 78 | [/tr/glossary/iso](https://torqyx.com/tr/glossary/iso) | `tr` | 291 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 79 | [/tr/glossary/turbulent-flow](https://torqyx.com/tr/glossary/turbulent-flow) | `tr` | 293 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 80 | [/tr/glossary/power-factor](https://torqyx.com/tr/glossary/power-factor) | `tr` | 294 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 81 | [/en/tools/gear-design/calculators/backlash-calculator](https://torqyx.com/en/tools/gear-design/calculators/backlash-calculator) | `en` | 295 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 82 | [/tr/glossary/interference](https://torqyx.com/tr/glossary/interference) | `tr` | 296 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 83 | [/tr/glossary/stress](https://torqyx.com/tr/glossary/stress) | `tr` | 296 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 84 | [/en/tags/iso-281](https://torqyx.com/en/tags/iso-281) | `en` | 297 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 85 | [/en/tags/mechanical-calculation](https://torqyx.com/en/tags/mechanical-calculation) | `en` | 298 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |
| 86 | [/tr/glossary/laminar-flow](https://torqyx.com/tr/glossary/laminar-flow) | `tr` | 298 | Zenginleştirilmeli veya taksonomi index kurallarına göre değerlendirilmeli |

## 3. Hâlâ İndekslenebilir Olan En Zayıf 30 Sayfa

Aşağıdaki tablo, sitede `noindex` olmayan (yani arama motorlarına açık olan) en düşük kelime hacmine sahip 30 sayfayı göstermektedir:

| # | URL | Dil | Kelime | Jenerik Şablon? | Dil Sızıntısı? | İç Link | Durum Notu |
|---|---|---|---|---|---|---|---|
| 1 | [/en/glossary/backlash](https://torqyx.com/en/glossary/backlash) | `en` | **113** | Hayır | Hayır | 48 | İndekslenebilir |
| 2 | [/tr/changelog](https://torqyx.com/tr/changelog) | `tr` | **113** | Hayır | Hayır | 40 | İndekslenebilir |
| 3 | [/tr/tags/flow](https://torqyx.com/tr/tags/flow) | `tr` | **118** | Hayır | Hayır | 44 | İndekslenebilir |
| 4 | [/tr/tags/torque](https://torqyx.com/tr/tags/torque) | `tr` | **140** | Hayır | Hayır | 44 | İndekslenebilir |
| 5 | [/tr/iletisim](https://torqyx.com/tr/iletisim) | `tr` | **147** | Hayır | Hayır | 39 | İndekslenebilir |
| 6 | [/tr/tags/icerik](https://torqyx.com/tr/tags/icerik) | `tr` | **147** | Hayır | Hayır | 63 | İndekslenebilir |
| 7 | [/tr/tags/pressure](https://torqyx.com/tr/tags/pressure) | `tr` | **148** | Hayır | Hayır | 46 | İndekslenebilir |
| 8 | [/en/contact](https://torqyx.com/en/contact) | `en` | **154** | Hayır | Hayır | 39 | İndekslenebilir |
| 9 | [/tr/tags/reynolds](https://torqyx.com/tr/tags/reynolds) | `tr` | **172** | Hayır | Hayır | 66 | İndekslenebilir |
| 10 | [/tr/tags/engineering](https://torqyx.com/tr/tags/engineering) | `tr` | **175** | Hayır | Hayır | 49 | İndekslenebilir |
| 11 | [/tr/tags/mukavemet](https://torqyx.com/tr/tags/mukavemet) | `tr` | **177** | Hayır | Hayır | 68 | İndekslenebilir |
| 12 | [/tr/tags/kaplama](https://torqyx.com/tr/tags/kaplama) | `tr` | **178** | Hayır | Hayır | 69 | İndekslenebilir |
| 13 | [/tr/tags/cekme-testi](https://torqyx.com/tr/tags/cekme-testi) | `tr` | **180** | Hayır | Hayır | 68 | İndekslenebilir |
| 14 | [/tr/categories/elektrik](https://torqyx.com/tr/categories/elektrik) | `tr` | **181** | Hayır | Hayır | 69 | İndekslenebilir |
| 15 | [/tr/tags/elektrik](https://torqyx.com/tr/tags/elektrik) | `tr` | **181** | Hayır | Hayır | 68 | İndekslenebilir |
| 16 | [/tr/tags/viskozite](https://torqyx.com/tr/tags/viskozite) | `tr` | **183** | Hayır | Hayır | 69 | İndekslenebilir |
| 17 | [/tr/tags/imalat](https://torqyx.com/tr/tags/imalat) | `tr` | **184** | Hayır | Hayır | 69 | İndekslenebilir |
| 18 | [/tr/tags/tolerans](https://torqyx.com/tr/tags/tolerans) | `tr` | **184** | Hayır | Hayır | 69 | İndekslenebilir |
| 19 | [/tr/tags/kalite](https://torqyx.com/tr/tags/kalite) | `tr` | **185** | Hayır | Hayır | 69 | İndekslenebilir |
| 20 | [/tr/tags/kavitasyon](https://torqyx.com/tr/tags/kavitasyon) | `tr` | **187** | Hayır | Hayır | 69 | İndekslenebilir |
| 21 | [/tr/tags/korozyon](https://torqyx.com/tr/tags/korozyon) | `tr` | **187** | Hayır | Hayır | 69 | İndekslenebilir |
| 22 | [/tr/tags/npsh](https://torqyx.com/tr/tags/npsh) | `tr` | **187** | Hayır | Hayır | 69 | İndekslenebilir |
| 23 | [/en/tags/flow](https://torqyx.com/en/tags/flow) | `en` | **189** | ⚠️ Evet (`is a core engineering term`) | Hayır | 60 | İndekslenebilir |
| 24 | [/tr/tags/yorulma](https://torqyx.com/tr/tags/yorulma) | `tr` | **190** | Hayır | Hayır | 69 | İndekslenebilir |
| 25 | [/tr/tags/darcy-weisbach](https://torqyx.com/tr/tags/darcy-weisbach) | `tr` | **191** | Hayır | Hayır | 68 | İndekslenebilir |
| 26 | [/tr/tags/yaglama](https://torqyx.com/tr/tags/yaglama) | `tr` | **196** | Hayır | Hayır | 69 | İndekslenebilir |
| 27 | [/en/tools/gear-design/calculators/force-torque-calculator](https://torqyx.com/en/tools/gear-design/calculators/force-torque-calculator) | `en` | **198** | Hayır | Hayır | 45 | İndekslenebilir |
| 28 | [/tr/tags/talasli-imalat](https://torqyx.com/tr/tags/talasli-imalat) | `tr` | **201** | Hayır | Hayır | 69 | İndekslenebilir |
| 29 | [/tr/tags/rulman-secimi](https://torqyx.com/tr/tags/rulman-secimi) | `tr` | **206** | Hayır | Hayır | 63 | İndekslenebilir |
| 30 | [/tr/tags/muhendislik-yontemleri](https://torqyx.com/tr/tags/muhendislik-yontemleri) | `tr` | **207** | Hayır | Hayır | 62 | İndekslenebilir |

## 4. Dil Sızıntısı (Language Leak) Analizi

* **Tespit Edilen Toplam Sayfa:** 9 (v1'de 19 idi)

| # | URL | Dil | Tespit Edilen Sızıntı Nedeni |
|---|---|---|---|
| 1 | [/en/tools/gear-design/simulations](https://torqyx.com/en/tools/gear-design/simulations) | `en` | Turkish characters found: ş, ı, ı, ş, ı |
| 2 | [/en/tools/pipe-pressure-loss/guide](https://torqyx.com/en/tools/pipe-pressure-loss/guide) | `en` | Turkish characters found: ı, ç, ı, ı, ı |
| 3 | [/en/tools/bolt-calculator/guide](https://torqyx.com/en/tools/bolt-calculator/guide) | `en` | Turkish characters found: ı, ı, ı, ı, ı |
| 4 | [/en/tools/param-chart](https://torqyx.com/en/tools/param-chart) | `en` | Turkish characters found: ş, ğ, ş, ş, ğ |
| 5 | [/en/guides/tolerans-zinciri-analizi-kotu-durum-ve-rss](https://torqyx.com/en/guides/tolerans-zinciri-analizi-kotu-durum-ve-rss) | `en` | Turkish characters found: Ç, Ç |
| 6 | [/en/tools/torque-power](https://torqyx.com/en/tools/torque-power) | `en` | Turkish characters found: ç, ş, ç, ı, ı |
| 7 | [/en/tools/fillet-weld](https://torqyx.com/en/tools/fillet-weld) | `en` | Turkish characters found: ş, ı, İ, ç, ğ |
| 8 | [/en/tools/pipe-pressure-loss](https://torqyx.com/en/tools/pipe-pressure-loss) | `en` | Turkish characters found: ı, ı, ş, ı, ç |
| 9 | [/en/tools/bolt-calculator](https://torqyx.com/en/tools/bolt-calculator) | `en` | Turkish characters found: ç, ş, ı, ı, ı |

## 5. Uygulanan Değişikliklerin Özeti (Commit Özeti)

1. **Commit 1 (`606bef7`):** `/project-hub` ve tüm alt sayfaları (`/devreye-alma`, `/part-tracking`, `/project-tools`, `/rfq`) ile `/community` sayfaları `INDEXING_CONFIG` bayrağıyla `noindex, follow` yapıldı; sitemap'ten tamamen çıkarıldı.
2. **Commit 2 (`b97288e`):** Header (`config/nav.ts`) ve referans menüsü sadeleştirildi; sadece Sözlük (`glossary`) ve Hızlı Referans (`reference`) bırakıldı. Kalite Araçları ve Standartlar menüden kaldırıldı.
3. **Commit 3 (`ee6e47d`):** Footer'daki Metodoloji ve Sorumluluk Reddi çapa linkleri (`#methodology`, `#disclaimer`) gerçek, bağımsız sayfalara dönüştürüldü: TR (`/tr/metodoloji`, `/tr/sorumluluk-reddi`) ve EN (`/en/methodology`, `/en/disclaimer`). Her sayfa 400+ kelime zengin mühendislik içeriğiyle donatıldı (Vitest 412+ test sayısı, E-E-A-T editör kurulu, standart kaynakları).
4. **Commit 4 (`683d48f`):** "Satış, İade ve Teslimat" sayfası gerçek ücretli ürün yayına girene kadar footer'dan gizlendi, `noindex` yapıldı ve sitemap'ten kaldırıldı.

