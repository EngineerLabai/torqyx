"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

type TaktInputs = {
  netTime: string; // available time per shift (min)
  demand: string; // units per shift
};

type OeeInputs = {
  availability: string; // %
  performance: string; // %
  quality: string; // %
};

type PressInputs = {
  thickness: string; // mm
  perimeter: string; // mm
  shear: string; // MPa
  safety: string; // factor
};

type PowerInputs = {
  torque: string; // Nm
  rpm: string; // rev/min
  load: string; // load factor %
};

const TAKT_INIT: TaktInputs = {
  netTime: "450",
  demand: "900",
};

const OEE_INIT: OeeInputs = {
  availability: "85",
  performance: "90",
  quality: "98",
};

const PRESS_INIT: PressInputs = {
  thickness: "2.0",
  perimeter: "420",
  shear: "320",
  safety: "1.2",
};

const POWER_INIT: PowerInputs = {
  torque: "180",
  rpm: "1450",
  load: "85",
};

const COPY = {
  tr: {
    badge: "Üretim & Proje",
    subBadge: "Çoklu Hesap",
    title: "Üretim & Proje Hızlı Paket",
    desc: "Üretim için hızlı hesaplar: (1) takt time, (2) OEE, (3) pres tonaj tahmini, (4) motor güç/tork. Hızlı fikir verir; sahada detaylı analiz ve verifikasyon şart.",
    graphicTitle: "Hızlı görselleştirme",
    graphicSubtitle: "Takt/OEE/pres/güç nabzı",
    bars: [
      { label: "Takt", value: 68 },
      { label: "OEE", value: 82 },
      { label: "Pres", value: 74 },
      { label: "Güç", value: 88 },
    ],
    positivePrompt: "Pozitif değerler gir.",
    taktTitle: "1) Takt Time",
    taktTimeLabel: "Net süre (dk/mesai)",
    demandLabel: "Talep (adet/mesai)",
    taktMin: "Takt (dk/adet)",
    taktSec: "Takt (sn/adet)",
    oeeTitle: "2) OEE (Overall Equipment Effectiveness)",
    oeeNote:
      "Hızlı değerlendirme: < 60% zayıf, 60-75% orta, 75-85% iyi, > 85% dünya klası (genel kural). Kayıp analizi için A/P/Q bileşenlerini ayrı izleyin.",
    pressTitle: "3) Pres Tonaj Tahmini (kesme)",
    thicknessLabel: "Kalınlık t (mm)",
    perimeterLabel: "Kesim çevresi P (mm)",
    shearLabel: "Kesme dayanımı (MPa)",
    safetyLabel: "Emniyet kats.",
    pressNote:
      "Not: Kesme için kullanılır. Delme/blanking için P, parçanın kesim çevresidir; malzeme kesme dayanımı datasheet'ten alınmalıdır.",
    powerTitle: "4) Motor Güç/Tork",
    torqueLabel: "Tork (Nm)",
    rpmLabel: "Devir (rpm)",
    loadLabel: "Yükleme [%]",
    loadHelper: "Tipik: 70-90%",
    powerLoaded: "P (kW) - yükte",
    powerNote:
      "Not: P[kW] = T[Nm] x n[rpm] / 9550. Servis faktörleri ve verim için motor datasına bak.",
  },
  en: {
    badge: "Production & Project",
    subBadge: "Multi-Calculator",
    title: "Production & Operations Fast Pack",
    desc: "Fast engineering estimates for operations: (1) takt time, (2) OEE calculation, (3) press tonnage prediction, and (4) motor power/torque sizing. Practical approximations for shop-floor and project scoping.",
    graphicTitle: "Operational Pulse",
    graphicSubtitle: "Takt / OEE / Press / Power metrics",
    bars: [
      { label: "Takt", value: 68 },
      { label: "OEE", value: 82 },
      { label: "Press", value: 74 },
      { label: "Power", value: 88 },
    ],
    positivePrompt: "Enter positive values.",
    taktTitle: "1) Takt Time",
    taktTimeLabel: "Available time (min/shift)",
    demandLabel: "Customer demand (units/shift)",
    taktMin: "Takt (min/unit)",
    taktSec: "Takt (sec/unit)",
    oeeTitle: "2) OEE (Overall Equipment Effectiveness)",
    oeeNote:
      "Benchmark guide: < 60% poor, 60-75% fair, 75-85% good, > 85% world-class (general rule of thumb). Track individual A, P, Q components to identify root bottlenecks.",
    pressTitle: "3) Press Tonnage Estimation (Shearing/Punching)",
    thicknessLabel: "Thickness t (mm)",
    perimeterLabel: "Cutting perimeter P (mm)",
    shearLabel: "Shear strength (MPa)",
    safetyLabel: "Safety factor",
    pressNote:
      "Note: Sized for shearing and blanking. P is total cutting perimeter; shear strength should be verified from sheet metal material datasheets (typically 70-80% of ultimate tensile strength).",
    powerTitle: "4) Motor Power & Torque",
    torqueLabel: "Torque (Nm)",
    rpmLabel: "Speed (rpm)",
    loadLabel: "Load factor [%]",
    loadHelper: "Typical: 70–90%",
    powerLoaded: "P (kW) - loaded",
    powerNote:
      "Note: P[kW] = T[Nm] x n[rpm] / 9550. Account for service factors, gearbox efficiency, and duty cycles from supplier catalog data.",
  },
} as const;

type ProductionProjectClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function ProductionProjectPage({ initialDocs }: ProductionProjectClientProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const t = COPY[isEn ? "en" : "tr"];

  return (
    <PageShell>
      <ToolDocTabs slug="production-project" initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t.badge}
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
              {t.subBadge}
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">{t.title}</h1>
              <p className="mt-2 text-xs text-slate-600">{t.desc}</p>
            </div>
            <ProductionGraphic
              title={t.graphicTitle}
              subtitle={t.graphicSubtitle}
              bars={t.bars}
            />
          </div>
        </section>

        <TaktBlock t={t} />
        <OeeBlock t={t} />
        <PressForceBlock t={t} />
        <MotorPowerBlock t={t} />
      </ToolDocTabs>
    </PageShell>
  );
}

function ProductionGraphic({
  title,
  subtitle,
  bars,
}: {
  title: string;
  subtitle: string;
  bars: readonly { label: string; value: number }[];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-4 shadow-[0_12px_35px_-22px_rgba(15,23,42,0.4)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700">
            {title}
          </p>
          <p className="text-[11px] text-slate-600">{subtitle}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
          Ops
        </div>
      </div>
      <div className="relative flex h-28 items-end gap-2">
        {bars.map((b, idx) => (
          <div key={b.label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="prod-bar w-full rounded-md bg-indigo-500/80"
              style={{ height: `${b.value}%`, animationDelay: `${idx * 0.2}s` }}
              title={`${b.label} ${b.value}%`}
            />
            <span className="text-[10px] font-medium text-slate-700">{b.label}</span>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 220 70" className="mt-3 h-16 w-full text-indigo-500">
        <defs>
          <linearGradient id="prodLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <polyline
          points="10,55 45,35 80,50 120,25 160,38 200,18"
          fill="none"
          stroke="url(#prodLine)"
          strokeWidth="4"
          strokeLinecap="round"
          className="prod-flow"
        />
        <polyline
          points="10,55 45,35 80,50 120,25 160,38 200,18"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="4 8"
          opacity="0.6"
        />
      </svg>
      <style jsx>{`
        @keyframes prodRise {
          0% {
            transform: scaleY(0.35);
            opacity: 0.55;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
          100% {
            transform: scaleY(0.65);
            opacity: 0.7;
          }
        }
        @keyframes prodFlow {
          0% {
            stroke-dashoffset: 120;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .prod-bar {
          transform-origin: bottom;
          animation: prodRise 3.2s ease-in-out infinite;
        }
        .prod-flow {
          stroke-dasharray: 4 8;
          animation: prodFlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function TaktBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<TaktInputs>(TAKT_INIT);

  const res = useMemo(() => {
    const timeVal = Number(inp.netTime);
    const d = Number(inp.demand);
    if (timeVal <= 0 || d <= 0) return null;
    const taktMin = timeVal / d; // min/unit
    const taktSec = taktMin * 60;
    return { taktMin, taktSec };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.taktTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label={t.taktTimeLabel}
          value={inp.netTime}
          onChange={(v) => setInp({ ...inp, netTime: v })}
        />
        <Field
          label={t.demandLabel}
          value={inp.demand}
          onChange={(v) => setInp({ ...inp, demand: v })}
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <ResultRow label={t.taktMin} value={res.taktMin.toFixed(3)} />
          <ResultRow label={t.taktSec} value={res.taktSec.toFixed(1)} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
    </section>
  );
}

function OeeBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<OeeInputs>(OEE_INIT);

  const res = useMemo(() => {
    const A = Number(inp.availability);
    const P = Number(inp.performance);
    const Q = Number(inp.quality);
    if (A <= 0 || P <= 0 || Q <= 0) return null;
    const oee = (A / 100) * (P / 100) * (Q / 100);
    return { oee };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.oeeTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field
          label="Availability %"
          value={inp.availability}
          onChange={(v) => setInp({ ...inp, availability: v })}
        />
        <Field
          label="Performance %"
          value={inp.performance}
          onChange={(v) => setInp({ ...inp, performance: v })}
        />
        <Field
          label="Quality %"
          value={inp.quality}
          onChange={(v) => setInp({ ...inp, quality: v })}
        />
      </div>
      {res ? (
        <div className="mt-3">
          <ResultRow label="OEE" value={`${(res.oee * 100).toFixed(2)} %`} />
          <p className="mt-1 text-[11px] text-slate-600">{t.oeeNote}</p>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
    </section>
  );
}

function PressForceBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<PressInputs>(PRESS_INIT);

  const res = useMemo(() => {
    const thicknessVal = Number(inp.thickness);
    const p = Number(inp.perimeter);
    const tau = Number(inp.shear);
    const sf = Number(inp.safety);
    if (thicknessVal <= 0 || p <= 0 || tau <= 0 || sf <= 0) return null;
    const forceN = p * thicknessVal * tau * sf; // N (MPa = N/mm^2)
    const forcekN = forceN / 1000;
    const tonf = forceN / 9810;
    return { forceN, forcekN, tonf };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.pressTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          label={t.thicknessLabel}
          value={inp.thickness}
          onChange={(v) => setInp({ ...inp, thickness: v })}
        />
        <Field
          label={t.perimeterLabel}
          value={inp.perimeter}
          onChange={(v) => setInp({ ...inp, perimeter: v })}
        />
        <Field
          label={t.shearLabel}
          value={inp.shear}
          onChange={(v) => setInp({ ...inp, shear: v })}
        />
        <Field
          label={t.safetyLabel}
          value={inp.safety}
          onChange={(v) => setInp({ ...inp, safety: v })}
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <ResultRow label="F (kN)" value={res.forcekN.toFixed(1)} />
          <ResultRow label="F (tonf)" value={res.tonf.toFixed(2)} />
          <ResultRow label="F (N)" value={res.forceN.toFixed(0)} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.pressNote}</p>
    </section>
  );
}

function MotorPowerBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<PowerInputs>(POWER_INIT);

  const res = useMemo(() => {
    const T = Number(inp.torque);
    const n = Number(inp.rpm);
    const load = Number(inp.load);
    if (T <= 0 || n <= 0 || load <= 0) return null;
    const p_kw = (T * n) / 9550;
    const p_loaded = p_kw * (load / 100);
    const omega = (2 * Math.PI * n) / 60;
    return { p_kw, p_loaded, omega };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.powerTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field
          label={t.torqueLabel}
          value={inp.torque}
          onChange={(v) => setInp({ ...inp, torque: v })}
        />
        <Field
          label={t.rpmLabel}
          value={inp.rpm}
          onChange={(v) => setInp({ ...inp, rpm: v })}
        />
        <Field
          label={t.loadLabel}
          value={inp.load}
          onChange={(v) => setInp({ ...inp, load: v })}
          helper={t.loadHelper}
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <ResultRow label="P (kW)" value={res.p_kw.toFixed(2)} />
          <ResultRow label={t.powerLoaded} value={res.p_loaded.toFixed(2)} />
          <ResultRow label="omega (rad/s)" value={res.omega.toFixed(1)} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.powerNote}</p>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        aria-label="Input field"
      />
      {helper && <span className="text-[10px] text-slate-500">{helper}</span>}
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5">
      <span className="text-[11px] text-slate-600">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}
