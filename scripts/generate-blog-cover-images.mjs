import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 900;

const POSTS = [
  {
    slug: "bilyali-rulman-mi-makarali-rulman-mi",
    label: "BALL / ROLLER",
    motif: "bearing-choice",
    alt: "Bilyali ve makarali rulman secimini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz rulman karsilastirma gorseli.",
  },
  {
    slug: "boru-capi-seciminde-hiz-ve-basinc-dengesi",
    label: "PIPE SIZING",
    motif: "pipe-diameter",
    alt: "Boru capi, hiz ve basinc dengesini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz boru capi secimi gorseli.",
  },
  {
    slug: "civata-gevsemesinin-5-ana-nedeni",
    label: "BOLT LOOSENING",
    motif: "bolt-loosening",
    alt: "Civata gevsemesi ve titresim etkisini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz civata gevsemesi gorseli.",
  },
  {
    slug: "civata-mukavemet-siniflari-8-8-10-9-12-9",
    label: "8.8 / 10.9 / 12.9",
    motif: "bolt-strength",
    alt: "Civata mukavemet siniflarini karsilastiran teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz civata mukavemet sinifi gorseli.",
  },
  {
    slug: "civata-on-yuk-kuvveti-nedir",
    label: "PRELOAD FORCE",
    motif: "bolt-preload",
    alt: "Civata on yuk kuvvetini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz civata on yuk gorseli.",
  },
  {
    slug: "darcy-weisbach-denklemi-boru-basinc-kaybi",
    label: "DARCY DROP",
    motif: "pipe-darcy",
    alt: "Darcy Weisbach basinc kaybi hesabini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz Darcy Weisbach gorseli.",
  },
  {
    slug: "din-931-ve-din-933-farki",
    label: "DIN 931 / 933",
    motif: "bolt-din",
    alt: "DIN 931 ve DIN 933 civata farkini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz DIN 931 ve DIN 933 gorseli.",
  },
  {
    slug: "dinamik-ve-statik-yuk-kapasitesi-c-ve-c0",
    label: "C / C0 LOAD",
    motif: "bearing-load",
    alt: "Rulman dinamik ve statik yuk kapasitesini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz C ve C0 rulman yuk gorseli.",
  },
  {
    slug: "disli-modulu-nedir-nasil-secilir",
    label: "GEAR MODULE",
    motif: "gear-module",
    alt: "Disli modulu secimini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz disli modulu gorseli.",
  },
  {
    slug: "disli-omrunu-kisaltan-tasarim-hatalari",
    label: "GEAR LIFE",
    motif: "gear-life",
    alt: "Disli omrunu kisaltan tasarim hatalarini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz disli omru ve hata gorseli.",
  },
  {
    slug: "disli-orani-hesabi",
    label: "GEAR RATIO",
    motif: "gear-ratio",
    alt: "Disli orani hesabini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz disli orani gorseli.",
  },
  {
    slug: "duz-disli-mi-helisel-disli-mi",
    label: "SPUR / HELICAL",
    motif: "gear-helical",
    alt: "Duz disli ve helisel disli farkini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz duz ve helisel disli gorseli.",
  },
  {
    slug: "evolvent-dis-profili-nedir",
    label: "INVOLUTE",
    motif: "gear-involute",
    alt: "Evolvent dis profilini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz evolvent dis profili gorseli.",
  },
  {
    slug: "excel-ile-muhendislik-hesabi-yapmanin-7-riski",
    label: "CALC RISKS",
    motif: "sheet-risk",
    alt: "Muhendislik hesaplarinda tablo ve form risklerini gosteren blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz hesap tablosu risk gorseli.",
  },
  {
    slug: "hidrolik-silindir-kuvveti-nasil-hesaplanir",
    label: "HYD CYLINDER",
    motif: "hydraulic-cylinder",
    alt: "Hidrolik silindir kuvveti hesabini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz hidrolik silindir gorseli.",
  },
  {
    slug: "iso-din-vdi-standartlari-arasindaki-fark",
    label: "ISO DIN VDI",
    motif: "standards",
    alt: "ISO DIN ve VDI standartlarini karsilastiran teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz muhendislik standartlari gorseli.",
  },
  {
    slug: "l10-rulman-omru-nedir-nasil-hesaplanir",
    label: "L10 LIFE",
    motif: "bearing-life",
    alt: "L10 rulman omru hesabini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz L10 rulman omru gorseli.",
  },
  {
    slug: "metrik-ve-inc-vida-adimi-farklari",
    label: "THREAD PITCH",
    motif: "bolt-pitch",
    alt: "Metrik ve inc vida adimi farklarini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz vida adimi karsilastirma gorseli.",
  },
  {
    slug: "mil-gobek-baglantisi-kamali-flansli-gecme-cakma",
    label: "SHAFT HUB",
    motif: "shaft-hub",
    alt: "Mil gobek baglantisi seceneklerini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz mil gobek baglantisi gorseli.",
  },
  {
    slug: "motor-seciminde-tork-egrisi-nasil-okunur",
    label: "TORQUE CURVE",
    motif: "motor-curve",
    alt: "Motor tork egrisini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz motor tork egrisi gorseli.",
  },
  {
    slug: "muhendislik-hesaplarinda-guvenlik-katsayisi",
    label: "SAFETY FACTOR",
    motif: "safety-factor",
    alt: "Muhendislik hesaplarinda guvenlik katsayisini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz guvenlik katsayisi gorseli.",
  },
  {
    slug: "paslanmaz-celik-civata-mi-galvanizli-mi",
    label: "FASTENER FINISH",
    motif: "bolt-finish",
    alt: "Paslanmaz celik ve galvanizli civata secimini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz civata kaplama karsilastirma gorseli.",
  },
  {
    slug: "reduktor-seciminde-5-kriter",
    label: "GEARBOX",
    motif: "gearbox",
    alt: "Reduktor secim kriterlerini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz reduktor secim gorseli.",
  },
  {
    slug: "reynolds-sayisi-laminar-turbulansli-akis",
    label: "REYNOLDS",
    motif: "pipe-reynolds",
    alt: "Laminar ve turbulansli akis ayrimini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz Reynolds sayisi gorseli.",
  },
  {
    slug: "rulman-toleranslari-iso-286-sistemi",
    label: "ISO 286 FIT",
    motif: "bearing-tolerance",
    alt: "Rulman toleranslari ve gecme sistemini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz rulman toleransi gorseli.",
  },
  {
    slug: "saft-boyutlandirma-tork-burulma-gerilmesi",
    label: "SHAFT TORSION",
    motif: "shaft-torsion",
    alt: "Saft boyutlandirma ve burulma gerilmesini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz saft burulma gorseli.",
  },
  {
    slug: "tork-anahtari-nasil-dogru-kullanilir",
    label: "TORQUE WRENCH",
    motif: "bolt-wrench",
    alt: "Tork anahtari kullanimini gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz tork anahtari gorseli.",
  },
  {
    slug: "tork-katsayisi-k-faktoru-nedir",
    label: "K FACTOR",
    motif: "bolt-k-factor",
    alt: "Tork katsayisi K faktorunu gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz K faktoru gorseli.",
  },
  {
    slug: "tork-ve-guc-arasindaki-fark",
    label: "TORQUE POWER",
    motif: "torque-power",
    alt: "Tork ve guc arasindaki farki gosteren teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz tork ve guc gorseli.",
  },
  {
    slug: "zincir-kasnak-sistemi-mi-disli-kutusu-mu",
    label: "CHAIN / GEAR",
    motif: "chain-gearbox",
    alt: "Zincir kasnak sistemi ile disli kutusunu karsilastiran teknik blog gorseli",
    caption: "Bu yazi icin olusturulan benzersiz zincir kasnak ve disli kutusu gorseli.",
  },
];

