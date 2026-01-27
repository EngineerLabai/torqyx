"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

export default function WeightOptimizationPage() {
  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators/weight-optimization">
      <Header
        title="Dişli Ağırlığı / Gövde Optimizasyonu"
        description="Dış çap, yüz genişliği, iç çap ve malzeme yoğunluğuna göre ağırlık ve hafifletme tasarrufunu hesaplar."
      />
      <WeightCalculator />
          </ToolDocTabs>
    </PageShell>
  );
}

function WeightCalculator() {
  const [inp, setInp] = useState({
    outerDia: "250", // mm
    faceWidth: "40", // mm
    boreDia: "60", // mm
    density: "7850", // kg/m3
    lighten: "0.2", // 0-0.6
    material: "steel",
  });

  const materialMap: Record<string, number> = {
    steel: 7850,
    castiron: 7200,
    aluminum: 2700,
    bronze: 8800,
  };

  const res = useMemo(() => {
    const D = Number(inp.outerDia);
    const b = Number(inp.faceWidth);
    const d = Number(inp.boreDia);
    const rho = Number(inp.density);
    const rawLighten = Number(inp.lighten);
    const lighten = Math.min(Math.max(rawLighten, 0), 0.6);
    const valid = D > 0 && b > 0 && rho > 0 && d >= 0 && d < D;
    if (!valid) return null;
    const areaOuter = (Math.PI / 4) * D * D;
    const areaBore = (Math.PI / 4) * d * d;
    const volumeSolidMm3 = (areaOuter - areaBore) * b; // mm3
    const volumeSolid = volumeSolidMm3 * 1e-9; // m3
    const massSolid = volumeSolid * rho; // kg
    const massLight = massSolid * (1 - lighten);
    const reduction = lighten * 100;
    return {
      massSolid,
      massLight,
      reduction,
      volumeSolid,
      rho,
      lighten,
      D,
      d,
      b,
    };
  }, [inp]);

  const setMaterial = (mat: string) => {
    const val = materialMap[mat];
    setInp((prev) => ({ ...prev, material: mat, density: val ? String(val) : prev.density }));
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Dişli Ağırlığı / Gövde Optimizasyonu</h2>
          <p className="text-sm text-slate-700">
            Dişli geometri ve malzeme yoğunluğuna göre ağırlık tahmini yapar; hafifletme faktörü ile kaburga/boşaltım etkisi
            hesaba katılır (tipik 0-0.35, maksimum 0.6).
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">Aktif</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Dış diş çapı D [mm]" value={inp.outerDia} onChange={(v) => setInp({ ...inp, outerDia: v })} />
        <Field label="Yüz genişliği b [mm]" value={inp.faceWidth} onChange={(v) => setInp({ ...inp, faceWidth: v })} />
        <Field label="Giriş çapı d [mm]" value={inp.boreDia} onChange={(v) => setInp({ ...inp, boreDia: v })} />
        <SelectField
          label="Malzeme"
          value={inp.material}
          onChange={(v) => setMaterial(v)}
          options={[
            { value: "steel", label: "Çelik ~7850 kg/m3" },
            { value: "castiron", label: "Dökme demir ~7200 kg/m3" },
            { value: "bronze", label: "Bronz ~8800 kg/m3" },
            { value: "aluminum", label: "Alüminyum ~2700 kg/m3" },
          ]}
        />
        <Field label="Yoğunluk [kg/m3]" value={inp.density} onChange={(v) => setInp({ ...inp, density: v })} />
        <Field
          label="Hafifletme faktörü (0-0.6)"
          value={inp.lighten}
          onChange={(v) => setInp({ ...inp, lighten: v })}
        />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() =>
              setInp({ outerDia: "250", faceWidth: "40", boreDia: "60", density: "7850", lighten: "0.2", material: "steel" })
            }
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            Örnek değerlerle doldur
          </button>
        </div>
      </div>

      {res ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label="Katı (hafifletmesiz) ağırlık" value={`${res.massSolid.toFixed(2)} kg`} />
          <Result label="Hafifletilmiş ağırlık" value={`${res.massLight.toFixed(2)} kg`} />
          <Result label="Tasarruf" value={`${res.reduction.toFixed(1)} %`} />
          <Result label="Hacim (katı)" value={`${res.volumeSolid.toFixed(4)} m3`} />
          <Result label="Kullanılan yoğunluk" value={`${res.rho.toFixed(0)} kg/m3`} />
          <Result label="Hafifletme faktörü" value={`${res.lighten.toFixed(2)}`} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">Pozitif geometri ve yoğunluk girin; giriş çapı dış diş çapından küçük olmalıdır.</p>
      )}

      <p className="mt-3 text-[11px] text-slate-600">
        Hafifletme faktörü kaburga/boşaltım ile alınan malzeme oranıdır (0: katı, 0.3: %30 boşaltma). 0.6 üzeri koşullar için
        yapısal analiz yapın. Tasarımda emniyet için balans, kaynak veya civata delikleri ayrıca kontrol edilmelidir.
      </p>
    </section>
  );
}

function Header({ title, description }: { title: string; description: string }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
      <div className="relative space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/tools/gear-design/calculators"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            ← Tüm hesaplayıcılar
          </Link>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            Ağırlık
          </span>
        </div>
        <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">{title}</h1>
        <p className="text-sm leading-relaxed text-slate-700">{description}</p>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
      />
    </label>
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
  options: { value: string; label: string }[];
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Result({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "warn" | "ok" }) {
  const toneClass =
    tone === "warn"
      ? "bg-amber-50 text-amber-800"
      : tone === "ok"
        ? "bg-emerald-50 text-emerald-800"
        : "bg-slate-50 text-slate-800";

  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${toneClass}`}>
      <span className="text-slate-600">{label}</span>
      <span className="font-mono text-[12px] font-semibold">{value}</span>
    </div>
  );
}


