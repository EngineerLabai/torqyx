---
title: "Boru Basınç Kaybı Hesabı: Nasıl Kullanılır?"
description: "Darcy-Weisbach temelli basınç kaybı hesabını adım adım uygulama rehberi."
date: "2026-03-07"
updatedAt: "2026-03-07"
standards:
  - "ISO 5167"
  - "VDI 2040"
  - "DIN EN 13480"
relatedTools:
  - "fluids-hvac"
  - "hydraulic-cylinder"
  - "unit-converter"
  - "torque-power"
---

## Problem Tanımı

Akışkan taşıyan hatlarda basınç kaybı pompaya, enerji tüketimine ve sistem kapasitesine doğrudan etki eder.
Hat uzunluğu veya çap seçimi yanlış yapılırsa işletme maliyeti artar ve hedef debi sağlanamaz.
Bu hesap, boru tasarımını ilk aşamada teknik olarak doğrulamak için yapılır.

## Formül Açıklaması

Temel denklem Darcy-Weisbach:

`DeltaP = f * (L / D) * (rho * v^2 / 2)`

- `DeltaP`: basınç kaybı (Pa)
- `f`: sürtünme katsayısı
- `L`: boru uzunluğu (m)
- `D`: iç çap (m)
- `rho`: yoğunluk (kg/m^3)
- `v`: ortalama hız (m/s)

Adım 1: Debiden hız bulunur.

Adım 2: Reynolds sayısı hesaplanır.

Adım 3: Akış rejimine göre sürtünme katsayısı seçilir.

Adım 4: Toplam basınç kaybı hesaplanır ve hedef sınırlarla karşılaştırılır.

Görsel akış:

![Hidrolik devre görseli](/images/hydraulic-circuit.webp)

## Örnek Çözüm

Örnek giriş:

- Debi: `12 m^3/h`
- İç çap: `80 mm`
- Uzunluk: `120 m`
- Yoğunluk: `998 kg/m^3`
- Kinematik viskozite: `1.0e-6 m^2/s`
- Yaklaşık sürtünme katsayısı: `f = 0.022`

Ara adımlar:

1. Debi `Q = 0.00333 m^3/s`
2. Alan `A = pi*D^2/4 = 0.00503 m^2`
3. Hız `v = Q/A = 0.66 m/s`
4. Reynolds `Re ~ 5.3e4` (türbülans bölgesi)

Basınç kaybı:

`DeltaP = 0.022 * (120/0.08) * (998 * 0.66^2 / 2) ~ 7.2 kPa`

## Sık Yapılan Hatalar

- Debiyi `m^3/h` yerine `m^3/s` kullanmadan doğrudan denklemde kullanmak
- İç çap yerine dış çap kullanmak
- Viskozite birimini karıştırmak
- Yalnızca düz boru kaybına bakıp fittings kaybını ihmal etmek

## İlgili Standart Referansı (ISO/DIN/VDI)

- ISO 5167: Debi ölçümü ve basınç farkı yaklaşımı
- VDI 2040: İşletme verimliliği ve sistem değerlendirmesi
- DIN EN 13480: Endüstriyel metal borulama gereksinimleri

## İlgili Araçlar

- [Akışkanlar ve HVAC](/tools/fluids-hvac)
- [Hidrolik Silindir Kuvvet & Hız](/tools/hydraulic-cylinder)
- [Birim Dönüştürücü](/tools/unit-converter)
- [Güç - Tork - Devir](/tools/torque-power)