const PALETTES = [
  { bg1: "#f5fbf8", bg2: "#e8f7ef", accent: "#0f766e", accent2: "#f59e0b", line: "#0f172a" },
  { bg1: "#f8fafc", bg2: "#e0f2fe", accent: "#0369a1", accent2: "#e11d48", line: "#111827" },
  { bg1: "#fff7ed", bg2: "#ffedd5", accent: "#c2410c", accent2: "#2563eb", line: "#172554" },
  { bg1: "#f9fafb", bg2: "#dcfce7", accent: "#15803d", accent2: "#9333ea", line: "#1f2937" },
  { bg1: "#fdf2f8", bg2: "#e0e7ff", accent: "#7e22ce", accent2: "#059669", line: "#312e81" },
  { bg1: "#f8fafc", bg2: "#fee2e2", accent: "#b91c1c", accent2: "#0891b2", line: "#1e293b" },
];

const repoRoot = process.cwd();
const outputDir = path.join(repoRoot, "public", "images", "blog");

const xml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const rotate = (x, y, cx, cy, deg) => {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: cx + (x - cx) * cos - (y - cy) * sin,
    y: cy + (x - cx) * sin + (y - cy) * cos,
  };
};

const gearPoints = (cx, cy, radius, teeth, depth = 22, rotation = 0) => {
  const points = [];
  for (let i = 0; i < teeth * 2; i += 1) {
    const angle = ((Math.PI * 2) / (teeth * 2)) * i - Math.PI / 2 + (rotation * Math.PI) / 180;
    const r = i % 2 === 0 ? radius + depth : radius - depth;
    points.push(`${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`);
  }
  return points.join(" ");
};

const gear = (cx, cy, radius, teeth, p, fill = "rgba(255,255,255,0.72)", rotation = 0) => `
  <polygon points="${gearPoints(cx, cy, radius, teeth, 24, rotation)}" fill="${fill}" stroke="${p.line}" stroke-width="7" stroke-linejoin="round"/>
  <circle cx="${cx}" cy="${cy}" r="${radius * 0.48}" fill="${p.bg1}" stroke="${p.line}" stroke-width="7"/>
  <circle cx="${cx}" cy="${cy}" r="${radius * 0.16}" fill="${p.accent2}" opacity="0.9"/>
`;

const dimensionLine = (x1, y1, x2, y2, label, p) => `
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${p.accent2}" stroke-width="5" marker-start="url(#dot)" marker-end="url(#arrow)"/>
  <text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 12}" text-anchor="middle" class="small" fill="${p.line}">${xml(label)}</text>
`;

