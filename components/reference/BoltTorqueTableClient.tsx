"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  BOLT_PROPERTY_CLASSES,
  BOLT_TORQUE_TABLE_DATA,
  type BoltPropertyClass,
  type BoltTorqueRow,
} from "@/data/bolt-torque-table";

type PitchFilter = "all" | "coarse" | "fine";
type GradeFilter = "all" | BoltPropertyClass;

const COPY = {
  tr: {
    searchPlaceholder: "Cıvata ölçüsü ara (örn: M12, M8, 1.75)...",
    allPitches: "Tüm Adımlar",
    coarsePitch: "Kaba Adım",
    finePitch: "İnce Adım",
    allGrades: "Tüm Kaliteler",
    filterLabelPitch: "Diş Adımı:",
    filterLabelGrade: "Mukavemet Sınıfı:",
    showingResults: (shown: number, total: number) => `${total} kombinasyondan ${shown} cıvata gösteriliyor`,
    resetFilters: "Filtreleri Sıfırla",
    tableHeaders: {
      size: "Cıvata Ölçüsü",
      pitchType: "Adım Türü",
      grade: "Kalite",
      as: "Gerilme Alanı (As)",
      fv: "Ön Yük (Fv)",
      torqueDry: "Kuru Tork (K=0.25)",
      torqueOiled: "Yağlı Tork (K=0.20)",
      action: "Hesaplayıcı",
    },
    tableFootnote: "* Tüm tork ve ön yük değerleri ISO 898-1 akma dayanımının %70'i üzerinden TORQYX Bolt Calculator motoru ile deterministik olarak hesaplanmıştır.",
    calculateBtn: "Kendi Değerinle Hesapla",
    coarseBadge: "Kaba",
    fineBadge: "İnce",
    emptyTitle: "Eşleşen cıvata bulunamadı",
    emptyDesc: "Arama teriminizi veya filtreleri değiştirerek tekrar deneyin.",
    calcBannerTitle: "Özel Sürtünme veya %90 Akma Sınırı mı Gerekiyor?",
    calcBannerDesc: "Tablodaki standart kuru (K=0.25) ve yağlı (K=0.20) değerlerin ötesinde kaplamalı cıvatalar (K=0.18) veya VDI 2230 %90 montaj ön yükü için etkileşimli hesaplayıcıyı başlatın.",
    calcBannerCta: "Bolt Calculator'ı Başlat",
  },
  en: {
    searchPlaceholder: "Search bolt size (e.g. M12, M8, 1.75)...",
    allPitches: "All Pitches",
    coarsePitch: "Coarse Pitch",
    finePitch: "Fine Pitch",
    allGrades: "All Grades",
    filterLabelPitch: "Thread Pitch:",
    filterLabelGrade: "Property Class:",
    showingResults: (shown: number, total: number) => `Showing ${shown} of ${total} bolt combinations`,
    resetFilters: "Reset Filters",
    tableHeaders: {
      size: "Bolt Size",
      pitchType: "Pitch Type",
      grade: "Class",
      as: "Stress Area (As)",
      fv: "Preload (Fv)",
      torqueDry: "Dry Torque (K=0.25)",
      torqueOiled: "Oiled Torque (K=0.20)",
      action: "Calculator",
    },
    tableFootnote: "* All torque and clamp load values are deterministically calculated at 70% of ISO 898-1 yield strength using the TORQYX Bolt Calculator engine.",
    calculateBtn: "Calculate with Own Values",
    coarseBadge: "Coarse",
    fineBadge: "Fine",
    emptyTitle: "No matching bolts found",
    emptyDesc: "Try adjusting your search query or active filter settings.",
    calcBannerTitle: "Need Custom Friction or 90% Yield Preload?",
    calcBannerDesc: "Beyond standard dry (K=0.25) and oiled (K=0.20) values, launch our interactive calculator for coated bolts (K=0.18) or VDI 2230 90% tightening targets.",
    calcBannerCta: "Launch Bolt Calculator",
  },
} as const;

function formatTorque(val: number): string {
  if (val < 10) {
    return val.toFixed(2);
  }
  return val.toFixed(1);
}

function formatArea(val: number): string {
  return val < 10 ? val.toFixed(2) : val.toFixed(1);
}

function formatForce(val: number): string {
  return val < 10 ? val.toFixed(2) : val.toFixed(1);
}

