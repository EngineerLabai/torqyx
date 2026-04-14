# SEO Schema & Internal Linking Sistemi

aiengineerslab.com için gelişmiş SEO optimizasyonu sistemi.

## 🚀 Özellikler

### 📋 HowTo Schema Sistemi
- **Otomatik HowTo JSON-LD**: Her hesaplama aracı için otomatik HowTo schema üretimi
- **ToolConfig Entegrasyonu**: Mevcut araç yapılandırmasından step'ler çıkarılır
- **Dil Desteği**: Türkçe ve İngilizce için ayrı schema'lar
- **SoftwareApplication**: Hesaplayıcı uygulaması için ek schema

### 🔗 Internal Linking Haritası
- **37 Araç Kategorizasyonu**: Mechanical, General Engineering, Automotive
- **Mantıksal Bağlantılar**: Dişli → Tork → Güç zincirleri
- **Anchor Text Önerileri**: Anahtar kelime odaklı bağlantı metinleri
- **İçerik Bağlantıları**: Blog ve guide'lerden araçlara bağlantı önerileri

## 🛠 Teknik Altyapı

### HowTo Schema Sistemi

#### Temel Kullanım
```tsx
import { buildHowToSchema, buildLocalizedHowToSchemas } from "@/utils/howto-schema";
import { getToolPageTool } from "@/tools/tool-page-tools";
import { toolCatalog } from "@/tools/_shared/catalog";

// Tek dil için
const tool = getToolPageTool("bolt-calculator");
const catalogItem = toolCatalog.find(t => t.id === "bolt-calculator");

if (tool && catalogItem) {
  const toolConfig = { ...tool, ...catalogItem };
  const schema = buildHowToSchema(toolConfig, "tr");
  // JSON-LD olarak kullan
}
```

#### Sayfa Entegrasyonu
```tsx
// app/tools/[tool]/page.tsx
import { buildToolHowToJsonLd } from "@/utils/tool-seo";

export default function ToolPage({ params }: { params: { tool: string; locale: string } }) {
  const howToSchema = buildToolHowToJsonLd(params.tool, params.locale);

  return (
    <div>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      </Head>
      {/* Sayfa içeriği */}
    </div>
  );
}
```

### Internal Linking Sistemi

#### Bağlantı Önerileri
```tsx
import { getLinkSuggestions, buildInternalLinkingMap } from "@/utils/internal-linking";

// Tek araç için öneriler
const suggestions = getLinkSuggestions("bolt-calculator");

// Tüm harita
const linkingMap = buildInternalLinkingMap();

// Örnek çıktı:
// [
//   {
//     slug: "shaft-torsion",
//     title: "Mil Burulma",
//     anchorText: "mil burulma hesabı",
//     relevance: "high",
//     category: "Mechanical"
//   }
// ]
```

#### Sayfa İçinde Kullanım
```tsx
// components/RelatedTools.tsx
import { getLinkSuggestions } from "@/utils/internal-linking";

export function RelatedTools({ currentTool }: { currentTool: string }) {
  const suggestions = getLinkSuggestions(currentTool);

  return (
    <div className="related-tools">
      <h3>İlgili Araçlar</h3>
      {suggestions.map(suggestion => (
        <a
          key={suggestion.slug}
          href={`/tools/${suggestion.slug}`}
          title={suggestion.description}
        >
          {suggestion.anchorText}
        </a>
      ))}
    </div>
  );
}
```

## 📊 Veri Yapıları

### HowTo Schema Çıktısı
```json
{
  "@type": "HowTo",
  "name": "Cıvata Boyut ve Ön Yük Hesabı",
  "description": "Nominal çap, diş adımı ve malzeme sınıfına göre...",
  "url": "https://aiengineerslab.com/tools/bolt-calculator",
  "inLanguage": "tr",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Girdi parametrelerini girin",
      "text": "Gerekli parametreleri girin: Nominal çap (mm), Diş adımı (mm)..."
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "ISO 898-1 (Mechanical properties of fasteners)"
    }
  ],
  "application": {
    "name": "Cıvata Boyut ve Ön Yük Hesabı",
    "applicationCategory": "EngineeringApplication",
    "offers": { "@type": "Offer", "price": "0" }
  }
}
```