const boltBody = (x, y, height, p, options = {}) => {
  const width = options.width ?? 70;
  const threadHeight = options.threadHeight ?? height * 0.48;
  const headHeight = options.headHeight ?? 48;
  const shankHeight = height - headHeight;
  const bottom = y + height;
  const threadTop = bottom - threadHeight;
  const threadLines = Array.from({ length: Math.max(5, Math.round(threadHeight / 22)) }, (_, index) => {
    const yy = threadTop + index * 22;
    return `<line x1="${x - width / 2}" y1="${yy}" x2="${x + width / 2}" y2="${yy + 13}" stroke="${p.line}" stroke-width="4" opacity="0.72"/>`;
  }).join("");

  return `
    <polygon points="${x - width * 0.62},${y + headHeight * 0.3} ${x - width * 0.28},${y} ${x + width * 0.28},${y} ${x + width * 0.62},${y + headHeight * 0.3} ${x + width * 0.48},${y + headHeight} ${x - width * 0.48},${y + headHeight}" fill="${p.accent}" stroke="${p.line}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="${x - width / 2}" y="${y + headHeight}" width="${width}" height="${shankHeight}" rx="14" fill="rgba(255,255,255,0.78)" stroke="${p.line}" stroke-width="6"/>
    <rect x="${x - width / 2 + 8}" y="${threadTop}" width="${width - 16}" height="${threadHeight - 8}" rx="8" fill="${p.bg2}" opacity="0.65"/>
    ${threadLines}
  `;
};

const bearing = (cx, cy, r, p, variant = "balls") => {
  const count = variant === "rollers" ? 10 : 12;
  const parts = Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count;
    const x = cx + Math.cos(angle) * r * 0.6;
    const y = cy + Math.sin(angle) * r * 0.6;
    if (variant === "rollers") {
      const deg = (angle * 180) / Math.PI;
      return `<rect x="${x - 17}" y="${y - 34}" width="34" height="68" rx="12" fill="${p.accent2}" stroke="${p.line}" stroke-width="5" transform="rotate(${deg} ${x} ${y})"/>`;
    }
    return `<circle cx="${x}" cy="${y}" r="25" fill="${p.accent2}" stroke="${p.line}" stroke-width="5"/>`;
  }).join("");
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.74)" stroke="${p.line}" stroke-width="8"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="${p.bg1}" stroke="${p.line}" stroke-width="6"/>
    ${parts}
    <circle cx="${cx}" cy="${cy}" r="${r * 0.34}" fill="rgba(255,255,255,0.84)" stroke="${p.line}" stroke-width="7"/>
  `;
};

const pipeBase = (p) => `
  <rect x="170" y="360" width="860" height="180" rx="90" fill="rgba(255,255,255,0.78)" stroke="${p.line}" stroke-width="8"/>
  <rect x="210" y="395" width="780" height="110" rx="55" fill="${p.bg2}" opacity="0.82"/>
  <line x1="210" y1="450" x2="990" y2="450" stroke="${p.accent}" stroke-width="9" stroke-linecap="round"/>
