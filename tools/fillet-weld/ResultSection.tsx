"use client";

import ExplanationPanel from "@/components/tools/ExplanationPanel";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatNumberFixed } from "@/utils/number-format";
import type { ToolResultProps } from "@/tools/_shared/types";
import type { FilletWeldResult } from "./types";

const formatNumber = (value: number | null, digits = 2, locale: "tr" | "en") =>
  formatNumberFixed(value, locale, digits);

export default function ResultSection({ result }: ToolResultProps<FilletWeldResult>) {
  const { locale } = useLocale();
  const statusLabel = result.isSafe === null ? "-" : result.isSafe ? "Uygun" : "Yetersiz";

  return (
    <div className="space-y-4 text-sm">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-900">Sonuçlar</h2>
        <p className="text-xs text-slate-500">Gereken a, boğaz kalınlığı ve gerilme kontrolü.</p>
      </div>

      {result.error ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {result.error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Gereken a</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.requiredA, 2, locale)} mm</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Boğaz kalınlığı</p>
          <p className="mt-1 text-base font-semibold text-slate-900">{formatNumber(result.throat, 2, locale)} mm</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Gerilme kontrolü</p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {result.stress === null ? "-" : `${formatNumber(result.stress, 2, locale)} MPa`}
          </p>
          <p className="text-[11px] text-slate-500">{statusLabel}</p>
        </div>
      </div>

      <ExplanationPanel
        title="Formül ve değişkenler"
        formulas={["sigma = F / (0.707 * a * L)", "a_req = F / (0.707 * L * sigma_izin)"]}
        variables={[
          { symbol: "F", description: "Toplam yük (N)." },
          { symbol: "L", description: "Toplam kaynak boyu (mm)." },
          { symbol: "a", description: "Köşe kaynak bacak boyu (mm)." },
          { symbol: "sigma_izin", description: "İzin verilen gerilme (MPa)." },
        ]}
        notes={["0.707 katsayısı boğaz kalınlığından gelir.", "Gerçek katsayılar standartlara göre değişir."]}
      />
    </div>
  );
}
