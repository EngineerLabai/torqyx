# Sitede Görsel Kullanım Raporu & İhtiyaç Listesi

## 🔴 SORUNLU ALANLAR

### 1. **Proje Merkezi (Project Hub) - Modül Kartları**
**Dosya:** `app/[locale]/project-hub/page.tsx`
**Sorun:** Tüm 4 modül kartının hepsi aynı görseli kullanıyor
**Şu Anki Durum:** `getHeroImageSrc("projectHub")` → `/images/Endüstriyel Tesis.webp`

**İhtiyaç Duyulan Görseller (4 adet farklı):**
- [ ] `devreye-alma` modülü için özel görsel → `/images/commissioning-hero.webp` (Veya başka isim)
- [ ] `project-tools` modülü için özel görsel → `/images/project-tracking-hero.webp`
- [ ] `rfq` modülü için özel görsel → `/images/rfq-hero.webp`
- [ ] `part-tracking` modülü için özel görsel → `/images/part-tracking-hero.webp`

---

### 2. **Converter/Calculator Bileşenleri - Açıklama Görüntüsü**
**Dosya:** `app/(tools)/tools/gear-design/calculators/Client.tsx` (ve benzerleri)
**Sorun:** Arka plan olarak sadece `/images/blueprint-assembly.jpg` kullanılıyor, diğer converter'larda aynı blueprint
**Durum:** `Image src="/images/blueprint-assembly.jpg"` (opacity-20, arka plan olarak)

**İhtiyaç Duyulan Görseller:**
- [ ] Birim Dönüştürücü (unit-converter) → `/images/converter-blueprint.webp`
- [ ] Cıvata Hesaplayıcısı (bolt-calculator) → `/images/bolt-assembly.webp`
- [ ] Mil Burulma (shaft-torsion) → `/images/shaft-torsion-diagram.webp`
- [ ] Boru Basınç Kaybı (pipe-pressure-loss) → `/images/piping-schematic.webp` (Şu anki: `/images/blueprint-hydraulic.jpg`)
- [ ] Hidrolik Silindir (hydraulic-cylinder) → `/images/hydraulic-circuit.webp`
- [ ] Köşe Kaynak (fillet-weld) → `/images/weld-diagram.webp`
- [ ] Dişli Tasarım (gear-design) → `/images/gear-assembly.webp` (Şu anki: `/images/blueprint-assembly.jpg`)
- [ ] Rulman Ömrü (bearing-life) → `/images/bearing-section.webp`

---

### 3. **Hızlı Referans (Reference Center) - Blueprint Görselleri**
**Dosya:** `components/reference/ReferenceCenter.tsx` (lines ~430)
**Sorun:** İki blueprint görseli var ama bunlar tekrar başka yerlerde kullanılıyor

**Şu Anki Görseller:**
```javascript
{ title: "Rulman Blueprint", image: "/images/Rulman Blueprint.webp" }
{ title: "Hidrolik Silindir Blueprint", image: "/images/Hidrolik Silindir Blueprint.webp" }
```

**İhtiyaç Duyulan Görseller:**
- [ ] Daha fazla makine bileşeni blueprint'i ekleyin:
  - `/images/shaft-blueprint.webp` - Mil blueprint
  - `/images/bearing-cross-section.webp` - Rulman kesiti (veya mevcut devam etsin)
  - `/images/weld-joint-diagram.webp` - Kaynak detayı
  - `/images/threaded-connection.webp` - Civata bağlantısı
  - `/images/gear-tooth-profile.webp` - Dişli profili

---

### 4. **SSS (FAQ) Sayfası**
**Dosya:** `app/faq/page.tsx`
**Sorun:** `getHeroImageSrc("support")` kullanıyor → `/images/support-hero.webp` (Destek sayfasıyla aynı)
**İhtiyaç:** SSS sayfasına özel görsel
- [ ] `/images/faq-hero.webp` - SSS sayfasına özel hero görsel

---

### 5. **İletişim Sayfası**
**Dosya:** `app/iletisim/page.tsx` + `app/iletisim/page.tsx.h1bak`
**Sorun:** `getHeroImageSrc("support")` kullanıyor → `/images/support-hero.webp` (Destek ve FAQ sayfasıyla aynı)
**İhtiyaç:** İletişim sayfasına özel görsel
- [ ] `/images/contact-hero.webp` - İletişim sayfasına özel hero görsel

---

### 6. **Gizlilik Politikası Sayfası**
**Dosya:** `app/gizlilik/page.tsx`
**Durum:** `HERO_PLACEHOLDER` kullanıyor → `/images/placeholder.webp`
**İhtiyaç:** Gizlilik politikasına özel görsel
- [ ] `/images/privacy-hero.webp` - Gizlilik politikasına özel hero görsel

