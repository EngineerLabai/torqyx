---
title: "Boru Basinc Kaybi Hesabi: Nasil Kullanilir?"
description: "Darcy-Weisbach temelli basinc kaybi hesabini adim adim uygulama rehberi."
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

- `DeltaP`: basinc kaybi (Pa)
- `f`: surtunme katsayisi
- `L`: boru uzunlugu (m)
- `D`: ic cap (m)
- `rho`: yogunluk (kg/m^3)
- `v`: ortalama hiz (m/s)

Adim 1: Debiden hiz bulunur.

Adim 2: Reynolds sayisi hesaplanir.

Adim 3: Akis rejimine gore surtunme katsayisi secilir.

Adim 4: Toplam basinc kaybi hesaplanir ve hedef sinirlarla karsilastirilir.

Gorsel akis:

![Hydraulic Blueprint](/images/blueprint-hydraulic.jpg)

## Ornek Cozum

Ornek giris:

- Debi: `12 m^3/h`
- Ic cap: `80 mm`
- Uzunluk: `120 m`
- Yogunluk: `998 kg/m^3`
- Kinematik viskozite: `1.0e-6 m^2/s`
- Yaklasik surtunme katsayisi: `f = 0.022`

Ara adimlar:

1. Debi `Q = 0.00333 m^3/s`
2. Alan `A = pi*D^2/4 = 0.00503 m^2`
3. Hiz `v = Q/A = 0.66 m/s`
4. Reynolds `Re ~ 5.3e4` (turbulans bolgesi)

Basinc kaybi:

`DeltaP = 0.022 * (120/0.08) * (998 * 0.66^2 / 2) ~ 7.2 kPa`

## Sik Yapilan Hatalar

- Debiyi `m^3/h` yerine `m^3/s` kullanmadan dogrudan denklemde kullanmak
- Ic cap yerine dis cap kullanmak
- Viskozite birimini karistirmak
- Yalnizca duz boru kaybina bakip fittings kaybini ihmal etmek

## Ilgili Standart Referansi (ISO/DIN/VDI)

- ISO 5167: Debi olcumu ve basinc farki yaklasimi
- VDI 2040: Isletme verimliligi ve sistem degerlendirmesi
- DIN EN 13480: Endustriyel metal borulama gereksinimleri

## Ilgili Araclar

- [Akiskanlar ve HVAC](/tools/fluids-hvac)
- [Hidrolik Silindir Kuvvet & Hiz](/tools/hydraulic-cylinder)
- [Birim Donusturucu](/tools/unit-converter)
- [Guc - Tork - Devir](/tools/torque-power)
