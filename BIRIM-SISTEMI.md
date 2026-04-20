# Global Birim Sistemi

aiengineerslab.com için kapsamlı birim dönüşüm sistemi.

## 🚀 Özellikler

### 🌍 Üç Birim Sistemi
- **SI**: mm, N, MPa, °C
- **Imperial**: in, lbf, psi, °F
- **Mixed**: Her iki sistemi birlikte göster

### 🔄 Otomatik Dönüşüm
- **Input**: Kullanıcı seçili birimde girer, sistem SI'ye dönüştürür
- **Output**: Sonuçlar seçili birimde gösterilir
- **PDF**: Hesaplama anındaki birim sistemi kullanılır
- **Paylaşım**: URL ve kısa linklerde birim bilgisi korunur

### 🛠 Teknik Altyapı

#### Context & Hooks
```tsx
// Global state yönetimi
<UnitSystemProvider>
  <App />
</UnitSystemProvider>

// Hook kullanımı
const { system, setSystem } = useUnitSystem();
const { value, unit, display } = useUnit(25.4, 'mm');
```

#### Component'ler
```tsx
// Otomatik dönüşümlü input
<UnitInput
  value={diameter} // SI değer
  onChange={setDiameter} // SI değer döner
  unit="mm"
/>

// Otomatik dönüşümlü display
<UnitDisplay value={area} unit="mm²" />

// Sistem switcher (header'da)
<UnitSystemSwitcher />
```

## 📊 Desteklenen Dönüşümler

| Kategori | SI | Imperial | Örnek |
|----------|----|----------|-------|
| Uzunluk | mm, m | in, ft | 25.4 mm → 1 in |
| Kuvvet | N, kN | lbf, kipf | 1000 N → 224.8 lbf |
| Moment | N·m, N·mm | lbf·ft, lbf·in | 100 N·m → 73.76 lbf·ft |
| Basınç | MPa, GPa | psi, ksi | 1 MPa → 145 psi |
| Güç | kW | hp | 1 kW → 1.341 hp |
| Kütle | kg, g | lb, oz | 1 kg → 2.205 lb |
| Sıcaklık | °C | °F | 0°C → 32°F |
| Açı | rad | deg | π rad → 180° |

## 🏗 Mimari

### Dosya Yapısı
```
utils/
├── units.ts              # Dönüşüm fonksiyonları
contexts/
├── UnitSystemContext.tsx # Global state
hooks/
├── useUnit.ts           # Unit hook'ları
components/units/
├── UnitInput.tsx        # Dönüşümlü input
├── UnitDisplay.tsx      # Dönüşümlü display
├── UnitSystemSwitcher.tsx # Sistem seçici
lib/pdf/
├── generatePdfReport.ts # PDF birim desteği
```

### State Yönetimi
- **localStorage**: Kullanıcı tercihleri
- **Context**: Global birim sistemi
- **Props**: Component-specific override

### Veri Akışı
```
User Input → UnitInput → SI Conversion → State
State → UnitDisplay → System Conversion → UI
```

## 🔧 Entegrasyon

### Mevcut Araçlara Eklenmesi

1. **Input Güncelleme**:
```tsx
// Önce
<input value={input.d} onChange={e => setInput({...input, d: +e.target.value})} />

// Sonra
<UnitInput value={input.d} onChange={d => setInput({...input, d})} unit="mm" />
```

2. **Output Güncelleme**:
```tsx
// Önce
<div>Sonuç: {result.area} mm²</div>

// Sonra
<UnitDisplay value={result.area} unit="mm²" />
```

3. **PDF Converter Güncelleme**:
```tsx
export const createToolReport: ToReportDataConverter<...> =
  (input, result, toolId, toolName, unitSystem) => ({
    // ...
    unitSystem,
    parameters: [/* converted parameters */],
    results: [/* converted results */],
  });
```

## 🧪 Test

```bash
# Unit testleri
npm run test:units

# Entegrasyon testleri
npm run test:e2e:units
```

## 📈 Ölçeklenebilirlik

### Yeni Birimler Eklenmesi
```tsx
// utils/units.ts
const NEW_UNITS: Record<string, UnitDefinition> = {
  newUnit: {
    si: 'si_unit',
    imperial: 'imp_unit',
    category: 'new_category',
    toImperial: (si) => si * factor,
    fromImperial: (imp) => imp / factor,
    precision: 2,
  },
};
```

### Yeni Kategoriler
```tsx
type UnitCategory = 'length' | 'force' | /* ... */ | 'new_category';
```

## 🎯 Kullanım Senaryoları

### 1. Mühendis Hesaplaması
- ABD'li mühendis: Imperial birimler
- Avrupa'dan iş arkadaşı: SI birimler
- PDF raporu: Herkes kendi biriminde

### 2. Eğitim
- Öğrenciler: Mixed modunda öğrenme
- Profesörler: SI modunda öğretim

### 3. Endüstri
- Otomotiv: mm, MPa
- İnşaat: ft, ksi
- Havacılık: in, psi

## 🔒 Güvenlik & Performans

- **Client-side**: Tüm dönüşümler tarayıcıda
- **Validation**: SI cinsinden sınır kontrolü
- **Precision**: Bilimsel gösterim desteği
- **Caching**: localStorage ile tercihler

## 📚 Dokümantasyon

- [Migration Guide](BIRIM-SISTEMI-MIGRATION.md) - Mevcut araçların güncellenmesi
- [API Reference](docs/units-api.md) - Detaylı API dokümantasyonu
- [Test Suite](test-units.test.ts) - Kapsamlı testler

## 🚀 Production Ready

- ✅ TypeScript tam desteği
- ✅ React 19 uyumluluğu
- ✅ Next.js 16 entegrasyonu
- ✅ Tailwind CSS stilleri
- ✅ Responsive tasarım
- ✅ Accessibility desteği
- ✅ Error handling
- ✅ Performance optimized