---

## 📋 ÖZETLEŞTİRİLMİŞ İHTİYAÇ LİSTESİ

### **Kategoriye Göre Eksik/Değiştirilmesi Gereken Görseller:**

#### **A. Hero Images (Sayfanın başında büyük görsel)**
1. ✅ Support-FAQ (aynı olabilir) → `/images/support-hero.webp`
2. ❌ **FAQ'ya özel** → `/images/faq-hero.webp`
3. ❌ **İletişim'e özel** → `/images/contact-hero.webp`
4. ❌ **Gizlilik'e özel** → `/images/privacy-hero.webp`

#### **B. Proje Hub Modül Kartları (4 modül = 4 farklı görsel)**
1. ❌ Devreye Alma (Commissioning) → `/images/commissioning-hero.webp`
2. ❌ Proje & Kaizen Takip → `/images/project-tracking-hero.webp`
3. ❌ RFQ/Teknik Şartname → `/images/rfq-hero.webp`
4. ❌ Parça/Revizyon Takip → `/images/part-tracking-hero.webp`

#### **C. Calculator/Converter Arka Plan Görselleri (8 adet)**
1. ❌ Birim Dönüştürücü → `/images/converter-blueprint.webp`
2. ❌ Cıvata Hesaplayıcısı → `/images/bolt-assembly.webp`
3. ✅ Mil Burulma → `/images/shaft-torsion-diagram.webp`
4. ✅ Boru Basınç Kaybı → `/images/piping-schematic.webp` (şu anki: `blueprint-hydraulic.jpg`)
5. ❌ Hidrolik Silindir → `/images/hydraulic-circuit.webp`
6. ❌ Köşe Kaynak → `/images/weld-diagram.webp`
7. ✅ Dişli Tasarım → `/images/gear-assembly.webp` (şu anki: `blueprint-assembly.jpg`)
8. ❌ Rulman Ömrü → `/images/bearing-section.webp`

#### **D. Reference Center Blueprint'leri**
- ✅ Rulman Blueprint → `/images/Rulman Blueprint.webp` (Mevcut)
- ✅ Hidrolik Silindir → `/images/Hidrolik Silindir Blueprint.webp` (Mevcut)
- ❌ Mil Blueprint → `/images/shaft-blueprint.webp`
- ❌ Kaynak Detayı → `/images/weld-joint-diagram.webp`
- ❌ Civata Bağlantısı → `/images/threaded-connection.webp`
- ❌ Dişli Profili → `/images/gear-tooth-profile.webp`

---

## 📁 Toplam İhtiyaç Duyulan Görseller

| Kategori | Adet | URL Şablonu |
|----------|------|-----------|
| Hero Images (Sayfalar) | 3 | `/images/{faq,contact,privacy}-hero.webp` |
| Proje Hub Modülleri | 4 | `/images/{commissioning,project-tracking,rfq,part-tracking}-hero.webp` |
| Calculator Arka Planları | 8 | `/images/{converter,bolt,shaft-torsion,piping,hydraulic,weld,gear,bearing}-{blueprint/diagram/schematic}.webp` |
| Reference Blueprints | 4+ | `/images/{shaft,weld,threaded,gear-tooth}-{blueprint/diagram/profile}.webp` |
| **TOPLAM** | **19+** | Farklı görseller gerekli |

---

## 🎯 ÖNERİLER

### **Kısa Vadede (Acil)**
1. SSS, İletişim ve Gizlilik sayfalarına **özel hero görseller** ekleyin
2. Proje Hub'daki 4 modülün **her biri için farklı görsel** tanımlayın

### **Orta Vadede**
1. Converter/calculator'lar için **kontekste uygun arka plan görselleri** hazırlayın
2. Reference Center'a **daha fazla makine bileşeni blueprint**'i ekleyin

### **Görsel Hazırlama Tavsiyeleri**
- **Hero images**: 1200x600 px, `.webp` format
- **Blueprint/Diagram**: 600x400 px, `.jpg` veya `.webp`, % 20-30 opacity ile arka plan olarak kullanılacak
- **Tüm görseller**: SEO için `alt` text ve açıklayıcı isim olmalı

---

## 📍 İlgili Kod Dosyaları

- `lib/assets.ts` - Hero asset tanımları
- `app/faq/page.tsx` - SSS sayfası
- `app/iletisim/page.tsx` - İletişim sayfası
- `app/gizlilik/page.tsx` - Gizlilik sayfası
- `app/[locale]/project-hub/page.tsx` - Proje hub modülleri
- `app/(tools)/tools/*/calculators/Client.tsx` - Converter arka planları
- `components/reference/ReferenceCenter.tsx` - Reference blueprintleri
- `sections/home/PopularToolsSection.tsx` - Anasayfa tool kartları