`;

const waveLines = (x1, x2, yBase, p, chaotic = false) =>
  Array.from({ length: 6 }, (_, i) => {
    const y = yBase + i * 18;
    const mid1 = chaotic ? `${x1 + 130},${y - 42} ${x1 + 250},${y + 44}` : `${x1 + 160},${y} ${x1 + 300},${y}`;
    const mid2 = chaotic ? `${x1 + 420},${y - 54} ${x1 + 560},${y + 48}` : `${x1 + 480},${y} ${x1 + 650},${y}`;
    return `<path d="M ${x1} ${y} C ${mid1}, ${mid2}, ${x2} ${y}" fill="none" stroke="${i % 2 ? p.accent : p.accent2}" stroke-width="${chaotic ? 5 : 4}" opacity="${chaotic ? 0.82 : 0.68}" stroke-linecap="round"/>`;
  }).join("");

const renderBolt = (motif, p) => {
  if (motif === "bolt-strength") {
    return `
      <g transform="translate(0 18)">
        ${boltBody(380, 265, 380, p, { width: 76, threadHeight: 160 })}
        ${boltBody(600, 225, 420, p, { width: 84, threadHeight: 180 })}
        ${boltBody(820, 185, 460, p, { width: 92, threadHeight: 205 })}
        <text x="380" y="705" text-anchor="middle" class="label" fill="${p.line}">8.8</text>
        <text x="600" y="705" text-anchor="middle" class="label" fill="${p.line}">10.9</text>
        <text x="820" y="705" text-anchor="middle" class="label" fill="${p.line}">12.9</text>
      </g>
    `;
  }

  if (motif === "bolt-preload") {
    return `
      <rect x="240" y="310" width="720" height="78" rx="18" fill="rgba(255,255,255,0.82)" stroke="${p.line}" stroke-width="7"/>
      <rect x="240" y="530" width="720" height="78" rx="18" fill="rgba(255,255,255,0.82)" stroke="${p.line}" stroke-width="7"/>
      ${boltBody(600, 205, 510, p, { width: 92, threadHeight: 250 })}
      <line x1="520" y1="292" x2="520" y2="195" stroke="${p.accent2}" stroke-width="10" marker-end="url(#arrow)"/>
      <line x1="680" y1="624" x2="680" y2="730" stroke="${p.accent2}" stroke-width="10" marker-end="url(#arrow)"/>
      <path d="M 432 462 C 500 415 700 415 768 462" fill="none" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/>
      <text x="600" y="468" text-anchor="middle" class="label" fill="${p.line}">Fv</text>
    `;
  }

  if (motif === "bolt-din") {
    return `
      <g transform="translate(-15 0)">
        ${boltBody(455, 245, 430, p, { width: 86, threadHeight: 165 })}
        ${boltBody(745, 245, 430, p, { width: 86, threadHeight: 300 })}
        <rect x="295" y="665" width="320" height="58" rx="18" fill="rgba(255,255,255,0.72)" stroke="${p.line}" stroke-width="5"/>
        <rect x="585" y="665" width="320" height="58" rx="18" fill="rgba(255,255,255,0.72)" stroke="${p.line}" stroke-width="5"/>
        <text x="455" y="704" text-anchor="middle" class="small" fill="${p.line}">PARTIAL THREAD</text>
        <text x="745" y="704" text-anchor="middle" class="small" fill="${p.line}">FULL THREAD</text>
      </g>
    `;
  }

  if (motif === "bolt-pitch") {
    const thread = (x, y, pitch, color) =>
      Array.from({ length: 9 }, (_, i) => {
        const yy = y + i * pitch;
        return `<path d="M ${x - 160} ${yy} L ${x - 35} ${yy + pitch * 0.52} L ${x + 90} ${yy}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
      }).join("");
    return `
      <rect x="205" y="255" width="330" height="430" rx="34" fill="rgba(255,255,255,0.78)" stroke="${p.line}" stroke-width="7"/>
      <rect x="665" y="255" width="330" height="430" rx="34" fill="rgba(255,255,255,0.78)" stroke="${p.line}" stroke-width="7"/>
      ${thread(370, 315, 39, p.accent)}
      ${thread(830, 315, 58, p.accent2)}
      ${dimensionLine(260, 598, 455, 598, "fine pitch", p)}
      ${dimensionLine(720, 624, 940, 624, "coarse pitch", p)}
    `;
  }

  if (motif === "bolt-finish") {
    return `
      ${boltBody(455, 235, 430, { ...p, accent: "#94a3b8" }, { width: 90, threadHeight: 235 })}
      ${boltBody(745, 235, 430, { ...p, accent: "#facc15" }, { width: 90, threadHeight: 235 })}
      <path d="M 410 220 C 395 290 400 365 450 430 C 500 365 506 290 490 220 Z" fill="rgba(14,165,233,0.20)" stroke="${p.accent}" stroke-width="6"/>
      <path d="M 705 235 L 790 235 L 810 335 C 789 410 765 455 748 488 C 727 454 704 410 685 335 Z" fill="rgba(245,158,11,0.22)" stroke="${p.accent2}" stroke-width="6"/>
      <circle cx="842" cy="390" r="17" fill="${p.accent}" opacity="0.7"/>
      <circle cx="850" cy="445" r="11" fill="${p.accent2}" opacity="0.8"/>
    `;
  }

  if (motif === "bolt-wrench") {
    const w1 = rotate(290, 315, 600, 450, -18);
    const w2 = rotate(880, 375, 600, 450, -18);
    return `
      <rect x="245" y="515" width="710" height="92" rx="22" fill="rgba(255,255,255,0.80)" stroke="${p.line}" stroke-width="7"/>
      ${boltBody(600, 265, 380, p, { width: 88, threadHeight: 210 })}
      <line x1="${w1.x}" y1="${w1.y}" x2="${w2.x}" y2="${w2.y}" stroke="${p.accent}" stroke-width="44" stroke-linecap="round"/>
      <circle cx="600" cy="450" r="78" fill="rgba(255,255,255,0.78)" stroke="${p.line}" stroke-width="8"/>
      <path d="M 705 270 A 205 205 0 0 1 810 455" fill="none" stroke="${p.accent2}" stroke-width="9" marker-end="url(#arrow)"/>
    `;
  }

  if (motif === "bolt-k-factor") {
    return `
      <rect x="265" y="525" width="670" height="86" rx="18" fill="rgba(255,255,255,0.82)" stroke="${p.line}" stroke-width="7"/>
      ${boltBody(600, 230, 410, p, { width: 92, threadHeight: 235 })}
      <ellipse cx="600" cy="526" rx="165" ry="46" fill="rgba(255,255,255,0.72)" stroke="${p.accent2}" stroke-width="7"/>
      <path d="M 436 525 C 485 475 715 475 765 525" fill="none" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/>
      <text x="600" y="455" text-anchor="middle" class="big" fill="${p.line}">K</text>
      <text x="600" y="690" text-anchor="middle" class="small" fill="${p.line}">friction + geometry</text>
    `;
  }

  return `
    <rect x="250" y="515" width="700" height="86" rx="18" fill="rgba(255,255,255,0.82)" stroke="${p.line}" stroke-width="7"/>
    ${boltBody(600, 240, 430, p, { width: 90, threadHeight: 260 })}
    <path d="M 392 355 C 334 386 329 485 388 525" fill="none" stroke="${p.accent2}" stroke-width="9" marker-end="url(#arrow)"/>
    <path d="M 810 355 C 870 392 870 486 812 525" fill="none" stroke="${p.accent2}" stroke-width="9" marker-end="url(#arrow)"/>
    <polyline points="310,300 340,275 370,300 400,275 430,300" fill="none" stroke="${p.accent}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="770,300 800,275 830,300 860,275 890,300" fill="none" stroke="${p.accent}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  `;
};

