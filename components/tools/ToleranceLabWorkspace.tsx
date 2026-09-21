"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateToleranceStack,
  convertLength,
  formatToleranceEquation,
  ToleranceInputError,
  type ToleranceDimension,
  type ToleranceUnit,
} from "@/lib/engineering/tolerance/stack";
import type { Locale } from "@/utils/locale";

type Tab = "stack" | "gdt" | "report";

type Copy = {
  title: string;
  subtitle: string;
  stackTab: string;
  gdtTab: string;
  reportTab: string;
  inputs: string;
  add: string;
  remove: string;
  reset: string;
  label: string;
  nominal: string;
  upper: string;
  lower: string;
  direction: string;
  plus: string;
  minus: string;
  unit: string;
  worstCase: string;
  rss: string;
  nominalResult: string;
  min: string;
  max: string;
  range: string;
  equation: string;
  sensitivity: string;
  contribution: string;
  methodNote: string;
  rssNote: string;
  empty: string;
  invalid: string;
  gdtTitle: string;
  gdtIntro: string;
  mmr: string;
  mmrText: string;
  position: string;
  positionText: string;
  datum: string;
  datumText: string;
  gdtCaveat: string;
  reportTitle: string;
  copyLink: string;
  copied: string;
  print: string;
  references: string;
  disclaimer: string;
  sourceIso: string;
  sourceAsme: string;
  sourceNist: string;
};

const copy: Record<Locale, Copy> = {
  tr: {
    title: "Tolerance Lab",
    subtitle: "Doğrusal ölçü zincirini worst-case, RSS ve hassasiyet katkısı ile inceleyin.",
    stackTab: "Tolerans zinciri",
    gdtTab: "GD&T çalışma notu",
    reportTab: "Rapor",
    inputs: "Zincir elemanları",
    add: "Eleman ekle",
    remove: "Sil",
    reset: "Örneği yükle",
    label: "Etiket",
    nominal: "Nominal",
    upper: "Üst sapma",
    lower: "Alt sapma",
    direction: "Yön",
    plus: "Topla (+)",
    minus: "Çıkar (−)",
    unit: "Birim",
    worstCase: "Worst-case aralık",
    rss: "RSS istatistiksel tahmin",
    nominalResult: "Nominal sonuç",
    min: "Minimum",
    max: "Maksimum",
    range: "Toplam tolerans",
    equation: "Zincir denklemi",
    sensitivity: "Hassasiyet katkısı",
    contribution: "Varyans katkısı",
    methodNote: "Worst-case, her elemanın sınırlarının aynı yönde birleştiği deterministik sınırdır.",
    rssNote: "RSS sonucu bağımsız ve yaklaşık normal dağılan etkiler varsayımıyla istatistiksel tahmindir; güvenlik doğrulaması yerine geçmez.",
    empty: "En az bir eleman ekleyin.",
    invalid: "Girdi aralığını kontrol edin.",
    gdtTitle: "GD&T kapsam notu",
    gdtIntro: "Bu sekme eğitim amaçlı bir kavram özeti sunar; tam tolerans uygunluk motoru değildir.",
    mmr: "MMC / MMR",
    mmrText: "MMC ve MMR durumunda datum veya feature size ilişkisi, sanal koşul ve bonus tolerans birlikte değerlendirilir.",
    position: "Basic position",
    positionText: "Konum toleransı, teorik olarak kesin konumdan sapmayı kontrol eder; datum referans çerçevesi ve modifier seçimi sonucu değiştirir.",
    datum: "Datum referansı",
    datumText: "Datum A|B|C sırası ölçüm çerçevesini kurar. Gerçek proje kararı ISO GPS veya ASME Y14.5 çizim çağrısı üzerinden verilmelidir.",
    gdtCaveat: "ISO GPS ve ASME Y14.5 terminolojileri bire bir aynı kabul edilmemelidir. Bu araç yalnızca erken tasarım incelemesine yardımcı olur.",
    reportTitle: "Teknik özet",
    copyLink: "Paylaşım bağlantısını kopyala",
    copied: "Bağlantı kopyalandı",
    print: "Yazdır / PDF",
    references: "Referanslar",
    disclaimer: "Bu sonuçlar tasarım doğrulaması yerine geçmez. Kritik parçalar için yetkili mühendis, çizim toleransları ve ilgili standartlar birlikte incelenmelidir.",
    sourceIso: "ISO 1101:2017 — geometrik tolerans gösterimi",
    sourceAsme: "ASME Y14.5-2018 — dimensioning and tolerancing",
    sourceNist: "NIST TN 1297 — uncertainty evaluation yaklaşımı",
  },
  en: {
    title: "Tolerance Lab",
    subtitle: "Inspect a linear dimension chain with worst-case, RSS, and sensitivity contribution views.",
    stackTab: "Tolerance stack",
    gdtTab: "GD&T study note",
    reportTab: "Report",
    inputs: "Stack members",
    add: "Add member",
    remove: "Remove",
    reset: "Load example",
    label: "Label",
    nominal: "Nominal",
    upper: "Upper deviation",
    lower: "Lower deviation",
    direction: "Direction",
    plus: "Add (+)",
    minus: "Subtract (−)",
    unit: "Unit",
    worstCase: "Worst-case range",
    rss: "RSS statistical estimate",
    nominalResult: "Nominal result",
    min: "Minimum",
    max: "Maximum",
    range: "Total tolerance",
    equation: "Stack equation",
    sensitivity: "Sensitivity contribution",
    contribution: "Variance contribution",
    methodNote: "Worst-case is the deterministic boundary where every member reaches a limiting direction together.",
    rssNote: "RSS is a statistical estimate based on independent, approximately normal contributors; it is not a safety validation.",
    empty: "Add at least one member.",
    invalid: "Check the input range.",
    gdtTitle: "GD&T scope note",
    gdtIntro: "This tab is an educational concept summary; it is not a full tolerance-compliance engine.",
    mmr: "MMC / MMR",
    mmrText: "MMC and MMR cases combine feature size, datum or feature modifiers, virtual condition, and possible bonus tolerance.",
    position: "Basic position",
    positionText: "Position tolerance controls deviation from theoretically exact location; datum reference frame and modifiers change the interpretation.",
    datum: "Datum reference",
    datumText: "The datum A|B|C sequence establishes the measurement frame. Project decisions must use the ISO GPS or ASME Y14.5 drawing callout.",
    gdtCaveat: "ISO GPS and ASME Y14.5 terminology must not be treated as identical. This tool supports early design review only.",
    reportTitle: "Technical summary",
    copyLink: "Copy share link",
    copied: "Link copied",
    print: "Print / PDF",
    references: "References",
    disclaimer: "These results do not replace design verification. Critical parts require an authorized engineer, drawing tolerances, and the applicable standards.",
    sourceIso: "ISO 1101:2017 — geometrical tolerancing",
    sourceAsme: "ASME Y14.5-2018 — dimensioning and tolerancing",
    sourceNist: "NIST TN 1297 — uncertainty evaluation approach",
  },
};

