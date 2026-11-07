"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

type Media = "oil" | "fuel" | "water" | "steam" | "chem" | "food" | "air";
type Temp = "low" | "mid" | "high";
type Pressure = "low" | "mid" | "high";

type SealOption = {
  materialTr: string;
  materialEn: string;
  typesTr: string;
  typesEn: string;
  media: Media[];
  temps: Temp[];
  pressures: Pressure[];
  descTr: string;
  descEn: string;
  notesTr?: string;
  notesEn?: string;
};

const SEALS: SealOption[] = [
  {
    materialTr: "NBR (Nitril)",
    materialEn: "NBR (Nitrile Butadiene)",
    typesTr: "O-ring, V-ring, döner mil keçesi",
    typesEn: "O-rings, V-rings, rotary shaft oil seals",
    media: ["oil", "fuel"],
    temps: ["low", "mid"],
    pressures: ["low", "mid"],
    descTr: "Mineral yağ, gres ve yakıtlarla uyumlu; ekonomik ve sanayide en yaygın elastomer.",
    descEn:
      "Excellent compatibility with mineral oils, petroleum greases, and fuels; cost-effective general-purpose elastomer.",
    notesTr: "Ozon ve UV direnci zayıftır; -30°C / +100°C tipik çalışma aralığıdır.",
    notesEn: "Poor ozone/UV weather resistance; typical operational range -30°C to +100°C.",
  },
  {
    materialTr: "HNBR (Hidrojene Nitril)",
    materialEn: "HNBR (Hydrogenated Nitrile)",
    typesTr: "O-ring, dinamik hidrolik keçe",
    typesEn: "High-pressure O-rings, dynamic hydraulic packings",
    media: ["oil", "fuel"],
    temps: ["mid", "high"],
    pressures: ["mid", "high"],
    descTr: "Yağ/yakıt uyumu ve termal dayanımı NBR'den belirgin şekilde yüksektir.",
    descEn:
      "Higher mechanical strength, oil/fuel resistance, and thermal headroom compared to standard NBR.",
    notesTr: "-30°C / +140°C tipik; aşınma ve ozon direnci mükemmeldir.",
    notesEn: "Typical range -30°C to +140°C; outstanding ozone, abrasion, and sour-gas resistance.",
  },
  {
    materialTr: "FKM (Viton / Floroelastomer)",
    materialEn: "FKM (Viton / Fluoroelastomer)",
    typesTr: "O-ring, şaft keçesi, flanş contası",
    typesEn: "O-rings, rotary lip seals, sheet gaskets",
    media: ["oil", "fuel", "chem"],
    temps: ["mid", "high"],
    pressures: ["mid", "high"],
    descTr: "Yakıt, sentetik yağlar ve agresif kimyasallara olağanüstü direnç; yüksek sıcaklık.",
    descEn:
      "Exceptional resistance to aggressive hydrocarbons, synthetic lubricants, acids, and elevated temperatures.",
    notesTr: "-20°C / +200°C; yüksek basınçlı buhar ve amin içeren ortamlarda özel kaliteler seçilmelidir.",
    notesEn: "-20°C to +200°C; avoid high-pressure steam and amine-rich additives unless specialized grade.",
  },
  {
    materialTr: "FFKM (Perfloroelastomer)",
    materialEn: "FFKM (Perfluoroelastomer)",
    typesTr: "Hassas O-ring, özel sızdırmazlık",
    typesEn: "Ultra-pure O-rings, chemical process seals",
    media: ["chem"],
    temps: ["mid", "high"],
    pressures: ["mid", "high"],
    descTr: "Elastomer esnekliğine sahip PTFE benzeri evrensel kimyasal dayanım; yarı iletken ve nükleer standart.",
    descEn:
      "Ultimate chemical inertness virtually matching PTFE with full elastomeric sealing recovery; ultra-high purity & semiconductor grade.",
  },
  {
    materialTr: "EPDM (Etilen Propilen)",
    materialEn: "EPDM (Ethylene Propylene Diene)",
    typesTr: "O-ring, düz su contası, boru contası",
    typesEn: "O-rings, flat sanitary gaskets, pipe couplings",
    media: ["water", "steam", "food"],
    temps: ["low", "mid"],
    pressures: ["low", "mid"],
    descTr: "Sıcak su, buhar, fren hidrolikleri ve dış hava şartları için ideal; mineral yağlara temas etmemelidir.",
    descEn:
      "Outstanding resistance to hot water, steam, polar solvents, brake fluids, and outdoor ozone; attacked by hydrocarbon oils.",
    notesTr: "-40°C / +130°C (+150°C peroksit kürlü); mineral yağda hızla şişer.",
    notesEn: "-40°C to +130°C (+150°C peroxide cured); sulfur cured grades degrade faster in steam.",
  },
  {
    materialTr: "VMQ (Silikon)",
    materialEn: "VMQ (Silicone Rubber)",
    typesTr: "O-ring, profil conta, fırın contası",
    typesEn: "Sanitary O-rings, oven door profiles, flat gaskets",
    media: ["food", "air"],
    temps: ["low", "high"],
    pressures: ["low"],
    descTr: "Geniş sıcaklık aralığı ve gıda uyumu (FDA); yakıt ve madeni yağ ortamlarında mekanik mukavemeti zayıftır.",
    descEn:
      "Broadest thermal flexibility and clean biocompatibility (FDA/USP); mechanically soft with low tensile/tear strength.",
    notesTr: "-50°C / +200°C; dinamik sürtünme ve yırtılma direnci düşüktür.",
    notesEn: "-50°C to +200°C; poor resistance to aromatic fuels and dynamic abrasive wear.",
  },
  {
    materialTr: "PTFE (Saf Teflon)",
    materialEn: "Virgin PTFE (Polytetrafluoroethylene)",
    typesTr: "Düz conta, dudaklı mil contası",
    typesEn: "Flat flange gaskets, machined rotary lip seals",
    media: ["chem", "food", "steam"],
    temps: ["mid", "high"],
    pressures: ["mid"],
    descTr: "Sıfıra yakın kimyasal reaktivite ve en düşük sürtünme katsayısı; soğuk akma (sünme) eğilimi vardır.",
    descEn:
      "Nearly universal chemical immunity, zero moisture absorption, and lowest dry friction coefficient; prone to cold flow (creep).",
    notesTr: "Cıvata torkunu korumak için yaylı flanş rondelası veya back-up ring önerilir.",
    notesEn: "Often paired with Belleville spring energizers or back-up rings to sustain contact pressure.",
  },
  {
    materialTr: "PTFE Kaplı Elastomer (FEP/FKM)",
    materialEn: "FEP/PFA Encapsulated Elastomer",
    typesTr: "Kapsüllenmiş O-ring",
    typesEn: "Encapsulated O-rings (FKM or VMQ core)",
    media: ["chem", "food"],
    temps: ["mid", "high"],
    pressures: ["mid"],
    descTr: "Elastomer çekirdeğin yaylanma kabiliyeti ile PTFE dış kılıfın kimyasal korumasını birleştirir.",
    descEn:
      "Combines the elastic resilience of an FKM or VMQ core with the near-universal chemical barrier of a seamless FEP/PFA jacket.",
  },
  {
    materialTr: "Spiral Sarımlı Grafit Conta (SPW)",
    materialEn: "Spiral Wound Graphite Gasket (SWG)",
    typesTr: "Flanş contası (ASME B16.20)",
    typesEn: "Spiral wound flange gaskets (ASME B16.20)",
    media: ["steam", "chem", "oil"],
    temps: ["high"],
    pressures: ["high"],
    descTr: "V-profilli paslanmaz çelik şerit ve esnek grafit dolgu; termal şok ve yüksek basınçlı flanşlarda standarttır.",
    descEn:
      "Engineered V-shaped metallic winding with flexible exfoliated graphite filler for cyclic pressure/thermal flange joints.",
    notesTr: "Flanş yüzey pürüzlülüğü (Ra 3.2–6.3 µm) ve kontrollü torklama şarttır.",
    notesEn: "Strict bolt torque pattern and ASME B16.5 flange surface finish (3.2–6.3 µm Ra) required.",
  },
  {
    materialTr: "Klingerit / Aramid Elyaf Takviyeli (CNAF)",
    materialEn: "Compressed Non-Asbestos Fiber (CNAF)",
    typesTr: "Düz boru ve flanş contası",
    typesEn: "Cut sheet pipe flange gaskets (EN 1514 / ASME B16.21)",
    media: ["steam", "oil", "chem"],
    temps: ["mid", "high"],
    pressures: ["mid"],
    descTr: "Aramid ve inorganik elyafların NBR bağlayıcı ile preslenmesi; buhar ve proses borularında çok amaçlı çözüm.",
    descEn:
      "Aramid/inorganic fibers bonded with NBR elastomer; standard general-utility pipe flange and boiler casing gasket.",
    notesTr: "Modern asbestsiz tipler tercih edilmelidir.",
    notesEn: "Ensure modern non-asbestos grades complying with DIN 3754 / ASME B16.21.",
  },
  {
    materialTr: "Dolgulu PTFE (Karbon / Cam Takviyeli)",
    materialEn: "Filled PTFE (Glass / Carbon Filled)",
    typesTr: "Düz conta, back-up ring",
    typesEn: "High-pressure flat gaskets, anti-extrusion rings",
    media: ["chem", "steam"],
    temps: ["mid", "high"],
    pressures: ["high"],
    descTr: "%15–25 cam veya karbon dolgu ile soğuk akma minimuma indirilir; kimyasal direnç korunur.",
    descEn:
      "Compounded with 15–25% glass or carbon fibers to curtail creep and cold-flow deformation while resisting acids.",
  },
  {
    materialTr: "PU (Poliüretan)",
    materialEn: "Polyurethane (PU / AU / EU)",
    typesTr: "Hidrolik piston/boğaz keçesi, sıyırıcı",
    typesEn: "Hydraulic rod & piston seals, wiper scrapers",
    media: ["oil", "air"],
    temps: ["low", "mid"],
    pressures: ["mid", "high"],
    descTr: "Yüksek mekanik darbe, aşınma ve ekstrüzyon direnci; hidrolik silindirlerde vazgeçilmezdir.",
    descEn:
      "High tear strength, abrasion resistance, and extrusion resistance for heavy-duty hydraulic cylinder rods and pistons.",
    notesTr: "-30°C / +90°C tipik; sıcak su ve sulu emülsiyonlarda hidroliz riski vardır.",
    notesEn: "-30°C to +90°C; susceptible to hydrolysis in hot water, acids, and strong alkaline media.",
  },
  {
    materialTr: "NBR + PTFE Destek Halkası (Back-up Ring)",
    materialEn: "NBR O-Ring with PTFE Back-up Ring",
    typesTr: "Yüksek basınç O-ring takımı",
    typesEn: "Anti-extrusion O-ring + back-up assembly",
    media: ["oil", "fuel"],
    temps: ["low", "mid"],
    pressures: ["high"],
    descTr: "Yüksek basınç altında O-ring elastomerinin radyal boşluktan taşmasını önlemek için PTFE halka ile desteklenir.",
    descEn:
      "O-ring supported by contoured PTFE anti-extrusion rings in clearance gaps above 100–150 bar.",
  },
  {
    materialTr: "Metalik C-Ring / E-Ring",
    materialEn: "Metallic C-Ring / E-Ring",
    typesTr: "Metalik basınçla enerjilenen conta",
    typesEn: "Resilient metal pressure-energized seals",
    media: ["steam", "chem", "fuel"],
    temps: ["high"],
    pressures: ["high"],
    descTr: "Kriyojenik ve 500°C+ aşırı sıcaklıklarda çalışan Inconel/paslanmaz metalik sızdırmazlık elemanı.",
    descEn:
      "Pressure-energized metallic seal designed for extreme cryogenics, nuclear service, and ultra-high pressures exceeding 1000 bar.",
    notesTr: "Çok hassas taşlanmış kanal yüzey kalitesi (Ra < 0.4 µm) ve yüksek cıvata ön yükü gerektirir.",
    notesEn: "Demands fine diamond-turned or ground flange groove finishes (Ra < 0.4–0.8 µm).",
  },
  {
    materialTr: "RTJ Metalik Halka Conta (API 6A / 17D)",
    materialEn: "Ring Type Joint (RTJ Metal Ring)",
    typesTr: "Oval veya sekizgen RTJ metal halka",
    typesEn: "Octagonal / oval solid metal RTJ rings",
    media: ["oil", "chem", "steam"],
    temps: ["high"],
    pressures: ["high"],
    descTr: "Petrol-gaz kuyubaşı ve yüksek basınçlı buhar hatlarında metal-metale temasla mutlak sızdırmazlık.",
    descEn:
      "Solid precision-machined octagonal or oval metallic ring for API 6A oilfield wellhead and high-pressure steam headers.",
  },
];

