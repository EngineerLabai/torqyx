# Yazım Standarti

## Birim kullanımı (SI / Imperial)
- Varsayılan birim SI. örnek: mm, N, kN, MPa, kg, s, C.
- Imperial deger gerekiyorsa parantez icinde ver: 25.4 mm (1 in).
- Her tabloda ve formulde birim yaz.
- Birim kısaltmalarını noktasız kullan (mm, N, MPa).

## Varsayım yazma kuralı
- Varsayımlar başlıklı bölümde madde madde yaz.
- Her varsayım su yapida olsun: koşul + aralık + etki.
  örnek: "Yük sabit kabul edilir (0-2% dalgalanma). Sonucu dogrudan etkiler."
- Belirsiz ifadelerden kaçının ("genelde", "yaklaşık").

## Metodoloji vurgusu
- Standart not:
  "Hesaplamalar manuel adimlar, varsayımlar ve analitik kontrollerle desteklenir."
- üst kısımda bir Callout icinde verin.

## Kaynak / uyarı notlari formati
- Kaynaklar veya kritik uyarilar için Callout kullanin.
- Format:
  - Kaynak: [doküman adi], [sürüm], [tarih]
  - Uyarı: [etki] + [ne zaman kontrol edilmeli]
- örnek:
  <Callout type="warning" title="Uyarı">
  - Kaynak: ISO 6336, v2019, 2020-03-01
  - Uyarı: Yük ve hız sinirlari degisirse sonucu tekrar hesaplayin.
  </Callout>
