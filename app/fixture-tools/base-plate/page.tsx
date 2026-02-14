"use client";

// app/fixture-tools/base-plate/page.tsx
import { useState } from "react";
import PageShell from "@/components/layout/PageShell";
import { trackEvent } from "@/utils/analytics";

type Inputs = {
  length: string; // mm
  width: string; // mm
  partWeight: string; // kg
  density: string; // kg/m3
};

type Results = {
  thickness: number | null; // mm
  plateWeight: number | null; // kg
  note: string | null;
};

type StandardInputs = {
  reqLength: string; // mm
  reqWidth: string; // mm
  reqThickness: string; // mm
  allowanceXY: string; // mm per side
  allowanceZ: string; // mm total
  materialId: string;
};

type StandardPlate = {
  code: string;
  length: number;
  width: number;
  thickness: number;
  note?: string;
};

type MaterialOption = {
  id: string;
  label: string;
  density: number; // kg/m3
  defaultAllowanceXY: number; // mm per side
  defaultAllowanceZ: number; // mm total
};

type StandardResult = {
  plate: StandardPlate | null;
  orientedLength: number | null;
  orientedWidth: number | null;
  oversizeL: number | null;
  oversizeW: number | null;
  oversizeT: number | null;
  plateWeight: number | null; // kg
  note: string | null;
};

const DEFAULT_INPUTS: Inputs = {
  length: "500",
  width: "400",
  partWeight: "40",
  density: "7850",
};

const DEFAULT_STD_INPUTS: StandardInputs = {
  reqLength: "450",
  reqWidth: "320",
  reqThickness: "25",
  allowanceXY: "3",
  allowanceZ: "2",
  materialId: "s235",
};

const STANDARD_PLATES: StandardPlate[] = [
  { code: "300x250x20", length: 300, width: 250, thickness: 20, note: "Küçük jig / aparat" },
  { code: "400x300x25", length: 400, width: 300, thickness: 25 },
  { code: "500x400x25", length: 500, width: 400, thickness: 25 },
  { code: "500x400x30", length: 500, width: 400, thickness: 30 },
  { code: "600x400x30", length: 600, width: 400, thickness: 30 },
  { code: "600x500x32", length: 600, width: 500, thickness: 32 },
  { code: "700x500x36", length: 700, width: 500, thickness: 36 },
  { code: "800x500x40", length: 800, width: 500, thickness: 40 },
  { code: "800x600x45", length: 800, width: 600, thickness: 45 },
  { code: "900x600x50", length: 900, width: 600, thickness: 50 },
  { code: "1000x600x50", length: 1000, width: 600, thickness: 50, note: "Büyük tabla" },
];

const MATERIALS: MaterialOption[] = [
  { id: "s235", label: "S235 / S355 (yapısal)", density: 7850, defaultAllowanceXY: 3, defaultAllowanceZ: 2 },
  { id: "p20", label: "1.2311 / P20 (ön tavlı)", density: 7800, defaultAllowanceXY: 4, defaultAllowanceZ: 3 },
  { id: "c45", label: "1.1730 / C45U", density: 7850, defaultAllowanceXY: 3, defaultAllowanceZ: 2 },
  { id: "h13", label: "1.2344 / H13", density: 7800, defaultAllowanceXY: 4, defaultAllowanceZ: 3 },
  { id: "al", label: "Al 5083 / 6061", density: 2700, defaultAllowanceXY: 2, defaultAllowanceZ: 2 },
];

