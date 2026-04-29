"use client";

import { useState } from "react";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";

type Part = { id: number; name: string; nominal: number | ""; tol: number | "" };

export default function ToleranceStackupPage() {

  const [parts, setParts] = useState<Part[]>([
    { id: 1, name: "Parça 1", nominal: "", tol: "" },
    { id: 2, name: "Parça 2", nominal: "", tol: "" },
  ]);

  const addPart = () => setParts([...parts, { id: Date.now(), name: `Parça ${parts.length + 1}`, nominal: "", tol: "" }]);
  const removePart = (id: number) => setParts(parts.filter((p) => p.id !== id));
  const updatePart = (id: number, field: keyof Part, value: any) => {
    setParts(parts.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  let nominalSum = 0;
  let worstCase = 0;
  let sumTolSquared = 0;

  parts.forEach((p) => {
    if (typeof p.nominal === "number") nominalSum += p.nominal;
    if (typeof p.tol === "number") {
      worstCase += p.tol;
      sumTolSquared += Math.pow(p.tol, 2);
    }
  });

  const rss = Math.sqrt(sumTolSquared);

  return (
    <PageShell>
      <PageHero title={t("header.title")} description={t("header.description")} eyebrow={t("badges.secondary")} />

      <div className="grid gap-8 lg:grid-cols-3 mt-8">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">{t("inputs.title")}</h2>
            <button onClick={addPart} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md font-medium hover:bg-blue-100">+ {t("inputs.addPart")}</button>
          </div>
          
          <div className="space-y-3">
            {parts.map((part) => (
              <div key={part.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="w-1/3 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder={t("inputs.partName")}
                  value={part.name}
                  onChange={(e) => updatePart(part.id, "name", e.target.value)}
                />
                <input
                  type="number"
                  className="w-1/3 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder={t("inputs.nominal")}
                  value={part.nominal}
                  onChange={(e) => updatePart(part.id, "nominal", e.target.value ? Number(e.target.value) : "")}
                />
                <span className="text-slate-400 font-medium">±</span>
                <input
                  type="number"
                  className="w-1/4 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder={t("inputs.tolerance")}
                  value={part.tol}
                  onChange={(e) => updatePart(part.id, "tol", e.target.value ? Number(e.target.value) : "")}
                />
                {parts.length > 1 && (
                  <button onClick={() => removePart(part.id)} className="text-slate-400 hover:text-red-500 font-bold px-2">✕</button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{t("results.title")}</h2>
          <div className="space-y-4">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="text-sm text-slate-500">{t("results.nominalSum")}</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{nominalSum > 0 ? nominalSum.toFixed(3) : "—"}</div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100 border-l-4 border-l-orange-400">
              <div className="text-sm text-slate-500">{t("results.worstCase")}</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">± {worstCase > 0 ? worstCase.toFixed(3) : "—"}</div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
              <div className="text-sm text-slate-500">{t("results.rss")}</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">± {rss > 0 ? rss.toFixed(3) : "—"}</div>
            </div>
            
            {/* Varyans Katkı Payları Grafiği */}
            <div className="mt-6 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">{t("results.contributionTitle")}</h3>
              <div className="space-y-4">
                {parts.map((p) => {
                  const isValid = typeof p.tol === "number" && p.tol > 0;
                  const contribution = isValid && sumTolSquared > 0 ? (Math.pow(p.tol, 2) / sumTolSquared) * 100 : 0;
                  return (
                    <div key={p.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-700 font-medium truncate pr-2">{p.name || "İsimsiz Parça"}</span>
                        <span className="text-slate-500">{contribution.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${contribution}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Raporlama Paneli */}
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-md">
              <h3 className="text-lg font-semibold mb-2">{t("results.reportTitle")}</h3>
              <p className="text-sm text-slate-300 mb-4">{t("results.reportDesc")}</p>
              <button className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors w-max">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {t("results.downloadPdf")}
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}