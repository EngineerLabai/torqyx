// app/tools/machine-elements/page.tsx
"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

type BearingInputs = {
  C: string; // dinamik yük kapasitesi (kN)
  P: string; // eşdeğer yük (kN)
  n: string; // rpm
};

type KeyInputs = {
  torque: string; // Nm
  shaftDia: string; // mm
  keyWidth: string; // mm
  keyHeight: string; // mm
  keyLength: string; // mm
  shearAllow: string; // MPa
  bearingAllow: string; // MPa
};

type GearInputs = {
  power: string; // kW
  rpm: string; // rpm
  pinionDia: string; // mm
  face: string; // mm
  pressureAngle: string; // deg
  gearRatio: string; // i = z2/z1
};

const BEARING_INIT: BearingInputs = {
  C: "25",
  P: "5",
  n: "1500",
};

const KEY_INIT: KeyInputs = {
  torque: "180",
  shaftDia: "40",
  keyWidth: "12",
  keyHeight: "8",
  keyLength: "50",
  shearAllow: "100",
  bearingAllow: "200",
};

const GEAR_INIT: GearInputs = {
  power: "5.5",
  rpm: "1450",
  pinionDia: "120",
  face: "40",
  pressureAngle: "20",
  gearRatio: "3",
};

export default function MachineElementsPage() {
  return (
    <PageShell>
      <ToolDocTabs slug="machine-elements">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Makine Elemanları
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            Çoklu Hesap
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Makine Elemanları Hızlı Paket
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Öğrenciler ve mezunların sık aradığı üç temel kontrol: (1) rulman L10 ömrü, (2)
          kamalı milde kesme/ezilme, (3) basit düz dişli yükleri (Ft, Fr) ve tork. Hızlı
          kontrol amaçlıdır; katalog/standart değerleri mutlaka doğrulayın.
        </p>
      </section>

      <BearingBlock />
      <KeyBlock />
      <GearBlock />
          </ToolDocTabs>
    </PageShell>
  );
}

