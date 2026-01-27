// app/fixture-tools/clamping/page.tsx
"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import { trackEvent } from "@/utils/analytics";

type Inputs = {
  weightKg: string;
  safety: string;
  friction: string;
  clampCount: string;
};

type Result = {
  totalNormal: number | null; // N
  perClamp: number | null; // N
};

const DEFAULT_INPUTS: Inputs = {
  weightKg: "25",
  safety: "1.5",
  friction: "0.2",
  clampCount: "2",
};

const FRICTION_OPTIONS = [
  { value: "0.15", label: "Taşlanmış çelik / kuru (~0.15)" },
  { value: "0.2", label: "Freze / tornalanmış çelik (~0.20)" },
  { value: "0.25", label: "Ortalama temiz yüzey (~0.25)" },
  { value: "0.3", label: "Pürüzlü yüzey / kir (~0.30)" },
];

const CLAMP_NOTE_ROWS = [
  {
    id: 1,
    area: "Ön flange",
    reaction: "Dayama + pim üzerinde",
    risk: "Yerel ezilme, ince duvar",
  },
  {
    id: 2,
    area: "Arka taban",
    reaction: "Taban plakası üzerinde",
    risk: "Tork yönü, kayma",
  },
  {
    id: 3,
    area: "Yanal kulak",
    reaction: "Yanal dayama bloğu",
    risk: "Deformasyon, burulma",
  },
];

export default function ClampingPage() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<Result>({
    totalNormal: null,
    perClamp: null,
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function handleCalculate() {
    const weight = Number(inputs.weightKg);
    const safety = Number(inputs.safety);
    const mu = Number(inputs.friction);
    const clampCount = Number(inputs.clampCount);

    if (!weight || weight <= 0) {
      setError("Parça ağırlığı pozitif olmalı.");
      setResult({ totalNormal: null, perClamp: null });
      return;
    }
    if (!safety || safety < 1) {
      setError("Emniyet katsayısı 1 ve üzerinde olmalı.");
      setResult({ totalNormal: null, perClamp: null });
      return;
    }
    if (!mu || mu <= 0) {
      setError("Sürtünme katsayısı pozitif olmalı.");
      setResult({ totalNormal: null, perClamp: null });
      return;
    }
    if (!clampCount || clampCount < 1) {
      setError("Kıskaç sayısı en az 1 olmalı.");
      setResult({ totalNormal: null, perClamp: null });
      return;
    }

    setError(null);
    trackEvent("calculate_click", { tool_id: "fixture-clamping", tool_title: "Clamping Force" });

    const g = 9.81; // m/s2
    const totalNormal = (weight * g * safety) / mu; // N
    const perClamp = totalNormal / clampCount; // N

    setResult({ totalNormal, perClamp });
  }

  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Clamping
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-medium text-emerald-700">
            Beta
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Sıkma / Bağlama Planlama Kartı
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Parçanın nereden sıkılacağını, reaksiyon noktalarını ve kıskaç sayısını
          belirlemek için hafif bir hesap + kontrol listesi. Amaç:
          kuvvet yolunu netleştirmek, kayma ve deformasyon riskini düşürmek.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Hızlı kıskaç kuvveti tahmini
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Parça ağırlığı [kg]
              </label>
              <input
                type="number"
                value={inputs.weightKg}
                onChange={(e) => handleChange("weightKg", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={0}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Emniyet katsayısı
              </label>
              <input
                type="number"
                value={inputs.safety}
                onChange={(e) => handleChange("safety", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                step="0.1"
                min={1}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Sürtünme katsayısı (µ tahmin)
              </label>
              <select
                value={inputs.friction}
                onChange={(e) => handleChange("friction", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                {FRICTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Kıskaç sayısı
              </label>
              <input
                type="number"
                value={inputs.clampCount}
                onChange={(e) => handleChange("clampCount", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={1}
              />
            </div>
          </div>

          {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}

          <button
            onClick={handleCalculate}
            className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
          >
            Hesapla
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Sonuçlar
          </h3>
          <div className="space-y-2">
            <ResultRow
              label="Toplam gereken normal kuvvet"
              value={
                result.totalNormal !== null
                  ? `${(result.totalNormal / 1000).toFixed(2)} kN`
                  : "—"
              }
            />
            <ResultRow
              label="Kıskaç başına normal kuvvet"
              value={
                result.perClamp !== null
                  ? `${(result.perClamp / 1000).toFixed(2)} kN`
                  : "—"
              }
            />
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
              Not: Basit sürtünme tahmini (W*g*SF/µ). Düşey yönelimli
              işlemlerde ek emniyet payı ve emniyetli durdurma mekanizması
              (stopper, pim, yan dayama) ekleyin.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          Kontrol listesi (kuvvet yolu + emniyet)
        </h2>
        <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
          <li>Reaksiyon yüzeyi: Kıskaç altında rijit ve yeterince geniş mi?</li>
          <li>Kuvvet yolu: Kıskaç → parça → dayama / pim hattı net mi?</li>
          <li>Kayma riski: Yanal dayama / pim var mı, sürtünme yeterli mi?</li>
          <li>Deformasyon: İnce duvar / flange bölgesi baskı ile esner mi?</li>
          <li>Operatör: Erişim, sıkma sırası ve tork kontrolü düşünüldü mü?</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Kıskaç noktaları not kartı
            </h2>
            <p className="text-[11px] text-slate-600">
              Kritik bölgeleri ve muhtemel riskleri küçük bir tabloda topla.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-700">
            Taslak
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-[11px]">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-semibold">Bölge</th>
                <th className="px-3 py-2 font-semibold">Reaksiyon / Dayama</th>
                <th className="px-3 py-2 font-semibold">Risk / Not</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
              {CLAMP_NOTE_ROWS.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-2">{row.area}</td>
                  <td className="px-3 py-2">{row.reaction}</td>
                  <td className="px-3 py-2 text-slate-700">{row.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5">
      <span className="text-[11px] text-slate-600">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}