const MEDIA_LABELS = {
  tr: {
    oil: "Yağ / Gres",
    water: "Su",
    steam: "Buhar",
    fuel: "Yakıt / Hidrokarbon",
    chem: "Kimyasal / Asit",
    food: "Gıda / Hijyen",
    air: "Hava / Gaz",
  },
  en: {
    oil: "Oil / Petroleum Grease",
    water: "Water",
    steam: "Steam",
    fuel: "Fuel / Hydrocarbons",
    chem: "Chemicals / Acids",
    food: "Food / Sanitary",
    air: "Air / Inert Gas",
  },
} as const;

const TEMP_LABELS = {
  tr: {
    low: "Düşük (-50 / +60°C)",
    mid: "Orta (+60 / +140°C)",
    high: "Yüksek (+140°C üstü)",
  },
  en: {
    low: "Low (-50 to +60°C)",
    mid: "Medium (+60 to +140°C)",
    high: "High (> +140°C)",
  },
} as const;

const PRESSURE_LABELS = {
  tr: {
    low: "Düşük (< 10 bar)",
    mid: "Orta (10–40 bar)",
    high: "Yüksek (40+ bar)",
  },
  en: {
    low: "Low (< 10 bar)",
    mid: "Medium (10–40 bar)",
    high: "High (40+ bar)",
  },
} as const;

