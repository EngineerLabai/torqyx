"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { withLocalePrefix } from "@/utils/locale-path";

type HelixAxialCalculatorClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

const t = (locale: "tr" | "en", tr: string, en: string) => (locale === "tr" ? tr : en);

export default function HelixAxialCalculatorPage({ initialDocs }: HelixAxialCalculatorClientProps) {
  const { locale } = useLocale();
  const title = t(locale, "Helis Aksiyel Kuvvet Hesaplayıcı", "Helical Axial Force Calculator");
  const description = t(
    locale,
    "Helis açısı ve basınç açısıyla aksiyel kuvveti hesaplar; Ft ve Fr bilgisini verir.",
    "Calculates axial force from helix and pressure angles; also provides Ft and Fr.",
  );

  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators/helix-axial-calculator" initialDocs={initialDocs}>
        <Header title={title} description={description} />
        <HelixAxialCalculator />
      </ToolDocTabs>
    </PageShell>
  );
}

function HelixAxialCalculator() {
  const { locale } = useLocale();
  const [inp, setInp] = useState({
    power: "7.5",
    rpm: "1450",
    torque: "",
    diameter: "140",
    alpha: "20",
    beta: "15",
  });

  const res = useMemo(() => {
    const P = Number(inp.power);
    const n = Number(inp.rpm);
    const Tinput = Number(inp.torque);
    const d = Number(inp.diameter);
    const alpha = Number(inp.alpha);
    const beta = Number(inp.beta);
    const okGeom = d > 0 && alpha > 0 && beta >= 0;
    const hasPowerTorque = (P > 0 && n > 0) || Tinput > 0;
    if (!okGeom || !hasPowerTorque) return null;
    const T = Tinput > 0 ? Tinput : (9550 * P) / n;
    const Ft = (2000 * T) / d;
    const Fa = Ft * Math.tan((beta * Math.PI) / 180);
    const Fr = Ft * Math.tan((alpha * Math.PI) / 180);
    return { T, Ft, Fr, Fa };
  }, [inp]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {t(locale, "Helis Aksiyel Kuvvet Hesaplayıcı", "Helical Axial Force Calculator")}
          </h2>
          <p className="text-sm text-slate-700">
            {t(
              locale,
              "Helis açısı ve basınç açısıyla aksiyel kuvveti hesapla; Ft ve Fr bilgisi de verilir.",
              "Calculate axial force from helix and pressure angles; Ft and Fr are also provided.",
            )}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
          {t(locale, "Aktif", "Active")}
        </span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={t(locale, "Güç P [kW]", "Power P [kW]")} value={inp.power} onChange={(v) => setInp({ ...inp, power: v })} />
        <Field label={t(locale, "Devir n [rpm]", "Speed n [rpm]")} value={inp.rpm} onChange={(v) => setInp({ ...inp, rpm: v })} />
        <Field
          label={t(locale, "Tork T [Nm] (opsiyonel, P ve n yoksa)", "Torque T [Nm] (optional, if P and n are not given)")}
          value={inp.torque}
          onChange={(v) => setInp({ ...inp, torque: v })}
        />
        <Field label={t(locale, "Pinyon çapı d [mm]", "Pinion diameter d [mm]")} value={inp.diameter} onChange={(v) => setInp({ ...inp, diameter: v })} />
        <Field label={t(locale, "Basınç açısı α [deg]", "Pressure angle α [deg]")} value={inp.alpha} onChange={(v) => setInp({ ...inp, alpha: v })} />
        <Field label={t(locale, "Helis açısı β [deg]", "Helix angle β [deg]")} value={inp.beta} onChange={(v) => setInp({ ...inp, beta: v })} />
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-600">
        <button
          type="button"
          onClick={() => setInp({ power: "7.5", rpm: "1450", torque: "", diameter: "140", alpha: "20", beta: "15" })}
          className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
        >
          {t(locale, "Örnek değerlerle doldur", "Fill with sample values")}
        </button>
        <span>Fa = Ft·tan(β); Fr = Ft·tan(α); Ft = 2·π·T/d.</span>
      </div>

      {res ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result label={t(locale, "Tork T [Nm]", "Torque T [Nm]")} value={`${res.T.toFixed(2)} Nm`} />
          <Result label="Ft [N]" value={`${res.Ft.toFixed(1)} N`} />
          <Result label="Fr [N]" value={`${res.Fr.toFixed(1)} N`} />
          <Result label="Fa [N]" value={`${res.Fa.toFixed(1)} N`} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">
          {t(locale, "P/n veya T ile pozitif geometri değerleri giriniz.", "Enter positive geometry values with P/n or T.")}
        </p>
      )}
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
            {t(locale, "Helis", "Helix")}
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