### Bağlantı Öneri Yapısı
```typescript
type RelatedLink = {
  slug: string;           // Araç slug'ı
  title: string;          // Tam başlık
  description: string;    // Kısa açıklama
  anchorText: string;     // Bağlantı metni
  relevance: "high" | "medium" | "low";
  category: string;       // Kategori
};
```

## 🔧 Özelleştirme

### Yeni Araç İlişkileri Eklemek
```typescript
// utils/internal-linking.ts
const toolRelationships: Record<string, string[]> = {
  "yeni-arac": ["ilgili-arac-1", "ilgili-arac-2"],
  // ...
};
```

### Anchor Text Önerileri Eklemek
```typescript
const anchorTextSuggestions: Record<string, string[]> = {
  "yeni-arac": [
    "özel hesap yapın",
    "profesyonel çözüm",
    "detaylı analiz"
  ],
  // ...
};
```

### HowTo Step'lerini Özelleştirmek
```typescript
// utils/howto-schema.ts
function extractHowToSteps(tool: ToolConfig, locale: Locale): HowToStepSchema[] {
  // Özel logic ekleyin
  if (tool.id === "special-tool") {
    return [
      // Özel step'ler
    ];
  }

  // Varsayılan logic
  return defaultSteps;
}
```

## 🧪 Test

```bash
# HowTo schema testleri
npm run test:seo

# Internal linking testleri
npm run test:linking

# Tüm testler
npm run test
```

## 📈 SEO Faydaları

### HowTo Schema Faydaları
- **Rich Snippets**: Google'da görsel how-to sonuçları
- **Featured Snippets**: Adım adım rehber gösterimi
- **Voice Search**: "Nasıl yapılır" sorularında görünürlük
- **Click-Through Rate**: Daha yüksek tıklama oranları

### Internal Linking Faydaları
- **Page Authority**: Bağlantı akışı ile sayfa otoritesi
- **Crawl Efficiency**: Arama motorlarının site keşfi
- **User Experience**: İlgili içerik keşfi
- **Dwell Time**: Kullanıcıların sitede kalma süresi

## 🎯 Best Practices

### HowTo Schema
- **4 Adım Limiti**: Karmaşık araçlar için 4 adıma sığdırın
- **Eylem Odaklı**: Her adım spesifik bir eylem içersin
- **Teknik Detaylar**: Gerekli parametreleri belirtin
- **Araç Referansları**: İlgili standartları ekleyin

### Internal Linking
- **Relevance**: Yüksek relevance bağlantılara öncelik
- **Anchor Text**: Anahtar kelime içeren doğal metinler
- **Çeşitlilik**: Farklı kategorilerden bağlantılar
- **Context**: Bağlantı bağlamı içinde mantıklı olsun

## 🔍 Monitoring

### Schema Markup Validation
```javascript
// Google Rich Results Test
// https://search.google.com/test/rich-results

// Schema.org Validator
// https://validator.schema.org/
```

### Internal Linking Analytics
- **Ahrefs/Semrush**: Internal linking raporları
- **Google Search Console**: Index coverage
- **Page Speed Insights**: Core Web Vitals

## 🚀 Production Deployment

1. **Schema Test**: Tüm araç sayfalarında schema validasyonu
2. **Linking Audit**: Internal linking yapısının kontrolü
3. **Performance Test**: Sayfa yükleme hızı etkisi
4. **SEO Monitoring**: Rich snippets görünürlük takibi

## 📚 Referanslar

- [Google HowTo Schema](https://developers.google.com/search/docs/appearance/structured-data/how-to)
- [Schema.org HowTo](https://schema.org/HowTo)
- [Internal Linking Guide](https://ahrefs.com/blog/internal-linking/)
- [Rich Snippets Testing](https://search.google.com/test/rich-results)