const renderPipe = (motif, p) => {
  if (motif === "pipe-diameter") {
    return `
      ${pipeBase(p)}
      ${dimensionLine(600, 350, 600, 550, "D", p)}
      <path d="M 265 595 C 445 740 760 740 940 595" fill="none" stroke="${p.accent2}" stroke-width="8" stroke-linecap="round"/>
      <text x="600" y="740" text-anchor="middle" class="small" fill="${p.line}">velocity / pressure tradeoff</text>
    `;
  }

  if (motif === "pipe-darcy") {
    return `
      ${pipeBase(p)}
      ${waveLines(245, 930, 405, p)}
      <circle cx="295" cy="285" r="58" fill="rgba(255,255,255,0.80)" stroke="${p.line}" stroke-width="7"/>
      <circle cx="905" cy="285" r="58" fill="rgba(255,255,255,0.80)" stroke="${p.line}" stroke-width="7"/>
      <path d="M 295 285 L 324 248" stroke="${p.accent2}" stroke-width="7" stroke-linecap="round"/>
      <path d="M 905 285 L 885 260" stroke="${p.accent2}" stroke-width="7" stroke-linecap="round"/>
      <line x1="295" y1="344" x2="295" y2="360" stroke="${p.line}" stroke-width="6"/>
      <line x1="905" y1="344" x2="905" y2="360" stroke="${p.line}" stroke-width="6"/>
      ${dimensionLine(330, 628, 870, 628, "delta p", p)}
    `;
  }

  return `
    ${pipeBase(p)}
    <g transform="translate(0 -110)">
      ${waveLines(250, 560, 455, p)}
      ${waveLines(640, 960, 455, p, true)}
      <line x1="600" y1="365" x2="600" y2="635" stroke="${p.line}" stroke-width="4" stroke-dasharray="12 12" opacity="0.45"/>
      <text x="405" y="640" text-anchor="middle" class="small" fill="${p.line}">laminar</text>
      <text x="805" y="640" text-anchor="middle" class="small" fill="${p.line}">turbulent</text>
    </g>
    <text x="600" y="695" text-anchor="middle" class="big" fill="${p.line}">Re</text>
  `;
};

const renderGear = (motif, p) => {
  if (motif === "gear-ratio") {
    return `
      ${gear(430, 450, 116, 18, p, "rgba(255,255,255,0.76)", 4)}
      ${gear(720, 450, 178, 28, p, "rgba(255,255,255,0.72)", 12)}
      <path d="M 310 255 A 180 180 0 0 1 520 255" fill="none" stroke="${p.accent2}" stroke-width="8" marker-end="url(#arrow)"/>
      <path d="M 865 650 A 240 240 0 0 1 635 650" fill="none" stroke="${p.accent}" stroke-width="8" marker-end="url(#arrow)"/>
      <text x="600" y="735" text-anchor="middle" class="big" fill="${p.line}">i = z2 / z1</text>
    `;
  }

  if (motif === "gear-helical") {
    const helix = Array.from({ length: 7 }, (_, i) => {
      const x = 675 + i * 34;
      return `<line x1="${x}" y1="320" x2="${x + 120}" y2="590" stroke="${p.accent2}" stroke-width="11" opacity="0.72"/>`;
    }).join("");
    return `
      ${gear(410, 450, 150, 24, p, "rgba(255,255,255,0.76)", 0)}
      <rect x="650" y="290" width="310" height="320" rx="34" fill="rgba(255,255,255,0.76)" stroke="${p.line}" stroke-width="8"/>
      ${helix}
      <rect x="650" y="290" width="310" height="320" rx="34" fill="none" stroke="${p.line}" stroke-width="8"/>
      <text x="410" y="700" text-anchor="middle" class="small" fill="${p.line}">spur</text>
      <text x="805" y="700" text-anchor="middle" class="small" fill="${p.line}">helical</text>
    `;
  }

  if (motif === "gear-involute") {
    return `
      <circle cx="600" cy="475" r="210" fill="rgba(255,255,255,0.72)" stroke="${p.line}" stroke-width="8"/>
      <circle cx="600" cy="475" r="136" fill="none" stroke="${p.accent}" stroke-width="7" stroke-dasharray="14 16"/>
      <path d="M 445 570 C 520 502 590 405 740 302" fill="none" stroke="${p.accent2}" stroke-width="13" stroke-linecap="round"/>
      <path d="M 510 632 C 596 576 698 505 805 390" fill="none" stroke="${p.accent}" stroke-width="7" stroke-linecap="round"/>
      ${dimensionLine(600, 475, 740, 302, "involute", p)}
    `;
  }

  if (motif === "gear-module") {
    return `
      ${gear(600, 455, 185, 28, p, "rgba(255,255,255,0.74)", 8)}
      <path d="M 470 290 L 545 214 L 622 288" fill="none" stroke="${p.accent2}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      ${dimensionLine(448, 322, 600, 322, "m", p)}
      <path d="M 736 540 C 794 510 848 546 862 606" fill="none" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/>
    `;
  }

  if (motif === "gear-life") {
    return `
      ${gear(590, 440, 175, 28, p, "rgba(255,255,255,0.74)", 5)}
      <path d="M 628 280 L 674 365 L 640 448" fill="none" stroke="#dc2626" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 450 610 C 520 640 670 652 766 610" fill="none" stroke="${p.accent2}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="780" cy="310" r="30" fill="#dc2626" opacity="0.18" stroke="#dc2626" stroke-width="6"/>
      <path d="M 820 366 C 856 420 850 474 804 515" fill="none" stroke="${p.accent}" stroke-width="9" stroke-linecap="round"/>
    `;
  }

  if (motif === "gearbox") {
    return `
      <rect x="285" y="285" width="630" height="370" rx="46" fill="rgba(255,255,255,0.76)" stroke="${p.line}" stroke-width="8"/>
      ${gear(480, 470, 100, 18, p, "rgba(255,255,255,0.68)", 5)}
      ${gear(650, 470, 132, 24, p, "rgba(255,255,255,0.70)", 11)}
      <line x1="198" y1="470" x2="285" y2="470" stroke="${p.line}" stroke-width="18" stroke-linecap="round"/>
      <line x1="915" y1="470" x2="1002" y2="470" stroke="${p.line}" stroke-width="18" stroke-linecap="round"/>
      <circle cx="840" cy="340" r="17" fill="${p.accent2}"/>
      <circle cx="840" cy="410" r="17" fill="${p.accent2}"/>
      <circle cx="840" cy="480" r="17" fill="${p.accent2}"/>
      <circle cx="840" cy="550" r="17" fill="${p.accent2}"/>
    `;
  }

  return `
    <g transform="translate(-15 0)">
      <path d="M 240 550 C 360 450 448 445 540 540" fill="none" stroke="${p.accent}" stroke-width="24" stroke-linecap="round"/>
      <circle cx="340" cy="525" r="75" fill="rgba(255,255,255,0.74)" stroke="${p.line}" stroke-width="8"/>
      <circle cx="860" cy="525" r="95" fill="rgba(255,255,255,0.74)" stroke="${p.line}" stroke-width="8"/>
      ${gear(675, 430, 105, 20, p, "rgba(255,255,255,0.70)", 10)}
      <rect x="608" y="555" width="300" height="95" rx="20" fill="rgba(255,255,255,0.72)" stroke="${p.line}" stroke-width="7"/>
      <path d="M 318 374 C 420 300 505 316 575 410" fill="none" stroke="${p.accent2}" stroke-width="8" stroke-linecap="round" stroke-dasharray="18 16"/>
    </g>
  `;
};

