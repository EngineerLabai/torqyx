// app/tools/fluids-hvac/page.tsx
"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

type PipeInputs = {
  flow: string; // m3/h
  diameter: string; // mm
  length: string; // m
  roughness: string; // mm
};

type DuctInputs = {
  flow: string; // m3/h
  velocity: string; // m/s
};

type AchInputs = {
  volume: string; // m3
  ach: string; // h-1
};

const PIPE_INIT: PipeInputs = {
  flow: "12",
  diameter: "40",
  length: "50",
  roughness: "0.05",
};

const DUCT_INIT: DuctInputs = {
  flow: "1800",
  velocity: "6",
};

const ACH_INIT: AchInputs = {
  volume: "150",
  ach: "8",
};

export default function FluidsHvacPage() {
  return (
    <PageShell>
      <ToolDocTabs slug="fluids-hvac">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Akışkanlar & HVAC
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            Çoklu Hesap
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Akışkanlar & HVAC Hızlı Paket
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Öğrencilerin sık aradığı üç temel kontrol: (1) su için Reynolds, sürtünme faktörü
          ve basınç kaybı, (2) hava kanalı hız yöntemiyle çap tahmini, (3) ACH ↔ debi
          dönüşümü. Hızlı fikir vermek içindir; ayrıntılı projelendirmede standart ve
          üretici verilerini kullanın.
        </p>
      </section>

      <PipeBlock />
      <DuctBlock />
      <AchBlock />
          </ToolDocTabs>
    </PageShell>
  );
}

function PipeBlock() {
  const [inp, setInp] = useState<PipeInputs>(PIPE_INIT);

  const res = useMemo(() => {
    const Q_m3h = Number(inp.flow);
    const D_mm = Number(inp.diameter);
    const L_m = Number(inp.length);
    const eps_mm = Number(inp.roughness);
    if (Q_m3h <= 0 || D_mm <= 0 || L_m <= 0 || eps_mm < 0) return null;

    const rho = 1000; // kg/m3 (su)
    const mu = 1e-3; // Pa.s
    const Q = Q_m3h / 3600; // m3/s
    const D = D_mm / 1000; // m
    const eps = eps_mm / 1000; // m
    const A = (Math.PI * D * D) / 4;
    const v = Q / A;
    const Re = (rho * v * D) / mu;
    let f: number;
    if (Re < 2300) {
      f = 64 / Re;
    } else {
      // Haaland
      const term = (eps / D) / 3.7;
      f = Math.pow(
        -1.8 * Math.log10(Math.pow(term, 1.11) + 6.9 / Re),
        -2,
      );
    }
    const dp = f * (L_m / D) * (0.5 * rho * v * v); // Pa
    return { Re, f, v, dp };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        1) Su için Reynolds, f ve Basınç Kaybı (Darcy-Weisbach)
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Debi Q [m³/h]" value={inp.flow} onChange={(v) => setInp({ ...inp, flow: v })} />
        <Field label="Çap D [mm]" value={inp.diameter} onChange={(v) => setInp({ ...inp, diameter: v })} />
        <Field label="Boru boyu L [m]" value={inp.length} onChange={(v) => setInp({ ...inp, length: v })} />
        <Field label="Pürüzlülük ε [mm]" value={inp.roughness} onChange={(v) => setInp({ ...inp, roughness: v })} helper="Çelik 0.05 mm tipik" />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="Re" value={`${res.Re.toFixed(0)}`} />
          <ResultRow label="f (Darcy)" value={`${res.f.toFixed(4)}`} />
          <ResultRow label="Hız v" value={`${res.v.toFixed(2)} m/s`} />
          <ResultRow label="Δp (L boyunca)" value={`${(res.dp / 1000).toFixed(2)} kPa`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Varsayımlar: Su 20°C (ρ=1000 kg/m³, μ=1 cP). Δp = f·(L/D)·ρv²/2. Bağlantı/kayıplar,
        armatur etkisi ve sıcaklık değişimi dahil değildir.
      </p>
    </section>
  );
}

function DuctBlock() {
  const [inp, setInp] = useState<DuctInputs>(DUCT_INIT);

  const res = useMemo(() => {
    const Q_m3h = Number(inp.flow);
    const v = Number(inp.velocity);
    if (Q_m3h <= 0 || v <= 0) return null;
    const Q = Q_m3h / 3600; // m3/s
    const A = Q / v; // m2
    const D = Math.sqrt((4 * A) / Math.PI); // m
    const rho = 1.2; // kg/m3 hava
    const q = 0.5 * rho * v * v; // Pa (dinamik basınç)
    return { A, D, q };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        2) Hava Kanalı Hız Yöntemi (eşdeğer çap)
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Debi Q [m³/h]" value={inp.flow} onChange={(v) => setInp({ ...inp, flow: v })} />
        <Field label="Hedef hız v [m/s]" value={inp.velocity} onChange={(v) => setInp({ ...inp, velocity: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <ResultRow label="Kesit A" value={`${(res.A * 1e4).toFixed(2)} dm²`} />
          <ResultRow label="D eşdeğer" value={`${(res.D * 1000).toFixed(0)} mm`} />
          <ResultRow label="Dinamik basınç q" value={`${res.q.toFixed(0)} Pa`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Ofis: 4–6 m/s, endüstri: 6–10 m/s tipiktir. Gürültü ve basınç kaybı için üretici
        katalog değerlerine bakın; dirsek/damper kayıpları ayrıca hesaplanmalıdır.
      </p>
    </section>
  );
}

function AchBlock() {
  const [inp, setInp] = useState<AchInputs>(ACH_INIT);

  const res = useMemo(() => {
    const V = Number(inp.volume);
    const ach = Number(inp.ach);
    if (V <= 0 || ach <= 0) return null;
    const Q_m3h = V * ach;
    const Q_m3s = Q_m3h / 3600;
    return { Q_m3h, Q_m3s };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        3) Hava Değişim Sayısı (ACH) ↔ Debi
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Hacim V [m³]" value={inp.volume} onChange={(v) => setInp({ ...inp, volume: v })} />
        <Field label="ACH [1/h]" value={inp.ach} onChange={(v) => setInp({ ...inp, ach: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <ResultRow label="Debi" value={`${res.Q_m3h.toFixed(0)} m³/h`} />
          <ResultRow label="Debi (m³/s)" value={`${res.Q_m3s.toFixed(3)} m³/s`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Tipik ACH: ofis 4–8, sınıf 6–10, laboratuvar 8–15. Bina yönetmelikleri ve iç hava
        kalitesi standartlarını kontrol edin.
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