const COPY = {
  tr: {
    badge: "Sızdırmazlık",
    subBadge: "Rehber",
    title: "Sızdırmazlık ve Contalar Rehberi",
    desc: "Ortam (yağ, su/buhar, kimyasal), sıcaklık ve basınca göre uygun malzeme/conta tiplerini hızlıca filtrele. Sonuçlar hızlı öneridir; tedarikçi datasheet ve yüzey/tolerans şartları mutlaka kontrol edilmelidir.",
    selectionsTitle: "Seçimler",
    mediaLabel: "Ortam",
    tempLabel: "Sıcaklık",
    pressureLabel: "Basınç",
    paramNote:
      "Not: Yüksek basınçta (40+ bar) O-ring için PTFE back-up önerilir. Buhar için EPDM/FKM tipi ve sıcaklık derecesi doğrulanmalıdır. Gıda/hijyen için FDA/CE uygunluk iste.",
    recTitle: "Önerilen Malzeme / Conta Tipleri",
    typePrefix: "Tip:",
    noMatch:
      "Bu kombinasyonda öneri bulunamadı. Parametreleri değiştir veya özel malzeme (FFKM/metalik) talep et.",
    notesTitle: "Hızlı Tasarım Notları",
    notes: [
      "Yüzey pürüzlülüğü, sıkma oranı (%15–30 squeeze) ve kanal toleransı sızdırmazlık ömrü için kritiktir.",
      "Dinamik uygulamalarda akışkan filmi yağlaması dudak aşınmasını belirler; kuru sürtünmeden kaçınılmalıdır.",
      "Kimyasal ortamlarda elastomer hacimsel şişmesi ve sertlik değişimi için üretici uyumluluk tabloları kontrol edilmelidir.",
      "Darbeli yüksek basınçta O-ring ekstrüzyonunu önlemek için sertleştirilmiş PTFE destek halkaları (back-up) kullanılmalıdır.",
    ],
    graphicTitle: "Conta Kesiti & Kanal Görselleştirmesi",
    graphicSubtitle: "Basit sızdırmazlık ve akış geometrisi",
    graphicFooter:
      "Bu eskizi tedarikçi verisiyle destekleyin: yüzey pürüzlülük, sıkma torku, sıcaklık ve basınç çok kritiktir.",
  },
  en: {
    badge: "Sealing Systems",
    subBadge: "Engineering Guide",
    title: "Seals & Gaskets Selection Guide",
    desc: "Filter standard elastomers, engineering plastics, and metallic gaskets based on operating fluid, operating temperature, and system pressure. Engineering guidance for hydraulic, pneumatic, and process piping design.",
    selectionsTitle: "Operating Parameters",
    mediaLabel: "Fluid / Media",
    tempLabel: "Temperature",
    pressureLabel: "System Pressure",
    paramNote:
      "Design Tip: At 40+ bar, use contoured PTFE back-up rings to avoid radial extrusion. For steam systems verify peroxide-cured EPDM or specialized fluoroelastomers. Request FDA/EC1935 certificates for sanitary applications.",
    recTitle: "Recommended Seal & Gasket Materials",
    typePrefix: "Styles:",
    noMatch:
      "No standard recommendation for this exact operational envelope. Consider custom perfluoroelastomers (FFKM) or engineered metallic seals.",
    notesTitle: "Key Engineering Rules",
    notes: [
      "Gland groove depth, diametral clearance gap, and surface roughness (Ra) directly dictate extrusion limits and sealing integrity.",
      "In dynamic reciprocating and rotary seals, fluid film lubrication determines lip wear; never operate dry.",
      "Consult chemical compatibility matrices for volume swell, hardness change, and elongation loss in contact fluids.",
      "Under pulsating high pressure (> 50 bar), incorporate spiral or solid PTFE anti-extrusion back-up rings.",
    ],
    graphicTitle: "Seal Cavity Cross-Section",
    graphicSubtitle: "Gland compression and pressure energization behavior",
    graphicFooter:
      "Verify gland squeeze (15–30%), lead-in chamfers, and groove surface finish (Ra 0.4–1.6 µm) against manufacturer seal catalogs.",
  },
} as const;

type SealingGuideClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function SealingGuidePage({ initialDocs }: SealingGuideClientProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const t = COPY[isEn ? "en" : "tr"];
  const mediaLabels = MEDIA_LABELS[isEn ? "en" : "tr"];
  const tempLabels = TEMP_LABELS[isEn ? "en" : "tr"];
  const pressureLabels = PRESSURE_LABELS[isEn ? "en" : "tr"];

  const [media, setMedia] = useState<Media>("oil");
  const [temp, setTemp] = useState<Temp>("mid");
  const [pressure, setPressure] = useState<Pressure>("mid");

  const filtered = useMemo(
    () =>
      SEALS.filter(
        (seal) =>
          seal.media.includes(media) &&
          seal.temps.includes(temp) &&
          seal.pressures.includes(pressure),
      ),
    [media, temp, pressure],
  );

  return (
    <PageShell>
      <ToolDocTabs slug="sealing-guide" initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t.badge}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-700">
              {t.subBadge}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">{t.title}</h1>
          <p className="mt-2 text-xs text-slate-600">{t.desc}</p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.selectionsTitle}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <SelectField
                label={t.mediaLabel}
                value={media}
                onChange={(v) => setMedia(v as Media)}
                options={mediaLabels}
              />
              <SelectField
                label={t.tempLabel}
                value={temp}
                onChange={(v) => setTemp(v as Temp)}
                options={tempLabels}
              />
              <SelectField
                label={t.pressureLabel}
                value={pressure}
                onChange={(v) => setPressure(v as Pressure)}
                options={pressureLabels}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-600">{t.paramNote}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">{t.recTitle}</h3>
            <div className="space-y-3">
              {filtered.map((item) => (
                <article
                  key={item.materialTr + item.typesTr}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <h4 className="text-sm font-semibold text-slate-900">
                    {isEn ? item.materialEn : item.materialTr}
                  </h4>
                  <p className="text-[11px] text-slate-700">
                    <span className="font-semibold">{t.typePrefix} </span>
                    {isEn ? item.typesEn : item.typesTr}
                  </p>
                  <p className="text-[11px] text-slate-700">{isEn ? item.descEn : item.descTr}</p>
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

        <SealGraphic
          title={t.graphicTitle}
          subtitle={t.graphicSubtitle}
          footer={t.graphicFooter}
        />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">{t.notesTitle}</h3>
          <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
            {t.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </ToolDocTabs>
    </PageShell>
  );
}

function SealGraphic({
  title,
  subtitle,
  footer,
}: {
  title: string;
  subtitle: string;
  footer: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-5 text-xs shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
            {title}
          </p>
          <p className="text-[11px] text-slate-600">{subtitle}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-semibold text-white">
          PSI
        </div>
      </div>
      <svg viewBox="0 0 280 120" className="w-full">
        <defs>
          <linearGradient id="sealBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d1fae5" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
          <radialGradient id="sealCore" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        <rect
          x="15"
          y="46"
          width="250"
          height="52"
          rx="10"
          fill="url(#sealBody)"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
        <rect x="32" y="62" width="90" height="24" rx="6" fill="#94a3b8" opacity="0.65" />
        <rect x="140" y="62" width="70" height="24" rx="6" fill="#94a3b8" opacity="0.5" />
        <circle
          className="seal-pulse"
          cx="210"
          cy="72"
          r="16"
          fill="url(#sealCore)"
          stroke="#059669"
          strokeWidth="3"
        />
        <path
          className="seal-flow"
          d="M35 40 C 90 52, 150 34, 230 46"
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M32 46 L32 92"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M245 46 L245 92"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
      <p className="mt-2 text-[11px] text-slate-600">{footer}</p>
      <style jsx>{`
        @keyframes sealPulse {
          0% {
            transform: scale(0.92);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(0.92);
            opacity: 0.65;
          }
        }
        @keyframes sealFlow {
          0% {
            stroke-dashoffset: 42;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .seal-pulse {
          transform-origin: center;
          animation: sealPulse 3.2s ease-in-out infinite;
        }
        .seal-flow {
          stroke-dasharray: 10 10;
          animation: sealFlow 2.6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Record<string, string>;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
      >
        {Object.entries(options).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );
}
