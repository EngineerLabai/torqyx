# İki Modlu Paylaşım Sistemi

Bu sistem, aiengineerslab.com'da hesaplayıcı araçları için iki farklı paylaşım modu sağlar.

## 🚀 Mod 1: URL Paylaşımı (Basit, Anonim)

### Özellikler
- Hesaplama parametreleri URL'e encode edilir
- Kısa parametre isimleri kullanılır (ör: `m=2&z1=20&z2=40`)
- "Bağlantıyı Kopyala" butonu ile kolay paylaşım
- Sayfa açıldığında otomatik state restore
- Parametre validasyonu ve sınır kontrolleri
- URL uzunluğu optimize edilmiş

### Kullanım
```tsx
// Otomatik entegre - herhangi bir araçta çalışır
<ShareButton
  toolId="bolt-calculator"
  currentInput={input}
  currentResult={result}
/>
```

### URL Format
```
/tr/araclar/bolt-calculator?s=d:10|p:1.5|g:8.8|f:dry|l:0.7
```

### Kısa Parametreler
- `d`: diameter (çap)
- `p`: pitch (diş adımı)
- `g`: grade (kalite)
- `f`: friction (sürtünme)
- `l`: preloadPercent (ön yük)

## 🔗 Mod 2: Kısa Link (Premium, Veritabanı)

### Özellikler
- POST `/api/calculations/share` ile veritabanına kayıt
- Kısa kod üretimi (ör: `aelabs.co/s/x4k2m`)
- Premium kullanıcılara özel
- Kayıtlı hesaplama listesinde görünür
- TTL: ücretsiz 7 gün, premium sınırsız
- OG meta tag desteği

### API Kullanımı
```tsx
const { shareViaShortLink } = useShareableUrl({
  toolId: "bolt-calculator",
  currentInput: input,
  currentResult: result,
});

await shareViaShortLink(false); // Özel paylaşım
await shareViaShortLink(true);  // Herkese açık paylaşım
```

### Veritabanı Şeması
```prisma
model SharedCalculation {
  id        String   @id @default(cuid())
  code      String   @unique
  userId    String?
  toolSlug  String
  inputs    Json
  outputs   Json?
  isPublic  Boolean  @default(false)
  expiresAt DateTime?
  createdAt DateTime @default(now())
}
```

## 🛠 Teknik Detaylar

### Hook: `useShareableUrl`
```tsx
const {
  shareViaUrl,           // MOD 1
  shareViaShortLink,     // MOD 2
  loadSharedCalculation, // Paylaşım yükleme
  isSharing,            // Loading state
  lastShare,            // Son paylaşım bilgisi
  isPremium,            // Premium kontrolü
} = useShareableUrl(options);
```

### Component: `ShareButton`
```tsx
<ShareButton
  toolId="bolt-calculator"
  currentInput={input}
  currentResult={result}
  variant="outline"
  size="sm"
/>
```

### Utility Fonksiyonlar
- `encodeToolStateShort()` - Kısa encode
- `decodeToolStateShort()` - Kısa decode
- `generateShareCode()` - Kısa kod üretimi
- `calculateExpiration()` - TTL hesaplaması

## 🔒 Güvenlik & Validasyon

- Premium kontrolü: `useFeatureGate` hook'u
- Input sanitization: `sanitizeToolState()`
- URL validation: Base64URL encoding
- Database security: User isolation
- Expiration: Automatic cleanup

## 📊 Entegrasyon

### Otomatik Entegrasyon
Her araçta otomatik olarak aktif:
```tsx
// ToolPage.tsx'de otomatik eklenir
{reportData && (
  <div className="mt-4 flex gap-2 border-t pt-4">
    <PdfExportButton ... />
    <ShareButton ... />
  </div>
)}
```

### Manuel Entegrasyon
```tsx
import { ShareButton } from "@/components/share/ShareButton";

<ShareButton
  toolId={toolId}
  currentInput={input}
  currentResult={result}
/>
```

## 🎨 UI/UX

- Dropdown menu ile iki mod seçimi
- Toast bildirimleri
- Loading states
- Premium gating mesajları
- Responsive tasarım

## 📈 Ölçeklenebilirlik

- Yeni araçlar için kolay mapping ekleme
- Modüler architecture
- Database indexing
- Expiration cleanup jobs

## 🧪 Test

```bash
# Kısa link paylaşımı test
curl -X POST /api/calculations/share \
  -H "Content-Type: application/json" \
  -d '{"toolSlug":"bolt-calculator","inputs":{"d":10},"outputs":{}}'

# Kısa link erişim test
curl /api/calculations/x4k2m
```

## 🚀 Production Ready

- Error handling
- Rate limiting (eklenebilir)
- Analytics tracking
- SEO optimization
- Performance optimized