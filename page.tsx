"use client";

import React, { useState, useMemo } from "react";
import { goalSeek } from "@/components/community/goal-seek";

type Part = {
  id: string;
  name: string;
  nominal: number;
  tolerance: number; // +/- tolerans
  cp: number; // Süreç yeterliliği (Process Capability)
  sign: 1 | -1; // Montaj boşluğuna etkisi (+ veya -)
};

export default function ToleranceStackupPage() {
  const [parts, setParts] = useState<Part[]>([
    { id: "1", name: "Parça A", nominal: 50, tolerance: 0.1, cp: 1.0, sign: 1 },
    { id: "2", name: "Parça B", nominal: 30, tolerance: 0.05, cp: 1.33, sign: 1 },
    { id: "3", name: "Kasa (Boşluk)", nominal: 85, tolerance: 0.2, cp: 1.0, sign: -1 },
  ]);

  // Hedef Arama (Goal Seek) State'leri
  const [targetTolerance, setTargetTolerance] = useState<number>(0.25);
  const [targetPartId, setTargetPartId] = useState<string>("");
  const [optimizationMethod, setOptimizationMethod] = useState<"rss" | "worst-case">("rss");
  const [optimizedValue, setOptimizedValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dinamik Hesaplamalar
  const results = useMemo(() => {
    let nominalSum = 0;
    let worstCaseTol = 0;
    let varianceSum = 0; // RSS için varyans toplamı

    parts.forEach((p) => {
      nominalSum += p.nominal * p.sign;
      worstCaseTol += Math.abs(p.tolerance);
      
      // Cp değerine göre efektif standart sapmayı bul ve varyansa ekle
      // C_p = T / (3 * sigma) => sigma = T / (3 * C_p)
      const sigma = p.tolerance / (3 * p.cp);
      varianceSum += Math.pow(sigma, 2);
    });

    // Sistemin genel hedefinin Cp=1.0 (+/- 3 sigma) olduğunu varsayarak RSS hesapla
    const rssTol = 3 * Math.sqrt(varianceSum);

    return {
      nominalSum: Math.abs(nominalSum),
      worstCaseTol,
      rssTol,
    };
  }, [parts]);

  const handleAddPart = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setParts([...parts, { id: newId, name: `Yeni Parça`, nominal: 10, tolerance: 0.1, cp: 1.0, sign: 1 }]);
  };

  const handleUpdatePart = (id: string, field: keyof Part, value: string | number) => {
    setParts(parts.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleRemovePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
    if (targetPartId === id) setTargetPartId("");
  };

  const handleGoalSeek = () => {
    setError(null);
    setOptimizedValue(null);

    if (!targetPartId) {
      setError("Lütfen optimize edilecek parçayı seçin.");
      return;
    }

    const targetIndex = parts.findIndex((p) => p.id === targetPartId);
    if (targetIndex === -1) return;

    // Hedef arama motoruna gidecek matematiksel fonksiyon
    const calculationToOptimize = (x: number) => {
      const tempParts = [...parts];
      tempParts[targetIndex] = { ...tempParts[targetIndex], tolerance: x };

      if (optimizationMethod === "rss") {
        const vSum = tempParts.reduce((sum, p) => sum + Math.pow(p.tolerance / (3 * p.cp), 2), 0);
        return 3 * Math.sqrt(vSum);
      } else {
        return tempParts.reduce((sum, p) => sum + p.tolerance, 0);
      }
    };

    const currentTol = parts[targetIndex].tolerance || 0.1;
    // Tahminler: Mevcut tolerans ve %10 fazlası
    const result = goalSeek(calculationToOptimize, targetTolerance, currentTol, currentTol * 1.1);

    if (result !== null && !isNaN(result) && result >= 0) {
      setOptimizedValue(result);
    } else {
      setError("Bu hedef toleransa ulaşmak matematiksel olarak mümkün değil (Tolerans negatif olamaz).");
    }
  };

  const handleApplyOptimization = () => {
    if (optimizedValue !== null && targetPartId) {
      handleUpdatePart(targetPartId, "tolerance", optimizedValue);
      setOptimizedValue(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="mb-6 border-b pb-4">
        <div className="inline-flex items-center gap-2 mb-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
          Tasarım Optimizasyon Aracı
        </div>
        <h1 className="text-2xl font-bold text-slate-800">1D Tolerans Yığılma (Stack-up) Analizi</h1>
        <p className="text-sm text-slate-600 mt-1">Worst-Case ve RSS (İstatistiksel) yöntemleriyle montaj toleranslarını hesaplayın ve hedefinize ulaşmak için &quot;Goal Seek&quot; algoritmasını kullanın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL PANEL: Parça Listesi */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Parça Listesi</h3>
            <button onClick={handleAddPart} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800">
              + Parça Ekle
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-medium">
                <tr>
                  <th className="px-3 py-2">Yön</th>
                  <th className="px-3 py-2">Parça Adı</th>
                  <th className="px-3 py-2">Nominal</th>
                  <th className="px-3 py-2">Tolerans (±)</th>
                  <th className="px-3 py-2">Süreç (Cp)</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parts.map((part) => (
                  <tr key={part.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2">
                      <select value={part.sign} onChange={(e) => handleUpdatePart(part.id, "sign", Number(e.target.value))} className="w-12 border-slate-200 rounded p-1 text-xs">
                        <option value={1}>+</option>
                        <option value={-1}>-</option>
                      </select>
                    </td>
                    <td className="px-3 py-2"><input type="text" value={part.name} onChange={(e) => handleUpdatePart(part.id, "name", e.target.value)} className="w-full border-slate-200 rounded p-1" /></td>
                    <td className="px-3 py-2"><input type="number" value={part.nominal} onChange={(e) => handleUpdatePart(part.id, "nominal", Number(e.target.value))} className="w-20 border-slate-200 rounded p-1" /></td>
                    <td className="px-3 py-2"><input type="number" step="0.01" value={part.tolerance} onChange={(e) => handleUpdatePart(part.id, "tolerance", Number(e.target.value))} className="w-20 border-slate-200 rounded p-1" /></td>
                    <td className="px-3 py-2"><input type="number" step="0.01" value={part.cp} onChange={(e) => handleUpdatePart(part.id, "cp", Number(e.target.value))} className="w-16 border-slate-200 rounded p-1" title="1.0: Normal, 1.33: İyi, 1.67: Mükemmel" /></td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => handleRemovePart(part.id)} className="text-red-500 hover:text-red-700 p-1" title="Sil">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500">Not: Yön (+ / -) değerleri boşluğun (gap) oluşumundaki vektörel etkiyi belirler. Nominal toplamı etkiler, tolerans toplamını etkilemez.</p>
        </div>

        {/* SAĞ PANEL: Sonuçlar & Goal Seek */}
        <div className="space-y-6">
          
          {/* 1. Sonuç Paneli */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Yığılma Sonuçları</h3>
            
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Toplam Nominal (Boşluk)</div>
              <div className="text-xl font-bold text-slate-800">{results.nominalSum.toFixed(2)}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-2 rounded border border-rose-100">
                <div className="text-[10px] text-rose-500 font-bold uppercase">Worst-Case</div>
                <div className="text-lg font-bold text-rose-700">±{results.worstCaseTol.toFixed(3)}</div>
              </div>
              <div className="bg-white p-2 rounded border border-emerald-100">
                <div className="text-[10px] text-emerald-500 font-bold uppercase">RSS (İstatistiksel)</div>
                <div className="text-lg font-bold text-emerald-700">±{results.rssTol.toFixed(3)}</div>
              </div>
            </div>
          </div>

          {/* 2. Goal Seek Paneli */}
          <div className="bg-white border border-sky-200 rounded-xl p-4 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-sky-400"></div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-800">Hedef Arama (Tolerans Tahsisi)</h3>
              <p className="text-[11px] text-slate-500">Toplam montaj tolerans hedefine ulaşmak için bir parçanın toleransını optimize edin.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Hedef Yöntem</label>
                <select value={optimizationMethod} onChange={(e) => setOptimizationMethod(e.target.value as "rss" | "worst-case")} className="w-full border rounded p-1.5">
                  <option value="rss">RSS (İstatistiksel)</option>
                  <option value="worst-case">Worst-Case</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Hedef Tolerans (±)</label>
                <input type="number" step="0.01" value={targetTolerance} onChange={(e) => setTargetTolerance(Number(e.target.value))} className="w-full border rounded p-1.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-600 font-medium mb-1">Optimize Edilecek Parça (Bilinmeyen X)</label>
              <select value={targetPartId} onChange={(e) => setTargetPartId(e.target.value)} className="w-full border rounded p-1.5 text-xs mb-2">
                <option value="">-- Parça Seçin --</option>
                {parts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button onClick={handleGoalSeek} className="w-full bg-sky-600 text-white text-xs font-semibold py-2 rounded hover:bg-sky-700">
                Optimum Toleransı Bul
              </button>
            </div>

            {error && <div className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded">{error}</div>}
            
            {optimizedValue !== null && (
              <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2 rounded">
                <div>
                  <div className="text-[10px] text-emerald-600 font-semibold">GEREKEN TOLERANS:</div>
                  <div className="text-base font-bold text-emerald-800">±{optimizedValue.toFixed(4)}</div>
                </div>
                <button onClick={handleApplyOptimization} className="text-[10px] bg-emerald-600 text-white px-2 py-1 rounded shadow-sm hover:bg-emerald-700">Uygula</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}