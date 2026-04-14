# H1 SEO Audit & Fix Araçları

Bu 3 script, `aiengineerslab.com` Next.js App Router projesindeki eksik `<h1>` etiketlerini
otomatik olarak tespit eder, öneri üretir ve düzeltir.

---

## Kurulum

Scriptleri proje **root** klasörüne (yani `next.config.js` ile aynı dizine) kopyalayın:

```
your-project/
├── app/
├── h1-audit.mjs      ← buraya
├── h1-suggest.mjs    ← buraya
├── h1-fix.mjs        ← buraya
└── next.config.js
```

---

## Adım Adım Kullanım

### 1. Audit — Tüm sayfaları tara

```bash
node h1-audit.mjs
```

Ürettiği dosyalar:
- `h1-audit-report.json` — tam rapor
- `h1-audit-report.csv` — Excel'de açılabilir özet

---

### 2. Öneri — TR/EN H1 metinleri üret

```bash
node h1-suggest.mjs
```

Ürettiği dosyalar:
- `h1-suggestions.json` — her eksik sayfa için önerilen H1
- Konsol tablosu: dosya | mevcut title | öneri TR | öneri EN

---

### 3a. Dry-Run — Değişiklikleri önizle (dosyalara YAZMA)

```bash
node h1-fix.mjs --dry-run
```

---

### 3b. Fix — Gerçekten uygula

> ⚠️ Önce git commit yapın!

```bash
node h1-fix.mjs
```

Tek dosya için:
```bash
node h1-fix.mjs --file=app/tr/tools/gear-calculator/page.tsx
```

Ürettiği dosyalar:
- `*.h1bak` — her değiştirilen dosyanın yedeği
- `h1-fix-log.json` — hangi dosyaya ne yapıldığı

Yedekleri silmek için:
```bash
find . -name "*.h1bak" -delete
```

---

## Araç Sayfaları için Anahtar Kelime Özelleştirmesi

`h1-suggest.mjs` içindeki `TOOL_KEYWORDS` dizisini projenize göre genişletin:

```js
{ pattern: /pump|pompa/i, tr: "Pompa Hesaplayıcı", en: "Pump Calculator", std: "ISO 9906" },
```

---

## Manuel Kontrol Gereken İstisnalar

Script `⚠️` işaretiyle şu durumları işaretler:

| Durum | Neden Manuel? |
|-------|---------------|
| `i18n_key_manual` | Sayfa başlığı sadece çeviri key'inden geliyor, değer bilinemiyor |
| `slug_fallback` | Ne title ne keyword eşleşmesi var, slug'dan tahmin edildi |
| `TODO_comment` | TSX'te `<main>/<section>/<div>` bulunamadı, otomatik ekleme noktası yok |

`h1-suggestions.json` içinde `"needsManualReview": true` olan kayıtları kontrol edin.

---

## i18n Notları

- `app/tr/**` → Türkçe H1 eklenir
- `app/en/**` → İngilizce H1 eklenir
- Route yapısı değişmez; sadece görsel `<h1>` eklenir
- `buildPageMetadata` fonksiyonu **dokunulmaz**

---

## TSX Ekleme Stratejisi (öncelik sırası)

1. `<main ...>` açılış tag'inden hemen sonra
2. `<section ...>` açılış tag'inden hemen sonra
3. `<div className="container...">` içine
4. `return ( <>` fragment'inden sonra
5. ❌ Hiçbiri yoksa → `// TODO:` yorum satırı + manuel kontrol listesi

---

## MDX Ekleme Stratejisi

1. Frontmatter'a `h1: "..."` alanı eklenir
2. Frontmatter'dan sonra `# Başlık` satırı eklenir
3. Frontmatter yoksa yeni frontmatter oluşturulur
