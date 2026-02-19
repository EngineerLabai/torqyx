"use client";

import { useEffect, useMemo, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import type { Locale } from "@/utils/locale";

type ThreadSeries = "coarse" | "fine";

type ThreadSpec = {
  label: string;
  nominal: number;
  coarse: number;
  fine: number[];
  clearance: {
    close: number;
    normal: number;
    loose: number;
  };
};

type EngagementGuideRow = {
  material: Record<Locale, string>;
  recommendation: string;
  note: Record<Locale, string>;
};

const THREAD_SPECS: ThreadSpec[] = [
  { label: "M3", nominal: 3, coarse: 0.5, fine: [0.35], clearance: { close: 3.2, normal: 3.4, loose: 3.6 } },
  { label: "M4", nominal: 4, coarse: 0.7, fine: [0.5], clearance: { close: 4.3, normal: 4.5, loose: 4.8 } },
  { label: "M5", nominal: 5, coarse: 0.8, fine: [0.5], clearance: { close: 5.3, normal: 5.5, loose: 5.8 } },
  { label: "M6", nominal: 6, coarse: 1.0, fine: [0.75], clearance: { close: 6.4, normal: 6.6, loose: 7.0 } },
  { label: "M8", nominal: 8, coarse: 1.25, fine: [1.0], clearance: { close: 8.4, normal: 9.0, loose: 10.0 } },
  { label: "M10", nominal: 10, coarse: 1.5, fine: [1.25, 1.0], clearance: { close: 10.5, normal: 11.0, loose: 12.0 } },
  { label: "M12", nominal: 12, coarse: 1.75, fine: [1.5, 1.25], clearance: { close: 13.0, normal: 13.5, loose: 14.5 } },
  { label: "M16", nominal: 16, coarse: 2.0, fine: [1.5], clearance: { close: 17.0, normal: 18.0, loose: 19.0 } },
  { label: "M20", nominal: 20, coarse: 2.5, fine: [2.0, 1.5], clearance: { close: 21.0, normal: 22.0, loose: 24.0 } },
  { label: "M24", nominal: 24, coarse: 3.0, fine: [2.0], clearance: { close: 25.0, normal: 26.0, loose: 28.0 } },
];

const ENGAGEMENT_GUIDE: EngagementGuideRow[] = [
  {
    material: { tr: "Çelik gövde", en: "Steel base material" },
    recommendation: "1.0 x D",
    note: {
      tr: "Standart makine elemanlarında başlangıç kabulü.",
      en: "Typical starting point for general machine design.",
    },
  },
  {
    material: { tr: "Dökme demir (EN-GJL / EN-GJS)", en: "Cast iron (EN-GJL / EN-GJS)" },
    recommendation: "1.2 x D",
    note: {
      tr: "Kırılgan yapı nedeniyle güvenlik payı bırakılır.",
      en: "Slightly longer engagement helps brittle base materials.",
    },
  },
  {
    material: { tr: "Alüminyum alaşım", en: "Aluminum alloy" },
    recommendation: "1.5 x D",
    note: {
      tr: "Düşük akma dayanımı nedeniyle daha uzun diş önerilir.",
      en: "Longer thread reduces stripping risk in softer alloys.",
    },
  },
  {
    material: { tr: "Pirinç / Bronz", en: "Brass / Bronze" },
    recommendation: "1.2-1.5 x D",
    note: {
      tr: "Aşınma ve sök-tak döngüsüne göre üst sınır tercih edilir.",
      en: "Use upper range for frequent assembly/disassembly.",
    },
  },
  {
    material: { tr: "Plastik (PA6, POM vb.)", en: "Plastics (PA6, POM, etc.)" },
    recommendation: "2.0 x D + insert",
    note: {
      tr: "Mümkünse metal insert ile uzun ömür sağlanır.",
      en: "Prefer metal threaded inserts for durability.",
    },
  },
];

const COPY: Record<Locale, {
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  overview: {
    coarseTitle: string;
    coarseBody: string;
    coarseBullets: string[];
    fineTitle: string;
    fineBody: string;
    fineBullets: string[];
  };
  pitch: { title: string; description: string; columns: string[] };
  mini: {
    label: string;
    title: string;
    description: string;
    sizeLabel: string;
    seriesLabel: string;
    coarse: string;
    fine: string;
    pitchLabel: string;
    engagementLabel: string;
    drillLabel: string;
    drillGuidance: string;
    hardMaterialLabel: string;
    calloutLabel: string;
    copy: string;
    copied: string;
    copyFailed: string;
    formulaTitle: string;
    formula: string;
    formulaNote: string;
  };
  clearance: { title: string; description: string; columns: string[] };
  engagement: { title: string; description: string; columns: string[] };
  iso: { title: string; notes: string[] };
  references: { title: string; items: string[] };
}> = {
  tr: {
    hero: {
      title: "Metrik dişler: pratik standart özeti",
      description:
        "Coarse/fine seçim notları, hızlı tap drill hesabı ve montajda işe yarayan kısa tablolar.",
      eyebrow: "Standards",
      imageAlt: "Metric threads engineering reference",
    },
    overview: {
      coarseTitle: "Coarse (standart hatve)",
      coarseBody: "Genel montaj için varsayılan seçenektir, üretimde daha toleranslıdır.",
      coarseBullets: [
        "Hatve yazılmamışsa (ör. M10) coarse kabul edilir.",
        "Saha montajında kir ve hasara karşı daha dayanıklıdır.",
        "Titreşimli uygulamalarda kilitleme elemanı ile kullanılmalıdır.",
      ],
      fineTitle: "Fine (ince hatve)",
      fineBody: "Aynı çapta daha fazla diş adımı sağlar ve hassas ayara uygundur.",
      fineBullets: [
        "İnce cidarlı parçalarda daha kontrollü sıkma sağlar.",
        "Daha yüksek eksenel ayar hassasiyeti sunar.",
        "Kirlenmeye ve çapak etkisine coarse seriye göre daha duyarlıdır.",
      ],
    },
    pitch: {
      title: "Yaygın hatve tablosu",
      description: "M3-M24 arası pratik coarse/fine hatve görünümü.",
      columns: ["Ölçü", "Coarse P (mm)", "Fine P (mm)"],
    },
    mini: {
      label: "Mini Tool",
      title: "Tap drill hesaplayıcı",
      description:
        "Yaklaşık delik çapı: D - P x factor. Factor değeri, seçilen diş doluluk yüzdesine göre ayarlanır.",
      sizeLabel: "Nominal metrik ölçü",
      seriesLabel: "Hatve serisi",
      coarse: "Coarse",
      fine: "Fine",
      pitchLabel: "Hatve P (mm)",
      engagementLabel: "Diş doluluğu (%)",
      drillLabel: "Önerilen delik çapı",
      drillGuidance: "Atölye uygulamasında en yakın standart matkap çapına yuvarlayın.",
      hardMaterialLabel: "Sert malzeme başlangıç önerisi",
      calloutLabel: "Kopyalanabilir çağrı metni",
      copy: "Kopyala",
      copied: "Kopyalandı",
      copyFailed: "Kopyalama başarısız",
      formulaTitle: "Formül notu",
      formula: "D_tap ≈ D_nominal - P x (engagement/77)",
      formulaNote: "Sert malzemede genellikle +0.10 / +0.20 mm ile başlamak takım yükünü azaltır.",
    },
    clearance: {
      title: "Clearance hole hızlı tablosu",
      description: "Yakın / normal / gevşek delik çapları (tipik değerler).",
      columns: ["Ölçü", "Close", "Normal", "Loose"],
    },
    engagement: {
      title: "Thread engagement uzunluğu (kural tabanlı)",
      description: "İlk tasarım turu için tipik yaklaşım. Kritik yükte standart ve test doğrulaması gerekir.",
      columns: ["Malzeme", "Öneri", "Not"],
    },
    iso: {
      title: "Fit ve tolerans notları",
      notes: [
        "Genel kombinasyon: iç diş 6H, dış diş 6g.",
        "Konumlandırma pimine yakın dişlerde çapak için giriş pahı bırakın.",
        "Koroziv ortamda paslanmaz bağlantı elemanı + uygun anti-seize kullanın.",
      ],
    },
    references: {
      title: "References",
      items: [
        "ISO 68-1: Basic profile for ISO metric screw threads",
        "ISO 261: ISO general purpose metric screw threads - General plan",
        "ISO 965-1: Tolerances for metric screw threads",
        "Machinery's Handbook, latest edition (threading chapters)",
      ],
    },
  },
  en: {
    hero: {
      title: "Metric threads: practical standards notes",
      description:
        "Coarse/fine selection guidance, quick tap drill calculator, and compact workshop tables.",
      eyebrow: "Standards",
      imageAlt: "Metric threads engineering reference",
    },
    overview: {
      coarseTitle: "Coarse (standard pitch)",
      coarseBody: "Default for general assembly and usually more forgiving in manufacturing.",
      coarseBullets: [
        "If pitch is omitted (ex: M10), coarse is assumed.",
        "More robust against dirt and handling damage.",
        "Use locking features in vibration-heavy applications.",
      ],
      fineTitle: "Fine (smaller pitch)",
      fineBody: "Provides more threads per length at the same diameter for finer adjustment.",
      fineBullets: [
        "Works well in thin-wall sections.",
        "Improves clamp adjustment sensitivity.",
        "More sensitive to contamination and burrs than coarse threads.",
      ],
    },
    pitch: {
      title: "Common pitch snapshot",
      description: "Practical coarse/fine view from M3 to M24.",
      columns: ["Size", "Coarse P (mm)", "Fine P (mm)"],
    },
    mini: {
      label: "Mini Tool",
      title: "Tap drill calculator",
      description:
        "Approximate drill diameter: D - P x factor. The factor is adjusted by selected thread engagement.",
      sizeLabel: "Nominal metric size",
      seriesLabel: "Pitch series",
      coarse: "Coarse",
      fine: "Fine",
      pitchLabel: "Pitch P (mm)",
      engagementLabel: "Thread engagement (%)",
      drillLabel: "Recommended drill diameter",
      drillGuidance: "Round to the nearest practical drill size in your workshop.",
      hardMaterialLabel: "Starting point for hard materials",
      calloutLabel: "Copy-ready callout",
      copy: "Copy",
      copied: "Copied",
      copyFailed: "Copy failed",
      formulaTitle: "Formula note",
      formula: "D_tap ≈ D_nominal - P x (engagement/77)",
      formulaNote: "For harder materials, opening +0.10 / +0.20 mm often lowers tap load.",
    },
    clearance: {
      title: "Clearance hole quick table",
      description: "Close / normal / loose values (typical practical ranges).",
      columns: ["Size", "Close", "Normal", "Loose"],
    },
    engagement: {
      title: "Thread engagement length (rule of thumb)",
      description: "Good for early design loops. Validate by standard/tolerance and critical-load checks.",
      columns: ["Material", "Guideline", "Note"],
    },
    iso: {
      title: "Fit and tolerance notes",
      notes: [
        "Common combination: internal 6H with external 6g.",
        "Add lead-in chamfers where threads are near locating features.",
        "In corrosive environments, use stainless fasteners with suitable anti-seize.",
      ],
    },
    references: {
      title: "References",
      items: [
        "ISO 68-1: Basic profile for ISO metric screw threads",
        "ISO 261: ISO general purpose metric screw threads - General plan",
        "ISO 965-1: Tolerances for metric screw threads",
        "Machinery's Handbook, latest edition (threading chapters)",
      ],
    },
  },
};

const DEFAULT_SIZE = "M10";

function formatNumber(locale: Locale, value: number, maxFractionDigits = 2) {
  return value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });
}

