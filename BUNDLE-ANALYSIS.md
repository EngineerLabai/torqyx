# Bundle Analysis

## Nasıl çalıştırılır

1. `npm install` ile bağımlılıkları yükleyin.
2. `npm run analyze` komutunu çalıştırın.

Bu, `ANALYZE=true` ortam değişkeniyle `next build` çalıştırır ve `@next/bundle-analyzer` tarafından analiz dosyaları üretir.

## Çıktıyı yorumlama

- `client` ve `server` raporları arasında ayrım yapın.
- En büyük chunk'ları (`.next/static/chunks`) kontrol edin.
- `bundle:stats` ile top 40 dosya listesini görebilirsiniz:
  - `npm run bundle:stats`
- Önceki build ile fark görmek için iki dizin arasında karşılaştırma yapın:
  - `node scripts/bundle-stats.mjs path/to/old/chunks .next/static/chunks`

## Route bazlı hangi chunk'ları çekiyor?

- `app/(tools)/tools` route group'u `tools` sayfalarını ayrı chunk'lara ayırır.
- `app/(blog)/blog` route group'u blog sayfalarını ayrı chunk'lara ayırır.
- `app/(auth)/login` route group'u auth/login sayfasını ayrı chunk'a taşır.

Bu sayede `tools`, `blog` ve `auth` yolları yalnızca ihtiyaç duyulduğunda indirilir.

## Optimizasyon stratejileri

- `@next/bundle-analyzer` analizi route bazlı chunk boyutlarını gösterir.
- `cross-env ANALYZE=true npm run build` ile analiz devreye alınır.
- `bundle:stats` çıktısı küçük değişiklikleri hızlıca tespit etmek için kullanılabilir.
