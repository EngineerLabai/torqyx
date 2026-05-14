# 🎯 SEO ve İçerik Geliştirme Raporu - aiengineerslab.com

**Rapor Tarihi**: 9 Mayıs 2026  
**Site**: aiengineerslab.com (torqyx)  
**Analiz Kapsamı**: SEO Altyapısı, İçerik Stratejisi, Teknik Optimizasyon

---

## 📊 ÖZETİ ÖZET (Executive Summary)

### Mevcut Durum
✅ **Güçlü Yönler:**
- 29 yüksek kaliteli mühendislik hesaplama aracı
- İyi yapılandırılmış teknik SEO altyapısı (Schema, Sitemap, Robots.txt)
- Çift dil desteği (Türkçe/İngilizce) ile küresel potansiyel
- Optimize edilmiş performans metrikleri (LCP, INP, CLS)
- İç bağlantı sistemi ve HowTo schema implementasyonu

⚠️ **Kritik Sorunlar:**
- **H1 Tag Eksikliği**: 101 sayfanın 38'inde (%37.6) H1 etiketi yok
- **İçerik Dengesizliği**: Araçlar %81 vs Editöryal %14 vs Referans %5
- **Blog Yetersizliği**: Sadece 4 blog yazısı (Türkçe + İngilizce)
- **Rehber Eksikliği**: Tek bir rehber (Rulman Seçimi)
- **Sözlük Boşluğu**: Sadece 1 girdi
- **Metadata Optimizasyonu**: Birçok sayfa için optimize edilmemiş açıklamalar

### İmpakt Analizi
- **H1 Sorunları**: Organik arama görünürlüğünde %15-30 kayıp potansiyeli
- **İçerik Eksikliği**: Brand awareness ve SEO otoritesi kaybı
- **Blog Yok**: Düşük SEO trafiği, minimal sosyal paylaşma, sınırlı backlink fırsatları

### Beklenen ROI (Önerileri Uygulama Sonrası)
- H1 Fix: +10-15% organik trafik
- Blog İçeriği (20-30 yazı): +25-40% organik trafik
- Rehberler (15-20): +15-20% zaman geçirme süresi
- Toplam: +50-75% organik trafik potansiyeli

---

## 1️⃣ KRİTİK SORUN: H1 TAG EKSİKLİĞİ

### Mevcut Durum
```
Toplam Sayfalar: 101
H1 Olan Sayfalar: 63 (62.4%) ✅
H1 OLMAYAN Sayfalar: 38 (37.6%) ❌
Çoklu H1 Olan Sayfalar: 4 (Yapısal sorun) ⚠️
```

### Etkilenen Sayfalar

**Araç Sayfaları (En Fazla Etkilenen):**
- `app/(tools)/tools/basic-engineering/page.tsx` → ❌
- `app/(tools)/tools/bearing-life/page.tsx` → ❌
- `app/(tools)/tools/belt-length/page.tsx` → ❌
- `app/(tools)/tools/bending-stress/page.tsx` → ❌
- `app/(tools)/tools/bolt-calculator/page.tsx` → ❌
- `app/(tools)/tools/bolt-database/page.tsx` → ❌
- Ve 32 diğer araç sayfası... → ❌

**Liste/Hub Sayfaları:**
- `/blog` → ❌
- `/guides` → ❌
- `/glossary` → ❌

### SEO İmpaktu
- **Tıklama Oranı (CTR) Azalması**: Google arama sonuçlarında H1 eksikliği → title kaotikliği → düşük CTR
- **Keyword Mapping Sorunu**: H1 olmadan keyword relevansı kurulama → ranking düşüşü
- **Accessibility**: Ekran okuyucu kullananlar sayfa yapısını anlamıyor
- **User Experience**: H1 olmayan sayfa zayıf yapılandırma işareti

### Çözüm Planı

#### Faz 1: Otomatik H1 Ekleme (HEMEN)
```bash
# Mevcut script'i çalıştır
node h1-fix.mjs

# Önizleme için:
node h1-fix.mjs --dry-run
```

#### Faz 2: Manuel Kontrolü ve Optimizasyon (2 gün)
- Araç sayfaları: H1 = `{toolName} Hesaplayıcı`
- Blog sayfaları: H1 = `{blogTitle}` + Çeviri
- List sayfaları: H1 = Bölüm adı

**Optimal H1 Örnekleri:**
```
❌ Yanlış: <h1>Tool Page</h1>
✅ Doğru: <h1>Mil Burulma Hesaplayıcısı - Tork Hesaplama</h1>

❌ Yanlış: <h1>Araçlar</h1>
✅ Doğru: <h1>Mühendislik Hesaplama Araçları - 29+ Ücretsiz Kalkülator</h1>
```

