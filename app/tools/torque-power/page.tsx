// app/tools/torque-power/page.tsx
"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

type Inputs = {
  powerKw: string;
  rpm: string;
  mechEff: string; // %
};

const INITIAL: Inputs = {
  powerKw: "5.5",
  rpm: "1500",
  mechEff: "95",
};

export default function TorquePowerPage() {
  const [inputs, setInputs] = useState<Inputs>(INITIAL);

  const results = useMemo(() => {
    const pKw = Number(inputs.powerKw);
    const rpm = Number(inputs.rpm);
    const eff = Number(inputs.mechEff);
    const valid = pKw > 0 && rpm > 0 && eff > 0 && eff <= 100;
    if (!valid) return null;
    // P(kW) = T(Nm) * rpm / 9550  => T = 9550 * P / rpm
    const torqueNm = (9550 * pKw) / rpm;
    const torqueNm_eff = torqueNm * (eff / 100);
    const powerHp = pKw * 1.34102;
    return { torqueNm, torqueNm_eff, powerHp };
  }, [inputs]);

  function handleChange<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <PageShell>
      <ToolDocTabs slug="torque-power">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Güç–Tork–Devir
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-medium text-amber-700">
            Pratik
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Güç – Tork – Devir Hesaplayıcı
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Elektrik motoru ve mekanik aktarma için P(kW/hp) – T(Nm) – n(rpm) ilişkisini
          hesaplar. Mekanik verimi girerek şaft çıkış torkunu görebilirsin.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Girişler</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Güç [kW]"
              value={inputs.powerKw}
              onChange={(v) => handleChange("powerKw", v)}
            />
            <Field label="Devir [rpm]" value={inputs.rpm} onChange={(v) => handleChange("rpm", v)} />
            <Field
              label="Mekanik verim [%]"
              value={inputs.mechEff}
              onChange={(v) => handleChange("mechEff", v)}
              helper="Şafttan çıkış için tipik 90-98%"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Sonuçlar</h3>
          {results ? (
            <div className="space-y-2">
              <ResultRow label="Tork (ideal)" value={`${results.torqueNm.toFixed(1)} Nm`} />
              <ResultRow
                label="Tork (verim uygulanmış)"
                value={`${results.torqueNm_eff.toFixed(1)} Nm`}
              />
              <ResultRow label="Güç [hp]" value={`${results.powerHp.toFixed(2)} hp`} />
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                Formül: P(kW) = T(Nm) × n(rpm) / 9550. hp = kW × 1.341. Verim uygularsan
                tork = Tideal × η. Redüktör/kaplin kayıpları için % değerini artır.
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-red-600">
              Lütfen pozitif değerler gir (verim ≤ 100%).
            </p>
          )}
        </div>
      </section>
          </ToolDocTabs>
    </PageShell>
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


