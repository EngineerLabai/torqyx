"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { calculateOpenBelt } from "@/tools/belt-length/logic";

type Inputs = {
  d1: string;
  d2: string;
  center: string;
};

const INITIAL: Inputs = {
  d1: "120",
  d2: "80",
  center: "400",
};

const t = (locale: "tr" | "en", tr: string, en: string) => (locale === "tr" ? tr : en);

type BeltLengthClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function BeltLengthPage({ initialDocs }: BeltLengthClientProps) {
  const { locale } = useLocale();
  const [inputs, setInputs] = useState<Inputs>(INITIAL);

  const results = useMemo(() => calculateOpenBelt(inputs), [inputs]);

  function handleChange<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <PageShell>
      <ToolDocTabs slug="belt-length" initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t(locale, "Kasnak", "Pulley")}
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
              {t(locale, "Kayış", "Belt")}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">
            {t(locale, "Kasnak Kayışı Uzunluğu ve Sarma Açısı", "Pulley Belt Length and Wrap Angle")}
          </h1>
          <p className="mt-2 text-xs text-slate-600">
            {t(
              locale,
              "Açık kayış konfigürasyonunda iki kasnak çapı ve merkez mesafesine göre kayış uzunluğunu ve küçük kasnak sarma açısını hesaplar. Formül düz hat tahmini içindir; germe, polikayış diş profili ve üretici toleransları ayrıca dikkate alınmalıdır.",
              "For an open-belt configuration, calculates belt length and small pulley wrap angle from two pulley diameters and center distance. Formula is a straight-line estimate; tensioning, poly-V profile, and manufacturer tolerances should also be considered.",
            )}
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{t(locale, "Girişler", "Inputs")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label={t(locale, "Kasnak 1 çapı D1 [mm]", "Pulley 1 diameter D1 [mm]")}
                value={inputs.d1}
                onChange={(v) => handleChange("d1", v)}
              />
              <Field
                label={t(locale, "Kasnak 2 çapı D2 [mm]", "Pulley 2 diameter D2 [mm]")}
                value={inputs.d2}
                onChange={(v) => handleChange("d2", v)}
              />
              <Field
                label={t(locale, "Merkez mesafesi C [mm]", "Center distance C [mm]")}
                value={inputs.center}
                onChange={(v) => handleChange("center", v)}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-600">
              {t(
                locale,
                "Koşullar: çaplar ve C pozitif olmalı; kasnaklar fiziksel olarak çakışmamalı ve (Dbüyük-Dküçük)/(2C) < 1 olmalıdır. Germe payı ve üretici toleransı ayrıca değerlendirilir.",
                "Conditions: diameters and C must be positive; pulley pitch circles must not overlap and (Dbig-Dsmall)/(2C) must be below 1. Evaluate tension allowance and manufacturer tolerances separately.",
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">{t(locale, "Sonuçlar", "Results")}</h3>
            {results.ok ? (
              <div className="space-y-2">
                <ResultRow
                  label={t(locale, "Kayış uzunluğu", "Belt length")}
                  value={`${results.length.toFixed(1)} mm`}
                />
                <ResultRow
                  label={t(locale, "Küçük kasnak sarma açısı", "Small pulley wrap angle")}
                  value={`${results.betaSmallDeg.toFixed(1)}°`}
                />
                <ResultRow
                  label={t(locale, "Büyük kasnak sarma açısı", "Large pulley wrap angle")}
                  value={`${results.betaBigDeg.toFixed(1)}°`}
                />
                <ResultRow
                  label={t(locale, "Küçük kabul edilen kasnak", "Pulley treated as small")}
                  value={`${results.dSmall.toFixed(1)} mm (${results.smallPulleySource})`}
                />
                <ResultRow
                  label={t(locale, "Büyük kabul edilen kasnak", "Pulley treated as large")}
                  value={`${results.dBig.toFixed(1)} mm (${results.bigPulleySource})`}
                />
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                  {t(
                    locale,
                    "Formüller: L = 2C + π/2(Dbüyük+Dküçük) + (Dbüyük-Dküçük)²/(4C); βküçük = π - 2·asin(r), βbüyük = π + 2·asin(r), r=(Dbüyük-Dküçük)/(2C). Çapraz kayış için farklı formüller gerekir.",
                    "Formulas: L = 2C + π/2(Dbig+Dsmall) + (Dbig-Dsmall)²/(4C); βsmall = π - 2·asin(r), βbig = π + 2·asin(r), r=(Dbig-Dsmall)/(2C). Crossed belts require different formulas.",
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-red-600">
                {results.reason === "overlapping-pulleys"
                  ? t(
                      locale,
                      "Merkez mesafesi kasnakların çakışmasını önleyecek kadar büyük olmalıdır.",
                      "Center distance must be large enough to prevent the pulley pitch circles from overlapping.",
                    )
                  : t(
                      locale,
                      "Pozitif çap ve merkez mesafesi girin; (Dbüyük-Dküçük)/(2C) oranı 1'den küçük olmalıdır.",
                      "Enter positive diameters and center distance; (Dbig-Dsmall)/(2C) must be below 1.",
                    )}
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        aria-label={label}
      />
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
