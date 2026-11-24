"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  PARALLEL_KEY_DEFINITIONS,
  calculateKeyCapacity,
} from "@/data/parallel-key-table";

type RangeCategory = "all" | "small" | "medium" | "heavy";
type KeyForm = "A" | "B";
type HubMaterial = "steel" | "cast_iron";

const COPY = {
  tr: {
    searchPlaceholder: "Mil çapı veya kama ölçüsü ara (örn: 40, 12x8, 20)...",
    allRanges: "Tüm Çaplar (6–500 mm)",
    smallRanges: "Küçük / Hassas (6–22 mm)",
    mediumRanges: "Genel Makine (22–85 mm)",
    heavyRanges: "Ağır Sanayi (85–500 mm)",
    filterLabelRange: "Mil Çapı Grubu:",
    filterLabelForm: "Kama Formu:",
    filterLabelMaterial: "Göbek Malzemesi:",
    formADesc: "Form A (Yuvarlak Uçlu, leff = L - b)",
    formBDesc: "Form B (Düz Uçlu, leff = L)",
    matSteel: "Çelik Göbek (pem = 100 MPa)",
    matCastIron: "Pik / Sfero Döküm (pem = 60 MPa)",
    showingResults: (shown: number, total: number) =>
      `${total} standart ölçüden ${shown} kademe gösteriliyor`,
    resetFilters: "Filtreleri Sıfırla",
    tableHeaders: {
      shaftRange: "Mil Çapı (d)",
      crossSection: "Kama Kesiti (b × h)",
      t1: "Mil Kanalı (t₁)",
      t2: "Göbek Kanalı (t₂)",
      tolerances: "Toleranslar (P9 / JS9)",
      standardLengths: "Standart Boylar (L)",
      defaultLength: "Örnek Boy (L)",
      leff: "Etkin Boy (leff)",
      torque: "Maks. Tork (Tmax)",
      action: "Hesaplayıcı",
    },
    tableFootnote:
      "* Tüm tork değerleri DIN 6885-1 ve Niemann ilkelerine göre göbek yüzey ezilme emniyeti (çelik 100 MPa, döküm 60 MPa) esas alınarak TORQYX mühendislik motoru ile deterministik olarak hesaplanmıştır.",
    calculateBtn: "Mil Burulması Hesapla",
    calculateBtnMobile: "Hesapla",
    clearSearchAria: "Aramayı temizle",
    nominalLabel: "anma",
    chamferLabel: "pah",
    steelPemLabel: "Çelik pem",
    castIronPemLabel: "Döküm pem",
    emptyTitle: "Eşleşen kama ölçüsü bulunamadı",
    emptyDesc: "Arama teriminizi veya aktif filtreleri değiştirerek tekrar deneyin.",
    calcBannerTitle: "Mil Burulması ve Çentik Yorulmasını Kontrol Edin",
    calcBannerDesc:
      "Kama kanalı açılan millerde burulma ve eğilme gerilmesi yığılması (Kt ≈ 2.5–3.0) meydana gelir. Mil çapının burulma açısı ve yorulma dayanımını Shaft Torsion aracıyla anında doğrulayın.",
    calcBannerCta: "Mil Burulma Analizini Aç",
    unitMm: "mm",
    unitNm: "N·m",
  },
  en: {
    searchPlaceholder: "Search shaft diameter or key size (e.g. 40, 12x8, 20)...",
    allRanges: "All Diameters (6–500 mm)",
    smallRanges: "Small / Precision (6–22 mm)",
    mediumRanges: "General Machinery (22–85 mm)",
    heavyRanges: "Heavy Duty (85–500 mm)",
    filterLabelRange: "Shaft Diameter Group:",
    filterLabelForm: "Key Shape Form:",
    filterLabelMaterial: "Hub Material:",
    formADesc: "Form A (Round Ends, leff = L - b)",
    formBDesc: "Form B (Square Ends, leff = L)",
    matSteel: "Steel Hub (pem = 100 MPa)",
    matCastIron: "Cast Iron Hub (pem = 60 MPa)",
    showingResults: (shown: number, total: number) =>
      `Showing ${shown} of ${total} standard shaft size steps`,
    resetFilters: "Reset Filters",
    tableHeaders: {
      shaftRange: "Shaft Dia. (d)",
      crossSection: "Key Size (b × h)",
      t1: "Shaft Depth (t₁)",
      t2: "Hub Depth (t₂)",
      tolerances: "Tolerances (P9 / JS9)",
      standardLengths: "Standard Lengths (L)",
      defaultLength: "Sample Length (L)",
      leff: "Effective (leff)",
      torque: "Max Torque (Tmax)",
      action: "Calculator",
    },
    tableFootnote:
      "* All torque capacities are deterministically calculated according to DIN 6885-1 and Niemann machine element standards based on permissible surface pressure (steel 100 MPa, cast iron 60 MPa).",
    calculateBtn: "Check Shaft Torsion",
    calculateBtnMobile: "Calc",
    clearSearchAria: "Clear search",
    nominalLabel: "nom.",
    chamferLabel: "chamfer",
    steelPemLabel: "Steel pem",
    castIronPemLabel: "Cast iron pem",
    emptyTitle: "No matching key sizes found",
    emptyDesc: "Try adjusting your search query or diameter range filters.",
    calcBannerTitle: "Verify Shaft Torsion and Keyway Fatigue Notch Factor",
    calcBannerDesc:
      "Milling a keyway creates stress concentration (Kt ≈ 2.5–3.0) under combined torsion and bending. Verify shaft angular twist and dynamic fatigue strength with our interactive Shaft Torsion tool.",
    calcBannerCta: "Launch Shaft Torsion Tool",
    unitMm: "mm",
    unitNm: "N·m",
  },
} as const;