const renderBearing = (motif, p) => {
  if (motif === "bearing-choice") {
    return `
      ${bearing(415, 455, 162, p, "balls")}
      ${bearing(785, 455, 162, p, "rollers")}
      <line x1="600" y1="255" x2="600" y2="655" stroke="${p.line}" stroke-width="4" stroke-dasharray="12 14" opacity="0.42"/>
      <text x="415" y="700" text-anchor="middle" class="small" fill="${p.line}">speed</text>
      <text x="785" y="700" text-anchor="middle" class="small" fill="${p.line}">load</text>
    `;
  }

  if (motif === "bearing-load") {
    return `
      ${bearing(600, 475, 180, p, "balls")}
      <line x1="600" y1="190" x2="600" y2="285" stroke="${p.accent2}" stroke-width="12" marker-end="url(#arrow)"/>
      <path d="M 382 690 C 500 735 700 735 818 690" fill="none" stroke="${p.accent}" stroke-width="9" stroke-linecap="round"/>
      <text x="455" y="270" text-anchor="middle" class="label" fill="${p.line}">C0</text>
      <text x="770" y="270" text-anchor="middle" class="label" fill="${p.line}">C</text>
      <path d="M 755 314 A 125 125 0 0 1 840 455" fill="none" stroke="${p.accent}" stroke-width="8" marker-end="url(#arrow)"/>
    `;
  }

  if (motif === "bearing-life") {
    return `
      ${bearing(410, 455, 150, p, "balls")}
      <rect x="610" y="290" width="340" height="280" rx="28" fill="rgba(255,255,255,0.78)" stroke="${p.line}" stroke-width="7"/>
      <path d="M 665 515 C 720 505 748 462 782 422 C 828 367 873 337 915 332" fill="none" stroke="${p.accent2}" stroke-width="10" stroke-linecap="round"/>
      <line x1="660" y1="530" x2="925" y2="530" stroke="${p.line}" stroke-width="5"/>
      <line x1="660" y1="530" x2="660" y2="330" stroke="${p.line}" stroke-width="5"/>
      <text x="780" y="640" text-anchor="middle" class="big" fill="${p.line}">L10</text>
    `;
  }

  return `
    ${bearing(595, 455, 170, p, "rollers")}
    <rect x="305" y="640" width="590" height="54" rx="18" fill="rgba(255,255,255,0.76)" stroke="${p.line}" stroke-width="6"/>
    <path d="M 350 640 L 455 540" stroke="${p.accent2}" stroke-width="8" stroke-linecap="round"/>
    <path d="M 850 640 L 745 540" stroke="${p.accent2}" stroke-width="8" stroke-linecap="round"/>
    ${dimensionLine(430, 250, 770, 250, "fit window", p)}
  `;
};

