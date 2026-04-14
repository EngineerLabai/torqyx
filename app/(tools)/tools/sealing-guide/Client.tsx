"use client";

// app/tools/sealing-guide/page.tsximport { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

type Media = "oil" | "fuel" | "water" | "steam" | "chem" | "food" | "air";
type Temp = "low" | "mid" | "high";
type Pressure = "low" | "mid" | "high";

type SealOption = {
  material: string;
  types: string;
  media: Media[];
  temps: Temp[];
  pressures: Pressure[];
  description: string;
  notes?: string;
};

const SEALS: SealOption[] = [
  {
    material: "NBR (Nitril)",
    types: "O-ring, V-ring, dudak keçesi",
    media: ["oil", "fuel"],
    temps: ["low", "mid"],
    pressures: ["low", "mid"],
    description: "Mineral yağ, gres ve yakıtlarla uyumlu; ekonomik ve yaygın.",
    notes: "Ozon/UV zayıf; -30/+100°C tipik.",
  },
  {
    material: "HNBR",
    types: "O-ring, dinamik keçe",
    media: ["oil", "fuel"],
    temps: ["mid", "high"],
    pressures: ["mid", "high"],
    description: "Yağ/yakıt uyumu ve sıcaklık dayanımı NBR’den yüksek.",
    notes: "-30/+140°C tipik; ozon direnci daha iyi.",
  },
  {
    material: "FKM (Viton)",
    types: "O-ring, shaft keçe, flat gasket",
    media: ["oil", "fuel", "chem"],
    temps: ["mid", "high"],
    pressures: ["mid", "high"],
    description: "Yakıt, yağ ve birçok kimyasala yüksek direnç; yüksek sıcaklık.",
    notes: "-20/+200°C; buhar/amin ortamında dikkat.",
  },
  {
    material: "FFKM",
    types: "O-ring",
    media: ["chem"],
    temps: ["mid", "high"],
    pressures: ["mid", "high"],
    description: "En yüksek kimyasal ve sıcaklık direnci; çok pahalı.",
  },
  {
    material: "EPDM",
    types: "O-ring, flat gasket",
    media: ["water", "steam", "food"],
    temps: ["low", "mid"],
    pressures: ["low", "mid"],
    description: "Su, buhar ve dış hava için iyi; mineral yağa uyumsuz.",
    notes: "-40/+130°C; sıcak buhar için özel derece gerekebilir.",
  },
  {
    material: "VMQ (Silikon)",
    types: "O-ring, düz conta",
    media: ["food", "air"],
    temps: ["low", "high"],
    pressures: ["low"],
    description: "Geniş sıcaklık aralığı ve gıda uyumu; yakıt/yağ için zayıf.",
    notes: "-50/+200°C; yırtılma/aşınma dayanımı düşük.",
  },
  {
    material: "PTFE (Saf)",
    types: "Flat gasket, PTFE lip seal",
    media: ["chem", "food", "steam"],
    temps: ["mid", "high"],
    pressures: ["mid"],
    description: "Kimyasal inert, düşük sürtünme; soğuk akma riski.",
    notes: "Sızdırmazlık için arka destek (back-up ring) önerilir.",
  },
  {
    material: "PTFE + FKM elastomer takviyeli",
    types: "PTFE O-ring / kaplamalı",
    media: ["chem", "food"],
    temps: ["mid", "high"],
    pressures: ["mid"],
    description: "Elastomer çekirdekli PTFE kaplı; düşük sürtünme + kimyasal direnç.",
  },
  {
    material: "Graphite Spiral Wound",
    types: "Spiral wound gasket",
    media: ["steam", "chem", "oil"],
    temps: ["high"],
    pressures: ["high"],
    description: "Yüksek sıcaklık ve basınçta flanş contası; metal + grafit dolgu.",
    notes: "Yüzey pürüzlülüğü ve sıkma torku kontrol edilmeli.",
  },
  {
    material: "Klingerit / Elyaf Takviyeli (CAF)",
    types: "Flat gasket",
    media: ["steam", "oil", "chem"],
    temps: ["mid", "high"],
    pressures: ["mid"],
    description: "Çok amaçlı flanş contası; yüksek sıcaklık ve basınçta kullanılan tipler.",
    notes: "Asbest içermeyen tipler tercih edilmeli.",
  },
  {
    material: "PTFE Dolgulu (Glass/Carbon Filled)",
    types: "Flat gasket, back-up ring",
    media: ["chem", "steam"],
    temps: ["mid", "high"],
    pressures: ["high"],
    description: "Soğuk akma azalır, kimyasal direnç korunur.",
  },
  {
    material: "PU (Poliüretan)",
    types: "Hidrolik/Pnömatik rod-piston keçesi",
    media: ["oil", "air"],
    temps: ["low", "mid"],
    pressures: ["mid", "high"],
    description: "Yüksek aşınma direnci, hidrolikte yaygın.",
    notes: "-30/+90°C tipik; sıcak su/buhar için uygun değil.",
  },
  {
    material: "NBR + Teflon Back-up",
    types: "O-ring + back-up",
    media: ["oil", "fuel"],
    temps: ["low", "mid"],
    pressures: ["high"],
    description: "Yüksek basınçta ekstrüzyonu engellemek için PTFE back-up ile kombinasyon.",
  },
  {
    material: "Metal C-Ring / E-Ring",
    types: "Metal contalar",
    media: ["high_temp", "steam", "chem", "fuel"].filter((m) => m !== "high_temp") as Media[], // placeholder, not used
    temps: ["high"],
    pressures: ["high"],
    description: "Metal sızdırmazlık elemanları; çok yüksek sıcaklık ve basınç.",
    notes: "Yüksek yüzey kalitesi ve sıkma kuvveti gerekir.",
  },
  {
    material: "Alüminyum / Bakır Ring Joint",
    types: "RTJ metal ring gasket",
    media: ["oil", "chem", "steam"],
    temps: ["high"],
    pressures: ["high"],
    description: "RTJ flanşlarda yüksek basınç sızdırmazlık; metal halka.",
  },
];