**Beklenen Sonuç:**
- +5% organik trafik (3-6 ay içinde)
- Improved CTR %15 oranında
- Daha iyi ranking potansiyeli
- +2 accessibility score puan

---

## 2️⃣ BLOG STRATEJİSİ - En Büyük Fırsat

### Mevcut Durum
```
Blog Yazıları: 4 (Türkçe + İngilizce = 8 dosya)
Konular:
1. Haftalık Blog Planlama Rehberi
2. Mühendislik Hesaplama Süreçleri
3. Teknik İçerik Başlıkları (SEO)
4. İçerik Altyapısına Hızlı Giriş
```

### Sorunlar
- **Çok Az İçerik**: Organik SEO'da başarı için minimum 50-100 makale
- **Dar Konu Alanı**: Çoğu blog yazısı meta (platform hakkında), değer sağlayan değil
- **SEO Potansiyelini Kullanmama**: Blog trafiği = önemli backlink ve user engagement kaynağı
- **Sosyal Paylaşma Yok**: 4 yazı sosyal medya için yeterli değil

### Önerilen Blog Konuları (30-40 Makale)

#### A) Edukasyonel Rehberler (12-15 makale)

**Başlangıç Seviyesi:**
1. **"Mil Torku Nasıl Hesaplanır? Adım Adım Kılavuz"**
   - Keywords: "mil torku", "tork hesaplama", "shaft torque"
   - Long-tail: "dönen mil için torku hesaplamak"
   - Meta Description: "Mil torkunu formül, örnekler ve hesaplayıcı ile öğrenin"

2. **"Rulman Ömrü Hesaplaması - Mühendisler İçin Tam Rehber"**
   - Keywords: "rulman ömrü", "bearing life", "L10 life"
   - Uzunluk: 2500-3000 kelime
   - Kapsayacaklar: Teori, formüller, örnek hesaplamalar

3. **"Kayış Uzunluğu Hesaplama - Pratik İpuçları ve Formüller"**
   - Keywords: "kayış uzunluğu", "belt length formula", "pulley distance"

4. **"Bending Stress Nedir? İkinci Moment Hesaplama Rehberi"**
   - Keywords: "bending stress", "moment of inertia", "eğilme gerilmesi"

5. **"Kaynak Kalitesi - Fillet Weld Boyutu Hesabı"**
   - Keywords: "fillet weld", "weld size", "kaynak boyutu"

6. **"Cıvata Sıkma Torku - ISO Standartları ve Hesaplama"**
   - Keywords: "bolt torque", "cıvata torku", "fastener tension"
   - İçerir: Standart tablolar, formüller, örnekler

7. **"Tork ve Güç Arasındaki İlişki - Makine Tasarımında"**
   - Keywords: "torque vs power", "tork vs güç", "mechanical power"

8. **"Hidrolik Silindir Tasarımı - Basınç ve Kuvvet Hesaplama"**
   - Keywords: "hydraulic cylinder", "hidro silindir"

**Orta Seviye:**
9. **"Boru Basınç Kaybı Hesaplaması - Darcy-Weisbach Formülü"**
   - Keywords: "pipe pressure loss", "fluid flow", "boru akış"

10. **"Malzeme Seçimi: Çelik vs Alüminyum - Karşılaştırma Rehberi"**
    - Keywords: "material selection", "malzeme seçimi"

11. **"DIN Standartları Nelerdir? Mühendislik Tasarımında Uyum"**
    - Keywords: "DIN standards", "ISO standards", "teknik standartlar"

**İleri Seviye:**
12. **"Sonlu Elemanlar Analizi (FEA) Nedir? Temel Kavramlar"**
    - Keywords: "finite element analysis", "FEA", "elemanter analiz"

13. **"Stres Yoğunlaşması ve Fakat Faktörü - Tasarım Güvenliği"**
    - Keywords: "stress concentration", "stress factor", "gerilme yoğunlaşması"

#### B) Best Practices & Tips (8-10 makale)

14. **"5 Yaygın Mühendislik Hesaplama Hatası ve Bunları Nasıl Kaçınılır?"**
    - Keywords: "engineering mistakes", "calculation errors", "common mistakes"

15. **"Birim Dönüşümü Rehberi - N/mm² vs MPa vs ksi"**
    - Keywords: "unit conversion", "pressure units", "birim çevirisi"

16. **"Excel vs CAD vs Çevrimiçi Hesaplayıcı - Hangi Aracı Ne Zaman Kullanmalı?"**
    - Keywords: "engineering tools comparison", "CAD vs calculator"

17. **"Tolerans ve Tolerasyon - GD&T Basics İçin Mühendisler"**
    - Keywords: "geometric dimensioning", "tolerancing", "tolerans"

18. **"Makine Tasarımında Güvenlik Faktörü - Kaç Olmalı?"**
    - Keywords: "safety factor", "design factor", "güvenlik katsayısı"