const renderShaft = (motif, p) => {
  if (motif === "shaft-hub") {
    return `
      <rect x="210" y="410" width="780" height="92" rx="46" fill="rgba(255,255,255,0.80)" stroke="${p.line}" stroke-width="8"/>
      <rect x="445" y="330" width="310" height="250" rx="40" fill="${p.bg2}" stroke="${p.line}" stroke-width="8"/>
      <rect x="505" y="384" width="190" height="40" rx="8" fill="${p.accent2}" stroke="${p.line}" stroke-width="5"/>
      <circle cx="600" cy="455" r="88" fill="rgba(255,255,255,0.55)" stroke="${p.line}" stroke-width="6"/>
      ${dimensionLine(345, 575, 855, 575, "key / flange / press", p)}
    `;
  }

  return `
    <rect x="250" y="405" width="700" height="98" rx="49" fill="rgba(255,255,255,0.80)" stroke="${p.line}" stroke-width="8"/>
    <circle cx="250" cy="454" r="49" fill="${p.accent}" stroke="${p.line}" stroke-width="7"/>
    <circle cx="950" cy="454" r="49" fill="${p.accent}" stroke="${p.line}" stroke-width="7"/>
    <path d="M 305 300 A 165 165 0 0 1 480 260" fill="none" stroke="${p.accent2}" stroke-width="9" marker-end="url(#arrow)"/>
    <path d="M 895 610 A 165 165 0 0 1 720 650" fill="none" stroke="${p.accent2}" stroke-width="9" marker-end="url(#arrow)"/>
    <path d="M 430 510 C 500 585 696 585 770 510" fill="none" stroke="${p.accent}" stroke-width="8" stroke-linecap="round"/>
    <text x="600" y="695" text-anchor="middle" class="big" fill="${p.line}">tau</text>
  `;
};

