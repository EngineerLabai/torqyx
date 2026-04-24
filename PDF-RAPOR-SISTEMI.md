# Evrensel PDF Rapor Sistemi

Bu sistem, torqyx.com'da kullanılan tüm mühendislik hesaplayıcıları için profesyonel PDF raporları oluşturur. Sistem sadece premium üyelere açıktır.

## 🚀 Özellikler

### PDF Şablonu
- **Başlık Bloğu**: Site logosu, araç adı, tarih, kullanıcı adı
- **Giriş Parametreleri**: Parametre adı, değer, birim tablosu
- **Hesaplama Formülleri**: LaTeX stilinde adım adım formüller
- **Sonuçlar**: Parametre, sonuç, birim, kabul/ret durumu
- **Referans Standartları**: ISO/DIN kodları ve açıklamaları
- **Footer**: Standartlara dayalı sonuçlar notu

### Teknik Mimari
- **API Route**: `/api/generate-pdf` - POST ile rapor verisi alır, PDF buffer döner
- **Custom Hook**: `usePdfExport()` - PDF indirme ve preview işlemlerini yönetir
- **Lazy Loading**: PDF kütüphanesi sadece buton tıklandığında yüklenir
- **Premium Guard**: `useFeatureGate` hook'u ile kontrol

## 📁 Dosya Yapısı

```
lib/pdf/
├── types.ts              # TypeScript tipleri
├── generatePdfReport.ts  # PDF oluşturma motoru
└── reportConverters.ts   # Tool-specific converter'lar

components/pdf/
├── PdfExportButton.tsx   # PDF indirme butonu
└── PdfPreviewModal.tsx   # Önizleme modal'ı

hooks/
└── usePdfExport.ts       # PDF export hook'u

app/api/generate-pdf/
└── route.ts              # PDF API endpoint'i
```

## 🔧 Kullanım

### 1. Temel Kullanım (Generic Converter)

Mevcut hesaplayıcılar otomatik olarak generic converter kullanır:

```tsx
// ToolPage.tsx'de otomatik entegre
{reportData && (
  <div className="mt-4 flex gap-2 border-t pt-4">
    <PdfPreviewModal toolId={tool.id} reportData={reportData} />
    <PdfExportButton toolId={tool.id} reportData={reportData} />
  </div>
)}
```

### 2. Özel Converter Oluşturma

Tool-specific converter oluşturmak için:

```tsx
// lib/pdf/reportConverters.ts
export const createBoltCalculatorReport: ToReportDataConverter<
  BoltInput,
  BoltResult
> = (input, result, toolId, toolName) => {
  return {
    toolId,
    toolName,
    calculationDate: new Date().toISOString(),
    parameters: [
      ReportHelpers.createParameter("Nominal Çap", input.d, "mm"),
      // ... diğer parametreler
    ],
    formulas: [
      ReportHelpers.createFormula(
        "Kesit Alanı",
        "A_s = \\frac{\\pi}{4} \\times (d - 0.9382 \\times P)^2",
        "ISO 898-1 standardına göre"
      ),
      // ... diğer formüller
    ],
    results: [
      ReportHelpers.createResult("Kesit Alanı", result.stressArea, "mm²"),
      // ... diğer sonuçlar
    ],
    standards: [
      ReportHelpers.createStandard(
        "ISO 898-1",
        "Mechanical properties of fasteners",
        "https://www.iso.org/standard/40453.html"
      ),
      // ... diğer standartlar
    ],
  };
};

// Converter'ı kaydet
export const toolPdfConverters: Record<string, ToReportDataConverter<any, any>> = {
  "bolt-calculator": createBoltCalculatorReport,
};
```

### 3. Yardımcı Fonksiyonlar

```tsx
import { ReportHelpers } from "@/lib/pdf/reportConverters";

// Parametre oluştur
const param = ReportHelpers.createParameter("Çap", 10, "mm");

// Formül oluştur
const formula = ReportHelpers.createFormula(
  "Alan",
  "A = \\pi r^2",
  "Daire alanı formülü"
);

// Sonuç oluştur (otomatik durum belirleme)
const result = ReportHelpers.createResult(
  "Güvenlik Faktörü",
  1.5,
  "",
  ReportHelpers.getSafetyStatus(1.5, 1.2) // 1.5 > 1.2 → "pass"
);

// Standart oluştur
const standard = ReportHelpers.createStandard(
  "ISO 898-1",
  "Mechanical properties of fasteners",
  "https://www.iso.org/standard/40453.html"
);
```

## 🔒 Premium Kontrolü

PDF rapor özelliği otomatik olarak premium kontrolü yapar:

```tsx
const { isPremiumRequired, canExport } = usePdfExport({ toolId });

if (isPremiumRequired) {
  // Premium gerekli mesajı göster
  return <Button disabled>PDF Rapor (Premium)</Button>;
}
```

## 🎨 UI Bileşenleri

### PdfExportButton
```tsx
<PdfExportButton
  toolId="bolt-calculator"
  reportData={reportData}
  variant="default"
  size="sm"
  disabled={!canExport}
/>
```

### PdfPreviewModal
```tsx
<PdfPreviewModal
  toolId="bolt-calculator"
  reportData={reportData}
  trigger={<Button>Önizleme</Button>}
/>
```

## 📊 Mevcut Entegrasyon

- ✅ **Bolt Calculator**: Özel converter ile detaylı rapor
- ✅ **Tüm Diğer Araçlar**: Generic converter ile temel rapor
- ✅ **Premium Kontrolü**: Tüm araçlarda aktif
- ✅ **Lazy Loading**: PDF kütüphanesi ihtiyaç halinde yüklenir

## 🔄 Genişletme

Yeni araçlar için PDF desteği eklemek için:

1. `lib/pdf/reportConverters.ts`'e converter ekleyin
2. `toolPdfConverters` objesine kaydedin
3. Tool otomatik olarak PDF butonlarını gösterecek

## 🐛 Sorun Giderme

- **PDF oluşmuyor**: Console'da API response'larını kontrol edin
- **Premium kontrolü**: `useFeatureGate` hook'unun düzgün çalıştığından emin olun
- **Converter hatası**: Tool input/output tiplerinin converter ile uyumlu olduğunu kontrol edin

## 📈 Performans

- PDF kütüphanesi sadece ihtiyaç halinde yüklenir
- API response'ları önbelleğe alınır
- Büyük raporlar için streaming desteği