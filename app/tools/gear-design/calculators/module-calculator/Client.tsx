"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { withLocalePrefix } from "@/utils/locale-path";

const STANDARD_MODULES = [0.5, 0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20];

type ModuleCalculatorClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function ModuleCalculatorPage({ initialDocs }: ModuleCalculatorClientProps) {
  return (
    <PageShell>
      <ToolDocTabs
        slug="gear-design/calculators/module-calculator"
        initialDocs={initialDocs}
      >
      <Header
        title="Modül Hesaplayıcı"
        description="Hatve çapı ve diş sayısına göre ham modül hesaplar, en yakın standart modül ve önerilen çapı verir."
      />
      <ModuleCalculator />
          </ToolDocTabs>
    </PageShell>
  );
}

function ModuleCalculator() {
  const [inputs, setInputs] = useState({ diameter: "200", teeth: "40" });

  const result = useMemo(() => {
    const d = Number(inputs.diameter);
    const z = Number(inputs.teeth);
    if (!isFinite(d) || !isFinite(z) || d <= 0 || z <= 0) return null;
    const mRaw = d / z;
    const circularPitch = Math.PI * mRaw;
    const closest = STANDARD_MODULES.reduce(
      (best, m) => {
        const diff = Math.abs(m - mRaw);
        return diff < best.diff ? { m, diff } : best;
      },
      { m: STANDARD_MODULES[0], diff: Math.abs(STANDARD_MODULES[0] - mRaw) }
    );
    const suggestedM = closest.m;
    const suggestedDiameter = suggestedM * z;
    const diffPercent = ((suggestedM - mRaw) / mRaw) * 100;
    const zMin20deg = 17; // approx. undercut limit for 20 deg full-depth
    return {
      mRaw,
      circularPitch,
      suggestedM,
      suggestedDiameter,
      diffPercent,
      zMinWarning: z < zMin20deg,
      zMin20deg,
    };
  }, [inputs]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Modül Hesaplayıcı</h2>
          <p className="text-sm text-slate-700">
            Hatve çapını (d) ve diş sayını (z) gir, ham modül hesapla; en yakın standart modülü ve önerilen çapı gör.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">Aktif</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Hatve çapı d [mm]"
          value={inputs.diameter}
          onChange={(v) => setInputs({ ...inputs, diameter: v })}
        />
        <Field label="Diş sayısı z" value={inputs.teeth} onChange={(v) => setInputs({ ...inputs, teeth: v })} />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setInputs({ diameter: "200", teeth: "40" })}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            Örnek değerlerle doldur
          </button>
        </div>
      </div>

      {result ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label="Ham modül m" value={`${result.mRaw.toFixed(3)} mm`} />
          <Result label="Hatve (π·m)" value={`${result.circularPitch.toFixed(3)} mm`} />
          <Result label="Önerilen standart m" value={`${result.suggestedM.toFixed(3)} mm`} />
          <Result label="Önerilen çap (m_std·z)" value={`${result.suggestedDiameter.toFixed(2)} mm`} />
          <Result label="Standart sapma" value={`${result.diffPercent >= 0 ? "+" : ""}${result.diffPercent.toFixed(1)} %`} />
          <Result
            label="Undercut uyarısı (20°)"
            value={result.zMinWarning ? `Risk: z < ${result.zMin20deg}` : "Uygun"}
            tone={result.zMinWarning ? "warn" : "ok"}
          />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">Pozitif sayılar giriniz.</p>
      )}

      <p className="mt-3 text-[11px] text-slate-600">
        Standart modül serisi: {STANDARD_MODULES.join(", ")}. Çap/diş sayını değiştirdiğinde en yakın standart modül ve buna
        karşılık gelen önerilen hatve çapı gösterilir.
      </p>
    </section>
  );
}

function Header({ title, description }: { title: string; description: string }) {
  const { locale } = useLocale();
  const calculatorsHref = withLocalePrefix("/tools/gear-design/calculators", locale);
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
      <div className="relative space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={calculatorsHref}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            ← Tüm hesaplayıcılar
          </Link>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            Modüller
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


