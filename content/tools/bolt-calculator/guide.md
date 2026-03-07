---
title: "Civata Boyut ve On Yuk Hesabi: Nasil Kullanilir?"
description: "Civata on yuk, tork ve emniyet degerlerini adim adim hesaplamak icin pratik rehber."
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

## Problem Tanimi

Civata baglantilarinda iki kritik risk vardir: yetersiz on yuk ve asiri sikma.
Yetersiz on yuk gevsemeye, asiri sikma ise kalici uzamaya veya kopmaya gider.
Bu hesap, baglanti guvenligini hizli ve tekrarlanabilir sekilde kontrol etmek icin yapilir.

## Formul Aciklamasi

Adim 1: Dis adimi ve nominal cap ile gerilme alani `As` hesaplanir.

Adim 2: Hedef on yuk `F_preload` secilir.
Pratikte tasarim amacina gore akma dayaniminin belirli bir yuzdesi kullanilir.

Adim 3: Sikma torku yaklasik olarak bulunur:

`T = K * F_preload * d`

- `T`: sikma torku (N.m)
- `K`: surtunme/oturma etkisini kapsayan katsayi
- `F_preload`: on yuk (N)
- `d`: nominal cap (m)

Adim 4: Elde edilen gerilme, malzeme siniri ile karsilastirilir ve emniyet katsayisi yorumlanir.

Gorsel akis (placeholder):

```text
Malzeme + Geometri -> As -> Hedef On Yuk -> Tork -> Gerilme Kontrolu
```

## Ornek Cozum

Ornek giris:

- Nominal cap: `M12`
- Dis adimi: `1.75 mm`
- Malzeme sinifi: `8.8`
- Hedef on yuk: `35 kN`
- K katsayisi: `0.20`

Hesap:

1. Yaklasik `d = 0.012 m`
2. `T = 0.20 * 35000 * 0.012 = 84 N.m`
3. Sonuc: Yaklasik `84 N.m` sikma torku gerekir.

Bu deger saha kosullarinda anahtar hassasiyeti ve yaglama durumuna gore dogrulanmalidir.

## Sik Yapilan Hatalar

- `mm` ile `m` karistirmak
- K katsayisini sabit kabul etmek (yaglama degisirse sonuc ciddi degisir)
- Diadaki tolerans etkilerini goz ardi etmek
- Sonucu malzeme akma siniri ile karsilastirmamak

## Ilgili Standart Referansi (ISO/DIN/VDI)

- ISO 898-1: Carbon/alloy steel fastener mekanik ozellikleri
- ISO 68-1: Metrik dis temel geometrisi
- VDI 2230: Civata baglantilarinin sistematik hesap yontemi

## Ilgili Araclar

- [Guc - Tork - Devir](/tools/torque-power)
- [Mil Burulma](/tools/shaft-torsion)
- [Kose Kaynak Boyutlandirma](/tools/fillet-weld)
- [Boru Basinc Kaybi](/tools/pipe-pressure-loss)
