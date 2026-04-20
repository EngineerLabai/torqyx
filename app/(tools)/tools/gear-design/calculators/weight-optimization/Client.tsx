"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { withLocalePrefix } from "@/utils/locale-path";

type WeightOptimizationClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

const t = (locale: "tr" | "en", tr: string, en: string) => (locale === "tr" ? tr : en);

export default function WeightOptimizationPage({ initialDocs }: WeightOptimizationClientProps) {
  const { locale } = useLocale();
  const title = t(locale, "Dişli Ağırlığı / Gövde Optimizasyonu", "Gear Weight / Body Optimization");
  const description = t(
    locale,
    "Dış çap, yüz genişliği, iç çap ve malzeme yoğunluğuna göre ağırlık ve hafifletme tasarrufunu hesaplar.",
    "Calculates weight and lightening savings based on outer diameter, face width, bore diameter, and material density.",
  );

  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators/weight-optimization" initialDocs={initialDocs}>
        <Header title={title} description={description} />
        <WeightCalculator />
      </ToolDocTabs>
    </PageShell>
  );
}

function WeightCalculator() {
  const { locale } = useLocale();
  const [inp, setInp] = useState({
    outerDia: "250",
    faceWidth: "40",
    boreDia: "60",
    density: "7850",
    lighten: "0.2",
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
    const volumeSolidMm3 = (areaOuter - areaBore) * b;
    const volumeSolid = volumeSolidMm3 * 1e-9;
    const massSolid = volumeSolid * rho;
    const massLight = massSolid * (1 - lighten);
    const reduction = lighten * 100;
    return {
      massSolid,
      massLight,
      reduction,
      volumeSolid,
      rho,
      lighten,
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
          <h2 className="text-base font-semibold text-slate-900">{t(locale, "Dişli Ağırlığı / Gövde Optimizasyonu", "Gear Weight / Body Optimization")}</h2>
          <p className="text-sm text-slate-700">
            {t(
              locale,
              "Dişli geometri ve malzeme yoğunluğuna göre ağırlık tahmini yapar; hafifletme faktörü ile kaburga/boşaltım etkisi hesaba katılır (tipik 0-0.35, maksimum 0.6).",
              "Estimates gear weight from geometry and material density; includes rib/pocketing effect using a lightening factor (typical 0-0.35, maximum 0.6).",
            )}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">{t(locale, "Aktif", "Active")}</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label={t(locale, "Dış diş çapı D [mm]", "Outside diameter D [mm]")} value={inp.outerDia} onChange={(v) => setInp({ ...inp, outerDia: v })} />
        <Field label={t(locale, "Yüz genişliği b [mm]", "Face width b [mm]")} value={inp.faceWidth} onChange={(v) => setInp({ ...inp, faceWidth: v })} />
        <Field label={t(locale, "Giriş çapı d [mm]", "Bore diameter d [mm]")} value={inp.boreDia} onChange={(v) => setInp({ ...inp, boreDia: v })} />
        <SelectField
          label={t(locale, "Malzeme", "Material")}
          value={inp.material}
          onChange={(v) => setMaterial(v)}
          options={[
            { value: "steel", label: t(locale, "Çelik ~7850 kg/m3", "Steel ~7850 kg/m3") },
            { value: "castiron", label: t(locale, "Dökme demir ~7200 kg/m3", "Cast iron ~7200 kg/m3") },
            { value: "bronze", label: t(locale, "Bronz ~8800 kg/m3", "Bronze ~8800 kg/m3") },
            { value: "aluminum", label: t(locale, "Alüminyum ~2700 kg/m3", "Aluminum ~2700 kg/m3") },
          ]}
        />
        <Field label={t(locale, "Yoğunluk [kg/m3]", "Density [kg/m3]")} value={inp.density} onChange={(v) => setInp({ ...inp, density: v })} />
        <Field label={t(locale, "Hafifletme faktörü (0-0.6)", "Lightening factor (0-0.6)")} value={inp.lighten} onChange={(v) => setInp({ ...inp, lighten: v })} />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setInp({ outerDia: "250", faceWidth: "40", boreDia: "60", density: "7850", lighten: "0.2", material: "steel" })}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            {t(locale, "Örnek değerlerle doldur", "Fill with sample values")}
          </button>
        </div>
      </div>

      {res ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label={t(locale, "Katı (hafifletmesiz) ağırlık", "Solid (non-lightened) weight")} value={`${res.massSolid.toFixed(2)} kg`} />
          <Result label={t(locale, "Hafifletilmiş ağırlık", "Lightened weight")} value={`${res.massLight.toFixed(2)} kg`} />
          <Result label={t(locale, "Tasarruf", "Savings")} value={`${res.reduction.toFixed(1)} %`} />
          <Result label={t(locale, "Hacim (katı)", "Volume (solid)")} value={`${res.volumeSolid.toFixed(4)} m3`} />
          <Result label={t(locale, "Kullanılan yoğunluk", "Applied density")} value={`${res.rho.toFixed(0)} kg/m3`} />
          <Result label={t(locale, "Hafifletme faktörü", "Lightening factor")} value={`${res.lighten.toFixed(2)}`} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">
          {t(locale, "Pozitif geometri ve yoğunluk girin; giriş çapı dış diş çapından küçük olmalıdır.", "Enter positive geometry and density values; bore diameter must be smaller than outside diameter.")}
        </p>
      )}

      <p className="mt-3 text-[11px] text-slate-600">
        {t(
          locale,
          "Hafifletme faktörü kaburga/boşaltım ile alınan malzeme oranıdır (0: katı, 0.3: %30 boşaltma). 0.6 üzeri koşullar için yapısal analiz yapın. Tasarımda emniyet için balans, kaynak veya civata delikleri ayrıca kontrol edilmelidir.",
          "Lightening factor represents removed material ratio via ribs/pockets (0: solid, 0.3: 30% removal). For values above 0.6, run structural analysis. Also verify balancing, welds, or bolt holes for design safety.",
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
            {t(locale, "Ağırlık", "Weight")}
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
        aria-label="Select field"
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
