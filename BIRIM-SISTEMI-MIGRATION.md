# Global Birim Sistemi Entegrasyonu

Bu kılavuz, mevcut 37 mühendislik aracına birim sistemi desteğini eklemek için gereken adımları açıklar.

## 🎯 Genel Bakış

Birim sistemi şu şekilde çalışır:
- **İç hesaplamalar**: Her zaman SI birimlerinde yapılır
- **Kullanıcı girişi**: Seçili birim sistemine göre dönüştürülür
- **Sonuç gösterimi**: Seçili birim sisteminde gösterilir
- **PDF raporları**: Hesaplama anındaki birim sistemi kullanılır

## 📋 Entegrasyon Adımları

### 1. Araç Input'larını Güncelleme

#### Mevcut Durum
```tsx
// Eski - sadece SI input
<Input
  type="number"
  value={input.diameter}
  onChange={(e) => setInput({...input, diameter: Number(e.target.value)})}
  placeholder="Çap (mm)"
/>
```

#### Yeni Durum
```tsx
// Yeni - UnitInput ile otomatik dönüşüm
<UnitInput
  value={input.diameter} // SI değer (mm)
  onChange={(value) => setInput({...input, diameter: value})} // SI değer döner
  unit="mm"
  placeholder="Çap"
/>
```

### 2. Araç Sonuçlarını Güncelleme

#### Mevcut Durum
```tsx
// Eski - sabit birim gösterimi
<div>Alan: {result.area} mm²</div>
```

#### Yeni Durum
```tsx
// Yeni - UnitDisplay ile otomatik dönüşüm
<UnitDisplay value={result.area} unit="mm²" />
```

### 3. Formül Gösterimini Güncelleme

#### Mevcut Durum
```tsx
// Eski - sabit formül
<div>Formül: A = π × r²</div>
```

#### Yeni Durum
```tsx
// Yeni - UnitFormula ile birim dönüşümü
<UnitFormula
  formula="A = π × r²"
  variables={{
    A: { value: result.area, unit: "mm²" },
    r: { value: input.radius, unit: "mm" }
  }}
/>
```

### 4. PDF Converter Güncelleme

#### Mevcut Durum
```tsx
export const createMyToolReport: ToReportDataConverter<Input, Result> =
  (input, result, toolId, toolName) => ({
    // ...
  });
```

#### Yeni Durum
```tsx
export const createMyToolReport: ToReportDataConverter<Input, Result> =
  (input, result, toolId, toolName, unitSystem) => ({
    toolId,
    toolName,
    calculationDate: new Date().toISOString(),
    unitSystem, // ← Yeni: birim sistemi
    parameters: [
      ReportHelpers.createParameter("Çap", input.diameter, "mm"),
      // ...
    ],
    // ...
  });
```

## 🔧 Detaylı Örnekler

### Örnek 1: Bolt Calculator (Zaten Güncellendi)

```tsx
// InputSection.tsx
<UnitInput
  value={input.d}
  onChange={(value) => setInput({...input, d: value})}
  unit="mm"
  placeholder="Nominal çap"
/>

// ResultSection.tsx
<UnitDisplay value={result.stressArea} unit="mm²" />
<UnitDisplay value={result.preloadForce} unit="N" />
<UnitDisplay value={result.torque} unit="N·m" />
```

### Örnek 2: Shaft Torsion

```tsx
// InputSection.tsx
<UnitInput
  value={input.diameter}
  onChange={(value) => setInput({...input, diameter: value})}
  unit="mm"
  placeholder="Çap"
/>

<UnitInput
  value={input.torque}
  onChange={(value) => setInput({...input, torque: value})}
  unit="N·m"
  placeholder="Tork"
/>

// ResultSection.tsx
<UnitDisplay value={result.shearStress} unit="MPa" />
<UnitDisplay value={result.angle} unit="rad" />
```

### Örnek 3: Pipe Pressure Loss

```tsx
// InputSection.tsx
<UnitInput
  value={input.flowRate}
  onChange={(value) => setInput({...input, flowRate: value})}
  unit="m³/h"
  placeholder="Debi"
/>

<UnitInput
  value={input.pipeLength}
  onChange={(value) => setInput({...input, pipeLength: value})}
  unit="m"
  placeholder="Borulama uzunluğu"
/>

// ResultSection.tsx
<UnitDisplay value={result.pressureLoss} unit="Pa" />
<UnitDisplay value={result.velocity} unit="m/s" />
```

