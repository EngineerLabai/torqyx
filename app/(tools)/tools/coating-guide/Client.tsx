"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

type BaseMaterial = "steel" | "aluminum" | "stainless" | "copper" | "titanium" | "plastic";
type Need = "corrosion" | "wear" | "appearance" | "lowfriction" | "conductivity" | "high_temp";

type Coating = {
  nameTr: string;
  nameEn: string;
  bases: BaseMaterial[];
  needs: Need[];
  descTr: string;
  descEn: string;
  thicknessTr?: string;
  thicknessEn?: string;
  notesTr?: string;
  notesEn?: string;
};

const COATINGS: Coating[] = [
  {
    nameTr: "Elektrolitik Çinko Galvaniz",
    nameEn: "Zinc Electroplating (Clear / Yellow Trivalent)",
    bases: ["steel"],
    needs: ["corrosion", "appearance"],
    descTr: "Ekonomik korozyon koruması; parlak metalik görünüm, ince ve homojen tabaka.",
    descEn:
      "Cost-effective sacrificial cathodic protection for structural steel fasteners and sheet assemblies with bright finish.",
    thicknessTr: "5–15 µm",
    thicknessEn: "5–15 µm",
    notesTr: "Beyaz pas riskine karşı trivalan pasivasyon ve sızdırmazlık verniği uygulanmalıdır.",
    notesEn: "Trivalent passivate and sealant required to prevent premature white zinc corrosion.",
  },
  {
    nameTr: "Sıcak Daldırma Galvaniz (HDG)",
    nameEn: "Hot-Dip Galvanizing (HDG)",
    bases: ["steel"],
    needs: ["corrosion"],
    descTr: "Ergimiş çinkoya daldırılarak kalın metalurjik alaşım tabakası; dış ortam ve deniz atmosferinde onlarca yıl koruma.",
    descEn:
      "Immersion in molten zinc forming thick metallurgical iron-zinc alloy layers; 50+ years outdoor durability in harsh atmospheres.",
    thicknessTr: "50–100 µm",
    thicknessEn: "50–100 µm",
    notesTr: "Kalın tabaka vida dişlerinde aşırı yığılma yapar; dişler için galvaniz sonrası kılavuz çekilmelidir.",
    notesEn: "Heavy coating thickness clogs fine threads; nuts must be tapped oversize after spinning.",
  },
  {
    nameTr: "Çinko-Nikel Alaşımlı Kaplama (Zn-Ni)",
    nameEn: "Zinc-Nickel Alloy Plating (Zn-Ni)",
    bases: ["steel"],
    needs: ["corrosion", "appearance"],
    descTr: "Standart çinkoya göre 5–6 kat yüksek tuz sisi dayanımı (>1000 saat); otomotiv ve havacılık şasi standardı.",
    descEn:
      "Automotive benchmark with ~12–15% nickel co-deposition; achieves 1000+ hours neutral salt spray with high thermal stability.",
    thicknessTr: "8–15 µm",
    thicknessEn: "8–15 µm",
    notesTr: "200°C motor bölmesi sıcaklıklarında dahi korozyon direncini korur.",
    notesEn: "Maintains sacrificial integrity even after prolonged 200°C engine-bay exposure.",
  },
  {
    nameTr: "Mangan / Çinko Fosfatlama",
    nameEn: "Manganese / Zinc Phosphating",
    bases: ["steel"],
    needs: ["corrosion", "wear"],
    descTr: "Mikrokristalin fosfat tabakası; yağ tutma gözenekleri ve boya/toz kaplama öncesi korozyon aderansı sağlar.",
    descEn:
      "Microcrystalline conversion layer providing excellent oil retention for moving joints and strong primer adhesion for powder coating.",
    thicknessTr: "2–15 µm",
    thicknessEn: "2–15 µm",
    notesTr: "Mangan fosfat rodaj ve kayar dişli yüzeyleri için, çinko fosfat boya altı için tercih edilir.",
    notesEn: "Manganese phosphate excels for anti-galling run-in wear; zinc phosphate is standard paint pre-treatment.",
  },
  {
    nameTr: "Siyah Oksit (Black Oxide)",
    nameEn: "Black Oxide (Hot Alkaline)",
    bases: ["steel", "stainless"],
    needs: ["appearance", "lowfriction"],
    descTr: "Kimyasal dönüşümle oluşan manyetit (Fe3O4) siyah tabaka; sıfıra yakın boyutsal değişim.",
    descEn:
      "Chemical conversion into black magnetite (Fe3O4); preserves tight micron machining tolerances with zero dimensional growth.",
    thicknessTr: "~1 µm",
    thicknessEn: "~1 µm",
    notesTr: "Korozyon direnci düşüktür; mutlaka koruyucu yağ veya mum emdirilerek kullanılmalıdır.",
    notesEn: "Minimal inherent corrosion resistance; must be maintained with post-dip preservative oils.",
  },
  {
    nameTr: "Sert Eloksal (Tip III Sert Anodizasyon)",
    nameEn: "Hard Anodizing (MIL-A-8625 Type III)",
    bases: ["aluminum"],
    needs: ["wear", "corrosion"],
    descTr: "Düşük sıcaklıkta asidik banyoda kalın alüminyum oksit (Al2O3) tabakası; çelik sertliğinde (60–70 HRC) yüzey.",
    descEn:
      "Low-temperature sulfuric bath forming thick ceramic aluminum oxide (Al2O3); matches hardened tool steel surface wear (60–70 HRC).",
    thicknessTr: "25–60 µm",
    thicknessEn: "25–60 µm",
    notesTr: "Tabakanın yarısı malzemenin içine, yarısı dışına büyür (+12–30 µm radyal büyüme); tolerans payı bırakılmalıdır.",
    notesEn: "Grows 50% into substrate and 50% outward (+12–30 µm per surface); precision bores require pre-machining compensation.",
  },
  {
    nameTr: "Dekoratif Renkli Eloksal (Tip II)",
    nameEn: "Sulfuric Anodizing (MIL-A-8625 Type II)",
    bases: ["aluminum"],
    needs: ["appearance", "corrosion"],
    descTr: "Alüminyum gözeneklerine organik boya emdirilip sıcak suyla mühürlenen şık, parlak veya mat renkli yüzey.",
    descEn:
      "Porous anodic layer impregnated with organic/inorganic dyes and hydrothermally sealed; vibrant decorative aesthetic and corrosion barrier.",
    thicknessTr: "10–25 µm",
    thicknessEn: "10–25 µm",
    notesTr: "Döküm alaşımlarda (ör. yüksek silisli döküm) renk alacalı çıkabilir; işlenmiş 6000 serisi en iyisidir.",
    notesEn: "High-silicon casting alloys anodize grey/mottled; wrought 6000-series grades yield optimal dye brightness.",
  },
  {
    nameTr: "Kimyasal Dönüşüm Kromatlama (Alodine / SurTec)",
    nameEn: "Chemical Conversion Coating (Alodine / SurTec 650)",
    bases: ["aluminum"],
    needs: ["corrosion", "appearance", "conductivity"],
    descTr: "Elektriksel iletkenliği koruyan ve boya aderansını artıran mikron altı ince kromat tabakası.",
    descEn:
      "Sub-micron trivalent chromium passivate preserving low electrical contact resistance while ensuring paint bonding.",
    thicknessTr: "0.5–2 µm",
    thicknessEn: "0.5–2 µm",
    notesTr: "RoHS ve REACH uyumu için mutlaka Cr(VI) içermeyen üç değerli kromat seçilmelidir.",
    notesEn: "Hexavalent-free trivalent chemistries (e.g., MIL-DTL-5541 Type II) required for RoHS compliance.",
  },
  {
    nameTr: "Paslanmaz Pasivasyon (Sitrik / Nitrik)",
    nameEn: "Stainless Steel Passivation (ASTM A967)",
    bases: ["stainless"],
    needs: ["corrosion"],
    descTr: "Yüzeydeki serbest demir partiküllerini asitle çözerek zengin krom-oksit pasif filmi oluşturma.",
    descEn:
      "Acid leaching of exogenous free iron contaminations, promoting rapid formation of a self-healing chromium oxide passive film.",
    notesTr: "Kaynak dikişlerindeki yanıklar ve mekanik işleme demir tozları mutlaka pasive edilmelidir.",
    notesEn: "Critical after CNC machining, grinding, or welding to eradicate pinhole rust pitting.",
  },
  {
    nameTr: "PTFE / MoS2 Kuru Film Yağlayıcı",
    nameEn: "PTFE / MoS2 Solid Film Lubricant (Xylan / Everlube)",
    bases: ["steel", "aluminum", "stainless", "titanium"],
    needs: ["lowfriction", "wear", "corrosion"],
    descTr: "Sıvı yağın akacağı veya kirlilik yaratacağı mekanizmalarda kalıcı düşük sürtünme ve kilitlenmeme (anti-galling).",
    descEn:
      "Bonded fluoropolymer/moly dry film for vacuum, cleanroom, or extreme load joints where liquid oils evaporate or attract dust.",
    thicknessTr: "10–25 µm",
    thicknessEn: "10–25 µm",
    notesTr: "Paslanmaz cıvata somun dişlerinde sıkışmayı (galling) tamamen engeller.",
    notesEn: "Eliminates thread galling on stainless steel studs and deep subsea fasteners.",
  },
  {
    nameTr: "PVD İnce Film Kaplamalar (TiN / CrN / DLC)",
    nameEn: "PVD Thin-Film Coatings (TiN, CrN, Diamond-Like Carbon)",
    bases: ["steel", "stainless", "titanium"],
    needs: ["wear", "lowfriction", "appearance"],
    descTr: "Vakum altında fiziksel buhar biriktirme ile 2000–3500 HV aşırı sertlik ve 0.1 sürtünme katsayısı.",
    descEn:
      "Physical vapor deposition in high vacuum producing ultra-hard ceramic films (2000–3500 HV) with near-zero friction coefficient.",
    thicknessTr: "2–4 µm",
    thicknessEn: "2–4 µm",
    notesTr: "Alt malzemenin sertliği en az 54–58 HRC olmalıdır; aksi halde kaplama 'yumurta kabuğu' gibi çatlar.",
    notesEn: "Requires core substrate hardness of at least 54–58 HRC to prevent eggshell collapse under load.",
  },
  {
    nameTr: "Akımsız Kimyasal Nikel (ENP / Ni-P)",
    nameEn: "Electroless Nickel Plating (ENP / High-Phos Ni-P)",
    bases: ["steel", "aluminum", "stainless", "copper"],
    needs: ["wear", "corrosion", "appearance"],
    descTr: "Akım kullanmadan kimyasal indirgeme ile kör delikler ve karmaşık iç kanallarda bile birebir eşit kalınlıkta nikel tabakası.",
    descEn:
      "Autocatalytic chemical reduction providing 100% uniform thickness on blind bores, threads, and complex internal fluid channels.",
    thicknessTr: "10–35 µm",
    thicknessEn: "10–35 µm",
    notesTr: "Yüksek fosforlu (%10–13 P) tipler tuzlu su ve asitlere karşı mükemmeldir; ısıl işlemle 68 HRC sertliğe ulaşır.",
    notesEn: "High-phosphorus (10–13% P) grades offer superior pinhole-free barrier corrosion; bakeable to 68 HRC.",
  },
  {
    nameTr: "Akımsız Nikel + PTFE Kompozit",
    nameEn: "Electroless Nickel + PTFE Co-deposit (EN-PTFE)",
    bases: ["steel", "aluminum", "stainless"],
    needs: ["lowfriction", "corrosion", "wear"],
    descTr: "Nikel matrisi içine homojen dağıtılmış mikron PTFE partikülleri; kendi kendini yağlayan yapışmaz korozyon kalkanı.",
    descEn:
      "Sub-micron PTFE particles co-deposited within nickel matrix; self-lubricating non-stick surface with excellent release properties.",
    thicknessTr: "15–25 µm",
    thicknessEn: "15–25 µm",
  },
  {
    nameTr: "Bakır / Kalay Kaplama (Elektriksel Bara)",
    nameEn: "Tin Plating (Matte / Bright over Copper)",
    bases: ["copper", "steel"],
    needs: ["conductivity", "corrosion", "appearance"],
    descTr: "Bakır baralarda korozyon ve oksitlenmeyi önleyerek düşük elektriksel temas direnci ve kolay lehimlenebilirlik sağlar.",
    descEn:
      "Protects electrical copper busbars from atmospheric oxidation while preserving excellent solderability and contact conductivity.",
    notesTr: "Saf parlak kalayda 'whisker' (kılcal kristal büyümesi) riskine dikkat edilmelidir; mat kalay daha güvenlidir.",
    notesEn: "Matte tin with nickel underplate is preferred to inhibit conductive tin whisker growth in electronic busbars.",
  },
  {
    nameTr: "Gümüş Kaplama (Silver Plating)",
    nameEn: "Silver Plating (High Voltage Contacts)",
    bases: ["copper", "steel"],
    needs: ["conductivity", "wear", "appearance"],
    descTr: "En yüksek elektriksel ve termal iletkenlik; yüksek akım şalt kontakları ve RF dalga kılavuzları için vazgeçilmez.",
    descEn:
      "Supreme electrical and thermal conductivity with low contact resistance for high-voltage switchgear busbars and RF connectors.",
    thicknessTr: "5–25 µm",
    thicknessEn: "5–25 µm",
    notesTr: "Havadaki kükürt gazıyla kararabilir; koruyucu organik pasivasyon banyosu uygulanmalıdır.",
    notesEn: "Atmospheric sulfur tarnishes silver into black Ag2S; anti-tarnish organic passivation dips are applied.",
  },
  {
    nameTr: "Altın Kaplama (Gold Plating)",
    nameEn: "Hard Gold Plating (MIL-G-45204)",
    bases: ["copper", "stainless"],
    needs: ["conductivity", "corrosion", "appearance"],
    descTr: "Asla oksitlenmeyen mutlak korozyon koruması ve kararlı mikrovolt seviyesinde temas iletkenliği.",
    descEn:
      "Zero surface oxide formation, impervious corrosion immunity, and stable milliohm contact resistance for mission-critical pins.",
    notesTr: "Maliyeti düşürmek için nikel alt katman üzerine 0.5–2 µm hassas kalınlıkta kaplanır.",
    notesEn: "Deposited over ductile nickel barrier layer; thicknesses kept at 0.5–2 µm for economic efficiency.",
  },
  {
    nameTr: "Yüksek Sıcaklık PVD (TiAlN / AlCrN)",
    nameEn: "High-Temperature PVD (AlTiN / AlCrN)",
    bases: ["steel", "titanium"],
    needs: ["wear", "high_temp", "lowfriction"],
    descTr: "900°C sıcaklıkta yüzeyde sert Al2O3 koruyucu film oluşturarak kesici takımlarda kuru işlemeyi mümkün kılar.",
    descEn:
      "Forms protective nano-scale Al2O3 glass at 900°C tool tips; premier solution for dry high-speed CNC milling and deep hole drilling.",
    thicknessTr: "2–5 µm",
    thicknessEn: "2–5 µm",
  },
  {
    nameTr: "Cerakote Seramik Polimer Kaplama",
    nameEn: "Cerakote Thin-Film Ceramic Polymer",
    bases: ["steel", "aluminum", "stainless", "titanium", "plastic"],
    needs: ["appearance", "corrosion", "wear"],
    descTr: "Mikron inceliğinde fırınlanmış seramik-polimer kompozit; olağanüstü kimyasal, solvent ve çizilme dayanımı.",
    descEn:
      "Thin-film oven-cured ceramic composite formulation with unmatched chemical resistance, hydrophobic barrier, and custom tactical colors.",
    notesTr: "Parça geometrisini ve toleransları bozmaz (~25 µm); yüzey kumlaması kritik aşamadır.",
    notesEn: "Does not interfere with delicate mechanisms (~25 µm build); requires precise surface profile grit blasting.",
  },
  {
    nameTr: "Sert Krom Kaplama (Endüstriyel)",
    nameEn: "Industrial Hard Chrome Plating",
    bases: ["steel", "stainless"],
    needs: ["wear", "corrosion", "appearance"],
    descTr: "65–70 HRC mikro çatlaklı krom tabakası; hidrolik silindir milleri ve baskı merdanelerinde aşınma direnci.",
    descEn:
      "Heavy micro-cracked electroplated chromium (65–70 HRC) for hydraulic piston rods, mining rams, and print rollers.",
    thicknessTr: "20–100 µm",
    thicknessEn: "20–100 µm",
    notesTr: "Hidrojen gevrekliği giderme fırınlaması gerektirir; çevresel regülasyonlar (Cr VI) nedeniyle HVOF ikamesi yaygınlaşmaktadır.",
    notesEn: "Mandatory de-embrittlement bake on high-tensile steels; increasingly substituted by HVOF due to Cr(VI) environmental laws.",
  },
  {
    nameTr: "HVOF Termal Sprey Karbür (WC-Co-Cr)",
    nameEn: "HVOF Thermal Spray Carbide (WC-10Co-4Cr)",
    bases: ["steel", "stainless", "titanium"],
    needs: ["wear", "corrosion", "high_temp"],
    descTr: "Süpersonik alevle püskürtülen tungsten karbür parçacıkları; deniz suyu ve petrokimya vanalarında aşırı erozyon direnci.",
    descEn:
      "Supersonic thermal spray deposition of tungsten carbide particles; extreme cavitation and abrasive slurry resistance for subsea valves.",
    notesTr: "Kaplama sonrası elmas taşlama ile istenen finiş ve ölçüye getirilir (50–250 µm).",
    notesEn: "Requires post-spray diamond grinding and superfinishing to achieve mirror sealing surfaces.",
  },
  {
    nameTr: "Titanyum Renkli Eloksal (Tip II)",
    nameEn: "Titanium Anodizing (AMS 2488 / ISO 13485)",
    bases: ["titanium"],
    needs: ["appearance", "corrosion"],
    descTr: "Boya içermeyen, ışık interferansı prensibiyle çalışan biyouyumlu renkli oksit tabakası; medikal implant standardı.",
    descEn:
      "Dye-free biocompatible interference color oxide for medical orthopedic implants and surgical titanium instruments.",
    thicknessTr: "50–500 nm",
    thicknessEn: "50–500 nm",
  },
];

