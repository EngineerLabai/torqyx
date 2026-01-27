// app/tools/heat-energy/page.tsx
"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

type HxInputs = {
  q: string; // kW
  tHotIn: string; // C
  tHotOut: string; // C
  tColdIn: string; // C
  tColdOut: string; // C
  U: string; // W/m2K
};

type ConductionInputs = {
  k: string; // W/mK
  tInside: string; // C
  tOutside: string; // C
  thickness: string; // mm
  hInside: string; // W/m2K
  hOutside: string; // W/m2K
  area: string; // m2
};

type PvInputs = {
  area: string; // m2
  irradiance: string; // W/m2
  efficiency: string; // %
  tempCoeff: string; // %/C
  deltaT: string; // C above STC
};

const HX_INIT: HxInputs = {
  q: "50",
  tHotIn: "120",
  tHotOut: "90",
  tColdIn: "40",
  tColdOut: "70",
  U: "800",
};

const COND_INIT: ConductionInputs = {
  k: "0.04",
  tInside: "20",
  tOutside: "-5",
  thickness: "100",
  hInside: "8",
  hOutside: "20",
  area: "50",
};

const PV_INIT: PvInputs = {
  area: "30",
  irradiance: "950",
  efficiency: "18",
  tempCoeff: "-0.35",
  deltaT: "25",
};

export default function HeatEnergyPage() {
  return (
    <PageShell>
      <ToolDocTabs slug="heat-energy">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Isı Transferi & Enerji
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            Çoklu Hesap
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Isı Transferi & Enerji Hızlı Paket
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Öğrencilerin sık aradığı üç temel kontrol: (1) LMTD ile ısı değiştirici alan
          tahmini, (2) 1D iletim + iç/dış konveksiyon ile ısı kaybı, (3) PV panel güç
          tahmini (irradians, verim, sıcaklık katsayısı). Hızlı ön boyutlandırma içindir.
        </p>
      </section>

      <HxBlock />
      <ConductionBlock />
      <PvBlock />
          </ToolDocTabs>
    </PageShell>
  );
}

