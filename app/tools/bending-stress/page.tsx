// app/tools/bending-stress/page.tsx
"use client";

import { useState, FormEvent } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import { trackEvent } from "@/utils/analytics";

type CrossSectionType = "rect" | "circle";

type Inputs = {
  beamLengthMm: string;      // kiriş boyu [mm]
  forcekN: string;           // ortadaki tekil yük [kN]
  sectionType: CrossSectionType;
  widthMm: string;           // dikdörtgen b [mm] veya daire d [mm]
  heightMm: string;          // dikdörtgen h [mm] (daire için boş bırakılabilir)
  youngModulus: string;      // E [MPa]
  yieldStrength: string;     // Re / Rp0.2 [MPa]
};

type Results = {
  maxMoment: number | null;      // Mmax [N·mm]
  sectionModulus: number | null; // W [mm³]
  inertia: number | null;        // I [mm⁴]
  sigma: number | null;          // σ [MPa]
  deflection: number | null;     // δ [mm]
  safety: number | null;         // S [-]
  beamLengthMm: number | null;   // L [mm] (tasarım notları için)
};

const DEFAULT_INPUTS: Inputs = {
  beamLengthMm: "500",      // 500 mm
  forcekN: "2",             // 2 kN
  sectionType: "rect",
  widthMm: "40",            // 40 mm
  heightMm: "8",            // 8 mm
  youngModulus: "210000",   // Çelik için ~210000 MPa
  yieldStrength: "355",     // Örn. S355
};

