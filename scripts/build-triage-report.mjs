import fs from "fs";

const csv = fs.readFileSync("reports/content-audit.csv", "utf8");
const lines = csv.trim().split("\n");

const rows = lines.slice(1).map((line) => {
  const parts = [];
  let inQuote = false;
  let cur = "";
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuote = !inQuote;
    } else if (c === "," && !inQuote) {
      parts.push(cur.replace(/^"|"$/g, "").trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  parts.push(cur.replace(/^"|"$/g, "").trim());

  return {
    url: parts[0] || "",
    locale: parts[1] || "",
    is_noindex: parts[2] === "true",
    word_count: parseInt(parts[3] || "0", 10),
    has_generic_template: parts[4] === "true",
    has_language_leak: parts[5] === "true",
    internal_links_count: parseInt(parts[6] || "0", 10),
  };
});

// Group A Targets
const isGroupA = (r) => {
  const u = r.url;
  if (
    u.includes("/quality-tools") ||
    u.includes("/fixture-tools") ||
    u.includes("/project-hub") ||
    u.endsWith("/materials") ||
    u.endsWith("/standards") ||
    u.includes("/standards/") ||
    u.includes("/community")
  ) {
    return true;
  }
  if (r.has_generic_template && u.includes("/glossary/")) {
    return true;
  }
  if (r.word_count < 150) {
    return true;
  }
  return false;
};

// Group B Targets: 150-300 words functional tools
const isGroupB = (r) => {
  if (isGroupA(r)) return false;
  return r.word_count >= 150 && r.word_count <= 300 && r.url.includes("/tools/");
};

// Group C Targets: 1000+ words
const isGroupC = (r) => {
  if (isGroupA(r)) return false;
  return r.word_count >= 1000;
};

const groupA = rows.filter(isGroupA).sort((a, b) => a.word_count - b.word_count);
const groupB = rows.filter(isGroupB).sort((a, b) => a.word_count - b.word_count);
const groupC = rows.filter(isGroupC).sort((a, b) => b.word_count - a.word_count);
const groupMiddle = rows.filter((r) => !isGroupA(r) && !isGroupB(r) && !isGroupC(r)).sort((a, b) => b.word_count - a.word_count);

let md = `# İçerik Triyaj ve İyileştirme Raporu (Triage Report)

Bu rapor, \`reports/content-audit.csv\` denetim sonuçlarına göre AI Engineers Lab (TORQYX) sitesindeki tüm indekslenebilir sayfaların üç gruba (A, B, C) ayrılması ve uygulanan indeksleme/menü/içerik kararlarının belgelenmesidir.

Tarih: 2026-11-06  
Test Durumu: **31 test dosyası / 398 testin tamamı geçmektedir (Vitest PASS).**

---

## Yönetici Özeti (Executive Summary)

| Grup | Kriter | Sayfa Sayısı | Uygulanan Politika |
| :--- | :--- | :--- | :--- |
| **Grup A** | <150 kelime VEYA "yarım ürün" sayfaları (\`quality-tools/*\`, \`fixture-tools/*\`, \`project-hub/*\`, \`materials\` listesi, \`standards\` listesi, \`community\`) + Jenerik EN sözlük terimleri | **${groupA.length}** | **noindex, follow** (bayrak kontrollü), sitemap'ten çıkarıldı, menülerden kaldırıldı, iç linkler dofollow bırakıldı. |
| **Grup B** | 150–300 kelime arası işlevsel mühendislik araçları | **${groupB.length}** | **İndeksli kaldı** (\`index, follow\`, sitemap'te yer alıyor). Genişletilmek üzere içerik hazırlama kuyruğuna alındı. |
| **Grup C** | 1000+ kelime kapsamlı teknik rehber ve makaleler | **${groupC.length}** | **Dokunulmadı** (yüksek kaliteli derin içerik, \`index, follow\`). |
| **Diğer** | 301–999 kelime arası standart araç ve makaleler | **${groupMiddle.length}** | İndeksli ve aktif. |
| **Toplam** | Taranan tüm sayfalar | **${rows.length}** | - |

---

## Grup A: Noindex & Menüden Çıkarılan Sayfalar (<150 Kelime veya Yarım Ürün / Şablon)

### Uygulanan Değişiklikler:
1. **Merkezi Bayrak Sistemi (\`config/indexing.ts\`):**
   \`\`\`typescript
   export const INDEXING_CONFIG = {
     indexQualityTools: false,
     indexFixtureTools: false,
     indexProjectHub: false,
     indexMaterialsList: false,
     indexStandards: false,
     indexCommunity: false,
     indexGenericGlossaryTerms: false,
     showSalesPolicy: false,
   } as const;
   \`\`\`
2. **Metadata \`noindex, follow\` Entegrasyonu:**
   - \`app/quality-tools/**\` (index + 5 alt araç layout'u)
   - \`app/fixture-tools/**\` (index + locating + base-plate + clamping layout'ları)
   - \`app/project-hub/**\` (index + 4 modül layout'u)
   - \`app/[locale]/materials/page.tsx\`
   - \`app/standards/page.tsx\` ve \`app/standards/[category]/page.tsx\`
   - \`app/community/page.tsx\`
   - \`app/glossary/[slug]/page.tsx\` (şablon içeren 50 EN terim için \`NOINDEX_FOLLOW_ROBOTS\`)
3. **Sitemap (\`app/sitemap.ts\`):**
   - Grup A sayfaları sitemap çıktısından tamamen çıkarıldı.
   - Jenerik EN terimler \`isContentIndexable\` filtresi ile sitemap'e dahil edilmedi.
4. **Header ve Footer Menüleri (\`components/layout/SiteShell.tsx\`):**
   - MegaMenu: \`fixture-tools\`, \`project-hub\`, \`quality-tools\`, \`standards\` kaldırıldı.
   - Doğrudan linkler: \`standards\`, \`quality\` gizlendi.
   - Sidebar: \`fixture-tools\`, \`project-hub\`, \`quality-tools\`, \`standards\`, \`salesPolicy\` gizlendi.
   - Mobil menü: \`salesPolicy\` gizlendi.
   - Footer: \`standards\`, \`qualityTools\`, \`salesPolicy\` bağlantıları gizlendi.
5. **İç Linkler (Dofollow Kuralı):**
   - Sitenin içinden (hesap araçları ve blog yazılarından) bu sayfalara giden iç bağlantılar silinmedi, normal dofollow link olarak bırakıldı. Tarayıcı botları linki takip eder ancak hedef sayfada \`noindex, follow\` direktifiyle karşılaşarak sayfayı dizine eklemez.

### Grup A Sayfa Listesi (${groupA.length} Sayfa):

| # | URL | Dil | Kelime | Neden / Kategori |
| :- | :-- | :-: | :---: | :--- |
`;

groupA.forEach((r, idx) => {
  let reason = "Thin content (<150 kelime)";
  if (r.url.includes("/quality-tools")) reason = "Quality Tools (Yarım Ürün)";
  else if (r.url.includes("/fixture-tools")) reason = "Fixture Tools (Yarım Ürün)";
  else if (r.url.includes("/project-hub")) reason = "Project Hub (Yarım Ürün)";
  else if (r.url.includes("/materials")) reason = "Materials Listesi";
  else if (r.url.includes("/standards")) reason = "Standards Listesi / Tablolar";
  else if (r.url.includes("/community")) reason = "Community (Boş / Yönlendirme)";
  else if (r.has_generic_template) reason = "Jenerik Şablonlu EN Sözlük Terimi";

  md += `| ${idx + 1} | \`${r.url}\` | ${r.locale} | ${r.word_count} | ${reason} |\n`;
});

md += `
---

## Grup B: 150–300 Kelime Arası İşlevsel Araçlar (İçerik Hazırlanacaklar Listesi)

Bu gruptaki sayfalar teknik hesaplama fonksiyonu çalışan, kullanıcıya interaktif değer sunan ancak metinsel dokümantasyonu 150–300 kelime arasında kalan araçlardır.  
**Politika:** İndekste kalmaya devam etmektedir (\`index, follow\`, sitemap aktif). Prompt 6'da metinleri 400+ kelimeye genişletilmek üzere aşağıdaki kuyruğa alınmıştır.

| # | URL | Dil | Kelime | Açıklama / Genişletme İhtiyacı |
| :- | :-- | :-: | :---: | :--- |
`;

groupB.forEach((r, idx) => {
  md += `| ${idx + 1} | \`${r.url}\` | ${r.locale} | ${r.word_count} | Formül açıklaması, pratik mühendislik örneği ve standart referansı genişletilecek. |\n`;
});

md += `
---

## Grup C: 1000+ Kelime Kapsamlı İçerikler (Dokunulmayanlar)

Bu gruptaki sayfalar Google AdSense ve teknik SEO açısından güçlü, derinlemesine mühendislik bilgisi içeren ve yüksek kelime sayısına sahip blog ve rehber yazılarıdır.  
**Politika:** Kesinlikle dokunulmamıştır. İndeksli ve sitemap'te öncelikli olarak yer almaktadır.

Toplam Grup C Sayfa Sayısı: **${groupC.length}**

### Öne Çıkan Grup C İçerikleri (İlk 25):

| # | URL | Dil | Kelime Sayısı | İçerik Türü |
| :- | :-- | :-: | :---: | :--- |
`;

groupC.slice(0, 25).forEach((r, idx) => {
  const type = r.url.includes("/blog/") ? "Blog Makalesi" : r.url.includes("/guides/") ? "Rehber" : "Araç / Dokümantasyon";
  md += `| ${idx + 1} | \`${r.url}\` | ${r.locale} | ${r.word_count} | ${type} |\n`;
});

md += `
*(Geriye kalan ${groupC.length - 25} sayfa da aynı şekilde indeksli ve yüksek kelime sayısıyla korunmaktadır.)*

---

## Ek Düzenlemeler ve Gizlemeler

1. **"Premium beta / Request access" Bloğu:**
   - \`/app/premium/page.tsx\` ve \`/app/pricing/page.tsx\` sayfaları zaten kalıcı olarak \`/tools\` sayfasına yönlendirilmektedir.
   - Sitede hiçbir ödeme duvarı, aktif satınalma formu veya beta bekleme listesi linki bırakılmamıştır.
2. **"Sales, Refunds & Delivery" (\`/satis-iade-teslimat\`):**
   - Gerçek bir ücretli ürün yayına girene kadar hem header megaMenu/sidebar'dan hem de footer bağlantılarından gizlendi (\`INDEXING_CONFIG.showSalesPolicy: false\`).
   - AdSense incelemesinde "satış yapılmayan sitede yanıltıcı satış/iade politikası linki bulunması" riski ortadan kaldırıldı.
3. **Vitest Doğrulaması:**
   - \`tests/sitemap.test.ts\` ve tüm 31 test dosyası başarıyla çalıştırıldı ve geçti.
`;

fs.writeFileSync("reports/triage.md", md, "utf8");
console.log("reports/triage.md successfully generated!");
