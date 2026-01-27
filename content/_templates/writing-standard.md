# Yazim Standarti

## Birim kullanimi (SI / Imperial)
- Varsayilan birim SI. Ornek: mm, N, kN, MPa, kg, s, C.
- Imperial deger gerekiyorsa parantez icinde ver: 25.4 mm (1 in).
- Her tabloda ve formulde birim yaz.
- Birim kisaltmalarini noktasiz kullan (mm, N, MPa).

## Varsayim yazma kurali
- Varsayimlar baslikli bolumde madde madde yaz.
- Her varsayim su yapida olsun: kosul + aralik + etki.
  Ornek: "Yuk sabit kabul edilir (0-2% dalgalanma). Sonucu dogrudan etkiler."
- Belirsiz ifadelerden kacinin ("genelde", "yaklasik").

## "AI entegrasyonu yok" konumlandirma dili
- Standart ifade:
  "Bu icerik AI entegrasyonu icermez. Tum hesaplamalar manuel ve analitik dogrulamalara dayanir."
- Ust kisimda bir Callout icinde verin.

## Kaynak / uyari notlari formati
- Kaynaklar veya kritik uyarilar icin Callout kullanin.
- Format:
  - Kaynak: [dokuman adi], [surum], [tarih]
  - Uyari: [etki] + [ne zaman kontrol edilmeli]
- Ornek:
  <Callout type="warning" title="Uyari">
  - Kaynak: ISO 6336, v2019, 2020-03-01
  - Uyari: Yuk ve hiz sinirlari degisirse sonucu tekrar hesaplayin.
  </Callout>