#### C) Case Studies / Uygulamalar (5-7 makale)

19. **"Gerçek Dünya: Bir Tork Aktarım Sisteminin Tasarımı"**
    - Keywords: "torque transmission", "power transmission", "sistem tasarımı"

20. **"Otomotiv: Silindir Başı Vidası Tasarımı - Adım Adım"**
    - Keywords: "automotive design", "fastener design"

21. **"Endüstriyel Uygulamalar: Pompa Seçimi ve Boyutlandırması"**
    - Keywords: "pump selection", "hydraulic pump"

#### D) Trend & Industry (3-5 makale)

22. **"2026'da Mühendislik Tasarımında Yeni Trendler"**
    - Keywords: "engineering trends", "industry 4.0"

23. **"AI ve Machine Learning Mühendislik Hesaplamalarda"**
    - Keywords: "AI engineering", "machine learning calculations"

### Blog SEO Stratejisi

**Başlık Optimizasyonu (Title Tags):**
```
Format: "{Keyword} - {Detay} | AI Engineers Lab"

❌ Yanlış: "Blog yazısı"
✅ Doğru: "Mil Burulma Nasıl Hesaplanır? Formül + Örnekler | AI Engineers Lab"
```

**Meta Description Optimizasyonu:**
```
Format: "{Eylem} + {Fayda} + {Sayı/Detay} + CTA"

❌ Yanlış: "Bu makale hakkında bilgi"
✅ Doğru: "Mil torku hesaplamak için adım adım rehber. Formüller, örnekler ve 
          çevrimiçi hesaplayıcı ile 5 dakika içinde öğrenin. ISO standartları dahil."
```

**İç Bağlantı Stratejisi:**
- Her blog yazısına 3-5 araç bağlantısı ekle
- Blog yazılarından araçlara bağlantı → +25% araç kullanım artışı
- İlgili blog yazıları arasında bağlantı kurma

**Heading Yapısı (H1, H2, H3):**
```
H1: Ana başlık (1 adet)
  H2: Bölüm başlıkları (4-6 adet)
    H3: Alt başlıklar (2-3 adet)
```

### Blog İyileştirmeleri (Teknik)

1. **Word Count Target**: 1500-2500 kelime (standart 1800 kelime)
2. **FAQ Section**: Her yazının sonunda 3-5 sık sorulan soru
3. **Related Posts Widget**: En az 3 ilgili yazı bağlantısı
4. **Code Examples**: Hesaplama formülleri + örnekler
5. **Visual Content**: Diyagramlar, tablolar, infografikleri
6. **Canonical Tags**: Türkçe/İngilizce sürümler arasında doğru canonical yapısı

**Beklenen Sonuçlar:**
- +1000-1500 yeni sayfa (30 yazı × 2 dil × 1-2 slug = 60-120 sayfa)
- +25-40% organik trafik (6 ay içinde)
- +15-20% user engagement (daha fazla zaman geçirme)
- +30-50 alta alabilecek internal links
- +200-300 sosyal paylaşma fırsatı

---

## 3️⃣ REHBERLERDEN VE GLOSSARY'DEN YAKALANABİLECEK FIRASAT

### A) Rehberler (Guides) - Minimum 15-20 Yazı

#### Dünya Kaynakları
1. **"Rulman Seçimi Rehberi" (Mevcut - 1 makale)**
   - ✅ Zaten var, ama genişletilmesi gerekebilir

#### Yeni Rehberler (Önerilenen)

2. **"Doğru Malzeme Seçimi - Metal Tablosu ve Comparisons"** (2000+ kelime)
   - Çelik türleri, alüminyum, bakır, nikel alaşımları
   - Tablo: Özellikleri karşılaştırma
   - SEO Keywords: "malzeme seçimi", "material properties", "steel types"

3. **"Standart Birim Sistemi - Türkiye vs Dünya"** (1500+ kelime)
   - ISO, DIN, BS, ANSI, JIS standartları
   - Hangi sektör hangi standartı kullanıyor?

4. **"Cıvata Başı Şekilleri ve Türleri - Eksiksiz Rehber"** (1800+ kelime)
   - Hex, button head, socket head, vb.
   - Her türün avantajları/dezavantajları

5. **"Kama Tasarımı 101 - Basit Makinelerde Kama Hesabı"** (1500+ kelime)
   - Wedge geometry, friction angle, force distribution

6. **"Pompa Türleri - Pozitif Deplasmanlı vs Turbo Pompalar"** (1800+ kelime)
   - Dişli pompa, piston pompa, santrifüj pompa
   - Uygulama alanları

7. **"Viskozite Sınıflandırması - ISO VG vs SAE vs Grade"** (1500+ kelime)
   - Yağ viskozitesi nedir ve nasıl seçilir?

