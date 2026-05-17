---
title: "Cıvata Boyut ve Ön Yük Hesabı: Nasıl Kullanılır?"
description: "Cıvata ön yük, tork ve emniyet değerlerini adım adım hesaplamak için pratik rehber."
date: "2026-03-07"
updatedAt: "2026-03-07"
standards:
  - "ISO 898-1"
  - "ISO 68-1"
  - "VDI 2230"
relatedTools:
  - "torque-power"
  - "shaft-torsion"
  - "fillet-weld"
  - "pipe-pressure-loss"
---

## Problem Tanımı

Cıvata bağlantılarında iki kritik risk vardır: yetersiz ön yük ve aşırı sıkma.
Yetersiz ön yük gevşemeye, aşırı sıkma ise kalıcı uzamaya veya kopmaya gider.
Bu hesap, bağlantı güvenliğini hızlı ve tekrarlanabilir şekilde kontrol etmek için yapılır.

## Formül Açıklaması

Adım 1: Diş adımı ve nominal çap ile gerilme alanı `As` hesaplanır.

Adım 2: Hedef ön yük `F_preload` seçilir.
Pratikte tasarım amacına göre akma dayanımının belirli bir yüzdesi kullanılır.

Adım 3: Sıkma torku yaklaşık olarak bulunur:

`T = K * F_preload * d`

- `T`: sıkma torku (N.m)
- `K`: sürtünme/oturma etkisini kapsayan katsayı
- `F_preload`: ön yük (N)
- `d`: nominal çap (m)

Adım 4: Elde edilen gerilme, malzeme sınırı ile karşılaştırılır ve emniyet katsayısı yorumlanır.

Karar akışı:

```text
Malzeme + Geometri -> As -> Hedef Ön Yük -> Tork -> Gerilme Kontrolü
```

## Örnek Çözüm

Örnek giriş:

- Nominal çap: `M12`
- Diş adımı: `1.75 mm`
- Malzeme sınıfı: `8.8`
- Hedef ön yük: `35 kN`
- K katsayısı: `0.20`

Hesap:

1. Yaklaşık `d = 0.012 m`
2. `T = 0.20 * 35000 * 0.012 = 84 N.m`
3. Sonuç: Yaklaşık `84 N.m` sıkma torku gerekir.

Bu değer saha koşullarında anahtar hassasiyeti ve yağlama durumuna göre doğrulanmalıdır.

## Sık Yapılan Hatalar

- `mm` ile `m` karıştırmak
- K katsayısını sabit kabul etmek (yağlama değişirse sonuç ciddi değişir)
- Diş tolerans etkilerini göz ardı etmek
- Sonucu malzeme akma sınırı ile karşılaştırmamak

## İlgili Standart Referansı (ISO/DIN/VDI)

- ISO 898-1: Carbon/alloy steel fastener mekanik özellikleri
- ISO 68-1: Metrik diş temel geometrisi
- VDI 2230: Cıvata bağlantılarının sistematik hesap yöntemi

## İlgili Araçlar

- [Güç - Tork - Devir](/tools/torque-power)
- [Mil Burulma](/tools/shaft-torsion)
- [Köşe Kaynak Boyutlandırma](/tools/fillet-weld)
- [Boru Basınç Kaybı](/tools/pipe-pressure-loss)