const MATERIAL_LABELS = {
  tr: {
    steel: "Çelik",
    aluminum: "Alüminyum",
    stainless: "Paslanmaz Çelik",
    copper: "Bakır / Bronz",
    titanium: "Titanyum",
    plastic: "Mühendislik Plastiği",
  },
  en: {
    steel: "Carbon & Alloy Steel",
    aluminum: "Aluminum Alloys",
    stainless: "Stainless Steel",
    copper: "Copper & Bronze",
    titanium: "Titanium Alloys",
    plastic: "Engineering Plastics",
  },
} as const;

const NEED_LABELS = {
  tr: {
    corrosion: "Korozyon Direnci",
    wear: "Aşınma & Sertlik",
    appearance: "Görünüm & Estetik",
    lowfriction: "Düşük Sürtünme (Kayganlık)",
    conductivity: "Elektriksel İletkenlik",
    high_temp: "Yüksek Sıcaklık Oksidasyon",
  },
  en: {
    corrosion: "Corrosion Resistance",
    wear: "Wear & Hardness",
    appearance: "Appearance & Aesthetics",
    lowfriction: "Low Friction & Lubricity",
    conductivity: "Electrical Conductivity",
    high_temp: "High Temperature Oxidation",
  },
} as const;

const COPY = {
  tr: {
    badge: "Kaplama",
    subBadge: "Hızlı Rehber",
    title: "Kaplama Rehberi",
    desc: "Alt malzeme ve öncelikli ihtiyacı seç; uygun kaplamaları ve kısa notları gör. Tolerans, sıcaklık ve kimyasal uygunluk için tedarikçi teknik föyünü mutlaka kontrol edin. Kalın/ince kaplama uyarıları ve iletkenlik/ısı etkileri burada özetlenmiştir.",
    selectionsTitle: "Seçim Kriterleri",
    baseLabel: "Alt malzeme",
    needLabel: "Öncelik / İhtiyaç",
    tip: "İnce kaplamalar (PVD, siyah oksit, Zn) toleransı az etkiler (< 5 µm); kalın kaplamalar (HDG, sert anodizasyon) ölçüleri 25–100 µm büyüteceğinden dişli ve rulman toleranslarında ön işleme payı bırakılmalıdır.",
    recTitle: "Önerilen Kaplamalar & Yüzey İşlemleri",
    thicknessPrefix: "Tipik kalınlık:",
    noMatch: "Bu seçim için öneri bulunamadı. Farklı öncelik veya malzeme seçin.",
  },
  en: {
    badge: "Surface Coatings",
    subBadge: "Engineering Guide",
    title: "Surface Coating & Treatment Guide",
    desc: "Select the base metal and primary engineering requirement to view compatible surface finishes, plating types, PVD coatings, and anodizing processes. Detailed with typical thickness build-up, dimensional tolerance notes, and functional limits.",
    selectionsTitle: "Selection Criteria",
    baseLabel: "Base Material",
    needLabel: "Primary Engineering Need",
    tip: "Tolerance Tip: Thin-film finishes (PVD, black oxide, zinc) have minimal impact (< 5 µm); heavy deposits (hot-dip galvanizing, hard anodize) add 25–100 µm per side and will require pre-plating machining allowances on precision threads and bearing bores.",
    recTitle: "Recommended Coatings & Treatments",
    thicknessPrefix: "Typical thickness:",
    noMatch: "No standard industrial coating found for this specific pairing. Try adjusting the base substrate or requirement.",
  },
} as const;

type CoatingGuideClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function CoatingGuidePage({ initialDocs }: CoatingGuideClientProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const t = COPY[isEn ? "en" : "tr"];
  const materialLabels = MATERIAL_LABELS[isEn ? "en" : "tr"];
  const needLabels = NEED_LABELS[isEn ? "en" : "tr"];

  const [base, setBase] = useState<BaseMaterial>("steel");
  const [need, setNeed] = useState<Need>("corrosion");

  const filtered = useMemo(
    () => COATINGS.filter((c) => c.bases.includes(base) && c.needs.includes(need)),
    [base, need],
  );

  return (
    <PageShell>
      <ToolDocTabs slug="coating-guide" initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t.badge}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-medium text-amber-700">
              {t.subBadge}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">{t.title}</h1>
          <p className="mt-2 text-xs text-slate-600">{t.desc}</p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.selectionsTitle}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-slate-700">{t.baseLabel}</span>
                <select
                  value={base}
                  onChange={(e) => setBase(e.target.value as BaseMaterial)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  {(Object.keys(materialLabels) as BaseMaterial[]).map((m) => (
                    <option key={m} value={m}>
                      {materialLabels[m]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-slate-700">{t.needLabel}</span>
                <select
                  value={need}
                  onChange={(e) => setNeed(e.target.value as Need)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  {(Object.keys(needLabels) as Need[]).map((n) => (
                    <option key={n} value={n}>
                      {needLabels[n]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-2 text-[11px] text-slate-600">{t.tip}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">{t.recTitle}</h3>
            <div className="space-y-3">
              {filtered.map((item) => (
                <article
                  key={item.nameTr}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <h4 className="text-sm font-semibold text-slate-900">
                    {isEn ? item.nameEn : item.nameTr}
                  </h4>
                  <p className="text-[11px] text-slate-700">{isEn ? item.descEn : item.descTr}</p>
                  {(isEn ? item.thicknessEn : item.thicknessTr) && (
                    <p className="mt-1 text-[11px] text-slate-700">
                      <span className="font-semibold">{t.thicknessPrefix} </span>
                      {isEn ? item.thicknessEn : item.thicknessTr}
                    </p>
                  )}
                  {(isEn ? item.notesEn : item.notesTr) && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      {isEn ? item.notesEn : item.notesTr}
                    </p>
                  )}
                </article>
              ))}
              {filtered.length === 0 && (
                <p className="text-[11px] text-slate-600">{t.noMatch}</p>
              )}
            </div>
          </div>
        </section>
      </ToolDocTabs>
    </PageShell>
  );
}