export default function BoltTorqueTableClient() {
  const { locale } = useLocale();
  const copy = COPY[locale];

  const [query, setQuery] = useState("");
  const [pitchFilter, setPitchFilter] = useState<PitchFilter>("all");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return BOLT_TORQUE_TABLE_DATA.filter((row: BoltTorqueRow) => {
      // Query filter
      if (q) {
        const matchesSize = row.size.toLowerCase().includes(q);
        const matchesLabel = row.threadLabel.toLowerCase().includes(q);
        const matchesDiameter = String(row.d) === q || `m${row.d}` === q;
        const matchesPitch = String(row.pitch) === q;

        if (!matchesSize && !matchesLabel && !matchesDiameter && !matchesPitch) {
          return false;
        }
      }

      // Pitch type filter
      if (pitchFilter !== "all" && row.pitchType !== pitchFilter) {
        return false;
      }

      // Grade filter
      if (gradeFilter !== "all" && row.grade !== gradeFilter) {
        return false;
      }

      return true;
    });
  }, [query, pitchFilter, gradeFilter]);

  const hasActiveFilters = query.trim() !== "" || pitchFilter !== "all" || gradeFilter !== "all";

  const handleReset = () => {
    setQuery("");
    setPitchFilter("all");
    setGradeFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Interactive Tool Banner */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 p-5 shadow-sm sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-900">{copy.calcBannerTitle}</h2>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl">{copy.calcBannerDesc}</p>
        </div>
        <Link
          href={locale === "tr" ? "/tr/tools/bolt-calculator" : "/en/tools/bolt-calculator"}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow"
        >
          {copy.calcBannerCta} →
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            ) : null}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Pitch Filter */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
              <span className="hidden px-2 text-[11px] font-medium text-slate-500 sm:inline">
                {copy.filterLabelPitch}
              </span>
              <button
                type="button"
                onClick={() => setPitchFilter("all")}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  pitchFilter === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {copy.allPitches}
              </button>
              <button
                type="button"
                onClick={() => setPitchFilter("coarse")}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  pitchFilter === "coarse"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {copy.coarsePitch}
              </button>
              <button
                type="button"
                onClick={() => setPitchFilter("fine")}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  pitchFilter === "fine"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {copy.finePitch}
              </button>
            </div>

            {/* Grade Filter */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
              <span className="hidden px-2 text-[11px] font-medium text-slate-500 sm:inline">
                {copy.filterLabelGrade}
              </span>
              <button
                type="button"
                onClick={() => setGradeFilter("all")}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  gradeFilter === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {copy.allGrades}
              </button>
              {BOLT_PROPERTY_CLASSES.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setGradeFilter(grade)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    gradeFilter === grade
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                {copy.resetFilters}
              </button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
          <span>{copy.showingResults(filteredRows.length, BOLT_TORQUE_TABLE_DATA.length)}</span>
          <span className="font-mono text-slate-400">Preload: 70% Re (ISO 898-1)</span>
        </div>
      </div>

      {/* Main Table */}
      {filteredRows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-semibold text-slate-900">{copy.emptyTitle}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.emptyDesc}</p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
          >
            {copy.resetFilters}
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                    {copy.tableHeaders.size}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center whitespace-nowrap">
                    {copy.tableHeaders.pitchType}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center whitespace-nowrap">
                    {copy.tableHeaders.grade}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right whitespace-nowrap">
                    {copy.tableHeaders.as} <span className="font-normal text-slate-400">[mm²]</span>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right whitespace-nowrap">
                    {copy.tableHeaders.fv} <span className="font-normal text-slate-400">[kN]</span>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right whitespace-nowrap bg-amber-50/50 text-amber-900">
                    {copy.tableHeaders.torqueDry} <span className="font-normal text-amber-700">[N·m]</span>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right whitespace-nowrap bg-emerald-50/50 text-emerald-900">
                    {copy.tableHeaders.torqueOiled} <span className="font-normal text-emerald-700">[N·m]</span>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-center whitespace-nowrap">
                    {copy.tableHeaders.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRows.map((row: BoltTorqueRow) => {
                  const calculatorUrl = locale === "tr" ? row.calculatorUrlTr : row.calculatorUrlEn;

                  return (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-slate-50/80 group"
                    >
                      {/* Bolt Size */}
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{row.threadLabel}</span>
                        </div>
                      </td>

                      {/* Pitch Type */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            row.pitchType === "coarse"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          }`}
                        >
                          {row.pitchType === "coarse" ? copy.coarseBadge : copy.fineBadge}
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            row.grade === "8.8"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : row.grade === "10.9"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {row.grade}
                        </span>
                      </td>

                      {/* Tensile Stress Area As */}
                      <td className="px-3 py-3 text-right whitespace-nowrap font-mono text-slate-600">
                        {formatArea(row.As)}
                      </td>

                      {/* Preload Force Fv */}
                      <td className="px-3 py-3 text-right whitespace-nowrap font-mono font-medium text-slate-800">
                        {formatForce(row.Fv)}
                      </td>

                      {/* Dry Torque */}
                      <td className="px-4 py-3 text-right whitespace-nowrap font-mono font-bold text-amber-800 bg-amber-50/30">
                        {formatTorque(row.torqueDry)}
                      </td>

                      {/* Oiled Torque */}
                      <td className="px-4 py-3 text-right whitespace-nowrap font-mono font-bold text-emerald-800 bg-emerald-50/30">
                        {formatTorque(row.torqueOiled)}
                      </td>

                      {/* Action CTA */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <Link
                          href={calculatorUrl}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                          title={`${row.threadLabel} (${row.grade})`}
                        >
                          <span>{copy.calculateBtn}</span>
                          <span className="text-[10px]">↗</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footnote */}
          <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-[11px] text-slate-500">
            {copy.tableFootnote}
          </div>
        </div>
      )}
    </div>
  );
}
