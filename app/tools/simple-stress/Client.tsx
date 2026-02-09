"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import ToolMethodNotes from "@/components/tools/ToolMethodNotes";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { getToolMethodNotes } from "@/lib/tool-method-notes";
import { useLocale } from "@/components/i18n/LocaleProvider";

type MaterialInfo = {
  name: string;
  yieldStrength: number; // akma dayanımı (MPa)
};

const MATERIALS: MaterialInfo[] = [
  { name: "S235", yieldStrength: 235 },
  { name: "S355", yieldStrength: 355 },
  { name: "C45 (Islahlı ~ 600 MPa)", yieldStrength: 600 },
  { name: "50CrV4 (Islahlı ~ 1100 MPa)", yieldStrength: 1100 },
  { name: "Alüminyum 6013 (T6 ~ 300 MPa)", yieldStrength: 300 },
];

type SimpleStressClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function SimpleStressPage({ initialDocs }: SimpleStressClientProps) {
  const { locale } = useLocale();
  const methodNotes = getToolMethodNotes("simple-stress", locale);
  const [force, setForce] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const [material, setMaterial] = useState<string>(MATERIALS[0].name);

  const selectedMaterial = MATERIALS.find((m) => m.name === material)!;

  const stress = area > 0 ? force / area : 0; // MPa
  const safetyFactor = stress > 0 ? selectedMaterial.yieldStrength / stress : 0;

  let statusMessage = "";
  if (stress === 0) {
    statusMessage = "Hesaplama için değer giriniz.";
  } else if (safetyFactor >= 2) {
    statusMessage = "Durum: Emniyette (n ≥ 2).";
  } else if (safetyFactor >= 1.2) {
    statusMessage = "Durum: Sınırda (1.2 ≤ n < 2).";
  } else {
    statusMessage = "Durum: Riskli (n < 1.2).";
  }

  return (
    <PageShell>
      <ToolDocTabs slug="simple-stress" initialDocs={initialDocs}>
        <main className="min-h-screen bg-[#E5E5E7] flex items-center justify-center px-4 py-10">
          <div className="max-w-xl w-full bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-[#2A2A2E] mb-3">
          Basit Çekme Gerilmesi Hesaplayıcı
        </h1>

        <p className="text-sm text-gray-700 mb-4">
          Kuvvet ve kesit alanıyla gerilmeyi hesapla, malzeme dayanımı ile karşılaştır.
        </p>

        {/* INPUT ALANI */}
        <div className="space-y-4">
          {/* Kuvvet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kuvvet (N)
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={force}
              onChange={(e) => setForce(Number(e.target.value))}
              placeholder="ör. 5000"
            />
          </div>

          {/* Alan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kesit Alanı (mm²)
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              placeholder="ör. 100"
            />
          </div>

          {/* Malzeme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Malzeme
            </label>
            <select
              className="w-full border p-2 rounded"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              {MATERIALS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SONUÇLAR */}
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Sonuçlar</h2>

          <p className="text-sm mb-1">
            <strong>Gerilme (σ): </strong>
            {stress.toFixed(2)} MPa
          </p>

          <p className="text-sm mb-1">
            <strong>Akma Dayanımı (Re): </strong>
            {selectedMaterial.yieldStrength} MPa
          </p>

          <p className="text-sm mb-3">
            <strong>Emniyet Katsayısı (n): </strong>
            {safetyFactor > 0 ? safetyFactor.toFixed(2) : "-"}
          </p>

          <p
            className={`text-sm font-semibold ${
              safetyFactor >= 2
                ? "text-green-600"
                : safetyFactor >= 1.2
                ? "text-orange-500"
                : "text-red-600"
            }`}
          >
            {statusMessage}
          </p>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Not: Hesaplamalar teoriktir. Kritik tasarımlarda ilgili standartlara
          başvurulmalıdır.
        </p>
          </div>
        </main>
        {methodNotes ? <ToolMethodNotes notes={methodNotes} /> : null}
      </ToolDocTabs>
    </PageShell>
  );
}
