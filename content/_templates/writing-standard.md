# Yazım Standardı

## Birim kullanımı (SI / Imperial)
- Varsayılan birim SI. Örnek: mm, N, kN, MPa, kg, s, C.
- Imperial değer gerekiyorsa parantez içinde ver: 25.4 mm (1 in).
- Her tabloda ve formülde birim yaz.
- Birim kısaltmalarını noktasız kullan (mm, N, MPa).

## Varsayım yazma kuralı
- Varsayımlar başlıklı bölümde madde madde yaz.
- Her varsayım şu yapıda olsun: koşul + aralık + etki.
  Örnek: "Yük sabit kabul edilir (0-2% dalgalanma). Sonucu doğrudan etkiler."
- Belirsiz ifadelerden kaçının ("genelde", "yaklaşık").

## Metodoloji vurgusu
- Standart not:
  "Hesaplamalar manuel adımlar, varsayımlar ve analitik kontrollerle desteklenir."
- Üst kısımda bir Callout içinde verin.

## Kaynak / uyarı notları formatı
- Kaynaklar veya kritik uyarılar için Callout kullanın.
- Format:
  - Kaynak: [doküman adı], [sürüm], [tarih]
  - Uyarı: [etki] + [ne zaman kontrol edilmeli]
- Örnek:
  <Callout type="warning" title="Uyarı">
  - Kaynak: ISO 6336, v2019, 2020-03-01
  - Uyarı: Yük ve hız sınırları değişirse sonucu tekrar hesaplayın.
  </Callout>