8. **"Korrozyon Direnci - Paslanmaz Çelik Seçimi"** (1600+ kelime)
   - Farklı paslanmaz çelik sınıfları (304, 316, 420, vb.)

9. **"Titanyum Alaşımları - Uçak ve Tıp Endüstrisi"** (1500+ kelime)
   - Ti-6Al-4V, properties, applications

10. **"Muğlak Kaynaklı Tasarım - Güvenlik vs Maliyet"** (1400+ kelime)
    - Fillet kaynak vs kapalı kaynak

11. **"Sıkma (Press Fit) Bağlantıları - Tolerans Seçimi"** (1700+ kelime)
    - Press fit formülü, sıkma gücü, kalıp tasarımı

12. **"CNC Makineleme - Malzeme Seçimi ve Kesme Hızı"** (1600+ kelime)
    - Her malzeme için optimal kesme parametreleri

13. **"Yüzey İşleme Yöntemleri - Kaplama vs Boya vs Anodize"** (1800+ kelime)
    - Galvaniz, krom, nikel kaplama
    - Karışık çevre koşulları için seçim

14. **"Bağlı Toleranslı (Stacked Tolerances) vs Bazalı - Dimensioning"** (1500+ kelime)
    - Geometrik toleranslama

15. **"Döner Ekipman - Dengeleme ve Titreşim Kontrolü"** (1700+ kelime)
    - Dinamik dengeleme, statik dengeleme

16. **"Akışkan Dinamiği Temelleri - Boru ve Kanal Akışı"** (1600+ kelime)
    - Laminar vs turbulent, Reynolds number

17. **"Işı Yalıtması ve Termal Çekilme - Yüksek Sıcaklık Uygulamaları"** (1500+ kelime)

18. **"Makine Öğesi Ömrü - Wöhler Eğrisi ve Yorulma"** (1800+ kelime)
    - Fatigue analysis, S-N curve

### B) Sözlük (Glossary) - Minimum 50-100 Terim

**Mevcut:** 1 terim ("Backlash")

#### Önerilen Terimler (50+ Başlangıç)

**Mekanik İlkeleri (10-12 Terim):**
- **Torque (Tork)** - Rotational force around an axis
- **Stress (Gerilme)** - Internal force per unit area
- **Strain (Şekil değiştirme)** - Deformation relative to original
- **Young's Modulus (Elastisite Modülü)** - Stiffness measure
- **Shear Stress (Kesme Gerilmesi)** - Parallel force stress
- **Fatigue (Yorulma)** - Progressive failure under cycling
- **Bending Moment (Eğilme Momenti)** - Force × distance
- **Buckling (Burkulma)** - Lateral failure under compression
- **Hysteresis (Histeresis)** - Lag between input and output
- **Resonance (Rezonans)** - Amplification at natural frequency

**Malzeme Bilimi (12-15 Terim):**
- **Annealing (Tavlama)** - Heat treatment for softening
- **Tempering (İnleme)** - Controlled cooling after hardening
- **Hardness (Sertlik)** - Resistance to indentation (Hardness)
- **Tensile Strength (Çekme Mukavemeti)** - Max pulling force
- **Yield Strength (Akma Sınırı)** - Permanent deformation point
- **Ductility (Şekil Değiştirilebilirlik)** - Ability to be drawn
- **Malleability (Dövülebilirlik)** - Can be hammered
- **Brittleness (Kırılganlık)** - Breaks suddenly
- **Corrosion Resistance (Korozyon Direnci)** - Rust prevention
- **Thermal Conductivity** - Heat transfer ability
- **Electrical Conductivity** - Electron flow ability
- **Coefficient of Friction** - Resistance to sliding
- **Viscosity** - Flow resistance of fluids
- **Specific Heat** - Energy to change temperature
- **Density** - Mass per unit volume

**Tasarım Hiyerarşik (8-10 Terim):**
- **Factor of Safety (Güvenlik Faktörü)** - Design margin
- **Tolerance (Tolerans)** - Acceptable dimensional variation
- **Clearance (Açıklık)** - Space between parts
- **Interference (Girişim)** - Negative clearance/press fit
- **GD&T (Geometric Dimensioning & Tolerancing)**
- **Datum (Referans Yüzeyi)** - Reference for measurements
- **Runout (Runout)** - Circular/total wobble of rotating part
- **Concentricity (Konsentriklik)** - Same center axes
- **Perpendicularity (Dikeylik)** - 90-degree relationship
- **Parallelism (Paralellik)** - Equal distance throughout

**Standartlar ve Sertifikasyonlar (8-10 Terim):**
- **ISO (International Organization for Standardization)**
- **DIN (Deutsches Institut für Normung)**
- **ASME (American Society of Mechanical Engineers)**
- **EN (European Standard)**
- **JIS (Japanese Industrial Standard)**
- **BS (British Standard)**
- **ANSI (American National Standards Institute)**
- **API (American Petroleum Institute)**
- **ASTM (American Society for Testing and Materials)**
- **CSA (Canadian Standards Association)**