export default function BendingStressPage() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<Results>({
    maxMoment: null,
    sectionModulus: null,
    inertia: null,
    sigma: null,
    deflection: null,
    safety: null,
    beamLengthMm: null,
  });
  const [error, setError] = useState<string | null>(null);

  function handleChange<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Girdileri sayıya çevir
    const L = Number(inputs.beamLengthMm);   // [mm]
    const FkN = Number(inputs.forcekN);      // [kN]
    const b = Number(inputs.widthMm);       // [mm]
    const h = inputs.sectionType === "rect" ? Number(inputs.heightMm) : NaN;
    const d = inputs.sectionType === "circle" ? Number(inputs.widthMm) : NaN;
    const E = Number(inputs.youngModulus);   // [MPa]
    const Re = Number(inputs.yieldStrength); // [MPa]

    // Basit kontroller
    if (!L || L <= 0) {
      setError("Kiriş boyunu (L) pozitif bir değer olarak giriniz.");
      resetResults();
      return;
    }

    if (!FkN || FkN <= 0) {
      setError("Kiriş üzerindeki yükü (F) pozitif bir değer olarak giriniz.");
      resetResults();
      return;
    }

    if (inputs.sectionType === "rect") {
      if (!b || !h || b <= 0 || h <= 0) {
        setError("Dikdörtgen kesit için b ve h değerlerini pozitif giriniz.");
        resetResults();
        return;
      }
    } else {
      if (!d || d <= 0) {
        setError("Daire kesit için çap (d) değerini pozitif giriniz.");
        resetResults();
        return;
      }
    }

    if (!E || E <= 0) {
      setError("Elastisite modülü E (MPa) pozitif olmalıdır.");
      resetResults();
      return;
    }

    if (!Re || Re <= 0) {
      setError("Akma dayanımı Re (MPa) pozitif olmalıdır.");
      resetResults();
      return;
    }

    trackEvent("calculate_click", { tool_id: "bending-stress", tool_title: "Bending Stress" });
    // Hesaplar
    // F [kN] -> [N]
    const F = FkN * 1000; // [N]

    // Basit mesnetli kiriş, ortada tekil yük:
    // Mmax = F * L / 4  (L: mm, F: N) -> N·mm
    const Mmax = (F * L) / 4;

    let I: number;
    let W: number;

    if (inputs.sectionType === "rect") {
      // Dikdörtgen kesit: b (genişlik), h (yükseklik)
      // I = b * h^3 / 12
      // W = I / (h/2) = b * h^2 / 6
      I = (b * Math.pow(h, 3)) / 12;
      W = (b * Math.pow(h, 2)) / 6;
    } else {
      // Daire kesit: d (çap)
      // I = π * d^4 / 64
      // W = I / (d/2) = π * d^3 / 32
      I = (Math.PI * Math.pow(d, 4)) / 64;
      W = (Math.PI * Math.pow(d, 3)) / 32;
    }

    // Eğilme gerilmesi:
    // σ = M / W  (N·mm / mm^3 = N/mm^2 = MPa)
    const sigma = Mmax / W; // [MPa]

    // Sehim (basit mesnetli, ortada yük):
    // δmax = F * L^3 / (48 * E * I)
    // F [N], L [mm], E [MPa = N/mm^2], I [mm^4] -> δ [mm]
    const deflection = (F * Math.pow(L, 3)) / (48 * E * I); // [mm]

    // Emniyet katsayısı:
    // S = Re / σ
    const safety = Re / sigma;

    setResults({
      maxMoment: Mmax,
      sectionModulus: W,
      inertia: I,
      sigma,
      deflection,
      safety,
      beamLengthMm: L,
    });
  }

  function resetResults() {
    setResults({
      maxMoment: null,
      sectionModulus: null,
      inertia: null,
      sigma: null,
      deflection: null,
      safety: null,
      beamLengthMm: null,
    });
  }

  return (
    <PageShell>
      <ToolDocTabs slug="bending-stress">
      {/* Başlık ve açıklama */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Mekanik Hesaplayıcı
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
            Eğilme Gerilmesi &amp; Sehim
          </span>
        </div>

        <h1 className="text-lg font-semibold text-slate-900">
          Basit Mesnetli Kiriş – Eğilme Gerilmesi ve Sehim Hesaplayıcı
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Basit mesnetli, ortasında tekil yük bulunan bir kiriş için eğilme
          momenti, kesit modülü, eğilme gerilmesi ve sehim hesabı yapar.
          Dikdörtgen veya dairesel kesit seçenekleri sunar. Değerler pratik
          mühendislik için yaklaşık olarak hesaplanmıştır.
        </p>
      </section>

      {/* Form + Sonuç + Tasarım Notları + Grafik */}
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1.1fr)]">
        {/* Sol panel: giriş formu */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Giriş Parametreleri
          </h2>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Kiriş ve yük */}
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Kiriş boyu L [mm]
                </label>
                <input
                  type="number"
                  value={inputs.beamLengthMm}
                  onChange={(e) => handleChange("beamLengthMm", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  placeholder="Örn. 500"
                  min={1}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Ortadaki yük F [kN]
                </label>
                <input
                  type="number"
                  value={inputs.forcekN}
                  onChange={(e) => handleChange("forcekN", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  placeholder="Örn. 2"
                  step="0.1"
                  min={0}
                />
              </div>
            </div>

            {/* Kesit tipi seçimi */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Kesit tipi
              </label>
              <div className="inline-flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChange("sectionType", "rect")}
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    inputs.sectionType === "rect"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  Dikdörtgen
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("sectionType", "circle")}
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    inputs.sectionType === "circle"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  Dairesel
                </button>
              </div>
            </div>

            {/* Kesit ölçüleri */}
            {inputs.sectionType === "rect" ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Genişlik b [mm]
                  </label>
                  <input
                    type="number"
                    value={inputs.widthMm}
                    onChange={(e) => handleChange("widthMm", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder="Örn. 40"
                    min={0}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Yükseklik h [mm]
                  </label>
                  <input
                    type="number"
                    value={inputs.heightMm}
                    onChange={(e) => handleChange("heightMm", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder="Örn. 8"
                    min={0}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Çap d [mm]
                </label>
                <input
                  type="number"
                  value={inputs.widthMm}
                  onChange={(e) => handleChange("widthMm", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  placeholder="Örn. 20"
                  min={0}
                />
              </div>
            )}

            {/* Malzeme bilgisi */}
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Elastisite modülü E [MPa]
                </label>
                <input
                  type="number"
                  value={inputs.youngModulus}
                  onChange={(e) =>
                    handleChange("youngModulus", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  placeholder="Çelik için ~210000"
                  min={0}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Akma dayanımı Re [MPa]
                </label>
                <input
                  type="number"
                  value={inputs.yieldStrength}
                  onChange={(e) =>
                    handleChange("yieldStrength", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  placeholder="Örn. 355"
                  min={0}
                />
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
            >
              Hesapla
            </button>
          </form>
        </div>

        {/* Sağ panel: sonuçlar + tasarım notları + grafik */}
        <div className="space-y-4">
          {/* Sonuçlar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Hesap Sonuçları
            </h2>

            <div className="space-y-2">
              <ResultRow
                label="Maksimum eğilme momenti Mₘₐₓ"
                value={
                  results.maxMoment !== null
                    ? `${(results.maxMoment / 1e6).toFixed(3)} kN·m`
                    : "–"
                }
              />
              <ResultRow
                label="Atalet momenti I"
                value={
                  results.inertia !== null
                    ? `${results.inertia.toExponential(3)} mm⁴`
                    : "–"
                }
              />
              <ResultRow
                label="Kesit modülü W"
                value={
                  results.sectionModulus !== null
                    ? `${results.sectionModulus.toExponential(3)} mm³`
                    : "–"
                }
              />
              <ResultRow
                label="Maksimum eğilme gerilmesi σ"
                value={
                  results.sigma !== null
                    ? `${results.sigma.toFixed(0)} MPa`
                    : "–"
                }
              />
              <ResultRow
                label="Maksimum sehim δ"
                value={
                  results.deflection !== null
                    ? `${results.deflection.toFixed(2)} mm`
                    : "–"
                }
              />
              <ResultRow
                label="Emniyet katsayısı S"
                value={
                  results.safety !== null
                    ? results.safety.toFixed(2)
                    : "–"
                }
              />
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              Formüller basit mesnetli, ortada tekil yük uygulanan kiriş için
              geçerlidir. Kesit, homojen ve doğrusal elastik kabul edilmiştir.
              Kritik tasarım durumlarında detaylı gerilme analizi ve ilgili
              standartlar mutlaka kontrol edilmelidir.
            </p>
          </div>

          {/* Emniyetli tasarım notları */}
          <DesignNotes results={results} />

          {/* Eğilme moment diyagramı – basit grafik */}
          <MomentDiagram results={results} />
        </div>
      </section>
          </ToolDocTabs>
    </PageShell>
  );
}

/* ---------------------- Yardımcı UI bileşenleri ---------------------- */

type ResultRowProps = {
  label: string;
  value: string;
};

function ResultRow({ label, value }: ResultRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5">
      <span className="text-[11px] text-slate-600">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}

type DesignNotesProps = {
  results: Results;
};

function DesignNotes({ results }: DesignNotesProps) {
  const { safety, deflection, beamLengthMm, sigma } = results;

  if (safety === null || sigma === null) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-600 shadow-sm">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">
          Emniyetli Tasarım Notları
        </h3>
        <p>
          Önce sağdaki formu doldurup <strong>Hesapla</strong> düğmesine
          basın. Sonuçlara göre buradaki yorumlar otomatik güncellenecektir.
        </p>
      </div>
    );
  }

  // Emniyet katsayısı yorumu
  let safetyLabel = "";
  let safetyColor =
    "bg-emerald-50 text-emerald-800 border-emerald-200";

  if (safety < 1) {
    safetyLabel = "Güvensiz – akma beklenir.";
    safetyColor = "bg-red-50 text-red-800 border-red-200";
  } else if (safety < 1.3) {
    safetyLabel =
      "Çok düşük emniyet. İmalat toleransları ve yük belirsizlikleri ile riskli.";
    safetyColor = "bg-orange-50 text-orange-800 border-orange-200";
  } else if (safety < 1.5) {
    safetyLabel =
      "Düşük emniyet. Prototip / test parçası için tolere edilebilir, seri için dikkat.";
    safetyColor = "bg-amber-50 text-amber-800 border-amber-200";
  } else if (safety < 2) {
    safetyLabel =
      "Tipik statik çelik konstrüksiyon için makul emniyet seviyesi.";
    safetyColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else if (safety < 3) {
    safetyLabel =
      "Konforlu emniyet seviyesi. Yorulma ve darbe etkileri için daha rahattır.";
    safetyColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else {
    safetyLabel =
      "Çok yüksek emniyet. Ağırlık optimizasyonu / maliyet azaltma için kesit azaltılması değerlendirilebilir.";
    safetyColor = "bg-slate-50 text-slate-800 border-slate-200";
  }

  // Sehim kriteri (basit kontrol)
  let deflectionText = "Sehim bilgisi mevcut değil.";
  if (deflection !== null && beamLengthMm !== null && beamLengthMm > 0) {
    const ratio = deflection > 0 ? beamLengthMm / deflection : Infinity; // L/δ
    deflectionText = `Sehim oranı yaklaşık L/δ ≈ ${ratio.toFixed(
      0,
    )}.`;

    if (ratio < 150) {
      deflectionText +=
        " Bu değer oldukça esnek bir yapı gösterir (L/150'den küçük). Konfor ve hizalama açısından sorun yaratabilir.";
    } else if (ratio < 250) {
      deflectionText +=
        " Bu aralık birçok genel uygulamada sınırda kabul edilir (yaklaşık L/150–L/250). Hassas uygulamalarda kontrol edilmelidir.";
    } else if (ratio < 400) {
      deflectionText +=
        " Çoğu makine parçası için kabul edilebilir bir sehim seviyesi (L/250–L/400 arası).";
    } else {
      deflectionText +=
        " Sehim açısından oldukça rijit bir yapı (L/400 ve üzeri).";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[11px] shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">
        Emniyetli Tasarım Notları
      </h3>

      {/* Emniyet etiketi */}
      <div
        className={`mb-2 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold ${safetyColor}`}
      >
        <span className="mr-1">S ≈ {safety.toFixed(2)}</span>
        <span>— {safetyLabel}</span>
      </div>

      <ul className="list-disc space-y-1 pl-4 text-slate-700">
        <li>
          Hesaplanan maksimum eğilme gerilmesi σ ≈{" "}
          <strong>{sigma.toFixed(0)} MPa</strong> seviyesindedir. Bu değer,
          malzemenin akma dayanımı ile karşılaştırılarak emniyet katsayısı
          hesaplanmıştır.
        </li>
        <li>{deflectionText}</li>
        <li>
          Tasarım yorulma / dinamik yükler içeriyorsa, sadece statik emniyet
          katsayısı yeterli değildir. Yorulma limitleri ve gerilme
          konsantrasyonları ayrıca değerlendirilmelidir.
        </li>
        <li>
          Bağlantı bölgeleri, kaynak kökleri, kesit değişimleri gibi noktalarda
          lokal gerilme artışları oluşabilir. Bu hesap, nominal kesit için
          yaklaşık değer sağlar.
        </li>
      </ul>
    </div>
  );
}

type MomentDiagramProps = {
  results: Results;
};

function MomentDiagram({ results }: MomentDiagramProps) {
  const { maxMoment } = results;

  // Sonuç yoksa sadece açıklama göster
  if (maxMoment === null || maxMoment <= 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-600 shadow-sm">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">
          Eğilme Moment Diyagramı
        </h3>
        <p>
          Bu bölüm, basit mesnetli kiriş için ortada tekil yük altında{" "}
          <strong>M(x)</strong> dağılımını gösteren şematik bir diyagramdır.
          Formu doldurup <strong>Hesapla</strong> dediğinizde moment diyagramı
          görsel olarak gösterilir. Maksimum moment kiriş ortasında oluşur.
        </p>
      </div>
    );
  }

  // SVG için basit normalize edilmiş üçgen diyagram (0 → L/2 → L)
  const width = 260;
  const height = 90;
  const paddingX = 20;
  const paddingY = 10;

  // 0–1 arası normalize x, üçgen dağılım: 0→1 (ortada)→0
  const points: { x: number; y: number }[] = [];
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const t = i / n; // 0..1
    const yNorm = t <= 0.5 ? 2 * t : 2 * (1 - t); // 0..1
    points.push({ x: t, y: yNorm });
  }

  const pathD =
    points
      .map((p, idx) => {
        const x = paddingX + p.x * (width - 2 * paddingX);
        // SVG'de yukarı negatif, bu yüzden 1 - y
        const y =
          height - paddingY - p.y * (height - 2 * paddingY);
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ") + " ";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[11px] shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">
        Eğilme Moment Diyagramı (Şematik)
      </h3>
      <svg width={width} height={height} className="mb-2">
        {/* Eksen çizgisi */}
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          className="stroke-slate-300"
          strokeWidth={1}
        />
        {/* Moment diyagramı */}
        <path
          d={pathD}
          className="stroke-slate-900 fill-slate-100"
          strokeWidth={2}
        />
        {/* Mesnet noktaları */}
        <circle
          cx={paddingX}
          cy={height - paddingY}
          r={3}
          className="fill-slate-700"
        />
        <circle
          cx={width - paddingX}
          cy={height - paddingY}
          r={3}
          className="fill-slate-700"
        />
        {/* Yük oku (ortada) */}
        <line
          x1={width / 2}
          y1={paddingY}
          x2={width / 2}
          y2={paddingY + 18}
          className="stroke-red-500"
          strokeWidth={2}
        />
        <polygon
          points={`${width / 2 - 4},${paddingY + 18} ${
            width / 2 + 4
          },${paddingY + 18} ${width / 2},${paddingY + 24}`}
          className="fill-red-500"
        />
      </svg>
      <p className="text-slate-600">
        Diyagram, kiriş boyunca eğilme momentinin sıfırdan ortada{" "}
        <strong>Mₘₐₓ ≈ {(maxMoment / 1e6).toFixed(3)} kN·m</strong> değerine
        çıkıp tekrar sıfıra düştüğünü gösterir. Grafik ölçeği normalize
        edilmiştir; amaç moment dağılımının şeklini görselleştirmektir.
      </p>
    </div>
  );
}


