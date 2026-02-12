"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { withLocalePrefix } from "@/utils/locale-path";
import AdvisorPanel from "@/src/components/tools/AdvisorPanel";
import { getAdvisorInsights } from "@/src/lib/advisor/engine";
import type { Locale } from "@/utils/locale";

const STEEL_ALPHA = 12e-6; // 1/°C

type BacklashCalculatorClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

const COPY = {
  tr: {
    header: {
      back: "Tüm hesaplayıcılar",
      badge: "Backlash",
      title: "Backlash Hesaplayıcı",
      description:
        "Modül, yüz genişliği, merkez mesafesi ve sıcaklık farkı ile min/nom/max backlash tahmini yapar (basit rehber).",
    },
    status: "Aktif",
    fields: {
      module: "Modül m [mm]",
      faceWidth: "Yüz genişliği b [mm]",
      centerDistance: "Merkez mesafesi a [mm]",
      deltaT: "Sıcaklık farkı ΔT [°C]",
      alphaTh: "Isıl genleşme α_th [µm/m·°C]",
    },
    actions: {
      sample: "Örnek değerlerle doldur",
    },
    results: {
      min: "Min backlash j_min [mm]",
      nominal: "Nominal backlash j_nom [mm]",
      max: "Maksimum backlash j_max [mm]",
      thermal: "Termal düzeltme Δa [mm]",
      nominalAdj: "Nominal (ΔT sonrası)",
      minMaxAdj: "Min/Max (ΔT sonrası)",
    },
    errors: {
      invalid: "Pozitif değerler giriniz.",
    },
    note:
      "Bu tahmin ISO/DIN rehber mantığına uygun basit bir ön hesap yaklaşımıdır; gerçek tolerans sınıfı ve çizim gereksinimleri için standart tablolara bakınız.",
  },
  en: {
    header: {
      back: "All calculators",
      badge: "Backlash",
      title: "Backlash Calculator",
      description:
        "Estimates min/nom/max backlash from module, face width, center distance, and temperature delta (simple guide).",
    },
    status: "Active",
    fields: {
      module: "Module m [mm]",
      faceWidth: "Face width b [mm]",
      centerDistance: "Center distance a [mm]",
      deltaT: "Temperature delta ΔT [°C]",
      alphaTh: "Thermal expansion α_th [µm/m·°C]",
    },
    actions: {
      sample: "Fill with sample values",
    },
    results: {
      min: "Min backlash j_min [mm]",
      nominal: "Nominal backlash j_nom [mm]",
      max: "Max backlash j_max [mm]",
      thermal: "Thermal correction Δa [mm]",
      nominalAdj: "Nominal (after ΔT)",
      minMaxAdj: "Min/Max (after ΔT)",
    },
    errors: {
      invalid: "Please enter positive values.",
    },
    note:
      "This is a simplified estimate aligned with ISO/DIN guidance. Check tolerance class tables and drawings for final design.",
  },
} as const;

type BacklashCopy = (typeof COPY)[Locale];

export default function BacklashCalculatorPage({ initialDocs }: BacklashCalculatorClientProps) {
  const { locale } = useLocale();
  const copy = COPY[locale];

  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators/backlash-calculator" initialDocs={initialDocs}>
        <Header copy={copy.header} />
        <BacklashCalculator copy={copy} locale={locale} />
      </ToolDocTabs>
    </PageShell>
  );
}

function BacklashCalculator({ copy, locale }: { copy: BacklashCopy; locale: Locale }) {
  const [inp, setInp] = useState({
    module: "2",
    faceWidth: "30",
    centerDistance: "150",
    deltaT: "10",
    alphaTh: "12",
  });

  const res = useMemo(() => {
    const m = Number(inp.module);
    const b = Number(inp.faceWidth);
    const a = Number(inp.centerDistance);
    const dT = Number(inp.deltaT);
    const alphaTh = Number(inp.alphaTh) * 1e-6 || STEEL_ALPHA;
    const ok = m > 0 && b > 0 && a > 0;
    if (!ok) return null;
    const jNom = 0.04 * m + 0.001 * b; // simple nominal backlash estimate
    const jMin = 0.8 * jNom;
    const jMax = 1.2 * jNom;
    const thermal = a * alphaTh * dT; // center distance thermal expansion
    const jNomAdj = jNom + thermal;
    const jMinAdj = jMin + thermal;
    const jMaxAdj = jMax + thermal;
    return { jNom, jMin, jMax, thermal, jNomAdj, jMinAdj, jMaxAdj };
  }, [inp]);

  const advisorInsights = useMemo(
    () => getAdvisorInsights("gear-design/calculators/backlash-calculator", inp, { locale }),
    [inp, locale],
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{copy.header.title}</h2>
          <p className="text-sm text-slate-700">{copy.header.description}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          {copy.status}
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={copy.fields.module} value={inp.module} onChange={(v) => setInp({ ...inp, module: v })} />
        <Field label={copy.fields.faceWidth} value={inp.faceWidth} onChange={(v) => setInp({ ...inp, faceWidth: v })} />
        <Field
          label={copy.fields.centerDistance}
          value={inp.centerDistance}
          onChange={(v) => setInp({ ...inp, centerDistance: v })}
        />
        <Field label={copy.fields.deltaT} value={inp.deltaT} onChange={(v) => setInp({ ...inp, deltaT: v })} />
        <Field
          label={copy.fields.alphaTh}
          value={inp.alphaTh}
          onChange={(v) => setInp({ ...inp, alphaTh: v })}
        />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() =>
              setInp({ module: "2", faceWidth: "30", centerDistance: "150", deltaT: "10", alphaTh: "12" })
            }
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            {copy.actions.sample}
          </button>
        </div>
      </div>

      {res ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label={copy.results.min} value={`${res.jMin.toFixed(3)} mm`} />
          <Result label={copy.results.nominal} value={`${res.jNom.toFixed(3)} mm`} />
          <Result label={copy.results.max} value={`${res.jMax.toFixed(3)} mm`} />
          <Result label={copy.results.thermal} value={`${res.thermal.toFixed(4)} mm`} />
          <Result label={copy.results.nominalAdj} value={`${res.jNomAdj.toFixed(3)} mm`} />
          <Result
            label={copy.results.minMaxAdj}
            value={`${res.jMinAdj.toFixed(3)} / ${res.jMaxAdj.toFixed(3)} mm`}
          />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">{copy.errors.invalid}</p>
      )}

      <div className="mt-4">
        <AdvisorPanel insights={advisorInsights} />
      </div>

      <p className="mt-3 text-[11px] text-slate-600">{copy.note}</p>
    </section>
  );
}

function Header({ copy }: { copy: BacklashCopy["header"] }) {
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
            ← {copy.back}
          </Link>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            {copy.badge}
          </span>
        </div>
        <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">{copy.title}</h1>
        <p className="text-sm leading-relaxed text-slate-700">{copy.description}</p>
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
