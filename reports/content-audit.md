# TORQYX Content & SEO Audit Report: En Zayıf 30 Sayfa İncelemesi

> **Denetim Tarihi:** 2026-11-07  
> **Kapsam:** Tüm indekslenebilir rotalar (Araçlar, Rehberler, Blog, Sözlük, Referans, Standartlar, Quality Tools, Fixture Tools, Project Hub) — Türkçe (`tr`) ve İngilizce (`en`)  
> **Toplam Taranan ve Denetlenen URL Sayısı:** 447  
> **CSV Raporu:** [`reports/content-audit.csv`](./content-audit.csv)

## 1. Yönetici Özeti & Genel Kalite Dağılımı

| Metrik | Değer | Durum |
|---|---|---|
| **Toplam İndekslenebilir Rota (200 OK)** | 447 | Aktif |
| **HTTP 500 Hata Veren Sayfalar** | 4 | 🚨 Müdahale Gerekli |
| **1.000+ Kelime Derinliğe Sahip Sayfalar (E-E-A-T)** | 70 | ✅ Mükemmel |
| **Kritik İnce İçerik (< 300 Kelime)** | 113 | ⚠️ AdSense Düşük Değer Riski |
| **Geliştirilmesi Gereken İçerik (300 - 600 Kelime)** | 97 | 🟡 İyileştirilmeli |
| **Jenerik Şablon / Kalıp Cümle İçeren Sayfalar** | 58 | ⚠️ İncelenmeli |
| **Dil Sızıntısı (Language Leak) Tespit Edilen Sayfalar** | 19 | 🔍 Düzeltilmeli |

## 2. En Zayıf 30 Sayfanın Detaylı Analiz Tablosu

Aşağıdaki liste; Google AdSense "Düşük Değerli İçerik" filtresine takılma riski en yüksek olan veya teknik hata veren 30 sayfayı kelime sayısı, şablon kullanımı ve dil sızıntısına göre sıralamaktadır:

| # | URL | Dil | Durum | Kelime | Jenerik Şablon? | Dil Sızıntısı? | İç Link | Tespit / Sorun |
|---|---|---|---|---|---|---|---|---|
| 1 | [/tr/tools/bolt-database](https://torqyx.com/tr/tools/bolt-database) | `tr` | 🔴 500 Hata | **0** | Hayır | Hayır | 0 | Sunucu 500 hatası veriyor, botlar sayfayı göremiyor |
| 2 | [/tr/tools/heat-energy](https://torqyx.com/tr/tools/heat-energy) | `tr` | 🔴 500 Hata | **0** | Hayır | Hayır | 0 | Sunucu 500 hatası veriyor, botlar sayfayı göremiyor |
| 3 | [/tr/tools/machine-elements](https://torqyx.com/tr/tools/machine-elements) | `tr` | 🔴 500 Hata | **0** | Hayır | Hayır | 0 | Sunucu 500 hatası veriyor, botlar sayfayı göremiyor |
| 4 | [/tr/tools/strength-statics](https://torqyx.com/tr/tools/strength-statics) | `tr` | 🔴 500 Hata | **0** | Hayır | Hayır | 0 | Sunucu 500 hatası veriyor, botlar sayfayı göremiyor |
| 5 | [/tr/materials](https://torqyx.com/tr/materials) | `tr` | ⚠️ <300 Kelime | **16** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 6 | [/en/materials](https://torqyx.com/en/materials) | `en` | ⚠️ <300 Kelime | **18** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 7 | [/tr/project-hub/part-tracking](https://torqyx.com/tr/project-hub/part-tracking) | `tr` | ⚠️ <300 Kelime | **71** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 8 | [/tr/project-hub/project-tools](https://torqyx.com/tr/project-hub/project-tools) | `tr` | ⚠️ <300 Kelime | **73** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 9 | [/en/fixture-tools](https://torqyx.com/en/fixture-tools) | `en` | ⚠️ <300 Kelime | **74** | Hayır | Hayır | 46 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 10 | [/en/project-hub/part-tracking](https://torqyx.com/en/project-hub/part-tracking) | `en` | ⚠️ <300 Kelime | **76** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 11 | [/en/standards](https://torqyx.com/en/standards) | `en` | ⚠️ <300 Kelime | **78** | Hayır | Hayır | 47 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 12 | [/tr/fixture-tools](https://torqyx.com/tr/fixture-tools) | `tr` | ⚠️ <300 Kelime | **78** | Hayır | Hayır | 46 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 13 | [/en/project-hub/project-tools](https://torqyx.com/en/project-hub/project-tools) | `en` | ⚠️ <300 Kelime | **80** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 14 | [/tr/standards](https://torqyx.com/tr/standards) | `tr` | ⚠️ <300 Kelime | **80** | Hayır | Hayır | 47 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 15 | [/tr/project-hub/rfq](https://torqyx.com/tr/project-hub/rfq) | `tr` | ⚠️ <300 Kelime | **81** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 16 | [/tr/quality-tools/5n1k](https://torqyx.com/tr/quality-tools/5n1k) | `tr` | ⚠️ <300 Kelime | **85** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 17 | [/en/project-hub/rfq](https://torqyx.com/en/project-hub/rfq) | `en` | ⚠️ <300 Kelime | **87** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 18 | [/en/quality-tools/5n1k](https://torqyx.com/en/quality-tools/5n1k) | `en` | ⚠️ <300 Kelime | **87** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 19 | [/en/project-hub](https://torqyx.com/en/project-hub) | `en` | ⚠️ <300 Kelime | **90** | Hayır | Hayır | 47 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 20 | [/tr/project-hub](https://torqyx.com/tr/project-hub) | `tr` | ⚠️ <300 Kelime | **95** | Hayır | Hayır | 47 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 21 | [/tr/support](https://torqyx.com/tr/support) | `tr` | ⚠️ <300 Kelime | **101** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 22 | [/en/support](https://torqyx.com/en/support) | `en` | ⚠️ <300 Kelime | **109** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 23 | [/en/glossary/backlash](https://torqyx.com/en/glossary/backlash) | `en` | ⚠️ <300 Kelime | **113** | Hayır | Hayır | 52 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 24 | [/tr/changelog](https://torqyx.com/tr/changelog) | `tr` | ⚠️ <300 Kelime | **113** | Hayır | Hayır | 44 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 25 | [/tr/tags/flow](https://torqyx.com/tr/tags/flow) | `tr` | ⚠️ <300 Kelime | **118** | Hayır | Hayır | 48 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 26 | [/en/quality-tools/kaizen](https://torqyx.com/en/quality-tools/kaizen) | `en` | ⚠️ <300 Kelime | **134** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 27 | [/tr/quality-tools/kaizen](https://torqyx.com/tr/quality-tools/kaizen) | `tr` | ⚠️ <300 Kelime | **140** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 28 | [/tr/tags/torque](https://torqyx.com/tr/tags/torque) | `tr` | ⚠️ <300 Kelime | **140** | Hayır | Hayır | 48 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 29 | [/en/quality-tools](https://torqyx.com/en/quality-tools) | `en` | ⚠️ <300 Kelime | **141** | Hayır | Hayır | 48 | Aşırı ince içerik (Thin content), sadece UI butonları var |
| 30 | [/tr/iletisim](https://torqyx.com/tr/iletisim) | `tr` | ⚠️ <300 Kelime | **147** | Hayır | Hayır | 43 | Aşırı ince içerik (Thin content), sadece UI butonları var |

## 3. Generic Şablon / Kalıp Cümle Analizi (Doğrulama Bulguları)

1. **"is a core engineering term"**: Toplam 58 sayfada tespit edildi (Örn: `/en/glossary/*` sayfaları). Bu sayfaların üst kısmında otomatik şablon cümlesi yer almaktadır.
2. **"performs the core engineering calculation"**: Canlı sitede 0 sayfada tespit edildi. Kod tabanında fallback olarak bulunmasına rağmen, `ToolDocTabs.tsx` bileşeni `isSpecific: false` olduğunda dokümantasyon kartını DOM'a basmadığı için HTML'e yansımamaktadır.
3. **"Unit-consistent project values"**: 0 sayfada tespit edildi. Daha önceki refactor commit'inde silinmiştir.
4. **"Documentation coming soon"**: 0 sayfada tespit edildi. `messages/en.json` içinde daha önce temizlenmiştir.
5. **"Premium is in private beta"**: 0 sayfada tespit edildi. Önceki AdSense temizliğinde kaldırılmıştır.