function BearingBlock() {
  const [inp, setInp] = useState<BearingInputs>(BEARING_INIT);

  const res = useMemo(() => {
    const C = Number(inp.C) * 1000; // N
    const P = Number(inp.P) * 1000; // N
    const n = Number(inp.n);
    if (C <= 0 || P <= 0 || n <= 0) return null;
    // L10h = ( (C/P)^3 * 10^6 ) / (60*n)
    const life_rev = Math.pow(C / P, 3) * 1_000_000;
    const life_h = life_rev / (60 * n);
    return { life_rev, life_h };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        1) Rulman L10 Ömrü (temel)
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="C dinamik [kN]" value={inp.C} onChange={(v) => setInp({ ...inp, C: v })} />
        <Field label="P eşdeğer [kN]" value={inp.P} onChange={(v) => setInp({ ...inp, P: v })} />
        <Field label="n [rpm]" value={inp.n} onChange={(v) => setInp({ ...inp, n: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <ResultRow label="L10 (devir)" value={`${res.life_rev.toFixed(0)} rev`} />
          <ResultRow label="L10h (saat)" value={`${res.life_h.toFixed(1)} h`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: p=3 (bilyalı) varsayıldı. Eşdeğer yük ve çalışma koşullarını katalogdan
        kontrol edin; güvenilirlik katsayısı a1 ve aISO düzeltmeleri burada yok.
      </p>
    </section>
  );
}

function KeyBlock() {
  const [inp, setInp] = useState<KeyInputs>(KEY_INIT);

  const res = useMemo(() => {
    const T = Number(inp.torque) * 1000; // Nmm
    const d = Number(inp.shaftDia);
    const b = Number(inp.keyWidth);
    const h = Number(inp.keyHeight);
    const L = Number(inp.keyLength);
    const tauAllow = Number(inp.shearAllow);
    const sigAllow = Number(inp.bearingAllow);
    const ok = T > 0 && d > 0 && b > 0 && h > 0 && L > 0 && tauAllow > 0 && sigAllow > 0;
    if (!ok) return null;
    // Kesme gerilmesi: T = F * d/2 => F = 2T/d; tau = F / (b*L)
    const F = (2 * T) / d;
    const tau = F / (b * L);
    // Ezilme: sigma_bearing = F / (h/2 * L) (anahtar yüksekliğinin yarısı yük aktarır varsayımı)
    const sigma = F / ((h / 2) * L);
    const n_shear = tauAllow / tau;
    const n_bearing = sigAllow / sigma;
    return { tau, sigma, n_shear, n_bearing, F };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        2) Kamalı Mil Kesme / Ezilme Kontrolü
      </h2>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Field label="Tork T [Nm]" value={inp.torque} onChange={(v) => setInp({ ...inp, torque: v })} />
        <Field label="Şaft çapı d [mm]" value={inp.shaftDia} onChange={(v) => setInp({ ...inp, shaftDia: v })} />
        <Field label="Kama genişliği b [mm]" value={inp.keyWidth} onChange={(v) => setInp({ ...inp, keyWidth: v })} />
        <Field label="Kama yüksekliği h [mm]" value={inp.keyHeight} onChange={(v) => setInp({ ...inp, keyHeight: v })} />
        <Field label="Kama boyu L [mm]" value={inp.keyLength} onChange={(v) => setInp({ ...inp, keyLength: v })} />
        <Field label="İzinli kesme τallow [MPa]" value={inp.shearAllow} onChange={(v) => setInp({ ...inp, shearAllow: v })} />
        <Field label="İzinli ezilme σallow [MPa]" value={inp.bearingAllow} onChange={(v) => setInp({ ...inp, bearingAllow: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="Kuvvet F" value={`${res.F.toFixed(0)} N`} />
          <ResultRow label="Kesme gerilmesi τ" value={`${res.tau.toFixed(1)} MPa`} />
          <ResultRow label="Ezilme gerilmesi σ" value={`${res.sigma.toFixed(1)} MPa`} />
          <ResultRow label="Emniyet (kesme / ezilme)" value={`${res.n_shear.toFixed(2)} / ${res.n_bearing.toFixed(2)}`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: Basit bir kesme/ezilme kontrolüdür. Gerilme yoğunlaşmaları, yüzey durumu ve
        darbe/yük spektrumu için güvenlik katsayısı eklenmelidir.
      </p>
    </section>
  );
}

function GearBlock() {
  const [inp, setInp] = useState<GearInputs>(GEAR_INIT);

  const res = useMemo(() => {
    const P = Number(inp.power); // kW
    const n1 = Number(inp.rpm);
    const d1 = Number(inp.pinionDia); // mm
    const b = Number(inp.face); // mm
    const alpha = Number(inp.pressureAngle); // deg
    const i = Number(inp.gearRatio);
    const ok = P > 0 && n1 > 0 && d1 > 0 && b > 0 && alpha > 0 && i > 0;
    if (!ok) return null;
    const torque1 = (9550 * P) / n1; // Nm
    const Ft = (2 * torque1 * 1000) / d1; // N (tangential)
    const Fr = Ft * Math.tan((alpha * Math.PI) / 180); // N radial
    const n2 = n1 / i;
    return { torque1, Ft, Fr, n2 };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        3) Basit Dişli Yükleri (düz dişli)
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Giriş güç P [kW]" value={inp.power} onChange={(v) => setInp({ ...inp, power: v })} />
        <Field label="Giriş devir n1 [rpm]" value={inp.rpm} onChange={(v) => setInp({ ...inp, rpm: v })} />
        <Field label="Pinyon çapı d1 [mm]" value={inp.pinionDia} onChange={(v) => setInp({ ...inp, pinionDia: v })} />
        <Field label="Yüz genişliği b [mm]" value={inp.face} onChange={(v) => setInp({ ...inp, face: v })} />
        <Field label="Basınç açısı α [deg]" value={inp.pressureAngle} onChange={(v) => setInp({ ...inp, pressureAngle: v })} />
        <Field label="Dişli oranı i = z2/z1" value={inp.gearRatio} onChange={(v) => setInp({ ...inp, gearRatio: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="Tork T1" value={`${res.torque1.toFixed(1)} Nm`} />
          <ResultRow label="Tangansiyel kuvvet Ft" value={`${res.Ft.toFixed(0)} N`} />
          <ResultRow label="Radyal kuvvet Fr" value={`${res.Fr.toFixed(0)} N`} />
          <ResultRow label="Çıkış devri n2" value={`${res.n2.toFixed(0)} rpm`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: Bu basit düz dişli yük tahminidir; temas/diş eğilme gerilmesi için AGMA/ISO
        faktörleri gereklidir. Helis açısı, dinamik faktör ve yüz yüklenme dağılımı burada
        yoktur.
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


