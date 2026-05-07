"use client";

import React, { useState } from "react";
import { goalSeek } from "@/components/community/goal-seek";
import { evaluateFormula } from "@/lib/sanityCheck/engine";
import type { LabSession } from "@/lib/sanityCheck/types";

export default function SanityCheckPanel() {
  const [baseFormula, setBaseFormula] = useState("x * 5 / 2"); // Örnek bir formül şablonu
  const [targetResult, setTargetResult] = useState<number>(100);
  const [optimizedValue, setOptimizedValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoalSeek = () => {
    setError(null);
    setOptimizedValue(null);

    // 1. Çözümlenecek Matematiksel Fonksiyonu Tanımlıyoruz (Goal Seek'e gidecek)
    const calculationToOptimize = (x: number) => {
      try {
        // eval() yerine projedeki güvenli ve gerçek hesaplama motorunu (evaluateFormula) kullanıyoruz.
        const tempSession = {
          variables: [{ id: "var-x", symbol: "x", value: x, name: "Optimize Edilen", min: 0, max: 0, unit: "" }],
          formula: baseFormula,
          expectedUnit: "",
          sweep: { variableId: "var-x", points: 10 },
          monteCarlo: { iterations: 10 },
        } as LabSession;

        const engineResult = evaluateFormula(tempSession);
        if (engineResult.error || engineResult.value === null) return NaN;
        return engineResult.value;
      } catch {
        return NaN;
      }
    };

    // 2. Goal Seek (Hedef Arama) Motorunu Çalıştır
    const result = goalSeek(calculationToOptimize, targetResult, 1, 2); // 1 ve 2 başlangıç tahminleri

    // 3. Sonucu Ekrana Yansıt
    if (result !== null && !isNaN(result)) {
      setOptimizedValue(result);
    } else {
      setError("Hedef değere ulaşılamadı. Formül doğrusal olmayabilir veya iterasyon limitine ulaşıldı.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-5 border border-slate-200 rounded-xl bg-white shadow-sm mt-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">BETA Motoru</span>
        <h2 className="text-lg font-bold text-slate-800">Hedef Arama (Goal Seek)</h2>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Formül çıktısının belirlediğiniz değere ulaşması için gerekli &apos;x&apos; değişkenini otomatik optimize edin.
      </p>

      <div className="space-y-5 bg-slate-50 p-4 rounded-lg border border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Çözümlenecek Formül (x içeren)</label>
          <input
            type="text"
            value={baseFormula}
            onChange={(e) => setBaseFormula(e.target.value)}
            className="w-full font-mono text-sm border rounded-md px-3 py-2 text-slate-700 focus:ring-2 focus:ring-sky-500 outline-none"
            placeholder="Örn: x * 5 / 2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Hedeflenen Sonuç</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={targetResult}
              onChange={(e) => setTargetResult(Number(e.target.value))}
              className="w-32 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            />
            <button
              onClick={handleGoalSeek}
              className="bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-700 transition"
            >
              Çöz (Optimize Et)
            </button>
          </div>
        </div>
      </div>

      {/* HEDEF ARAMA SONUCU */}
      {error && <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>}
      
      {optimizedValue !== null && (
        <div className="mt-4 p-4 border border-emerald-200 bg-emerald-50 rounded-lg flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm text-emerald-800">Hedefe ({targetResult}) ulaşmak için gereken optimum X değeri:</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">x = {optimizedValue.toFixed(4)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
