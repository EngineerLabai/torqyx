"use client";

import { useMemo, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import type { Locale } from "@/utils/locale";

type FitGuideCard = {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  examples: string[];
  typicalUse: Record<Locale, string>;
};

type ExampleDeviationRow = {
  nominal: string;
  holeH7: string;
  shaftG6: string;
  shaftK6: string;
  shaftP6: string;
};

const FIT_GUIDE: FitGuideCard[] = [
  {
    id: "clearance",
    title: { tr: "Boşluklu geçme", en: "Clearance fit" },
    description: {
      tr: "Montajı kolaydır, hareketli veya sık sökülen birleştirmelerde kullanılır.",
      en: "Easy assembly; used for moving parts or joints that require regular disassembly.",
    },
    examples: ["H7/g6", "H7/h6"],
    typicalUse: { tr: "Mafsal, kılavuz kızak, konumlama", en: "Guides, locators, sliding parts" },
  },
  {
    id: "transition",
    title: { tr: "Geçiş geçmesi", en: "Transition fit" },
    description: {
      tr: "Küçük boşluk veya hafif sıkılık olabilir; hassas merkezleme için tercih edilir.",
      en: "May yield small clearance or slight interference; common for accurate centering.",
    },
    examples: ["H7/j6", "H7/k6"],
    typicalUse: { tr: "Dişli göbeği, hassas merkezleme", en: "Gear hubs, precise centering" },
  },
  {
    id: "interference",
    title: { tr: "Sıkı geçme", en: "Interference fit" },
    description: {
      tr: "Negatif boşlukla çalışır; presleme veya ısıl montaj gerektirebilir.",
      en: "Negative clearance; often requires press fit or thermal assembly.",
    },
    examples: ["H7/n6", "H7/p6"],
    typicalUse: { tr: "Kalıcı tork aktarımı", en: "Permanent torque transfer joints" },
  },
];

const EXAMPLE_DEVIATION_ROWS: ExampleDeviationRow[] = [
  { nominal: "10", holeH7: "0 / +15 µm", shaftG6: "-14 / -5 µm", shaftK6: "+2 / +11 µm", shaftP6: "+20 / +29 µm" },
  { nominal: "20", holeH7: "0 / +21 µm", shaftG6: "-20 / -7 µm", shaftK6: "+3 / +16 µm", shaftP6: "+24 / +37 µm" },
  { nominal: "30", holeH7: "0 / +25 µm", shaftG6: "-25 / -9 µm", shaftK6: "+4 / +20 µm", shaftP6: "+28 / +44 µm" },
];

const COPY: Record<Locale, {
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  intro: { title: string; body: string; bullets: string[] };
  guide: { title: string; description: string; useLabel: string };
  mini: {
    label: string;
    title: string;
    description: string;
    holeMin: string;
    holeMax: string;
    shaftMin: string;
    shaftMax: string;
    resultType: string;
    minClearance: string;
    maxClearance: string;
    interferenceWarning: string;
    noInterference: string;
    invalidInput: string;
    typeLabels: {
      clearance: string;
      transition: string;
      interference: string;
    };
  };
  exampleTable: { title: string; description: string; columns: string[] };
  references: { title: string; items: string[] };
}> = {
  tr: {
    hero: {
      title: "Geçmeler: seçim rehberi ve mini hesaplayıcı",
      description:
        "Boşluklu-geçiş-sıkı geçme tiplerini hızlı karşılaştırın, ardından gerçek tolerans aralığı için clearance/interference hesabı yapın.",
      eyebrow: "Standards",
      imageAlt: "ISO fits engineering guide",
    },
    intro: {
      title: "Temel mantık",
      body: "Harf temel sapma konumunu, sayı tolerans derecesini (IT) ifade eder.",
      bullets: [
        "Büyük harf delik, küçük harf mil zonu içindir.",
        "H deliğinde alt sapma 0; h milde üst sapma 0 kabul edilir.",
        "IT6, IT7'ye göre daha dar toleranstır.",
      ],
    },
    guide: {
      title: "Fit selection guide",
      description: "Tip seçimini işlev ihtiyacına göre yapın: montaj kolaylığı, merkezleme, tork aktarımı.",
      useLabel: "Tipik kullanım",
    },
    mini: {
      label: "Mini Tool",
      title: "Clearance / Interference hesaplayıcı",
      description: "Delik ve mil min/max değerlerini girin; araç min-max boşluk ve geçme tipini belirler.",
      holeMin: "Delik min (mm)",
      holeMax: "Delik max (mm)",
      shaftMin: "Mil min (mm)",
      shaftMax: "Mil max (mm)",
      resultType: "Sınıflandırma",
      minClearance: "Min boşluk (delik min - mil max)",
      maxClearance: "Max boşluk (delik max - mil min)",
      interferenceWarning: "Uyarı: Negatif boşluk görüldü. Montajda sıkı geçme / presleme etkisi olabilir.",
      noInterference: "Negatif boşluk yok. Montaj serbestliği yüksektir.",
      invalidInput: "Geçerli sayısal girişler gereklidir.",
      typeLabels: {
        clearance: "Boşluklu geçme",
        transition: "Geçiş geçmesi",
        interference: "Sıkı geçme",
      },
    },
    exampleTable: {
      title: "Örnek sapmalar (gösterim amaçlı)",
      description:
        "Nominal 10/20/30 mm için kısa örnek. Nihai değer için ISO 286 tablosundan sınıf ve aralık teyit edilmelidir.",
      columns: ["Nominal (mm)", "H7 delik", "g6 mil", "k6 mil", "p6 mil"],
    },
    references: {
      title: "References",
      items: [
        "ISO 286-1: ISO code system for tolerances on linear sizes",
        "ISO 286-2: Standard tolerance grades and limit deviations",
        "DIN 7154: Fits and tolerances application guidance",
        "Machinery's Handbook, limits and fits section",
      ],
    },
  },
  en: {
    hero: {
      title: "Fits: selection guide and mini calculator",
      description:
        "Compare clearance, transition, and interference fit types, then evaluate your actual tolerance ranges.",
      eyebrow: "Standards",
      imageAlt: "ISO fits engineering guide",
    },
    intro: {
      title: "Core concept",
      body: "Letter defines fundamental deviation zone; number defines tolerance grade (IT).",
      bullets: [
        "Uppercase letters refer to holes, lowercase to shafts.",
        "H hole has zero lower deviation; h shaft has zero upper deviation.",
        "IT6 is tighter than IT7.",
      ],
    },
    guide: {
      title: "Fit selection guide",
      description: "Select by function need: assembly ease, centering precision, or torque transfer.",
      useLabel: "Typical use",
    },
    mini: {
      label: "Mini Tool",
      title: "Clearance / interference calculator",
      description: "Enter hole and shaft min/max values to classify fit behavior.",
      holeMin: "Hole min (mm)",
      holeMax: "Hole max (mm)",
      shaftMin: "Shaft min (mm)",
      shaftMax: "Shaft max (mm)",
      resultType: "Classification",
      minClearance: "Min clearance (hole min - shaft max)",
      maxClearance: "Max clearance (hole max - shaft min)",
      interferenceWarning: "Warning: Negative clearance detected. Press-fit behavior may occur.",
      noInterference: "No negative clearance detected. Assembly remains free.",
      invalidInput: "Valid numeric entries are required.",
      typeLabels: {
        clearance: "Clearance fit",
        transition: "Transition fit",
        interference: "Interference fit",
      },
    },
    exampleTable: {
      title: "Example deviations (illustrative)",
      description:
        "Compact examples for nominal 10/20/30 mm. Confirm final limits from ISO 286 tables for your exact range.",
      columns: ["Nominal (mm)", "H7 hole", "g6 shaft", "k6 shaft", "p6 shaft"],
    },
    references: {
      title: "References",
      items: [
        "ISO 286-1: ISO code system for tolerances on linear sizes",
        "ISO 286-2: Standard tolerance grades and limit deviations",
        "DIN 7154: Fits and tolerances application guidance",
        "Machinery's Handbook, limits and fits section",
      ],
    },
  },
};

function parseNumber(value: string) {
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatSigned(locale: Locale, value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
    maximumFractionDigits: 4,
  })} mm`;
}

export default function FitsStandardsClient({ locale, heroImage }: { locale: Locale; heroImage: string }) {
  const copy = COPY[locale];
  const [holeMin, setHoleMin] = useState("20.000");
  const [holeMax, setHoleMax] = useState("20.021");
  const [shaftMin, setShaftMin] = useState("19.980");
  const [shaftMax, setShaftMax] = useState("19.993");

  const calculation = useMemo(() => {
    const hMin = parseNumber(holeMin);
    const hMax = parseNumber(holeMax);
    const sMin = parseNumber(shaftMin);
    const sMax = parseNumber(shaftMax);

    if (hMin === null || hMax === null || sMin === null || sMax === null) {
      return { valid: false as const };
    }

    const minClearance = hMin - sMax;
    const maxClearance = hMax - sMin;

    let fitType: "clearance" | "transition" | "interference" = "transition";
    if (minClearance >= 0 && maxClearance >= 0) fitType = "clearance";
    if (minClearance <= 0 && maxClearance <= 0) fitType = "interference";

    return {
      valid: true as const,
      minClearance,
      maxClearance,
      fitType,
      hasInterference: minClearance < 0 || maxClearance < 0,
    };
  }, [holeMin, holeMax, shaftMin, shaftMax]);

  return (
    <PageShell>
      <PageHero
        title={copy.hero.title}
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        imageSrc={heroImage}
        imageAlt={copy.hero.imageAlt}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{copy.intro.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{copy.intro.body}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
          {copy.intro.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.guide.title}</h2>
          <p className="text-sm text-slate-600">{copy.guide.description}</p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {FIT_GUIDE.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">{item.title[locale]}</h3>
              <p className="mt-2 text-xs text-slate-600">{item.description[locale]}</p>
              <p className="mt-3 text-[11px] font-semibold text-slate-700">{item.examples.join(" / ")}</p>
              <p className="mt-1 text-[11px] text-slate-600">
                {copy.guide.useLabel}: {item.typicalUse[locale]}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">{copy.mini.label}</p>
          <h2 className="text-lg font-semibold text-slate-900">{copy.mini.title}</h2>
          <p className="text-sm text-slate-600">{copy.mini.description}</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input label={copy.mini.holeMin} value={holeMin} onChange={setHoleMin} />
          <Input label={copy.mini.holeMax} value={holeMax} onChange={setHoleMax} />
          <Input label={copy.mini.shaftMin} value={shaftMin} onChange={setShaftMin} />
          <Input label={copy.mini.shaftMax} value={shaftMax} onChange={setShaftMax} />
        </div>

        {!calculation.valid ? (
          <p className="mt-4 text-sm text-rose-700">{copy.mini.invalidInput}</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.mini.resultType}</h3>
              <p className="mt-2 text-sm font-semibold text-slate-900">{copy.mini.typeLabels[calculation.fitType]}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.mini.minClearance}</h3>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {formatSigned(locale, calculation.minClearance)}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{copy.mini.maxClearance}</h3>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {formatSigned(locale, calculation.maxClearance)}
              </p>
            </article>
          </div>
        )}

        {calculation.valid ? (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-xs ${
              calculation.hasInterference
                ? "border-amber-300 bg-amber-50 text-amber-800"
                : "border-emerald-300 bg-emerald-50 text-emerald-800"
            }`}
          >
            {calculation.hasInterference ? copy.mini.interferenceWarning : copy.mini.noInterference}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.exampleTable.title}</h2>
          <p className="text-sm text-slate-600">{copy.exampleTable.description}</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {copy.exampleTable.columns.map((column) => (
                  <th key={column} className="border-b border-slate-200 px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_DEVIATION_ROWS.map((row) => (
                <tr key={row.nominal} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-2 text-slate-700">{row.nominal}</td>
                  <td className="px-4 py-2 text-slate-700">{row.holeH7}</td>
                  <td className="px-4 py-2 text-slate-700">{row.shaftG6}</td>
                  <td className="px-4 py-2 text-slate-700">{row.shaftK6}</td>
                  <td className="px-4 py-2 text-slate-700">{row.shaftP6}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{copy.references.title}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
          {copy.references.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1 text-[11px] font-medium text-slate-700">
      <span>{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
      />
    </label>
  );
}
