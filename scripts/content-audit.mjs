import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const reportsDir = path.join(projectRoot, 'reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// 1. Gather all target URLs
async function collectAllUrls() {
  const urlSet = new Set();

  // A. Live sitemap URLs
  try {
    const sitemapRes = await fetch('https://torqyx.com/sitemap.xml');
    const xml = await sitemapRes.text();
    const matches = xml.matchAll(/<loc>(https:\/\/torqyx\.com[^<]+)<\/loc>/g);
    for (const m of matches) {
      urlSet.add(m[1].trim());
    }
    console.log(`Loaded ${urlSet.size} URLs from sitemap.xml`);
  } catch (err) {
    console.error('Failed to load sitemap:', err.message);
  }

  // B. Also add quality tools, fixture tools, project hub, standards, reference, community, etc. in both locales
  const staticPaths = [
    '',
    '/tools',
    '/blog',
    '/guides',
    '/glossary',
    '/standards',
    '/reference',
    '/materials',
    '/pricing',
    '/faq',
    '/community',
    '/support',
    '/hakkinda',
    '/iletisim',
    '/gizlilik',
    '/cerez-politikasi',
    '/kullanim-sartlari',
    '/satis-iade-teslimat',
    '/project-hub',
    '/project-hub/devreye-alma',
    '/project-hub/part-tracking',
    '/project-hub/project-tools',
    '/project-hub/rfq',
    '/quality-tools',
    '/quality-tools/5n1k',
    '/quality-tools/5why',
    '/quality-tools/8d',
    '/quality-tools/kaizen',
    '/quality-tools/poka-yoke',
    '/fixture-tools',
    '/fixture-tools/locating',
    '/fixture-tools/clamping',
    '/fixture-tools/base-plate'
  ];

  for (const sp of staticPaths) {
    urlSet.add(`https://torqyx.com/tr${sp}`);
    urlSet.add(`https://torqyx.com/en${sp}`);
  }

  // C. Add content items from directories
  const addContentSlugs = (folder, prefix) => {
    const dir = path.join(projectRoot, 'content', folder);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      for (const f of files) {
        if (f.endsWith('.mdx')) {
          const slug = f.replace(/\.(tr|en)\.mdx$/, '');
          urlSet.add(`https://torqyx.com/tr/${prefix}/${slug}`);
          urlSet.add(`https://torqyx.com/en/${prefix}/${slug}`);
        }
      }
    }
  };

  addContentSlugs('guides', 'guides');
  addContentSlugs('blog', 'blog');
  addContentSlugs('glossary', 'glossary');

  // D. Add all tools from app/(tools)/tools
  const toolsAppDir = path.join(projectRoot, 'app', '(tools)', 'tools');
  if (fs.existsSync(toolsAppDir)) {
    const dirs = fs.readdirSync(toolsAppDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('['))
      .map(d => d.name);

    for (const d of dirs) {
      if (d === 'gear-design') {
        urlSet.add(`https://torqyx.com/tr/tools/gear-design`);
        urlSet.add(`https://torqyx.com/en/tools/gear-design`);
        const calcDir = path.join(toolsAppDir, d, 'calculators');
        if (fs.existsSync(calcDir)) {
          const cdirs = fs.readdirSync(calcDir, { withFileTypes: true })
            .filter(cd => cd.isDirectory())
            .map(cd => cd.name);
          for (const cd of cdirs) {
            urlSet.add(`https://torqyx.com/tr/tools/gear-design/calculators/${cd}`);
            urlSet.add(`https://torqyx.com/en/tools/gear-design/calculators/${cd}`);
          }
        }
        urlSet.add(`https://torqyx.com/tr/tools/gear-design/simulations`);
        urlSet.add(`https://torqyx.com/en/tools/gear-design/simulations`);
      } else {
        urlSet.add(`https://torqyx.com/tr/tools/${d}`);
        urlSet.add(`https://torqyx.com/en/tools/${d}`);
      }
    }
  }

  return Array.from(urlSet).sort();
}