export default function BasePlatePage() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<Results>({
    thickness: null,
    plateWeight: null,
    note: null,
  });
  const [error, setError] = useState<string | null>(null);

  const [stdInputs, setStdInputs] = useState<StandardInputs>(DEFAULT_STD_INPUTS);
  const [stdResult, setStdResult] = useState<StandardResult>({
    plate: null,
    orientedLength: null,
    orientedWidth: null,
    oversizeL: null,
    oversizeW: null,
    oversizeT: null,
    plateWeight: null,
    note: null,
  });
  const [stdError, setStdError] = useState<string | null>(null);

  function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
  }

  function handleChange<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function handleStdChange<K extends keyof StandardInputs>(
    key: K,
    value: StandardInputs[K],
  ) {
    setStdInputs((prev) => {
      // Malzeme seçildiğinde tipik işleme payını otomatik öner
      if (key === "materialId") {
        const mat = MATERIALS.find((m) => m.id === value);
        if (mat) {
          return {
            ...prev,
            materialId: value,
            allowanceXY: mat.defaultAllowanceXY.toString(),
            allowanceZ: mat.defaultAllowanceZ.toString(),
          };
        }
      }
      return { ...prev, [key]: value };
    });
  }

  function handleCalculate() {
    const L = Number(inputs.length);
    const W = Number(inputs.width);
    const partW = Number(inputs.partWeight);
    const density = Number(inputs.density);

    if (!L || !W || L <= 0 || W <= 0) {
      setError("Uzunluk ve genişlik pozitif olmalı.");
      setResults({ thickness: null, plateWeight: null, note: null });
      return;
    }
    if (!partW || partW <= 0) {
      setError("Parça ağırlığı pozitif olmalı.");
      setResults({ thickness: null, plateWeight: null, note: null });
      return;
    }
    if (!density || density <= 0) {
      setError("Yoğunluk pozitif olmalı.");
      setResults({ thickness: null, plateWeight: null, note: null });
      return;
    }

      setError(null);
      trackEvent("calculate_click", { tool_id: "fixture-base-plate", tool_title: "Base Plate" });

    const span = Math.min(L, W);
    const tBase = 0.03 * span; // mm, kaba kural
    const loadFactor = clamp(0.6 + partW / 50, 0.8, 1.6); // ağır parça için kalınlaştırma
    const thickness = tBase * loadFactor;

    const volume_m3 = (L * W * thickness) / 1_000_000_000; // mm3 -> m3
    const plateWeight = volume_m3 * density; // kg

    let note = "Orta yüklü fikstür için yeterli kalınlıkta.";
    if (loadFactor > 1.4) {
      note = "Ağır parça: Kalınlığı artırın, kaburga veya alt takviye düşün.";
    } else if (thickness < 12) {
      note = "İnce plaka: Rijitlik için kaburga veya kenar kalınlaştırma ekle.";
    }

    setResults({
      thickness,
      plateWeight,
      note,
    });
  }

  function handleRecommendPlate() {
    const reqL = Number(stdInputs.reqLength);
    const reqW = Number(stdInputs.reqWidth);
    const reqT = Number(stdInputs.reqThickness);
    const allowXY = Number(stdInputs.allowanceXY);
    const allowZ = Number(stdInputs.allowanceZ);
    const material = MATERIALS.find((m) => m.id === stdInputs.materialId);

    if (!material) {
      setStdError("Malzeme seç.");
      setStdResult({
        plate: null,
        orientedLength: null,
        orientedWidth: null,
        oversizeL: null,
        oversizeW: null,
        oversizeT: null,
        plateWeight: null,
        note: null,
      });
      return;
    }

    if (!reqL || !reqW || !reqT || reqL <= 0 || reqW <= 0 || reqT <= 0) {
      setStdError("İstenen ölçüler pozitif olmalı.");
      setStdResult({
        plate: null,
        orientedLength: null,
        orientedWidth: null,
        oversizeL: null,
        oversizeW: null,
        oversizeT: null,
        plateWeight: null,
        note: null,
      });
      return;
    }
    if (allowXY < 0 || allowZ < 0) {
      setStdError("İşleme payları negatif olamaz.");
      setStdResult({
        plate: null,
        orientedLength: null,
        orientedWidth: null,
        oversizeL: null,
        oversizeW: null,
        oversizeT: null,
        plateWeight: null,
        note: null,
      });
      return;
    }

    setStdError(null);

    const needL = reqL + 2 * allowXY;
    const needW = reqW + 2 * allowXY;
    const needT = reqT + allowZ;

    const requiredVolume = needL * needW * needT;

    let best: {
      plate: StandardPlate;
      orientedL: number;
      orientedW: number;
      volDiff: number;
    } | null = null;

    for (const p of STANDARD_PLATES) {
      const fitsNormal = p.length >= needL && p.width >= needW;
      const fitsRot = p.length >= needW && p.width >= needL;

      if (!fitsNormal && !fitsRot) continue;

      const orientedL = fitsNormal ? p.length : p.width;
      const orientedW = fitsNormal ? p.width : p.length;
      const volDiff = orientedL * orientedW * p.thickness - requiredVolume;

      if (volDiff < 0) continue;

      if (!best || volDiff < best.volDiff) {
        best = { plate: p, orientedL, orientedW, volDiff };
      }
    }

    if (!best) {
      setStdResult({
        plate: null,
        orientedLength: null,
        orientedWidth: null,
        oversizeL: null,
        oversizeW: null,
        oversizeT: null,
        plateWeight: null,
        note: "Liste dışı: Daha büyük/özel plaka seç veya işleme payını düşür.",
      });
      return;
    }

    const oversizeL = best.orientedL - needL;
    const oversizeW = best.orientedW - needW;
    const oversizeT = best.plate.thickness - needT;

    const note = `Seçilen plaka ${best.plate.code}. Fazlalık: +${oversizeL.toFixed(
      1,
    )}mm / +${oversizeW.toFixed(1)}mm / +${oversizeT.toFixed(
      1,
    )}mm (L/W/T). İşleme payı için yeterli görünüyor.`;

    const volume_m3 =
      (best.plate.length * best.plate.width * best.plate.thickness) / 1_000_000_000;
    const plateWeight = volume_m3 * material.density;

    setStdResult({
      plate: best.plate,
      orientedLength: best.orientedL,
      orientedWidth: best.orientedW,
      oversizeL,
      oversizeW,
      oversizeT,
      plateWeight,
      note,
    });
  }

  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Taban Plaka
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-medium text-emerald-700">
            Beta
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Taban Plakası Boyutlandırma ve Not Kartı
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Fikstür taban plakasının kalınlığı, cıvata yerleşimi ve makine tablası
          uyumluluğu için hızlı bir hatırlatma kartı. Amaç: gereğinden ağır
          olmayan, rijitliği yeterli bir plaka ve güvenli bağlama noktaları.
        </p>
      </section>

      {/* Standart plaka seçimi (bitmiş ölçü + işleme payı) */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Standart plaka seçici (işleme paylı)
          </h2>
          <p className="mb-3 text-[11px] text-slate-600">
            Bitmiş parça ölçülerini ve işleme payını gir; tipik tedarik boylarından en küçük
            uyumlu plakayı ve malzemeye göre tahmini ağırlığı önerir.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                İstenen boy L [mm]
              </label>
              <input
                type="number"
                value={stdInputs.reqLength}
                onChange={(e) => handleStdChange("reqLength", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={1}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                İstenen en W [mm]
              </label>
              <input
                type="number"
                value={stdInputs.reqWidth}
                onChange={(e) => handleStdChange("reqWidth", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={1}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                İstenen kalınlık T [mm]
              </label>
              <input
                type="number"
                value={stdInputs.reqThickness}
                onChange={(e) => handleStdChange("reqThickness", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={1}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Malzeme
              </label>
              <select
                value={stdInputs.materialId}
                onChange={(e) => handleStdChange("materialId", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                {MATERIALS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500">
                Malzemeye göre işleme payı otomatik önerilir, dilersen değiştir.
              </p>
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                İşleme payı (X/Y) [mm/yan]
              </label>
              <input
                type="number"
                value={stdInputs.allowanceXY}
                onChange={(e) => handleStdChange("allowanceXY", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={0}
                step="0.5"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                İşleme payı (Z) [mm toplam]
              </label>
              <input
                type="number"
                value={stdInputs.allowanceZ}
                onChange={(e) => handleStdChange("allowanceZ", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={0}
                step="0.5"
              />
            </div>
          </div>
          {stdError && <p className="mt-2 text-[11px] text-red-600">{stdError}</p>}
          <button
            onClick={handleRecommendPlate}
            className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
          >
            Standart plaka öner
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Önerilen standart plaka
          </h3>
          <div className="space-y-2">
            <ResultRow
              label="Plaka kodu"
              value={stdResult.plate ? stdResult.plate.code : "—"}
            />
            <ResultRow
              label="Kaplayacağı boyut (L - W)"
              value={
                stdResult.orientedLength && stdResult.orientedWidth
                  ? `${stdResult.orientedLength} - ${stdResult.orientedWidth} mm`
                  : "—"
              }
            />
            <ResultRow
              label="Kalınlık"
              value={stdResult.plate ? `${stdResult.plate.thickness} mm` : "—"}
            />
            <ResultRow
              label="Fazlalık (L/W/T)"
              value={
                stdResult.oversizeL !== null &&
                stdResult.oversizeW !== null &&
                stdResult.oversizeT !== null
                  ? `+${stdResult.oversizeL.toFixed(1)} / +${stdResult.oversizeW.toFixed(
                      1,
                    )} / +${stdResult.oversizeT.toFixed(1)} mm`
                  : "—"
              }
            />
            <ResultRow
              label="Tahmini plaka ağırlığı"
              value={
                stdResult.plateWeight !== null
                  ? `${stdResult.plateWeight.toFixed(1)} kg`
                  : "—"
              }
            />
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              {stdResult.note ?? "Standart plaka önerisi burada görünecek."}
            </div>
            <p className="text-[11px] text-slate-500">
              Mantık: İstenen ölçü + işleme payı için en küçük uyumlu plakayı seçer.
              Gerekirse listeyi genişlet veya payları azalt.
            </p>
          </div>
        </div>
      </section>

      {/* Kalınlık ve ağırlık tahmini (kaba) */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Hızlı taban plakası hesaplayıcı
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Uzunluk L [mm]
              </label>
              <input
                type="number"
                value={inputs.length}
                onChange={(e) => handleChange("length", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={1}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Genişlik W [mm]
              </label>
              <input
                type="number"
                value={inputs.width}
                onChange={(e) => handleChange("width", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={1}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Parça ağırlığı [kg]
              </label>
              <input
                type="number"
                value={inputs.partWeight}
                onChange={(e) => handleChange("partWeight", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={1}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Malzeme yoğunluğu [kg/m3]
              </label>
              <input
                type="number"
                value={inputs.density}
                onChange={(e) => handleChange("density", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                min={1000}
              />
              <p className="text-[11px] text-slate-500">
                S235/S355 ~7850; alüminyum 6061 ~2700.
              </p>
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
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Sonuçlar</h3>
          <div className="space-y-2">
            <ResultRow
              label="Önerilen kalınlık"
              value={
                results.thickness !== null
                  ? `${results.thickness.toFixed(1)} mm`
                  : "—"
              }
            />
            <ResultRow
              label="Plaka tahmini ağırlığı"
              value={
                results.plateWeight !== null
                  ? `${results.plateWeight.toFixed(1)} kg`
                  : "—"
              }
            />
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
              {results.note ?? "Hesap sonrası kısa yorum burada görünecek."}
            </div>
            <p className="text-[11px] text-slate-500">
              Kural: t ~ 0.03 x min(L, W), ağır parça için 0.8-1.6 katsayısı.
              Sonuçlar hızlı tahmindir; FEA veya sapma hesabıyla doğrulayın.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Hızlı kalınlık ve malzeme kılavuzu
          </h2>
          <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
            <li>Malzeme: S235/S355 sac; yüksek rijitlik için 4140/42CrMo4 istenebilir.</li>
            <li>
              Kalınlık (kaba): <span className="font-semibold">t ~ 0.03 x en kısa kenar</span>
              (ör. 400 mm taban için ~12 mm). Ağır parçalar için 0.04x alın.
            </li>
            <li>Rijitlik iyileştirme: kaburgalı alt yapı veya lokal kalınlaştırma bölgeleri.</li>
            <li>Düzgünlük: mastar yüzey taşlama (örn. 0.05 mm/500 mm) + çapaksız kenarlar.</li>
            <li>Kaplama: Fosfat / siyah oksit veya hafif yağ koruması, tablaya temas yüzeyi temiz.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Makine tablası uyumluluğu
          </h3>
          <div className="space-y-2 text-[11px] text-slate-700">
            <p>
              T-slot ölçülerini çizimde belirt: ör. <span className="font-mono">18H7</span> kanal,
              <span className="font-mono">M16</span> T cıvatası, kanal merkezi aralığı <span className="font-mono">100 mm</span>.
            </p>
            <p>
              T kanal eksenlerini taban plaka sıfırına göre konumlandır; mümkünse simetri eksenine hizala.
            </p>
            <p>
              Rayba delik/pim yerlerini T-kanal dışına taşı; montaj sırasında pim ile tekrar konumlandır.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Cıvata yerleşimi için hızlı notlar
          </h3>
          <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
            <li>Çevre kenardan pay: min. 2.0x d; slot kenarına yaklaşma 1.5x d.</li>
            <li>Düzen: 3-4 noktada eşit dağılım; eksenel simetri sağla.</li>
            <li>Pimle: Konum için 2 pim (1 sabit, 1 kayan). Cıvata yalnızca sıkma için.</li>
            <li>Uzun delik: Isıl genleşme veya montaj toleransı için bir noktayı uzun delik yap.</li>
            <li>
              Sıkma torku: M16 (8.8) tipik 120-150 Nm; tabloya veya OEM değerine göre doğrula.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Kontrol listesi
          </h3>
          <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
            <li>Taban plakası, iş mili/işleme yüksekliği için çok mu kalın/ağır?</li>
            <li>Alt yüzey ve üst yüzey paralelliği toleransı verildi mi?</li>
            <li>T-slot koordinatları ve referans pimi ölçüleri çizimde net mi?</li>
            <li>Taşıma: Kaldırma deliği/halka veya forklift cebi var mı?</li>
            <li>Yüzey koruma ve kimlik (etiket/gravür) belirtildi mi?</li>
          </ul>
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