**Üretim Yöntemleri (10-12 Terim):**
- **Machining (Makineleme)** - Cutting material removal
- **Casting (Döküm)** - Molten material in mold
- **Forging (Alaşımlama)** - Deforming solid metal
- **Welding (Kaynakçılık)** - Joining by melting
- **Grinding (Öğütme)** - Abrasive material removal
- **Drawing (Çekme)** - Pulling through dies
- **Rolling (Haddeleme)** - Pressure between cylinders
- **Stamping (Damgalama)** - Pressing into mold
- **Injection Molding (Enjeksiyon Kalıplama)** - Plastic
- **CNC (Computer Numerical Control)** - Automated machining
- **3D Printing / Additive Manufacturing**
- **Surface Finishing (Yüzey İşleme)**

**Akışkanlar Dinamiği (6-8 Terim):**
- **Laminar Flow (Laminar Akış)** - Smooth layered flow
- **Turbulent Flow (Türbülanslı Akış)** - Chaotic flow
- **Reynolds Number** - Flow regime indicator
- **Viscosity (Viskozite)** - Fluid thickness
- **Head Loss (Basınç Kaybı)** - Energy loss in pipes
- **Cavitation (Kavitasyon)** - Vapor bubble collapse
- **Hydraulic Diameter** - Effective diameter for non-circular ducts

**Elektrik ve Elektronik (5-7 Terim):**
- **Voltage (Voltaj)** - Electrical potential
- **Amperage (Amper)** - Current flow
- **Resistance (Direnç)** - Opposition to current
- **Impedance (İmpedans)** - AC resistance equivalent
- **Power Factor (Güç Faktörü)** - Real vs apparent power
- **Frequency (Frekans)** - Cycles per second
- **Phase (Faz)** - Relative timing of waveform

### Glossary SEO Stratejisi

**Format:**
```
Term: [İngilizce Terim] / [Türkçe Terim]

Definition (120-200 words):
- Tanım (1-2 cümle)
- Neden önemli?
- Nasıl kullanılır?
- Örnek

Related Terms: [Bağlantılı terimlere linkler]

Calculation Tool: [Varsa ilgili araçlara linkler]
```

**Örnek:**
```
### Torque (Tork)

**Definition:**
Tork, bir eksen etrafında döndürme eğilimi gösteren kuvvetin ölçüsüdür. 
Newtonmetre (N·m) veya pound-feet (lbf-ft) cinsinden ölçülür.

Formül: τ = F × r

Makine tasarımında, vidalı bağlantıların sıkılması, mil tasarımı ve güç 
aktarım sistemlerinin boyutlandırılması için kritik parametre.

**Örnek:** 10 N kuvvet 2 metre mesafeden uygulanırsa, tork = 20 N·m

**Related Terms:**
- Power (Güç)
- Shaft Design (Mil Tasarımı)
- Fastening (Bağlama)

**Calculation Tools:**
- Torque & Power Calculator
- Bolt Torque Calculator
```

**Beklenen Sonuçlar:**
- +50-100 yeni sayfa (glossary terimleri)
- +15-20 yeni rehber sayfası
- +30-40% long-tail keyword coverage
- Daha iyi "Aramaya İlişkili Sorular" (People Also Ask) görünümü
- +20% average session duration

---

## 4️⃣ METADATA OPTİMİZASYONU

### Mevcut Durum
✅ Bazı sayfalar metadata ile optimize edilmiş  
⚠️ Birçok sayfa eksik veya generic açıklamalar

### Title Tag Optimizasyonu

**Mevcut Sorunlar:**
```
❌ "Gear Calculator" - Çok generic, keyword yok
❌ "Tool" - Hiç bilgilendirici değil
❌ "Page" - Tamamen işe yaramaz
```

**Optimal Formüller:**

| Sayfa Türü | Format | Örnek |
|-----------|--------|-------|
| **Araç Sayfaları** | `{Araç Adı} Hesaplayıcısı - {Temel Amaç} \| AI Engineers Lab` | `Mil Burulma Hesaplayıcısı - Tork & Güç Hesapla \| AI Engineers Lab` |
| **Blog Yazıları** | `{Başlık} - {Detay} \| Blog \| AI Engineers Lab` | `5 Yaygın Tasarım Hatası - Nasıl Kaçınılır \| Blog \| AI Engineers Lab` |
| **Rehberler** | `{Konu} Rehberi - {Fayda} \| Rehberler \| AI Engineers Lab` | `Malzeme Seçimi Rehberi - Metal Karşılaştırması \| Rehberler` |
| **Glossary** | `{Terim} - {Kısa Tanım} \| Glossary \| AI Engineers Lab` | `Tork - Döndürme Kuvveti Nedir \| Glossary` |
| **Kategoriler** | `{Kategori} - {Öğe Sayısı} Araç \| AI Engineers Lab` | `Mekanik Tasarım Araçları - 12 Hesaplayıcı \| AI Engineers Lab` |

