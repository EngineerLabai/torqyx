"use client";

// app/tools/strength-statics/page.tsx
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

type CombinedInputs = {
  axial: string; // N
  shear: string; // N
  area: string; // mm2
  yield: string; // MPa
};

type BucklingInputs = {
  length: string; // mm
  k: string; // boyutsuz
  E: string; // GPa
  I: string; // mm4
  area: string; // mm2 (opsiyonel r için)
};

type ShaftInputs = {
  moment: string; // Nm
  torque: string; // Nm
  diameter: string; // mm
  yield: string; // MPa
};

const COMBINED_INIT: CombinedInputs = {
  axial: "12000",
  shear: "6000",
  area: "450",
  yield: "250",
};

const BUCKLING_INIT: BucklingInputs = {
  length: "1200",
  k: "1.0",
  E: "210",
  I: "32000",
  area: "900",
};

const SHAFT_INIT: ShaftInputs = {
  moment: "250", // Nm
  torque: "180", // Nm
  diameter: "40",
  yield: "350",
};

type StrengthStaticsClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function StrengthStaticsPage({ initialDocs }: StrengthStaticsClientProps) {
  return (
    <PageShell>
      <ToolDocTabs slug="strength-statics" initialDocs={initialDocs}>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Mukavemet
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            Çoklu Hesap
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Mukavemet & Statik Hızlı Paket
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Öğrenciler ve mezunların sık baktığı üç hesap: (1) eksenel+kesme birleşik gerilme
          ve emniyet, (2) Euler burkulma ve narinlik, (3) dairesel milde eğilme+tork
          birleşik gerilme. Hızlı kontrol amaçlıdır; detaylı tasarımda ilgili standartları
          ve güvenlik katsayılarını kontrol edin.
        </p>
      </section>

      <CombinedBlock />
      <BucklingBlock />
      <ShaftBlock />
          </ToolDocTabs>
    </PageShell>
  );
}

function CombinedBlock() {
  const [inp, setInp] = useState<CombinedInputs>(COMBINED_INIT);

  const res = useMemo(() => {
    const axial = Number(inp.axial);
    const shear = Number(inp.shear);
    const A = Number(inp.area);
    const sy = Number(inp.yield);
    const ok = axial > 0 && A > 0 && sy > 0 && shear >= 0;
    if (!ok) return null;
    const sigma = axial / A; // MPa (N/mm2)
    const tau = shear / A;
    const mises = Math.sqrt(sigma * sigma + 3 * tau * tau);
    const n = sy / mises;
    return { sigma, tau, mises, n };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        1) Eksenel + Kesme Birleşik Gerilme (von Mises)
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Eksenel yük N" value={inp.axial} onChange={(v) => setInp({ ...inp, axial: v })} />
        <Field label="Kesme yükü N" value={inp.shear} onChange={(v) => setInp({ ...inp, shear: v })} />
        <Field label="Kesit alanı A [mm²]" value={inp.area} onChange={(v) => setInp({ ...inp, area: v })} />
        <Field label="Akma dayanımı Sy [MPa]" value={inp.yield} onChange={(v) => setInp({ ...inp, yield: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="σ = N/A" value={`${res.sigma.toFixed(2)} MPa`} />
          <ResultRow label="τ = V/A" value={`${res.tau.toFixed(2)} MPa`} />
          <ResultRow label="σvm" value={`${res.mises.toFixed(2)} MPa`} />
          <ResultRow label="Emniyet n = Sy/σvm" value={`${res.n.toFixed(2)}`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif ve mantıklı değerler gir.</p>
      )}
    </section>
  );
}

function BucklingBlock() {
  const [inp, setInp] = useState<BucklingInputs>(BUCKLING_INIT);

  const res = useMemo(() => {
    const L = Number(inp.length);
    const k = Number(inp.k);
    const E = Number(inp.E); // GPa
    const I = Number(inp.I); // mm4
    const A = Number(inp.area);
    const ok = L > 0 && k > 0 && E > 0 && I > 0;
    if (!ok) return null;
    const L_eff = k * L;
    const E_mpa = E * 1000; // GPa -> MPa (N/mm2)
    const Pcr = (Math.PI * Math.PI * E_mpa * I) / (L_eff * L_eff); // N
    let slender: number | null = null;
    if (A > 0) {
      const r = Math.sqrt(I / A);
      slender = L_eff / r;
    }
    return { Pcr, L_eff, slender };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        2) Euler Burkulma & Narinlik
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Serbest boy L [mm]" value={inp.length} onChange={(v) => setInp({ ...inp, length: v })} />
        <Field
          label="K (uç koşulu)"
          value={inp.k}
          onChange={(v) => setInp({ ...inp, k: v })}
          helper="Sabit-sabit ~0.7, sabit-serbest 2.0, mafsal-mafsal 1.0"
        />
        <Field label="E [GPa]" value={inp.E} onChange={(v) => setInp({ ...inp, E: v })} />
        <Field label="Atalet I [mm⁴]" value={inp.I} onChange={(v) => setInp({ ...inp, I: v })} />
        <Field
          label="Alan A [mm²] (opsiyonel)"
          value={inp.area}
          onChange={(v) => setInp({ ...inp, area: v })}
          helper="Narinlik için"
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="Leff = K·L" value={`${res.L_eff.toFixed(0)} mm`} />
          <ResultRow label="Pcr (Euler)" value={`${res.Pcr.toFixed(0)} N`} />
          {res.slender !== null && (
            <ResultRow label="Narinlik λ = Leff/r" value={`${res.slender.toFixed(0)}`} />
          )}
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700 sm:col-span-2 lg:col-span-2">
            İnce çubuk varsayımı: elastik burkulma, malzeme doğrusal. Plastik sınır, yerel
            burkulma ve başlangıç kusurları için ilgili standardı kontrol edin.
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif ve mantıklı değerler gir.</p>
      )}
    </section>
  );
}