const MEDIA_LABELS: Record<Media, string> = {
  oil: "Yağ/Gres",
  water: "Su",
  steam: "Buhar",
  fuel: "Yakıt",
  chem: "Kimyasal",
  food: "Gıda/Hijyen",
  air: "Hava",
};

const TEMP_LABELS: Record<Temp, string> = {
  low: "Düşük (-50/+60°C)",
  mid: "Orta (+60/+140°C)",
  high: "Yüksek (+140°C üstü)",
};

const PRESSURE_LABELS: Record<Pressure, string> = {
  low: "Düşük (<10 bar)",
  mid: "Orta (10–40 bar)",
  high: "Yüksek (40+ bar)",
};

type SealingGuideClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function SealingGuidePage({ initialDocs }: SealingGuideClientProps) {
  const [media, setMedia] = useState<Media>("oil");
  const [temp, setTemp] = useState<Temp>("mid");
  const [pressure, setPressure] = useState<Pressure>("mid");

  const filtered = useMemo(
    () =>
      SEALS.filter(
        (s) =>
          s.media.includes(media) &&
          s.temps.includes(temp) &&
          s.pressures.includes(pressure),
      ),
    [media, temp, pressure],
  );

  return (
    <PageShell>
      <ToolDocTabs slug="sealing-guide" initialDocs={initialDocs}>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Sızdırmazlık
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-700">
            Rehber
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">Sızdırmazlık ve Contalar Rehberi</h1>
        <p className="mt-2 text-xs text-slate-600">
          Ortam (yağ, su/buhar, kimyasal), sıcaklık ve basınca göre uygun malzeme/conta tiplerini
          hızlıca filtrele. Sonuçlar hızlı öneridir; tedarikçi datasheet ve yüzey/tolerans şartları
          mutlaka kontrol edilmelidir.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Seçimler</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <SelectField label="Ortam" value={media} onChange={(v) => setMedia(v as Media)} options={MEDIA_LABELS} />
            <SelectField label="Sıcaklık" value={temp} onChange={(v) => setTemp(v as Temp)} options={TEMP_LABELS} />
            <SelectField
              label="Basınç"
              value={pressure}
              onChange={(v) => setPressure(v as Pressure)}
              options={PRESSURE_LABELS}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-600">
            Not: Yüksek basınçta (40+ bar) O-ring için PTFE back-up önerilir. Buhar için EPDM/
            FKM tipi ve sıcaklık derecesi doğrulanmalıdır. Gıda/hijyen için FDA/CE uygunluk iste.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Önerilen Malzeme/Conta</h3>
          <div className="space-y-3">
            {filtered.map((s) => (
              <article key={s.material + s.types} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <h4 className="text-sm font-semibold text-slate-900">{s.material}</h4>
                <p className="text-[11px] text-slate-700">
                  <span className="font-semibold">Tip: </span>
                  {s.types}
                </p>
                <p className="text-[11px] text-slate-700">{s.description}</p>
                {s.notes && <p className="mt-1 text-[11px] text-slate-500">{s.notes}</p>}
              </article>
            ))}
            {filtered.length === 0 && (
              <p className="text-[11px] text-slate-600">
                Bu kombinasyonda öneri bulunamadı. Parametreleri değiştir veya özel malzeme iste.
              </p>
            )}
          </div>
        </div>
      </section>


            <SealGraphic />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Hızlı Notlar</h3>
        <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
          <li>Yüzey pürüzlülüğü, boşluk (squeeze) ve kanal toleransı sızdırmazlık için kritiktir.</li>
          <li>Dinamik uygulamada yağlama ve dudak tasarımı ömrü belirler; kuru çalışmadan kaçın.</li>
          <li>Kimyasal ortamda elastomer şişmesi/sertleşmesi için datasheet kontrolü şart.</li>
          <li>Yüksek basınçta O-ring ekstrüzyonu için back-up ring ve uygun boşluk seç.</li>
        </ul>
      </section>

      
          </ToolDocTabs>
    </PageShell>
  );
}

function SealGraphic() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-5 text-xs shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">Conta kesiti</p>
          <p className="text-[11px] text-slate-600">Basit sızdırmazlık ve akış görselleştirmesi</p>
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
        <rect x="15" y="46" width="250" height="52" rx="10" fill="url(#sealBody)" stroke="#cbd5e1" strokeWidth="2" />
        <rect x="32" y="62" width="90" height="24" rx="6" fill="#94a3b8" opacity="0.65" />
        <rect x="140" y="62" width="70" height="24" rx="6" fill="#94a3b8" opacity="0.5" />
        <circle className="seal-pulse" cx="210" cy="72" r="16" fill="url(#sealCore)" stroke="#059669" strokeWidth="3" />
        <path
          className="seal-flow"
          d="M35 40 C 90 52, 150 34, 230 46"
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M32 46 L32 92" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
        <path d="M245 46 L245 92" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      </svg>
      <p className="mt-2 text-[11px] text-slate-600">
        Bu eskizi tedarikçi verisiyle destekleyin: yüzey pürüzlülük, sıkma torku, sıcaklık ve basınç çok kritiktir.
      </p>
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