const initialDimensions = (): ToleranceDimension[] => [
  { id: "a", label: "A", nominal: 20, upperDeviation: 0.1, lowerDeviation: -0.1, direction: 1 },
  { id: "b", label: "B", nominal: 10, upperDeviation: 0.05, lowerDeviation: -0.05, direction: 1 },
  { id: "c", label: "C", nominal: 5, upperDeviation: 0.02, lowerDeviation: -0.02, direction: -1 },
];

const encodeState = (unit: ToleranceUnit, dimensions: ToleranceDimension[]) => {
  const value = JSON.stringify({ unit, dimensions });
  return btoa(encodeURIComponent(value));
};

const decodeState = (value: string) => {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(value))) as {
      unit?: ToleranceUnit;
      dimensions?: ToleranceDimension[];
    };
    if ((parsed.unit !== "mm" && parsed.unit !== "in") || !Array.isArray(parsed.dimensions)) return null;
    return { unit: parsed.unit, dimensions: parsed.dimensions };
  } catch {
    return null;
  }
};

const number = (value: number, locale: Locale) =>
  value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", { maximumFractionDigits: 5 });

export default function ToleranceLabWorkspace({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const [unit, setUnit] = useState<ToleranceUnit>("mm");
  const [dimensions, setDimensions] = useState<ToleranceDimension[]>(initialDimensions);
  const [tab, setTab] = useState<Tab>("stack");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const state = new URLSearchParams(window.location.search).get("state");
    const decoded = state ? decodeState(state) : null;
    if (decoded) {
      setUnit(decoded.unit);
      setDimensions(decoded.dimensions);
    }
  }, []);

  const result = useMemo(() => {
    try {
      return { value: calculateToleranceStack(dimensions), error: null };
    } catch (error) {
      return { value: null, error: error instanceof ToleranceInputError ? error.message : text.invalid };
    }
  }, [dimensions, text.invalid]);

  const updateDimension = (id: string, patch: Partial<ToleranceDimension>) => {
    setDimensions((current) => current.map((dimension) => (dimension.id === id ? { ...dimension, ...patch } : dimension)));
  };

  const changeUnit = (nextUnit: ToleranceUnit) => {
    if (nextUnit === unit) return;
    setDimensions((current) =>
      current.map((dimension) => ({
        ...dimension,
        nominal: convertLength(dimension.nominal, unit, nextUnit),
        upperDeviation: convertLength(dimension.upperDeviation, unit, nextUnit),
        lowerDeviation: convertLength(dimension.lowerDeviation, unit, nextUnit),
      })),
    );
    setUnit(nextUnit);
  };

  const addDimension = () => {
    const index = dimensions.length + 1;
    setDimensions((current) => [
      ...current,
      { id: `member-${Date.now()}`, label: `D${index}`, nominal: 10, upperDeviation: 0.05, lowerDeviation: -0.05, direction: 1 },
    ]);
  };

  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("state", encodeState(unit, dimensions));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(text.copyLink, url.toString());
    }
  };

  const display = (value: number) => `${number(value, locale)} ${unit}`;

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">TORQYX Engineering Tool</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{text.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{text.subtitle}</p>
          </div>
          <label className="text-xs font-semibold text-slate-600">
            <span className="mb-1 block">{text.unit}</span>
            <select
              value={unit}
              onChange={(event) => changeUnit(event.target.value as ToleranceUnit)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              aria-label={text.unit}
            >
              <option value="mm">mm</option>
              <option value="in">in</option>
            </select>
          </label>
        </div>
        <nav className="mt-6 flex flex-wrap gap-2" aria-label={text.title}>
          {([
            ["stack", text.stackTab],
            ["gdt", text.gdtTab],
            ["report", text.reportTab],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${tab === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              aria-pressed={tab === value}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {tab === "stack" ? (
        <>
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">{text.inputs}</h2>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={addDimension} className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-800">{text.add}</button>
                <button type="button" onClick={() => setDimensions(initialDimensions())} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">{text.reset}</button>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-[760px] w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-2 py-3">{text.label}</th>
                    <th className="px-2 py-3">{text.nominal}</th>
                    <th className="px-2 py-3">{text.upper}</th>
                    <th className="px-2 py-3">{text.lower}</th>
                    <th className="px-2 py-3">{text.direction}</th>
                    <th className="px-2 py-3"><span className="sr-only">{text.remove}</span></th>
                  </tr>
                </thead>
                <tbody>
                  {dimensions.map((dimension) => (
                    <tr key={dimension.id} className="border-b border-slate-100">
                      <td className="px-2 py-3">
                        <input value={dimension.label} onChange={(event) => updateDimension(dimension.id, { label: event.target.value })} className="w-24 rounded-lg border border-slate-300 px-2 py-2 text-sm" aria-label={`${text.label} ${dimension.id}`} />
                      </td>
                      {["nominal", "upperDeviation", "lowerDeviation"].map((field) => (
                        <td key={field} className="px-2 py-3">
                          <input
                            type="number"
                            step="any"
                            value={dimension[field as keyof ToleranceDimension] as number}
                            onChange={(event) => updateDimension(dimension.id, { [field]: Number(event.target.value) })}
                            className="w-28 rounded-lg border border-slate-300 px-2 py-2 text-sm"
                            aria-label={`${text[field === "nominal" ? "nominal" : field === "upperDeviation" ? "upper" : "lower"]} ${dimension.label}`}
                          />
                        </td>
                      ))}
                      <td className="px-2 py-3">
                        <select value={dimension.direction} onChange={(event) => updateDimension(dimension.id, { direction: Number(event.target.value) as 1 | -1 })} className="rounded-lg border border-slate-300 px-2 py-2 text-sm" aria-label={`${text.direction} ${dimension.label}`}>
                          <option value={1}>{text.plus}</option>
                          <option value={-1}>{text.minus}</option>
                        </select>
                      </td>
                      <td className="px-2 py-3 text-right">
                        <button type="button" onClick={() => setDimensions((current) => current.length > 1 ? current.filter((item) => item.id !== dimension.id) : current)} className="text-xs font-semibold text-rose-700 hover:underline">{text.remove}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.error ? <p className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{text.invalid} {result.error}</p> : null}
          </section>

          {result.value ? <ToleranceResults result={result.value} dimensions={dimensions} unit={unit} text={text} display={display} /> : <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">{text.empty}</p>}
        </>
      ) : null}

      {tab === "gdt" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">{text.gdtTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{text.gdtIntro}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[[text.mmr, text.mmrText], [text.position, text.positionText], [text.datum, text.datumText]].map(([heading, body]) => (
              <article key={heading} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">{heading}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{text.gdtCaveat}</p>
        </section>
      ) : null}

      {tab === "report" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-slate-900">{text.reportTitle}</h2>
            <div className="flex gap-2">
              <button type="button" onClick={share} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">{copied ? text.copied : text.copyLink}</button>
              <button type="button" onClick={() => window.print()} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">{text.print}</button>
            </div>
          </div>
          {result.value ? <ToleranceResults result={result.value} dimensions={dimensions} unit={unit} text={text} display={display} compact /> : <p className="mt-4 text-sm text-rose-700">{text.invalid}</p>}
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{text.disclaimer}</div>
          <div className="mt-6">
            <h3 className="font-semibold text-slate-900">{text.references}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>{text.sourceIso}</li>
              <li>{text.sourceAsme}</li>
              <li>{text.sourceNist}</li>
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ToleranceResults({
  result,
  dimensions,
  unit,
  text,
  display,
  compact = false,
}: {
  result: ReturnType<typeof calculateToleranceStack>;
  dimensions: ToleranceDimension[];
  unit: ToleranceUnit;
  text: Copy;
  display: (value: number) => string;
  compact?: boolean;
}) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2">
        <ResultCard title={text.worstCase} values={[
          [text.nominalResult, display(result.nominalResult)],
          [text.min, display(result.worstCaseMin)],
          [text.max, display(result.worstCaseMax)],
          [text.range, display(result.worstCaseTolerance)],
        ]} />
        <ResultCard title={text.rss} values={[
          [text.nominalResult, display(result.rssNominal)],
          [text.min, display(result.rssMin)],
          [text.max, display(result.rssMax)],
          [text.range, display(result.rssHalfRange * 2)],
        ]} />
      </section>
      {!compact ? <ToleranceDiagram result={result} dimensions={dimensions} unit={unit} text={text} /> : null}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{text.equation}</h2>
        <p className="mt-3 rounded-xl bg-slate-900 px-4 py-3 font-mono text-sm text-white">{formatToleranceEquation(dimensions)}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{text.methodNote} {text.rssNote}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{text.sensitivity}</h2>
        <div className="mt-4 space-y-3">
          {result.sensitivity.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between gap-3 text-xs text-slate-600"><span>{item.label} ({display(item.halfRange)})</span><span className="font-semibold text-slate-900">{number(item.contributionPercent, "en")} %</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-600" style={{ width: `${Math.min(100, item.contributionPercent)}%` }} /></div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">{text.contribution}</p>
      </section>
    </div>
  );
}

function ResultCard({ title, values }: { title: string; values: Array<[string, string]> }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {values.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><dt className="text-[11px] text-slate-500">{label}</dt><dd className="mt-1 font-mono text-sm font-semibold text-slate-900">{value}</dd></div>)}
      </dl>
    </section>
  );
}

function ToleranceDiagram({ result, dimensions, unit, text }: { result: ReturnType<typeof calculateToleranceStack>; dimensions: ToleranceDimension[]; unit: ToleranceUnit; text: Copy }) {
  const width = 760;
  const height = 220;
  const maxNominal = Math.max(...dimensions.map((item) => Math.abs(item.nominal)), 1);
  const scale = 520 / (dimensions.reduce((sum, item) => sum + Math.abs(item.nominal), 0) || 1);
  let x = 80;
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{text.equation}</h2>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-auto w-full" role="img" aria-label={`${text.equation}: ${formatToleranceEquation(dimensions)}`}>
        <title>{formatToleranceEquation(dimensions)}</title>
        <line x1="60" y1="120" x2="700" y2="120" stroke="#0f172a" strokeWidth="2" />
        {dimensions.map((dimension) => {
          const start = x;
          const length = Math.max(54, Math.abs(dimension.nominal) * scale);
          x += length;
          return (
            <g key={dimension.id}>
              <line x1={start} y1="82" x2={x} y2="82" stroke={dimension.direction === -1 ? "#e11d48" : "#0284c7"} strokeWidth="8" strokeLinecap="round" />
              <line x1={start} y1="72" x2={start} y2="94" stroke="#334155" strokeWidth="2" />
              <line x1={x} y1="72" x2={x} y2="94" stroke="#334155" strokeWidth="2" />
              <text x={(start + x) / 2} y="62" textAnchor="middle" fontSize="14" fill="#0f172a">{dimension.direction === -1 ? "−" : "+"} {dimension.label}</text>
              <text x={(start + x) / 2} y="108" textAnchor="middle" fontSize="11" fill="#64748b">{dimension.nominal} {unit}</text>
            </g>
          );
        })}
        <text x="380" y="170" textAnchor="middle" fontSize="13" fill="#0f172a">X = {number(result.nominalResult, "en")} {unit}</text>
        <text x="380" y="192" textAnchor="middle" fontSize="11" fill="#64748b">{number(result.worstCaseMin, "en")} … {number(result.worstCaseMax, "en")} {unit}</text>
        <text x={maxNominal * 0 + 60} y="35" fontSize="11" fill="#0284c7">+ {text.plus}</text>
        <text x={maxNominal * 0 + 650} y="35" fontSize="11" textAnchor="end" fill="#e11d48">− {text.minus}</text>
      </svg>
    </section>
  );
}
