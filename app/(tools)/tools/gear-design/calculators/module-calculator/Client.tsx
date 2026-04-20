"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import ExportPanel from "@/components/tools/ExportPanel";
import EngineeringDiagram from "@/src/components/visuals/EngineeringDiagram";
import { exportSvgToPng, getSvgPreview } from "@/utils/export";
import { withLocalePrefix } from "@/utils/locale-path";

const STANDARD_MODULES = [0.5, 0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20];

type ModuleCalculatorClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

const t = (locale: "tr" | "en", tr: string, en: string) => (locale === "tr" ? tr : en);

export default function ModuleCalculatorPage({ initialDocs }: ModuleCalculatorClientProps) {
  const { locale } = useLocale();
  const title = t(locale, "Modül Hesaplayıcı", "Module Calculator");
  const description = t(
    locale,
    "Hatve çapı ve diş sayısına göre ham modül hesaplar, en yakın standart modül ve önerilen çapı verir.",
    "Calculates raw module from pitch diameter and tooth count, then suggests nearest standard module and recommended diameter.",
  );

  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators/module-calculator" initialDocs={initialDocs}>
        <Header title={title} description={description} />
        <ModuleCalculator />
      </ToolDocTabs>
    </PageShell>
  );
}

function ModuleCalculator() {
  const { locale } = useLocale();
  const [inputs, setInputs] = useState({ diameter: "200", teeth: "40" });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

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
      { m: STANDARD_MODULES[0], diff: Math.abs(STANDARD_MODULES[0] - mRaw) },
    );
    const suggestedM = closest.m;
    const suggestedDiameter = suggestedM * z;
    const diffPercent = ((suggestedM - mRaw) / mRaw) * 100;
    const zMin20deg = 17;
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

  const diameterValue = Number(inputs.diameter);
  const teethValue = Number(inputs.teeth);
  const moduleValue =
    Number.isFinite(diameterValue) && Number.isFinite(teethValue) && teethValue > 0
      ? diameterValue / teethValue
      : null;

  useEffect(() => {
    setPreviewUrl(getSvgPreview(svgRef.current));
  }, [diameterValue, teethValue, moduleValue, locale]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{t(locale, "Modül Hesaplayıcı", "Module Calculator")}</h2>
          <p className="text-sm text-slate-700">
            {t(
              locale,
              "Hatve çapını (d) ve diş sayısını (z) gir, ham modülü hesapla; en yakın standart modülü ve önerilen çapı gör.",
              "Enter pitch diameter (d) and tooth count (z), calculate raw module, and see nearest standard module with recommended diameter.",
            )}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">{t(locale, "Aktif", "Active")}</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={t(locale, "Hatve çapı d [mm]", "Pitch diameter d [mm]")} value={inputs.diameter} onChange={(v) => setInputs({ ...inputs, diameter: v })} />
        <Field label={t(locale, "Diş sayısı z", "Tooth count z")} value={inputs.teeth} onChange={(v) => setInputs({ ...inputs, teeth: v })} />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setInputs({ diameter: "200", teeth: "40" })}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            {t(locale, "Örnek değerlerle doldur", "Fill with sample values")}
          </button>
        </div>
      </div>

      {result ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label={t(locale, "Ham modül m", "Raw module m")} value={`${result.mRaw.toFixed(3)} mm`} />
          <Result label={t(locale, "Hatve (π·m)", "Pitch (π·m)")} value={`${result.circularPitch.toFixed(3)} mm`} />
          <Result label={t(locale, "Önerilen standart m", "Suggested standard m")} value={`${result.suggestedM.toFixed(3)} mm`} />
          <Result label={t(locale, "Önerilen çap (m_std·z)", "Suggested diameter (m_std·z)")} value={`${result.suggestedDiameter.toFixed(2)} mm`} />
          <Result label={t(locale, "Standart sapma", "Standard deviation")} value={`${result.diffPercent >= 0 ? "+" : ""}${result.diffPercent.toFixed(1)} %`} />
          <Result
            label={t(locale, "Undercut uyarısı (20°)", "Undercut warning (20°)")}
            value={result.zMinWarning ? t(locale, `Risk: z < ${result.zMin20deg}`, `Risk: z < ${result.zMin20deg}`) : t(locale, "Uygun", "OK")}
            tone={result.zMinWarning ? "warn" : "ok"}
          />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">{t(locale, "Pozitif sayılar giriniz.", "Please enter positive values.")}</p>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">{t(locale, "Teknik Diyagram", "Engineering Diagram")}</h3>
            <p className="text-xs text-slate-500">{t(locale, "Hatve çapı ve diş sayısına göre şematik görünüm.", "Schematic view based on pitch diameter and tooth count.")}</p>
          </div>

          <ExportPanel
            label={t(locale, "Görseli İndir", "Download diagram")}
            previewUrl={previewUrl}
            previewAlt={t(locale, "Dişli diyagramı önizleme", "Gear diagram preview")}
            helperText={t(locale, "PNG çıktısı rapor ekleri için uygundur.", "PNG export is report-ready.")}
            onPng={() =>
              exportSvgToPng(svgRef.current, {
                filename: locale === "tr" ? "disli-diyagram.png" : "gear-diagram.png",
              })
            }
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <EngineeringDiagram
            ref={svgRef}
            type="gear"
            params={{
              pitchDiameter: Number.isFinite(diameterValue) ? diameterValue : undefined,
              teeth: Number.isFinite(teethValue) ? teethValue : undefined,
              module: Number.isFinite(moduleValue ?? NaN) ? moduleValue ?? undefined : undefined,
              showGrid: true,
            }}
            locale={locale}
            className="h-auto w-full"
          />
        </div>
      </div>

      <p className="mt-3 text-[11px] text-slate-600">
        {t(
          locale,
          `Standart modül serisi: ${STANDARD_MODULES.join(", ")}. Çap/diş sayısını değiştirdiğinde en yakın standart modül ve buna karşılık gelen önerilen hatve çapı gösterilir.`,
          `Standard module series: ${STANDARD_MODULES.join(", ")}. Changing diameter/tooth count updates nearest standard module and corresponding recommended pitch diameter.`,
        )}
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
            {t(locale, "← Tüm hesaplayıcılar", "← All calculators")}
          </Link>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            {t(locale, "Modüller", "Modules")}
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
        aria-label="Number input"
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
