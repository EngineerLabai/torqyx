"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import ToolMethodNotes from "@/components/tools/ToolMethodNotes";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { getToolMethodNotes } from "@/lib/tool-method-notes";
import { useLocale } from "@/components/i18n/LocaleProvider";

type MaterialInfo = {
  key: string;
  yieldStrength: number;
};

const MATERIALS: MaterialInfo[] = [
  { key: "S235", yieldStrength: 235 },
  { key: "S355", yieldStrength: 355 },
  { key: "C45", yieldStrength: 600 },
  { key: "50CrV4", yieldStrength: 1100 },
  { key: "AL6013", yieldStrength: 300 },
];

const t = (locale: "tr" | "en", tr: string, en: string) => (locale === "tr" ? tr : en);

const materialLabel = (locale: "tr" | "en", key: string) => {
  if (key === "C45") return t(locale, "C45 (Islahlı ~ 600 MPa)", "C45 (Q&T ~ 600 MPa)");
  if (key === "50CrV4") return t(locale, "50CrV4 (Islahlı ~ 1100 MPa)", "50CrV4 (Q&T ~ 1100 MPa)");
  if (key === "AL6013") return t(locale, "Alüminyum 6013 (T6 ~ 300 MPa)", "Aluminum 6013 (T6 ~ 300 MPa)");
  return key;
};

type SimpleStressClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function SimpleStressPage({ initialDocs }: SimpleStressClientProps) {
  const { locale } = useLocale();
  const methodNotes = getToolMethodNotes("simple-stress", locale);
  const [force, setForce] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const [material, setMaterial] = useState<string>(MATERIALS[0].key);

  const selectedMaterial = MATERIALS.find((m) => m.key === material) ?? MATERIALS[0];

  const stress = area > 0 ? force / area : 0;
  const safetyFactor = stress > 0 ? selectedMaterial.yieldStrength / stress : 0;

  let statusMessage = "";
  if (stress === 0) {
    statusMessage = t(locale, "Hesaplama için değer giriniz.", "Enter values to calculate.");
  } else if (safetyFactor >= 2) {
    statusMessage = t(locale, "Durum: Emniyette (n ≥ 2).", "Status: Safe (n ≥ 2).");
  } else if (safetyFactor >= 1.2) {
    statusMessage = t(locale, "Durum: Sınırda (1.2 ≤ n < 2).", "Status: Marginal (1.2 ≤ n < 2).");
  } else {
    statusMessage = t(locale, "Durum: Riskli (n < 1.2).", "Status: Risky (n < 1.2).");
  }

  return (
    <PageShell>
      <ToolDocTabs slug="simple-stress" initialDocs={initialDocs}>
        <main className="min-h-screen bg-[#E5E5E7] flex items-center justify-center px-4 py-10">
          <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h1 className="text-2xl font-bold text-[#2A2A2E] mb-3">
              {t(locale, "Basit Çekme Gerilmesi Hesaplayıcı", "Basic Tensile Stress Calculator")}
            </h1>

            <p className="text-sm text-gray-700 mb-4">
              {t(locale, "Kuvvet ve kesit alanıyla gerilmeyi hesapla, malzeme dayanımı ile karşılaştır.", "Calculate stress from force and cross-sectional area, then compare with material strength.")}
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="simple-stress-force" className="block text-sm font-medium text-gray-700 mb-1">
                  {t(locale, "Kuvvet (N)", "Force (N)")}
                </label>
                <input
                  id="simple-stress-force"
                  type="number"
                  className="w-full border p-2 rounded"
                  value={force}
                  onChange={(e) => setForce(Number(e.target.value))}
                  placeholder={t(locale, "ör. 5000", "e.g. 5000")}
                  aria-label={t(locale, "Kuvvet değeri", "Force value")}
                />
              </div>

              <div>
                <label htmlFor="simple-stress-area" className="block text-sm font-medium text-gray-700 mb-1">
                  {t(locale, "Kesit Alanı (mm²)", "Cross-sectional Area (mm²)")}
                </label>
                <input
                  id="simple-stress-area"
                  type="number"
                  className="w-full border p-2 rounded"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  placeholder={t(locale, "ör. 100", "e.g. 100")}
                  aria-label={t(locale, "Kesit alanı değeri", "Cross-sectional area value")}
                />
              </div>

              <div>
                <label htmlFor="simple-stress-material" className="block text-sm font-medium text-gray-700 mb-1">
                  {t(locale, "Malzeme", "Material")}
                </label>
                <select
                  id="simple-stress-material"
                  className="w-full border p-2 rounded"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  aria-label={t(locale, "Malzeme seçimi", "Material selection")}
                >
                  {MATERIALS.map((m) => (
                    <option key={m.key} value={m.key}>
                      {materialLabel(locale, m.key)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">{t(locale, "Sonuçlar", "Results")}</h2>

              <p className="text-sm mb-1">
                <strong>{t(locale, "Gerilme (σ): ", "Stress (σ): ")}</strong>
                {stress.toFixed(2)} MPa
              </p>

              <p className="text-sm mb-1">
                <strong>{t(locale, "Akma Dayanımı (Re): ", "Yield Strength (Re): ")}</strong>
                {selectedMaterial.yieldStrength} MPa
              </p>

              <p className="text-sm mb-3">
                <strong>{t(locale, "Emniyet Katsayısı (n): ", "Safety Factor (n): ")}</strong>
                {safetyFactor > 0 ? safetyFactor.toFixed(2) : "-"}
              </p>

              <p
                className={`text-sm font-semibold ${
                  safetyFactor >= 2 ? "text-green-600" : safetyFactor >= 1.2 ? "text-orange-500" : "text-red-600"
                }`}
              >
                {statusMessage}
              </p>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              {t(locale, "Not: Hesaplamalar teoriktir. Kritik tasarımlarda ilgili standartlara başvurulmalıdır.", "Note: Calculations are theoretical. Refer to relevant standards for critical designs.")}
            </p>
          </div>
        </main>
        {methodNotes ? <ToolMethodNotes notes={methodNotes} /> : null}
      </ToolDocTabs>
    </PageShell>
  );
}