const renderOther = (motif, p) => {
  if (motif === "hydraulic-cylinder") {
    return `
      <rect x="250" y="365" width="520" height="180" rx="36" fill="rgba(255,255,255,0.80)" stroke="${p.line}" stroke-width="8"/>
      <rect x="665" y="393" width="330" height="124" rx="62" fill="${p.bg2}" stroke="${p.line}" stroke-width="8"/>
      <rect x="325" y="390" width="190" height="130" rx="20" fill="${p.accent}" opacity="0.25" stroke="${p.line}" stroke-width="6"/>
      <line x1="505" y1="455" x2="995" y2="455" stroke="${p.line}" stroke-width="20" stroke-linecap="round"/>
      <line x1="170" y1="290" x2="325" y2="390" stroke="${p.accent2}" stroke-width="10" stroke-linecap="round"/>
      <line x1="170" y1="620" x2="325" y2="520" stroke="${p.accent2}" stroke-width="10" stroke-linecap="round"/>
      <path d="M 214 455 C 230 405 260 382 325 390" fill="none" stroke="${p.accent}" stroke-width="8" marker-end="url(#arrow)"/>
    `;
  }

  if (motif === "standards") {
    return `
      <rect x="290" y="245" width="230" height="330" rx="22" fill="rgba(255,255,255,0.78)" stroke="${p.line}" stroke-width="7" transform="rotate(-9 405 410)"/>
      <rect x="485" y="230" width="230" height="330" rx="22" fill="rgba(255,255,255,0.82)" stroke="${p.line}" stroke-width="7"/>
      <rect x="680" y="255" width="230" height="330" rx="22" fill="rgba(255,255,255,0.78)" stroke="${p.line}" stroke-width="7" transform="rotate(9 795 420)"/>
      <text x="405" y="410" text-anchor="middle" class="label" fill="${p.accent}">ISO</text>
      <text x="600" y="400" text-anchor="middle" class="label" fill="${p.accent2}">DIN</text>
      <text x="795" y="420" text-anchor="middle" class="label" fill="${p.accent}">VDI</text>
      ${gear(600, 665, 62, 16, p, "rgba(255,255,255,0.68)", 4)}
    `;
  }

  if (motif === "sheet-risk") {
    const grid = Array.from({ length: 8 }, (_, i) => `<line x1="330" y1="${315 + i * 44}" x2="870" y2="${315 + i * 44}" stroke="${p.line}" stroke-width="3" opacity="0.18"/>`).join("") +
      Array.from({ length: 9 }, (_, i) => `<line x1="${330 + i * 67.5}" y1="315" x2="${330 + i * 67.5}" y2="623" stroke="${p.line}" stroke-width="3" opacity="0.18"/>`).join("");
    return `
      <rect x="300" y="275" width="600" height="390" rx="32" fill="rgba(255,255,255,0.82)" stroke="${p.line}" stroke-width="8"/>
      ${grid}
      <path d="M 515 520 L 610 360 L 705 520 Z" fill="rgba(220,38,38,0.16)" stroke="#dc2626" stroke-width="9" stroke-linejoin="round"/>
      <line x1="610" y1="410" x2="610" y2="470" stroke="#dc2626" stroke-width="10" stroke-linecap="round"/>
      <circle cx="610" cy="498" r="8" fill="#dc2626"/>
      <path d="M 408 365 L 465 420 L 545 330" fill="none" stroke="${p.accent}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  }

  if (motif === "motor-curve") {
    return `
      <rect x="220" y="390" width="300" height="170" rx="38" fill="rgba(255,255,255,0.80)" stroke="${p.line}" stroke-width="8"/>
      <circle cx="260" cy="475" r="64" fill="${p.bg2}" stroke="${p.line}" stroke-width="7"/>
      <line x1="520" y1="475" x2="635" y2="475" stroke="${p.line}" stroke-width="18" stroke-linecap="round"/>
      <rect x="655" y="270" width="310" height="325" rx="28" fill="rgba(255,255,255,0.78)" stroke="${p.line}" stroke-width="7"/>
      <line x1="700" y1="540" x2="920" y2="540" stroke="${p.line}" stroke-width="5"/>
      <line x1="700" y1="540" x2="700" y2="320" stroke="${p.line}" stroke-width="5"/>
      <path d="M 705 360 C 755 330 820 370 852 430 C 880 482 900 512 925 525" fill="none" stroke="${p.accent2}" stroke-width="10" stroke-linecap="round"/>
    `;
  }

  if (motif === "safety-factor") {
    return `
      <rect x="260" y="355" width="680" height="105" rx="18" fill="rgba(255,255,255,0.78)" stroke="${p.line}" stroke-width="8"/>
      <rect x="345" y="355" width="170" height="105" fill="${p.accent}" opacity="0.18"/>
      <rect x="515" y="355" width="220" height="105" fill="${p.accent2}" opacity="0.20"/>
      <path d="M 260 355 C 375 295 500 295 600 355 C 705 418 820 420 940 355" fill="none" stroke="${p.accent}" stroke-width="9" opacity="0.72"/>
      <line x1="600" y1="210" x2="600" y2="350" stroke="${p.accent2}" stroke-width="12" marker-end="url(#arrow)"/>
      <rect x="390" y="585" width="420" height="62" rx="18" fill="rgba(255,255,255,0.80)" stroke="${p.line}" stroke-width="6"/>
      <rect x="405" y="600" width="245" height="32" rx="12" fill="${p.accent}"/>
      <rect x="650" y="600" width="140" height="32" rx="12" fill="${p.accent2}"/>
    `;
  }

  if (motif === "torque-power") {
    return `
      <rect x="240" y="380" width="300" height="160" rx="36" fill="rgba(255,255,255,0.80)" stroke="${p.line}" stroke-width="8"/>
      <circle cx="290" cy="460" r="58" fill="${p.bg2}" stroke="${p.line}" stroke-width="7"/>
      <line x1="540" y1="460" x2="900" y2="460" stroke="${p.line}" stroke-width="20" stroke-linecap="round"/>
      <path d="M 635 290 A 165 165 0 0 1 800 380" fill="none" stroke="${p.accent2}" stroke-width="9" marker-end="url(#arrow)"/>
      <path d="M 650 630 C 720 585 825 562 940 560" fill="none" stroke="${p.accent}" stroke-width="10" stroke-linecap="round"/>
      <text x="790" y="705" text-anchor="middle" class="big" fill="${p.line}">P = T x w</text>
    `;
  }

  return renderShaft("shaft-torsion", p);
};

const renderMotif = (motif, p) => {
  if (motif.startsWith("bolt-")) return renderBolt(motif, p);
  if (motif.startsWith("pipe-")) return renderPipe(motif, p);
  if (motif.startsWith("gear-") || motif === "chain-gearbox" || motif === "gearbox") return renderGear(motif, p);
  if (motif.startsWith("bearing-")) return renderBearing(motif, p);
  if (motif.startsWith("shaft-")) return renderShaft(motif, p);
  return renderOther(motif, p);
};

const renderSvg = (post, index) => {
  const p = PALETTES[index % PALETTES.length];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.bg1}"/>
      <stop offset="1" stop-color="${p.bg2}"/>
    </linearGradient>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M 44 0 L 0 0 0 44" fill="none" stroke="${p.line}" stroke-width="1" opacity="0.08"/>
    </pattern>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${p.accent2}"/>
    </marker>
    <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
      <circle cx="5" cy="5" r="4" fill="${p.accent2}"/>
    </marker>
    <style>
      .label { font: 700 36px Arial, sans-serif; letter-spacing: 0; }
      .small { font: 700 24px Arial, sans-serif; letter-spacing: 0; }
      .big { font: 800 48px Arial, sans-serif; letter-spacing: 0; }
    </style>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <rect width="1200" height="900" fill="url(#grid)"/>
  <circle cx="175" cy="135" r="78" fill="${p.accent}" opacity="0.08"/>
  <circle cx="1000" cy="760" r="118" fill="${p.accent2}" opacity="0.10"/>
  <rect x="104" y="96" width="992" height="708" rx="48" fill="rgba(255,255,255,0.36)" stroke="rgba(15,23,42,0.10)" stroke-width="2"/>
  <g>${renderMotif(post.motif, p)}</g>
  <g>
    <rect x="110" y="104" width="${Math.max(250, post.label.length * 19 + 70)}" height="56" rx="18" fill="rgba(255,255,255,0.82)" stroke="${p.line}" stroke-width="4"/>
    <text x="146" y="141" class="small" fill="${p.line}">${xml(post.label)}</text>
  </g>
</svg>`;
};

const updateMdxImage = async (post) => {
  const filePath = path.join(repoRoot, "content", "blog", `${post.slug}.tr.mdx`);
  const source = await fs.readFile(filePath, "utf8");
  const imageLine = `<Image src="/images/blog/${post.slug}.webp" alt="${post.alt}" width={1200} height={900} caption="${post.caption}" />`;
  const imageRegex = /<Image src="[^"]+" alt="[^"]*" width=\{1200\} height=\{900\} caption="[^"]*" \/>/;
  if (!imageRegex.test(source)) {
    throw new Error(`Could not find first MDX image line in ${filePath}`);
  }

  await fs.writeFile(filePath, source.replace(imageRegex, imageLine), "utf8");
};

const main = async () => {
  await fs.mkdir(outputDir, { recursive: true });

  for (const [index, post] of POSTS.entries()) {
    const svg = renderSvg(post, index);
    const outputPath = path.join(outputDir, `${post.slug}.webp`);
    await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(outputPath);
    await updateMdxImage(post);
    console.log(`Generated ${path.relative(repoRoot, outputPath)}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