function formatTorque(val: number): string {
  if (val >= 1000) {
    return val.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  if (val >= 10) {
    return val.toFixed(1);
  }
  return val.toFixed(2);
}

export default function KeyTableClient() {
  const { locale } = useLocale();
  const copy = COPY[locale];

  const [query, setQuery] = useState("");
  const [rangeFilter, setRangeFilter] = useState<RangeCategory>("all");
  const [shapeForm, setShapeForm] = useState<KeyForm>("A");
  const [material, setMaterial] = useState<HubMaterial>("steel");

  const filteredDefs = useMemo(() => {
    const q = query.trim().toLowerCase();

    return PARALLEL_KEY_DEFINITIONS.filter((def) => {
      // Range Category filter
      if (rangeFilter === "small" && def.dMax > 22) return false;
      if (rangeFilter === "medium" && (def.dMin < 22 || def.dMax > 85)) return false;
      if (rangeFilter === "heavy" && def.dMin < 85) return false;

      // Query filter
      if (!q) return true;

      const sizeStr = `${def.b}x${def.h}`.toLowerCase();
      const crossStr = `${def.b} × ${def.h}`.toLowerCase();
      const rangeStr = `${def.dMin}-${def.dMax}`.toLowerCase();
      const dMinStr = String(def.dMin);
      const dMaxStr = String(def.dMax);
      const dNominalStr = String(def.dNominal);

      return (
        def.id.toLowerCase().includes(q) ||
        sizeStr.includes(q) ||
        crossStr.includes(q) ||
        rangeStr.includes(q) ||
        dMinStr === q ||
        dMaxStr === q ||
        dNominalStr === q ||
        (Number(q) >= def.dMin && Number(q) <= def.dMax)
      );
    });
  }, [query, rangeFilter]);

  const hasActiveFilters = query.trim() !== "" || rangeFilter !== "all" || shapeForm !== "A" || material !== "steel";

  const handleReset = () => {
    setQuery("");
    setRangeFilter("all");
    setShapeForm("A");
    setMaterial("steel");
  };

  const pem = material === "steel" ? 100 : 60;

  return (
    <div className="space-y-6">
      {/* Control Panel: Search & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 space-y-4">
        {/* Search Input */}
        <div>
          <label htmlFor="key-search-input" className="sr-only">
            {copy.searchPlaceholder}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="key-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="block w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                aria-label={copy.clearSearchAria}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filter Selectors */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Shaft Diameter Range Filter */}
          <div>
            <label htmlFor="range-filter" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              {copy.filterLabelRange}
            </label>
            <select
              id="range-filter"
              value={rangeFilter}
              onChange={(e) => setRangeFilter(e.target.value as RangeCategory)}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">{copy.allRanges}</option>
              <option value="small">{copy.smallRanges}</option>
              <option value="medium">{copy.mediumRanges}</option>
              <option value="heavy">{copy.heavyRanges}</option>
            </select>
          </div>

          {/* Key Form Selection */}
          <div>
            <label htmlFor="form-filter" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              {copy.filterLabelForm}
            </label>
            <select
              id="form-filter"
              value={shapeForm}
              onChange={(e) => setShapeForm(e.target.value as KeyForm)}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="A">{copy.formADesc}</option>
              <option value="B">{copy.formBDesc}</option>
            </select>
          </div>

          {/* Hub Material Selection */}
          <div>
            <label htmlFor="material-filter" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              {copy.filterLabelMaterial}
            </label>
            <select
              id="material-filter"
              value={material}
              onChange={(e) => setMaterial(e.target.value as HubMaterial)}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="steel">{copy.matSteel}</option>
              <option value="cast_iron">{copy.matCastIron}</option>
            </select>
          </div>
        </div>

        {/* Results Bar and Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>{copy.showingResults(filteredDefs.length, PARALLEL_KEY_DEFINITIONS.length)}</span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-2 transition"
            >
              {copy.resetFilters}
            </button>
          )}
        </div>
      </div>

      {/* Main Table Display */}
      {filteredDefs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-base font-semibold text-slate-900">{copy.emptyTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">{copy.emptyDesc}</p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            {copy.resetFilters}
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th scope="col" className="px-3.5 py-3.5 sm:px-4">
                    {copy.tableHeaders.shaftRange}
                  </th>
                  <th scope="col" className="px-3.5 py-3.5 sm:px-4">
                    {copy.tableHeaders.crossSection}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center">
                    {copy.tableHeaders.t1}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center">
                    {copy.tableHeaders.t2}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center hidden md:table-cell">
                    {copy.tableHeaders.tolerances}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center">
                    {copy.tableHeaders.defaultLength}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center">
                    {copy.tableHeaders.leff}
                  </th>
                  <th scope="col" className="px-3.5 py-3.5 sm:px-4 text-right font-mono">
                    {copy.tableHeaders.torque}
                  </th>
                  <th scope="col" className="px-3.5 py-3.5 sm:px-4 text-center">
                    {copy.tableHeaders.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-600">
                {filteredDefs.map((def, idx) => {
                  const cap = calculateKeyCapacity({
                    shaftDiameter: def.dNominal,
                    keyWidth: def.b,
                    keyHeight: def.h,
                    t2: def.t2,
                    length: def.defaultLength,
                    shape: shapeForm,
                    pemSteel: pem,
                    pemCastIron: pem,
                  });

                  const activeTorque = material === "steel" ? cap.torqueSteelNm : cap.torqueCastIronNm;

                  const calcUrl = `/${locale}/tools/shaft-torsion?diameter=${def.dNominal}&torque=${Math.round(activeTorque)}`;

                  return (
                    <tr
                      key={def.id}
                      className={idx % 2 === 0 ? "bg-white hover:bg-slate-50/80" : "bg-slate-50/40 hover:bg-slate-50/80"}
                    >
                      {/* Shaft Range */}
                      <td className="px-3.5 py-3 sm:px-4 font-semibold text-slate-900 whitespace-nowrap">
                        <span className="font-mono">{def.dMin} – {def.dMax}</span> {copy.unitMm}
                        <span className="block text-[11px] font-normal text-slate-400">
                          ({copy.nominalLabel}: {def.dNominal} {copy.unitMm})
                        </span>
                      </td>

                      {/* Key Size (b x h) */}
                      <td className="px-3.5 py-3 sm:px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                        <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                          {def.b} × {def.h}
                        </span>
                        <span className="block text-[11px] font-normal text-slate-400">
                          {copy.chamferLabel}: {def.chamfer}
                        </span>
                      </td>

                      {/* Shaft Depth (t1) */}
                      <td className="px-3 py-3 text-center font-mono whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{def.t1.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400 block">{def.tolDepth}</span>
                      </td>

                      {/* Hub Depth (t2) */}
                      <td className="px-3 py-3 text-center font-mono whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{def.t2.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400 block">{def.tolDepth}</span>
                      </td>

                      {/* Tolerances */}
                      <td className="px-3 py-3 text-center text-xs hidden md:table-cell whitespace-nowrap">
                        <span className="font-mono text-slate-700 block">P9: {def.tolShaftKeywayP9}</span>
                        <span className="font-mono text-slate-500 block">JS9: {def.tolHubKeywayJS9}</span>
                      </td>

                      {/* Default Length */}
                      <td className="px-3 py-3 text-center font-mono whitespace-nowrap">
                        <span className="font-medium text-slate-900">{def.defaultLength}</span> {copy.unitMm}
                        <span className="block text-[10px] text-slate-400">
                          ({def.standardLengths[0]}–{def.standardLengths[def.standardLengths.length - 1]})
                        </span>
                      </td>

                      {/* Effective Length leff */}
                      <td className="px-3 py-3 text-center font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {cap.leff} {copy.unitMm}
                        <span className="block text-[10px] font-normal text-slate-400">
                          {shapeForm === "A" ? "L - b" : "L"}
                        </span>
                      </td>

                      {/* Torque Capacity */}
                      <td className="px-3.5 py-3 sm:px-4 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                        <span>{formatTorque(activeTorque)}</span> {copy.unitNm}
                        <span className="block text-[10px] font-normal text-slate-400">
                          {material === "steel" ? copy.steelPemLabel : copy.castIronPemLabel}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-3.5 py-3 sm:px-4 text-center whitespace-nowrap">
                        <Link
                          href={calcUrl}
                          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition"
                          title={copy.calculateBtn}
                        >
                          <svg className="mr-1.5 h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden sm:inline">{copy.calculateBtn}</span>
                          <span className="sm:hidden">{copy.calculateBtnMobile}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footnote */}
          <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-3 text-[11px] text-slate-500 sm:px-6">
            <p>{copy.tableFootnote}</p>
          </div>
        </div>
      )}

      {/* Interactive Tool Banner CTA */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-6 shadow-sm sm:p-8">
        <div className="max-w-2xl space-y-2">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            {locale === "tr" ? "İleri Seviye Şaft Mukavemeti" : "Advanced Shaft Strength"}
          </span>
          <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{copy.calcBannerTitle}</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{copy.calcBannerDesc}</p>
        </div>
        <div className="mt-5 sm:mt-6">
          <Link
            href={`/${locale}/tools/shaft-torsion`}
            className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
          >
            <span>{copy.calcBannerCta}</span>
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