function ShaftBlock() {
  const [inp, setInp] = useState<ShaftInputs>(SHAFT_INIT);

  const res = useMemo(() => {
    const M_Nm = Number(inp.moment);
    const T_Nm = Number(inp.torque);
    const d = Number(inp.diameter);
    const sy = Number(inp.yield);
    const ok = M_Nm >= 0 && T_Nm >= 0 && d > 0 && sy > 0;
    if (!ok) return null;
    const M = M_Nm * 1000; // Nmm
    const T = T_Nm * 1000; // Nmm
    const denom = Math.PI * Math.pow(d, 3);
    const sigma_b = (32 * M) / denom;
    const tau_t = (16 * T) / denom;
    const mises = Math.sqrt(sigma_b * sigma_b + 3 * tau_t * tau_t);
    const n = sy / mises;
    return { sigma_b, tau_t, mises, n };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        3) Mil Eğilme + Tork (Dairesel, tam kesit)
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Eğilme momenti M [Nm]" value={inp.moment} onChange={(v) => setInp({ ...inp, moment: v })} />
        <Field label="Tork T [Nm]" value={inp.torque} onChange={(v) => setInp({ ...inp, torque: v })} />
        <Field label="Çap d [mm]" value={inp.diameter} onChange={(v) => setInp({ ...inp, diameter: v })} />
        <Field label="Akma dayanımı Sy [MPa]" value={inp.yield} onChange={(v) => setInp({ ...inp, yield: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="σb" value={`${res.sigma_b.toFixed(1)} MPa`} />
          <ResultRow label="τt" value={`${res.tau_t.toFixed(1)} MPa`} />
          <ResultRow label="σvm" value={`${res.mises.toFixed(1)} MPa`} />
          <ResultRow label="Emniyet n = Sy/σvm" value={`${res.n.toFixed(2)}`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: Dolu dairesel kesit için J = πd⁴/32, Wb = πd³/32. Yivli/kanallı miller için
        zayıflama katsayısı ve gerilme yoğunlaşması dikkate alınmalıdır.
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
        type="number"
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


