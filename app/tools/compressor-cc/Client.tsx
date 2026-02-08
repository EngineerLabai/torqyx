// app/tools/compressor-cc/page.tsx
"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

type Inputs = {
  bore: string;
  stroke: string;
  cylinders: string;
  rpm: string;
  volumetricEff: string; // %
  acting: "single" | "double";
};

const INITIAL: Inputs = {
  bore: "60",
  stroke: "45",
  cylinders: "2",
  rpm: "1400",
  volumetricEff: "80",
  acting: "single",
};

type CompressorCcClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function CompressorCcPage({ initialDocs }: CompressorCcClientProps) {
  const [inputs, setInputs] = useState<Inputs>(INITIAL);

  const results = useMemo(() => {
    const bore = Number(inputs.bore);
    const stroke = Number(inputs.stroke);
    const cylinders = Number(inputs.cylinders);
    const rpm = Number(inputs.rpm);
    const ve = Number(inputs.volumetricEff);
    const actingFactor = inputs.acting === "double" ? 2 : 1;

    const valid =
      bore > 0 && stroke > 0 && cylinders > 0 && rpm > 0 && ve > 0 && ve <= 120;
    if (!valid) {
      return null;
    }

    // mm^3 per rev
    const sweptPerRev_mm3 =
      (Math.PI / 4) * bore * bore * stroke * cylinders * actingFactor;
    const sweptPerRev_cc = sweptPerRev_mm3 / 1000;
    const sweptPerRev_L = sweptPerRev_cc / 1000;
    const theoFlow_L_min = sweptPerRev_L * rpm;
    const actualFlow_L_min = theoFlow_L_min * (ve / 100);

    return {
      sweptPerRev_cc,
      sweptPerRev_L,
      theoFlow_L_min,
      actualFlow_L_min,
    };
  }, [inputs]);

  function handleChange<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <PageShell>
      <ToolDocTabs slug="compressor-cc" initialDocs={initialDocs}>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Kompresör
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-medium text-emerald-700">
            Hacimsel
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Kompresör CC / Debi Hesaplayıcı (Pistonlu)
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Piston çapı, strok, silindir sayısı ve devir ile teorik hacimsel kapasiteyi
          hesaplar. Tek/çift etkili seçimi ve volumetrik verim ile yaklaşık gerçek debiyi
          verir. Sonuçlar serbest hava debisi (FAD) değildir; tahmini iç hacim
          deplasmanıdır.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Girişler</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Piston çapı [mm]"
              value={inputs.bore}
              onChange={(v) => handleChange("bore", v)}
            />
            <Field
              label="Strok [mm]"
              value={inputs.stroke}
              onChange={(v) => handleChange("stroke", v)}
            />
            <Field
              label="Silindir adedi"
              value={inputs.cylinders}
              onChange={(v) => handleChange("cylinders", v)}
            />
            <Field label="RPM" value={inputs.rpm} onChange={(v) => handleChange("rpm", v)} />
            <Field
              label="Volumetrik verim [%]"
              value={inputs.volumetricEff}
              onChange={(v) => handleChange("volumetricEff", v)}
              helper="Tipik 70-90%"
            />
            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-slate-700">
                Etki tipi
              </span>
              <select
                value={inputs.acting}
                onChange={(e) => handleChange("acting", e.target.value as Inputs["acting"])}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                <option value="single">Tek etkili</option>
                <option value="double">Çift etkili</option>
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Sonuçlar</h3>
          {results ? (
            <div className="space-y-2">
              <ResultRow label="Süpürülen hacim (cc/rev)" value={`${results.sweptPerRev_cc.toFixed(1)} cc`} />
              <ResultRow
                label="Süpürülen hacim (L/rev)"
                value={`${results.sweptPerRev_L.toFixed(3)} L/rev`}
              />
              <ResultRow
                label="Teorik debi"
                value={`${results.theoFlow_L_min.toFixed(1)} L/dk`}
              />
              <ResultRow
                label="Tahmini gerçek debi"
                value={`${results.actualFlow_L_min.toFixed(1)} L/dk`}
              />
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                Varsayımlar: Basit pistonlu, kayıpsız hacim = π/4·D²·S·(silindir·etki).
                Debi = hacim/rev × rpm × volumetrik verim. FAD için test/standart
                yöntem gerekir.
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-red-600">
              Lütfen pozitif ve makul sayılar girin (verim ≤ 120%).
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