async function copyTextToClipboard(text: string) {
  if (typeof navigator === "undefined") {
    throw new Error("Clipboard API is unavailable.");
  }

  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) {
    throw new Error("Fallback copy command failed.");
  }
}

export default function ThreadsStandardsClient({ locale, heroImage }: { locale: Locale; heroImage: string }) {
  const copy = COPY[locale];
  const fallbackSpec = THREAD_SPECS.find((row) => row.label === DEFAULT_SIZE) ?? THREAD_SPECS[0];
  const [size, setSize] = useState<string>(fallbackSpec.label);
  const [series, setSeries] = useState<ThreadSeries>("coarse");
  const [pitch, setPitch] = useState<number>(fallbackSpec.coarse);
  const [engagementPercent, setEngagementPercent] = useState<number>(65);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "error">("idle");

  const selectedSpec = useMemo(
    () => THREAD_SPECS.find((row) => row.label === size) ?? fallbackSpec,
    [size, fallbackSpec],
  );

  const availablePitches = useMemo<number[]>(
    () =>
      series === "fine" && selectedSpec.fine.length > 0
        ? selectedSpec.fine
        : [selectedSpec.coarse],
    [selectedSpec, series],
  );

  useEffect(() => {
    if (copyState === "idle") return;
    const timeoutId = window.setTimeout(() => setCopyState("idle"), 1400);
    return () => window.clearTimeout(timeoutId);
  }, [copyState]);

  const handleSizeChange = (nextSize: string) => {
    const nextSpec = THREAD_SPECS.find((row) => row.label === nextSize) ?? fallbackSpec;
    setSize(nextSpec.label);
    const nextPitchOptions =
      series === "fine" && nextSpec.fine.length > 0 ? nextSpec.fine : [nextSpec.coarse];
    if (!nextPitchOptions.includes(pitch)) {
      setPitch(nextPitchOptions[0]);
    }
  };

  const handleSeriesChange = (nextSeries: ThreadSeries) => {
    setSeries(nextSeries);
    const nextPitchOptions =
      nextSeries === "fine" && selectedSpec.fine.length > 0 ? selectedSpec.fine : [selectedSpec.coarse];
    if (!nextPitchOptions.includes(pitch)) {
      setPitch(nextPitchOptions[0]);
    }
  };

  const engagementFactor = engagementPercent / 77;
  const rawDrillDiameter = selectedSpec.nominal - pitch * engagementFactor;
  const suggestedDrill = Math.max(0.1, Math.round(rawDrillDiameter * 20) / 20);
  const hardMaterialDrill = suggestedDrill + 0.15;
  const callout = `${selectedSpec.label}x${pitch} - 6H/6g`;

  const handleCopyCallout = async () => {
    try {
      await copyTextToClipboard(callout);
      setCopyState("ok");
    } catch {
      setCopyState("error");
    }
  };

  return (
    <PageShell>
      <PageHero
        title={copy.hero.title}
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        imageSrc={heroImage}
        imageAlt={copy.hero.imageAlt}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.overview.coarseTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{copy.overview.coarseBody}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {copy.overview.coarseBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.overview.fineTitle}</h2>
          <p className="mt-2 text-sm text-slate-600">{copy.overview.fineBody}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {copy.overview.fineBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.pitch.title}</h2>
          <p className="text-sm text-slate-600">{copy.pitch.description}</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {copy.pitch.columns.map((column) => (
                  <th key={column} className="border-b border-slate-200 px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {THREAD_SPECS.map((row) => (
                <tr key={row.label} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-2 text-slate-700">{row.label}</td>
                  <td className="px-4 py-2 text-slate-700">{row.coarse}</td>
                  <td className="px-4 py-2 text-slate-700">{row.fine.join(" / ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{copy.mini.label}</p>
          <h2 className="text-lg font-semibold text-slate-900">{copy.mini.title}</h2>
          <p className="text-sm text-slate-600">{copy.mini.description}</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1 text-[11px] font-medium text-slate-700">
            <span>{copy.mini.sizeLabel}</span>
            <select
              value={size}
              onChange={(event) => handleSizeChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
            >
              {THREAD_SPECS.map((row) => (
                <option key={row.label} value={row.label}>
                  {row.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-[11px] font-medium text-slate-700">
            <span>{copy.mini.seriesLabel}</span>
            <select
              value={series}
              onChange={(event) => handleSeriesChange(event.target.value as ThreadSeries)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
            >
              <option value="coarse">{copy.mini.coarse}</option>
              <option value="fine">{copy.mini.fine}</option>
            </select>
          </label>

          <label className="space-y-1 text-[11px] font-medium text-slate-700">
            <span>{copy.mini.pitchLabel}</span>
            <select
              value={pitch}
              onChange={(event) => setPitch(Number(event.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
            >
              {availablePitches.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-[11px] font-medium text-slate-700">
            <span>{copy.mini.engagementLabel}</span>
            <input
              type="number"
              min={50}
              max={80}
              step={1}
              value={engagementPercent}
              onChange={(event) => {
                const next = Number(event.target.value);
                if (!Number.isFinite(next)) return;
                setEngagementPercent(Math.min(80, Math.max(50, next)));
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.mini.drillLabel}</h3>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(locale, suggestedDrill, 2)} mm</p>
            <p className="mt-2 text-xs text-slate-600">{copy.mini.drillGuidance}</p>
            <p className="mt-2 text-xs text-slate-600">
              {copy.mini.hardMaterialLabel}: <span className="font-semibold">{formatNumber(locale, hardMaterialDrill, 2)} mm</span>
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.mini.calloutLabel}</h3>
            <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-800">
              {callout}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCallout}
                className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                {copy.mini.copy}
              </button>
              {copyState === "ok" ? <span className="text-[11px] text-emerald-700">{copy.mini.copied}</span> : null}
              {copyState === "error" ? <span className="text-[11px] text-rose-700">{copy.mini.copyFailed}</span> : null}
            </div>
          </article>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
          <p className="font-semibold text-slate-800">{copy.mini.formulaTitle}</p>
          <p className="mt-1 font-mono">{copy.mini.formula}</p>
          <p className="mt-1">{copy.mini.formulaNote}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.clearance.title}</h2>
          <p className="text-sm text-slate-600">{copy.clearance.description}</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {copy.clearance.columns.map((column) => (
                  <th key={column} className="border-b border-slate-200 px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {THREAD_SPECS.filter((row) => row.nominal <= 20).map((row) => (
                <tr key={`${row.label}-clearance`} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-2 text-slate-700">{row.label}</td>
                  <td className="px-4 py-2 text-slate-700">{row.clearance.close}</td>
                  <td className="px-4 py-2 text-slate-700">{row.clearance.normal}</td>
                  <td className="px-4 py-2 text-slate-700">{row.clearance.loose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.engagement.title}</h2>
          <p className="text-sm text-slate-600">{copy.engagement.description}</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {copy.engagement.columns.map((column) => (
                  <th key={column} className="border-b border-slate-200 px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENGAGEMENT_GUIDE.map((row) => (
                <tr key={row.material.en} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-2 text-slate-700">{row.material[locale]}</td>
                  <td className="px-4 py-2 font-semibold text-slate-800">{row.recommendation}</td>
                  <td className="px-4 py-2 text-slate-700">{row.note[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.iso.title}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {copy.iso.notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.references.title}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
            {copy.references.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </PageShell>
  );
}
