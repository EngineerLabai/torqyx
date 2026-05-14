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

Adım 1: Diş adımı ve nominal çap ile gerilme alanı `As` hesaplanır.

Adım 2: Hedef ön yük `F_preload` seçilir.
Pratikte tasarım amacına göre akma dayanımının belirli bir yüzdesi kullanılır.

Adım 3: Sıkma torku yaklaşık olarak bulunur:

`T = K * F_preload * d`

- `T`: sıkma torku (N.m)
- `K`: sürtünme/oturma etkisini kapsayan katsayı
- `F_preload`: on yuk (N)
- `d`: nominal cap (m)

Adim 4: Elde edilen gerilme, malzeme siniri ile karsilastirilir ve emniyet katsayisi yorumlanir.

Karar akisi:

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

- ISO 898-1: Carbon/alloy steel fastener mekanik özellikleri
- ISO 68-1: Metrik dis temel geometrisi
- VDI 2230: Civata baglantilarinin sistematik hesap yontemi

## Ilgili Araclar

- [Guc - Tork - Devir](/tools/torque-power)
- [Mil Burulma](/tools/shaft-torsion)
- [Kose Kaynak Boyutlandirma](/tools/fillet-weld)
- [Boru Basinc Kaybi](/tools/pipe-pressure-loss)