### Meta Description Optimizasyonu

**Hedef Uzunluk:** 150-160 karakter (mobil'de uygun)

**Formül:** `[Açıklama/Fayda] + [Detay] + [CTA/Sayı]`

**Araç Sayfaları Örnekleri:**

```
❌ Yanlış: "Bu bir hesaplayıcıdır"

✅ Doğru: 
"Mil torkunu anında hesaplayın. Gücü, RPM'i ve verimliliği giren formüller 
ve örneklerle. ISO standartları ile kontrol edin."

✅ Doğru (Kısa):
"Dönen mil tarafından iletilen torkunu hesapla. Güç, hız ve verimlilik 
bilgisiyle anında sonuç al."
```

**Blog Yazıları Örnekleri:**

```
✅ "Cıvata sıkma torkunu doğru hesaplamayan mühendislerin 3 temel hatası 
ve bunları nasıl önleyeceğiniz. Praktik örneklerle."

✅ "Malzeme seçimi rehberi: Çelik vs alüminyum vs titanyum. Mühendislik 
özellikleri tablosu ve hangi uygulamada hangi malzeme kullanılır."
```

**Glossary Örnekleri:**

```
✅ "Tork: Bir eksen etrafında döndürme eğilimi gösteren kuvvetin ölçüsü. 
N·m ile ölçülür. Makine tasarımında kritik parametre."

✅ "Gerilme (Stress): İç kuvvetin birim alana oranı. Kesme, çekme ve basınç 
gerilmeleri mühendislik tasarımında temel kavramlardır."
```

**İmplementasyon Sonrası Beklenen:**
- +15-20% CTR artışı (title ve description iyileştiği için)
- +5-10% organik trafik artışı (6 ay içinde)
- Daha iyi ranking potential

---

## 5️⃣ İÇ BAĞLANTILAMA STRATEJİSİ

### Mevcut Altyapı
✅ HowTo Schema sistemi var  
✅ İç bağlantı haritası planlanmış  
⚠️ Henüz tam implemente edilmemiş

### Bağlantı Stratejisi

#### A) Araç → Blog Bağlantıları
```
Blog yazısından → İlgili araçlara
Örnek: "Mil Burulma Hesaplama" blog yazısı 
  → [Mil Burulma Hesaplayıcısı] linkine

Tavsiye: Her blog yazısında min 3-5 araç linki
```

#### B) Blog → Blog Cross-Linking
```
Yazı A: "5 Yaygın Tasarım Hatası"
  → Yazı B: "Cıvata Sıkma Torku" link
  → Yazı C: "Malzeme Seçimi"
  
Tavsiye: Her yazının sonunda 3-4 ilgili yazı
```

#### C) Rehber → Araçlar
```
Rehber: "Malzeme Seçimi"
  → [Dayanıklılık Karşılaştırması] aracı
  → [Malzeme Özellikleri] kartları
```

#### D) Glossary → Referanslar
```
Terim: "Tork"
  → İlgili blog yazılarına
  → Tork hesaplayıcısına
  → Güç bağlantısına
```

### Anchor Text Best Practices

```
❌ Yanlış: "[buraya tıkla](url)"
❌ Yanlış: "[linki aç](url)"
✅ Doğru: "[Mil Tork Hesaplayıcısı](url)"
✅ Doğru: "[cıvata torku nasıl hesaplanır](url)"
```

---

## 6️⃣ PERFORMANS VE TEKNİK SEO

### Mevcut Durum ✅
- **LCP (Largest Contentful Paint):** 2500ms bütçesi - Optimize edilmiş
- **INP (Interaction to Next Paint):** 200ms bütçesi - Optimize edilmiş
- **CLS (Cumulative Layout Shift):** 0.1 bütçesi - Optimize edilmiş
- **TTFB (Time to First Byte):** 800ms - İyi
- **Mobile Preset:** Lighthouse CI ile monitorize ediliyor

### Önerilen İyileştirmeler

#### 1. Core Web Vitals Monitoring
```bash
npm run lhci  # Düzenli çalıştır (haftalık)
```

#### 2. Schema Markup Iyileştirmesi

Mevcut: HowTo Schema  
Eklenebilecek:
- **ArticleSchema**: Blog yazıları için
- **FAQSchema**: Sıkça sorulan sorular
- **BreadcrumbSchema**: Navigasyon
- **OrganizationSchema**: Kuruluş bilgisi
- **LocalBusinessSchema**: Yerel iş (varsa)

#### 3. Internal Linking Raporu

```bash
# Bağlantı haritasını görselleştir
node scripts/link-analysis.mjs
```

---

## 7️⃣ KEYWORD STRATEJİ

### Primary Keywords (Her bölüm için)

#### Araç Sayfaları
```
[Araç Adı] + Hesaplayıcı/Calculator
+ Tork/Güç/Moment/Stress vb. araç için spesifik keywords
```

**Örnek "Shaft Torsion":**
- Primary: "mil burulma", "shaft torsion", "tork hesaplama"
- Secondary: "mil tasarımı", "shear stress", "torsional stiffness"
- Long-tail: "mil torsu nasıl hesaplanır", "dönen mil tork formülü"

#### Blog Yazıları
```
[Araç/Konu] + [Eylem]
Örneğin: "[Malzeme Seçimi] + [Rehberi]" → "Malzeme seçimi rehberi"
```

#### Rehberler
```
[Konu] + Rehberi/Guide
"Rulman Seçimi Rehberi", "Malzeme Seçimi Rehberi"
```

### Keyword Density Tavsiyesi
- **Primary Keyword:** %1-2 sayfa içinde
- **Secondary Keywords:** %0.5-1
- **Variations:** Doğal şekilde dağıtılmış
- **Kelimelerin yer alması:** Başlık, ilk paragraf, H2, H3, sonu

---

## 8️⃣ SOSYAL PAYLAŞIM ve BACKLINK STRATEJİSİ

### Sosyal Paylaşım Fırsatları

**Blog yazıları için:**
```
- LinkedIn: Mühendis topluluğu
- Twitter/X: #Engineering hashtags
- Reddit: r/engineering, r/machinist, r/mech_eng
- Instagram: Teknik content/infografik
- TikTok: "Engineering tips" kısa videolar
```

**Tavsiye Formatlama:**
```
LinkedIn: "Torque hesaplama - mühendislerin yaptığı 3 hata..."
Twitter: "Cıvata sıkma torku formülü ve standart tablosu [link] #engineering"
```

### Backlink Fırsatları

1. **Engineering Blogs:** Konuk yazı (guest post)
2. **YouTube:** Eğitim kanallarında araçlar
3. **Teknik Forumlar:** Stackexchange, Reddit, Quora cevaplarında mention
4. **Mühendislik Dersleri:** Üniversite kaynakları
5. **PDF Rehberleri:** İndirilebilir resource'lar
6. **Press Release:** Yeni feature/tool duyuruları
7. **Case Studies:** Başarı hikayeleri

---

## 9️⃣ İŞLEYİŞ VE ZAMAN PENCERESİ

### Faz 1: Acil (1-2 Hafta)
- [ ] H1 tag sorunlarını düzelt (38 sayfa)
- [ ] Title tags optimize et (50+ sayfa)
- [ ] Meta descriptions yenile (50+ sayfa)

**Beklenen İmpakt:** +5-8% organik trafik

### Faz 2: Kısa Vadeli (2-4 Hafta)
- [ ] Blog yazıları yaz (10 makale)
- [ ] Rehberler oluştur (5 rehber)
- [ ] Glossary terimleri ekle (25 terim)

**Beklenen İmpakt:** +10-15% organik trafik

### Faz 3: Orta Vadeli (1-2 Ay)
- [ ] Blog yazıları tamamla (30 yazı)
- [ ] Rehberler genişlet (15-20 rehber)
- [ ] Glossary tamamla (100 terim)
- [ ] İç bağlantıları optimize et

**Beklenen İmpakt:** +25-40% organik trafik

### Faz 4: Uzun Vadeli (Devam Eden)
- [ ] Sosyal paylaşım kampanyaları
- [ ] Backlink building
- [ ] Konuk yazılar (guest posts)
- [ ] YouTube/video content

**Beklenen İmpakt:** +40-75% organik trafik (toplam)

---

## 🔟 BAŞARI METRİKLERİ

### İzlenecek KPI'lar

| Metrik | Mevcut | Hedef (6 Ay) | Hedef (1 Yıl) |
|--------|--------|-------------|---------------|
| **Organik Trafik** | 100% | 150-160% | 200-250% |
| **Sayfa Sayısı** | 101 | 180-200 | 250+ |
| **Blog Yazıları** | 4 | 30-40 | 60-80 |
| **Avg Session Duration** | ? | +20% | +35% |
| **Bounce Rate** | ? | -15% | -25% |
| **Pages per Session** | ? | +2-3 | +3-5 |
| **Keyword Rankings** | ? | 200+ kw #1-10 | 500+ kw #1-10 |
| **Indexed Pages** | 100+ | 200+ | 300+ |
| **Backlinks** | ? | +50 | +200 |

### Monthly Review Checklist
```
[ ] Organik trafik trendi
[ ] Keyword ranking değişimleri
[ ] New content performance
[ ] User engagement metrics
[ ] Backlink growth
[ ] Crawl errors (Search Console)
[ ] Core Web Vitals durumu
[ ] Konuşma görevleri güncelle
```

---

## 1️⃣1️⃣ DEĞERLİ KAYNAKLAR ve BEST PRACTİCES

### SEO Learning Resources
- Google Search Central: https://developers.google.com/search
- Moz SEO Rehberi: https://moz.com/beginners-guide-to-seo
- Semrush Blog: Engineering keywords trends
- Ahrefs Academy: Technical SEO

### Content Creation Tools
- **Keyword Research:** Ahrefs, Semrush, Ubersuggest
- **Content Outline:** Frase, MarketMuse
- **Writing Assistance:** Grammarly, Hemingway App
- **SEO Analysis:** Yoast SEO, RankMath

### Monitoring Tools
- **Google Search Console:** Indexed pages, rankings, errors
- **Google Analytics 4:** Traffic, behavior, conversions
- **PageSpeed Insights:** Core Web Vitals monitoring
- **Lighthouse CI:** Otomatik performance testing

---

## 1️⃣2️⃣ ÖNGÖRÜLİ MALIYETLER VE ROI

### Zaman Yatırımı
- **H1 Fix:** 2-4 saat (otomatik + manuel kontrol)
- **Metadata Optimization:** 8-12 saat (50+ sayfa)
- **Blog Content (30 yazı):** 60-100 saat (~2-3 saat/yazı)
- **Rehberler (15-20):** 40-60 saat (~2.5-3 saat/rehber)
- **Glossary (100 terim):** 20-30 saat (~12-18 dakika/terim)
- **İç bağlantı optimizasyonu:** 8-12 saat

**Toplam:** 150-220 saat (3-5 hafta proje süresi)

### ROI Projeksiyonu

**Varsayımlar:**
- Mevcut organik trafik: 1000 ziyaretçi/ay
- Conversion rate: %2
- Ortalama customer value: $50

```
Mevcut: 1000 × 0.02 × $50 = $1000/ay

6 Ay Sonra (Faz 2): 
1500 × 0.02 × $50 = $1500/ay → +$500/ay → +$3000 toplamda

1 Yıl Sonra (Faz 3-4):
2500-2750 × 0.02 × $50 = $2500-$2750/ay 
→ +$1500-$1750/ay → +$18000-21000 yıllık ek revenue
```

**Net ROI:** +$18000-21000 yıllık (1-3 ay geri dönüş süresi)

---

## 📋 EYLEM PLANI - HEMEN BAŞLANACAKLAR

### Hafta 1 Görevleri
1. **H1 Düzeltmeleri**
   ```bash
   node h1-fix.mjs --dry-run  # Önizle
   node h1-fix.mjs             # Uygula
   ```
   
2. **Metadata Audit**
   - Title tags review (50 sayfa)
   - Meta descriptions optimizasyonu
   
3. **Blog Planning**
   - İçerik takvimi (30 yazı)
   - Keyword research

### Hafta 2-3 Görevleri
1. **Blog Yazıları Başla** (İlk 10 yazı)
   - "Mil Burulma Nedir?" 
   - "Cıvata Torku Hesaplama"
   - vb.

2. **Rehberler Oluştur** (İlk 5)
   - Malzeme Seçimi
   - DIN Standartları
   - vb.

3. **Glossary Kurulumu** (50+ terim)

### Ayın Sonu Hedefleri
- ✅ H1 sorunları çözüldü
- ✅ 10 blog yazısı yayınlandı
- ✅ 5 rehber eklendi
- ✅ 50 glossary terimi
- ✅ Metadata optimize edildi

---

## 📞 SONUÇ

**Aiengineerslab.com** bir güçlü teknik SEO altyapısına ve yüksek kaliteli araç koleksiyonuna sahiptir. Ancak:

1. **H1 tag eksiklikleri** immediate attention gerektirir (37% sayfa etkilenmiş)
2. **Blog content eksikliği** en büyük SEO fırsat (4 → 30-40 hedefli)
3. **Rehber ve glossary** boşluğu long-tail keyword stratejisini limitle

**Bu rapordaki önerileri uygulayarak:**
- **Kısa Vadede (3 ay):** +25-30% organik trafik
- **Orta Vadede (6 ay):** +40-50% organik trafik
- **Uzun Vadede (1 yıl):** +75-100% organik trafik

**Toplam Beklenen ROI:** $18000-21000 yıllık ek revenue  
**Geri Dönüş Süresi:** 1-3 ay

---

*Hazırlayan: SEO & Content Strategy Analysis*  
*Tarih: 9 Mayıs 2026*  
*Sonraki Review: 9 Haziran 2026*