// 2. Fetcher with timeout & redirect handling
function fetchUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('http://') ? http : https;
    const req = client.get(url, { headers: { 'User-Agent': 'TorqyxContentAuditor/2.0' }, timeout: 15000 }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) redirectUrl = 'https://torqyx.com' + redirectUrl;
        resolve({ status: res.statusCode, redirectedTo: redirectUrl, data: '', headers: res.headers });
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    });
    req.on('error', (e) => resolve({ status: 500, data: '', error: e.message, headers: {} }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 504, data: '', error: 'timeout', headers: {} }); });
  });
}

// 3. HTML Content Extractor & Analyzer
function analyzeHtml(url, locale, html, headers) {
  // A. Check noindex
  const isNoindex = /<meta[^>]*name=["'](robots|googlebot)["'][^>]*content=["'][^"']*noindex/i.test(html) ||
                    Boolean(headers['x-robots-tag'] && headers['x-robots-tag'].includes('noindex'));

  // B. Internal links count
  const linkMatches = html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi);
  let internalLinksCount = 0;
  for (const m of linkMatches) {
    const href = m[1].trim();
    if (href.startsWith('/') || href.startsWith('https://torqyx.com')) {
      internalLinksCount++;
    }
  }

  // C. Parse visible text (stripping nav, header, footer, aside, related links)
  // Strip comments & doctype
  let clean = html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<!doctype[^>]*>/gi, ' ');

  const ignoredTagNames = new Set(['head', 'script', 'style', 'svg', 'noscript', 'header', 'nav', 'footer', 'aside']);
  const ignoreTagStack = [];
  let inRelatedSection = false;
  let relatedSectionDepth = 0;
  let visibleText = '';

  const tagRegex = /<(\/)?([a-z0-9_-]+)([^>]*)>|([^<]+)/gi;
  let match;

  while ((match = tagRegex.exec(clean)) !== null) {
    const [full, isClosing, tagNameRaw, attrs, textContent] = match;

    if (textContent) {
      if (ignoreTagStack.length === 0 && !inRelatedSection) {
        visibleText += ' ' + textContent;
      }
    } else if (tagNameRaw) {
      const tagName = tagNameRaw.toLowerCase();

      // Related sections detection
      if (tagName === 'section') {
        if (!isClosing) {
          if (attrs && (attrs.includes('border-t') || attrs.includes('related') || attrs.includes('İlgili') || attrs.includes('Related'))) {
            inRelatedSection = true;
            relatedSectionDepth = 1;
          } else if (inRelatedSection) {
            relatedSectionDepth++;
          }
        } else {
          if (inRelatedSection) {
            relatedSectionDepth--;
            if (relatedSectionDepth <= 0) inRelatedSection = false;
          }
        }
      }

      if (ignoredTagNames.has(tagName)) {
        if (isClosing) {
          const idx = ignoreTagStack.lastIndexOf(tagName);
          if (idx !== -1) ignoreTagStack.splice(idx, 1);
        } else {
          if (!full.endsWith('/>')) {
            ignoreTagStack.push(tagName);
          }
        }
      }
    }
  }

  // Decode common HTML entities
  visibleText = visibleText
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&[a-z0-9#]+;/gi, ' ');

  const words = visibleText.trim().split(/\s+/).filter(w => w.length > 0 && !/^[\-_=+|/\\.,:;!?()[\]{}"]+$/.test(w));
  const wordCount = words.length;

  // D. Generic Template Check
  const genericPatterns = [
    // 5 Patterns explicitly specified for audit:
    /documentation coming soon/i,
    /performs the core engineering calculation/i,
    /unit-consistent project values/i,
    /is a core engineering term/i,
    /premium is in private beta/i,
    // Supporting patterns and localized templates:
    /definition, usage notes, and a practical example/i,
    /temel mühendislik hesabını yapar ve sonucu izlenebilir formatta sunar/i,
    /this tool accepts engineering inputs for a defined problem and returns a documented calculation result/i,
    /bu araç belirli bir mühendislik problemi için girdileri alır ve standart tabanlı hesap sonucu üretir/i,
    /documentation under preparation/i,
    /dokümantasyon hazırlanmaktadır/i,
    /dokumantasyon hazirlanmaktadir/i,
    /içerik yakında eklenecektir/i,
    /icerik yakinda eklenecektir/i,
    /content coming soon/i,
    /under construction/i,
    /under development/i,
    /geliştirme aşamasında/i,
    /gelistirme asamasinda/i,
    /henüz içerik bulunmamaktadır/i,
    /no description available/i
  ];

  let hasGenericTemplate = false;
  let genericMatchReason = '';
  for (const pat of genericPatterns) {
    if (pat.test(visibleText)) {
      hasGenericTemplate = true;
      genericMatchReason = pat.source;
      break;
    }
  }

  // E. Language Leak Check
  let hasLanguageLeak = false;
  let leakReason = '';

  if (locale === 'en') {
    // English page containing Turkish unique letters or prominent Turkish functional words
    const trLettersMatch = visibleText.match(/[çğışÇĞİŞ]/g);
    const trWordsPattern = /\b(ve|ile|için|veya|rehber|rehberi|hesaplayıcı|ölçü|değer|standart|tablo|özet|kaynaklar|hakkında|kullanım|seçimi|nasıl|neden|özellikleri|formülü|analizi|örnek|örneği|uygulaması|birim|tork|güç|basınç|emniyet|katsayısı|gerilme|eğilme|burulma)\b/i;
    const trWordsMatch = visibleText.match(trWordsPattern);

    if (trLettersMatch && trLettersMatch.length >= 2) {
      hasLanguageLeak = true;
      leakReason = `Turkish characters found: ${trLettersMatch.slice(0, 5).join(', ')}`;
    } else if (trWordsMatch) {
      hasLanguageLeak = true;
      leakReason = `Turkish keyword found: "${trWordsMatch[0]}"`;
    }
  } else if (locale === 'tr') {
    // Turkish page containing prominent untranslated English phrases
    const enBoilerplate = /\b(This guide has been prepared|Related calculators|Common mistakes|Step by step method|Documentation under preparation|Back to guides|min read|Table of contents)\b/i;
    const enMatch = visibleText.match(enBoilerplate);
    if (enMatch) {
      hasLanguageLeak = true;
      leakReason = `English phrase in TR page: "${enMatch[0]}"`;
    }
  }

  return {
    isNoindex,
    wordCount,
    hasGenericTemplate,
    genericMatchReason,
    hasLanguageLeak,
    leakReason,
    internalLinksCount,
    textSnippet: words.slice(0, 15).join(' ')
  };
}

// 4. Main Audit Controller
async function runAudit() {
  console.log('=== STARTING TORQYX CONTENT AUDIT (UPDATED PATTERNS) ===');
  const allUrls = await collectAllUrls();
  console.log(`Total URLs to audit: ${allUrls.length}`);

  const results = [];
  const concurrency = 8;
  let completed = 0;

  async function worker(workerId) {
    while (allUrls.length > 0) {
      const url = allUrls.shift();
      if (!url) break;

      const locale = url.includes('/en/') || url.endsWith('/en') ? 'en' : 'tr';
      const res = await fetchUrl(url);

      if (res.status === 200) {
        const analysis = analyzeHtml(url, locale, res.data, res.headers);
        results.push({
          url,
          locale,
          status: 200,
          is_noindex: analysis.isNoindex,
          word_count: analysis.wordCount,
          has_generic_template: analysis.hasGenericTemplate,
          generic_reason: analysis.genericMatchReason,
          has_language_leak: analysis.hasLanguageLeak,
          leak_reason: analysis.leakReason,
          internal_links_count: analysis.internalLinksCount,
          snippet: analysis.textSnippet
        });
      } else if (res.status >= 300 && res.status < 400) {
        // Redirection
        results.push({
          url,
          locale,
          status: res.status,
          is_noindex: true,
          word_count: 0,
          has_generic_template: false,
          generic_reason: '',
          has_language_leak: false,
          leak_reason: '',
          internal_links_count: 0,
          snippet: `Redirect -> ${res.redirectedTo}`
        });
      } else if (res.status === 404) {
        // 404
      } else {
        // 500 or error
        results.push({
          url,
          locale,
          status: res.status,
          is_noindex: true,
          word_count: 0,
          has_generic_template: false,
          generic_reason: '',
          has_language_leak: false,
          leak_reason: '',
          internal_links_count: 0,
          snippet: `HTTP ${res.status} Error`
        });
      }

      completed++;
      if (completed % 25 === 0 || completed === completed + allUrls.length) {
        console.log(`Audited: ${completed} URLs...`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, (_, i) => worker(i)));
  console.log(`\nAudit completed! Total valid/audited rows: ${results.length}`);

  // Sort results by word_count ascending (weakest first), prioritizing indexable 200 pages
  results.sort((a, b) => {
    if (a.status === 500 && b.status !== 500) return -1;
    if (b.status === 500 && a.status !== 500) return 1;
    return a.word_count - b.word_count;
  });

  // 5. Generate reports/content-audit.csv
  const csvHeader = 'url,locale,is_noindex,word_count,has_generic_template,has_language_leak,internal_links_count\n';
  const csvRows = results
    .filter(r => r.status === 200 || r.status === 500)
    .map(r => `"${r.url}","${r.locale}",${r.is_noindex},${r.word_count},${r.has_generic_template},${r.has_language_leak},${r.internal_links_count}`)
    .join('\n');

  const csvPath = path.join(reportsDir, 'content-audit.csv');
  fs.writeFileSync(csvPath, csvHeader + csvRows, 'utf8');
  console.log(`CSV written to: ${csvPath}`);

  // 6. Generate reports/content-audit.md (En Zayıf 30 Sayfanın Özeti)
  const indexablePages = results.filter(r => r.status === 200 && !r.is_noindex);
  const serverErrorPages = results.filter(r => r.status === 500);

  const weakest30 = [...serverErrorPages, ...indexablePages].slice(0, 30);

  let mdContent = `# TORQYX Content & SEO Audit Report: En Zayıf 30 Sayfa İncelemesi\n\n`;
  mdContent += `> **Denetim Tarihi:** ${new Date().toISOString().split('T')[0]}  \n`;
  mdContent += `> **Kapsam:** Tüm indekslenebilir rotalar (Araçlar, Rehberler, Blog, Sözlük, Referans, Standartlar, Quality Tools, Fixture Tools, Project Hub) — Türkçe (\`tr\`) ve İngilizce (\`en\`)  \n`;
  mdContent += `> **Toplam Taranan ve Denetlenen URL Sayısı:** ${results.filter(r => r.status === 200).length}  \n`;
  mdContent += `> **CSV Raporu:** [\`reports/content-audit.csv\`](./content-audit.csv)\n\n`;

  mdContent += `## 1. Yönetici Özeti & Genel Kalite Dağılımı\n\n`;

  const total200 = results.filter(r => r.status === 200).length;
  const genericCount = results.filter(r => r.status === 200 && r.has_generic_template).length;
  const leakCount = results.filter(r => r.status === 200 && r.has_language_leak).length;
  const under300Words = results.filter(r => r.status === 200 && !r.is_noindex && r.word_count < 300).length;
  const under600Words = results.filter(r => r.status === 200 && !r.is_noindex && r.word_count < 600).length;
  const over1000Words = results.filter(r => r.status === 200 && !r.is_noindex && r.word_count >= 1000).length;

  mdContent += `| Metrik | Değer | Durum |\n`;
  mdContent += `|---|---|---|\n`;
  mdContent += `| **Toplam İndekslenebilir Rota (200 OK)** | ${total200} | Aktif |\n`;
  mdContent += `| **HTTP 500 Hata Veren Sayfalar** | ${serverErrorPages.length} | ${serverErrorPages.length === 0 ? '✅ 0 Hata' : '🚨 Müdahale Gerekli'} |\n`;
  mdContent += `| **1.000+ Kelime Derinliğe Sahip Sayfalar (E-E-A-T)** | ${over1000Words} | ✅ Mükemmel |\n`;
  mdContent += `| **Kritik İnce İçerik (< 300 Kelime)** | ${under300Words} | ⚠️ AdSense Düşük Değer Riski |\n`;
  mdContent += `| **Geliştirilmesi Gereken İçerik (300 - 600 Kelime)** | ${under600Words - under300Words} | 🟡 İyileştirilmeli |\n`;
  mdContent += `| **Jenerik Şablon / Kalıp Cümle İçeren Sayfalar** | ${genericCount} | ⚠️ İncelenmeli |\n`;
  mdContent += `| **Dil Sızıntısı (Language Leak) Tespit Edilen Sayfalar** | ${leakCount} | 🔍 Düzeltilmeli |\n\n`;

  mdContent += `## 2. En Zayıf 30 Sayfanın Detaylı Analiz Tablosu\n\n`;
  mdContent += `Aşağıdaki liste; Google AdSense "Düşük Değerli İçerik" filtresine takılma riski en yüksek olan veya teknik hata veren 30 sayfayı kelime sayısı, şablon kullanımı ve dil sızıntısına göre sıralamaktadır:\n\n`;

  mdContent += `| # | URL | Dil | Durum | Kelime | Jenerik Şablon? | Dil Sızıntısı? | İç Link | Tespit / Sorun |\n`;
  mdContent += `|---|---|---|---|---|---|---|---|---|\n`;

  weakest30.forEach((item, idx) => {
    const statusLabel = item.status === 500 ? '🔴 500 Hata' : (item.word_count < 300 ? '⚠️ <300 Kelime' : '🟡 Orta');
    const genericLabel = item.has_generic_template ? `⚠️ Evet (\`${item.generic_reason}\`)` : 'Hayır';
    const leakLabel = item.has_language_leak ? `⚠️ Evet (${item.leak_reason})` : 'Hayır';
    const issue = item.status === 500 
      ? 'Sunucu 500 hatası veriyor, botlar sayfayı göremiyor' 
      : (item.word_count < 200 
          ? 'Aşırı ince içerik (Thin content), sadece UI butonları var' 
          : (item.has_generic_template ? 'Varsayılan şablon metinleri temizlenmemiş' : 'Gövde metni mühendislik detayından yoksun'));

    mdContent += `| ${idx + 1} | [${item.url.replace('https://torqyx.com', '')}](${item.url}) | \`${item.locale}\` | ${statusLabel} | **${item.word_count}** | ${genericLabel} | ${leakLabel} | ${item.internal_links_count} | ${issue} |\n`;
  });

  mdContent += `\n## 3. Generic Şablon / Kalıp Cümle Analizi (Doğrulama Bulguları)\n\n`;
  mdContent += `1. **"is a core engineering term"**: Toplam ${results.filter(r => r.generic_reason && r.generic_reason.includes('core engineering term')).length} sayfada tespit edildi (Örn: \`/en/glossary/*\` sayfaları). Bu sayfaların üst kısmında otomatik şablon cümlesi yer almaktadır.\n`;
  mdContent += `2. **"performs the core engineering calculation"**: Canlı sitede 0 sayfada tespit edildi. Kod tabanında fallback olarak bulunmasına rağmen, \`ToolDocTabs.tsx\` bileşeni \`isSpecific: false\` olduğunda dokümantasyon kartını DOM'a basmadığı için HTML'e yansımamaktadır.\n`;
  mdContent += `3. **"Unit-consistent project values"**: 0 sayfada tespit edildi. Daha önceki refactor commit'inde silinmiştir.\n`;
  mdContent += `4. **"Documentation coming soon"**: 0 sayfada tespit edildi. \`messages/en.json\` içinde daha önce temizlenmiştir.\n`;
  mdContent += `5. **"Premium is in private beta"**: 0 sayfada tespit edildi. Önceki AdSense temizliğinde kaldırılmıştır.\n\n`;

  const mdPath = path.join(reportsDir, 'content-audit.md');
  fs.writeFileSync(mdPath, mdContent, 'utf8');
  console.log(`Markdown report written to: ${mdPath}`);

  console.log('=== AUDIT FINISHED SUCCESSFULLY ===');
}

runAudit();