function HxBlock() {
  const [inp, setInp] = useState<HxInputs>(HX_INIT);

  const res = useMemo(() => {
    const q = Number(inp.q) * 1000; // W
    const thIn = Number(inp.tHotIn);
    const thOut = Number(inp.tHotOut);
    const tcIn = Number(inp.tColdIn);
    const tcOut = Number(inp.tColdOut);
    const U = Number(inp.U); // W/m2K
    const ok = q > 0 && U > 0 && thIn > thOut && tcOut > tcIn;
    if (!ok) return null;
    const dT1 = thIn - tcOut;
    const dT2 = thOut - tcIn;
    if (dT1 <= 0 || dT2 <= 0) return null;
    const lmtd = (dT1 - dT2) / Math.log(dT1 / dT2);
    const A = q / (U * lmtd);
    return { lmtd, A };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        1) LMTD ile Isı Değiştirici Alan Tahmini
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Isı yükü Q [kW]" value={inp.q} onChange={(v) => setInp({ ...inp, q: v })} />
        <Field label="T sıcak giriş [°C]" value={inp.tHotIn} onChange={(v) => setInp({ ...inp, tHotIn: v })} />
        <Field label="T sıcak çıkış [°C]" value={inp.tHotOut} onChange={(v) => setInp({ ...inp, tHotOut: v })} />
        <Field label="T soğuk giriş [°C]" value={inp.tColdIn} onChange={(v) => setInp({ ...inp, tColdIn: v })} />
        <Field label="T soğuk çıkış [°C]" value={inp.tColdOut} onChange={(v) => setInp({ ...inp, tColdOut: v })} />
        <Field label="U [W/m²K]" value={inp.U} onChange={(v) => setInp({ ...inp, U: v })} helper="Plakalı ~500-1200, borulu daha düşük" />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <ResultRow label="ΔT1 = Th,in - Tc,out" value={`${(Number(inp.tHotIn) - Number(inp.tColdOut)).toFixed(1)} K`} />
          <ResultRow label="ΔT2 = Th,out - Tc,in" value={`${(Number(inp.tHotOut) - Number(inp.tColdIn)).toFixed(1)} K`} />
          <ResultRow label="LMTD" value={`${res.lmtd.toFixed(2)} K`} />
          <ResultRow label="Alan A" value={`${res.A.toFixed(2)} m²`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Mantıklı sıcaklıklar ve pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: Karşı akış varsayıldı. Geçiş düzeltme faktörü (F) ve faz değişimi/gaz
        tarafındaki değişken U dikkate alınmamıştır; ön boyutlandırma içindir.
      </p>
    </section>
  );
}

function ConductionBlock() {
  const [inp, setInp] = useState<ConductionInputs>(COND_INIT);

  const res = useMemo(() => {
    const k = Number(inp.k);
    const Ti = Number(inp.tInside);
    const To = Number(inp.tOutside);
    const L = Number(inp.thickness) / 1000; // m
    const hi = Number(inp.hInside);
    const ho = Number(inp.hOutside);
    const A = Number(inp.area);
    if (k <= 0 || L <= 0 || hi <= 0 || ho <= 0 || A <= 0) return null;
    const R_cond = L / (k * A);
    const R_conv_in = 1 / (hi * A);
    const R_conv_out = 1 / (ho * A);
    const R_total = R_cond + R_conv_in + R_conv_out;
    const q = (Ti - To) / R_total; // W
    return { R_total, q, R_cond, R_conv_in, R_conv_out };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        2) 1D İletim + Konveksiyon ile Isı Kaybı
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="İletkenlik k [W/mK]" value={inp.k} onChange={(v) => setInp({ ...inp, k: v })} />
        <Field label="T iç [°C]" value={inp.tInside} onChange={(v) => setInp({ ...inp, tInside: v })} />
        <Field label="T dış [°C]" value={inp.tOutside} onChange={(v) => setInp({ ...inp, tOutside: v })} />
        <Field label="Kalınlık [mm]" value={inp.thickness} onChange={(v) => setInp({ ...inp, thickness: v })} />
        <Field label="h iç [W/m²K]" value={inp.hInside} onChange={(v) => setInp({ ...inp, hInside: v })} />
        <Field label="h dış [W/m²K]" value={inp.hOutside} onChange={(v) => setInp({ ...inp, hOutside: v })} />
        <Field label="Alan A [m²]" value={inp.area} onChange={(v) => setInp({ ...inp, area: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="Rtoplam" value={`${res.R_total.toFixed(4)} K/W`} />
          <ResultRow label="Isı kaybı q" value={`${res.q.toFixed(1)} W`} />
          <ResultRow label="Riletim" value={`${res.R_cond.toFixed(4)} K/W`} />
          <ResultRow label="Rkonveksiyon (iç/dış)" value={`${res.R_conv_in.toFixed(4)} / ${res.R_conv_out.toFixed(4)} K/W`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: 1D düzlem duvar varsayımı. Köşe etkileri, radyasyon ve çok katmanlı yapı için
        detaylı hesap gerekir. HVAC kabuğu veya basit izolasyon kaybı için ilk tahmindir.
      </p>
    </section>
  );
}

function PvBlock() {
  const [inp, setInp] = useState<PvInputs>(PV_INIT);

  const res = useMemo(() => {
    const A = Number(inp.area);
    const G = Number(inp.irradiance);
    const eta = Number(inp.efficiency) / 100;
    const coeff = Number(inp.tempCoeff); // %/C
    const dT = Number(inp.deltaT);
    if (A <= 0 || G <= 0 || eta <= 0) return null;
    const eta_temp = eta * (1 + (coeff / 100) * dT);
    const P = A * G * eta_temp; // W
    return { eta_temp, P };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        3) PV Panel Basit Güç Tahmini
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Alan A [m²]" value={inp.area} onChange={(v) => setInp({ ...inp, area: v })} />
        <Field label="İrradians G [W/m²]" value={inp.irradiance} onChange={(v) => setInp({ ...inp, irradiance: v })} />
        <Field label="Verim ηSTC [%]" value={inp.efficiency} onChange={(v) => setInp({ ...inp, efficiency: v })} />
        <Field label="Sıcaklık katsayısı [%/°C]" value={inp.tempCoeff} onChange={(v) => setInp({ ...inp, tempCoeff: v })} helper="Kristalin için -0.3 ila -0.5" />
        <Field label="ΔT (STC üstü) [°C]" value={inp.deltaT} onChange={(v) => setInp({ ...inp, deltaT: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <ResultRow label="Düzeltilmiş verim η" value={`${(res.eta_temp * 100).toFixed(2)} %`} />
          <ResultRow label="Güç P" value={`${(res.P / 1000).toFixed(2)} kW`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: Güneşlenme açısı, gölgeleme, kirlenme, inverter verimi ve kablo kayıpları dahil
        değildir; kaba tahmindir.
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


