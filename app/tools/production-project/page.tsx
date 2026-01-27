// app/tools/production-project/page.tsx
"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

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

export default function ProductionProjectPage() {
  return (
    <PageShell>
      <ToolDocTabs slug="production-project">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Uretim & Proje
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            Coklu Hesap
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Uretim & Proje Hizli Paket
            </h1>
            <p className="mt-2 text-xs text-slate-600">
              Uretim icin hizli hesaplar: (1) takt time, (2) OEE, (3) pres tonaj tahmini, (4) motor guc/torque.
              Hizli fikir verir; sahada detayli analiz ve verifikasyon sart.
            </p>
          </div>
          <ProductionGraphic />
        </div>
      </section>

      <TaktBlock />
      <OeeBlock />
      <PressForceBlock />
      <MotorPowerBlock />
          </ToolDocTabs>
    </PageShell>
  );
}

function ProductionGraphic() {
  const bars = [
    { label: "Takt", value: 68 },
    { label: "OEE", value: 82 },
    { label: "Pres", value: 74 },
    { label: "Guc", value: 88 },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-4 shadow-[0_12px_35px_-22px_rgba(15,23,42,0.4)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700">Hizli gorsellestirme</p>
          <p className="text-[11px] text-slate-600">Takt/OEE/pres/guc nabzi</p>
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

function TaktBlock() {
  const [inp, setInp] = useState<TaktInputs>(TAKT_INIT);

  const res = useMemo(() => {
    const t = Number(inp.netTime);
    const d = Number(inp.demand);
    if (t <= 0 || d <= 0) return null;
    const taktMin = t / d; // min/unit
    const taktSec = taktMin * 60;
    return { taktMin, taktSec };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">1) Takt Time</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Net süre (dk/mesai)" value={inp.netTime} onChange={(v) => setInp({ ...inp, netTime: v })} />
        <Field label="Talep (adet/mesai)" value={inp.demand} onChange={(v) => setInp({ ...inp, demand: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <ResultRow label="Takt (dk/adet)" value={res.taktMin.toFixed(3)} />
          <ResultRow label="Takt (sn/adet)" value={res.taktSec.toFixed(1)} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
    </section>
  );
}

function OeeBlock() {
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
      <h2 className="mb-3 text-sm font-semibold text-slate-900">2) OEE</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Availability %" value={inp.availability} onChange={(v) => setInp({ ...inp, availability: v })} />
        <Field label="Performance %" value={inp.performance} onChange={(v) => setInp({ ...inp, performance: v })} />
        <Field label="Quality %" value={inp.quality} onChange={(v) => setInp({ ...inp, quality: v })} />
      </div>
      {res ? (
        <div className="mt-3">
          <ResultRow label="OEE" value={`${(res.oee * 100).toFixed(2)} %`} />
          <p className="mt-1 text-[11px] text-slate-600">
            Hızlı değerlendirme: &lt; 60% zayıf, 60-75% orta, 75-85% iyi, &gt; 85% dünya klası
            (genel kural). Kayıp analizi için A/P/Q bileşenlerini ayrı izleyin.
          </p>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
    </section>
  );
}

function PressForceBlock() {
  const [inp, setInp] = useState<PressInputs>(PRESS_INIT);

  const res = useMemo(() => {
    const t = Number(inp.thickness);
    const p = Number(inp.perimeter);
    const tau = Number(inp.shear);
    const sf = Number(inp.safety);
    if (t <= 0 || p <= 0 || tau <= 0 || sf <= 0) return null;
    const forceN = p * t * tau * sf; // N (MPa = N/mm^2)
    const forcekN = forceN / 1000;
    const tonf = forceN / 9810;
    return { forceN, forcekN, tonf };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">3) Pres Tonaj Tahmini (kesme)</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Kalinlik t (mm)" value={inp.thickness} onChange={(v) => setInp({ ...inp, thickness: v })} />
        <Field label="Kesim cevresi P (mm)" value={inp.perimeter} onChange={(v) => setInp({ ...inp, perimeter: v })} />
        <Field label="Kesme dayanimi (MPa)" value={inp.shear} onChange={(v) => setInp({ ...inp, shear: v })} />
        <Field label="Emniyet kats." value={inp.safety} onChange={(v) => setInp({ ...inp, safety: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <ResultRow label="F (kN)" value={res.forcekN.toFixed(1)} />
          <ResultRow label="F (tonf)" value={res.tonf.toFixed(2)} />
          <ResultRow label="F (N)" value={res.forceN.toFixed(0)} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif degerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: Kesme icin kullanilir. Delme/blanking icin P, parcanin kesim cevresidir; malzeme kesme dayanimi datasheet&apos;ten alinmalidir.
      </p>
    </section>
  );
}

function MotorPowerBlock() {
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
      <h2 className="mb-3 text-sm font-semibold text-slate-900">4) Motor Guc/Tork</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Tork (Nm)" value={inp.torque} onChange={(v) => setInp({ ...inp, torque: v })} />
        <Field label="Devir (rpm)" value={inp.rpm} onChange={(v) => setInp({ ...inp, rpm: v })} />
        <Field label="Yukleme [%]" value={inp.load} onChange={(v) => setInp({ ...inp, load: v })} helper="Tipik: 70-90%" />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <ResultRow label="P (kW)" value={res.p_kw.toFixed(2)} />
          <ResultRow label="P (kW) - yukte" value={res.p_loaded.toFixed(2)} />
          <ResultRow label="omega (rad/s)" value={res.omega.toFixed(1)} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif degerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: P[kW] = T[Nm] x n[rpm] / 9550. Servis faktorleri ve verim icin motor datasina bak.
      </p>
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