## 📊 Desteklenen Birimler

### Uzunluk
- `mm`, `cm`, `m`, `km` ↔ `in`, `ft`, `yd`, `mile`

### Kuvvet
- `N`, `kN` ↔ `lbf`, `kipf`

### Moment/Tork
- `N·m`, `N·mm` ↔ `lbf·ft`, `lbf·in`

### Basınç/Gerilme
- `Pa`, `kPa`, `MPa`, `GPa` ↔ `psi`, `ksi`

### Güç
- `W`, `kW`, `MW` ↔ `hp`

### Kütle
- `g`, `kg`, `t` ↔ `oz`, `lb`, `ton`

### Sıcaklık
- `°C` ↔ `°F`

### Açı
- `rad` ↔ `deg`

## ⚠️ Önemli Notlar

### 1. İç Hesaplamalar
```tsx
// ❌ Yanlış - display değerini kullanma
const area = Math.PI * Math.pow(displayRadius, 2);

// ✅ Doğru - SI değerini kullan
const area = Math.PI * Math.pow(siRadius, 2);
```

### 2. State Yönetimi
```tsx
// State'te her zaman SI değerleri tut
const [input, setInput] = useState({
  diameter: 10, // mm (SI)
  torque: 100,  // N·m (SI)
});
```

### 3. Validation
```tsx
// UnitInput otomatik olarak SI'ye dönüştürür
<UnitInput
  value={input.diameter}
  onChange={(siValue) => {
    if (siValue > 0) { // SI cinsinden validation
      setInput({...input, diameter: siValue});
    }
  }}
  unit="mm"
/>
```

## 🧪 Test Checklist

### Input Testleri
- [ ] SI modunda giriş
- [ ] Imperial modunda giriş
- [ ] Mixed modunda giriş
- [ ] Geçersiz değer girişi
- [ ] Sınır değer kontrolü

### Display Testleri
- [ ] SI modunda gösterim
- [ ] Imperial modunda gösterim
- [ ] Mixed modunda gösterim
- [ ] Precision kontrolü

### PDF Testleri
- [ ] SI modunda PDF oluşturma
- [ ] Imperial modunda PDF oluşturma
- [ ] PDF'de doğru birimler

### Paylaşım Testleri
- [ ] URL paylaşımında birim bilgisi
- [ ] Kısa link paylaşımında birim bilgisi

## 🚀 Mevcut Araçların Güncellenmesi

37 araç için entegrasyon öncelik sırası:

### Yüksek Öncelik (Temel Araçlar)
1. ✅ bolt-calculator
2. shaft-torsion
3. pipe-pressure-loss
4. bearing-life
5. hydraulic-cylinder

### Orta Öncelik
6. fillet-weld
7. unit-converter
8. basic-engineering
9. param-chart

### Düşük Öncelik
10-37. Diğer araçlar...

## 🔧 Yardımcı Fonksiyonlar

### useUnit Hook
```tsx
const { value, unit, display } = useUnit(25.4, 'mm');
// SI: "25.4 mm"
// Imperial: "1.00 in"
// Mixed: "25.4 mm (1.00 in)"
```

### Unit Conversion
```tsx
const { convert, toSI, fromSI } = useUnitConversion();
const imperialValue = convert(100, 'N', 'lbf'); // 22.48
```

### Unit Preferences
```tsx
const { system, isSI, isImperial, isMixed } = useUnitPreferences();
```

## 📞 Destek

Entegrasyon sırasında sorun yaşarsanız:
1. Bu kılavuzu tekrar inceleyin
2. Örnek implementasyonları kontrol edin
3. Unit conversion fonksiyonlarını test edin
4. PDF converter'ını güncelleyin

## 🎯 Başarı Kriterleri

- [ ] Tüm input'lar UnitInput kullanır
- [ ] Tüm sonuçlar UnitDisplay kullanır
- [ ] PDF raporları doğru birimler gösterir
- [ ] Paylaşım linkleri birim bilgisini korur
- [ ] Formüller doğru birimler gösterir
- [ ] Validation'lar SI cinsinden çalışır