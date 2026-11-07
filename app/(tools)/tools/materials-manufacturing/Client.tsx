"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

type MachiningInputs = {
  material: string;
  tool: string;
  vc: string; // m/min
  fz: string; // mm/tooth
  z: string; // teeth
  ap: string; // mm
  ae: string; // mm
  diameter: string; // mm
};

type FitInputs = {
  shaft: string;
  hole: string;
  nominal: string;
};

type WeldInputs = {
  throat: string; // a, mm
  length: string; // mm
  allowStress: string; // MPa
  load: string; // N
};

const MACHINING_INIT = {
  tr: {
    material: "C45 (1.0503)",
    tool: "Karbür parmak freze",
    vc: "180",
    fz: "0.08",
    z: "4",
    ap: "2",
    ae: "8",
    diameter: "12",
  },
  en: {
    material: "AISI 1045 (Medium Carbon)",
    tool: "Carbide End Mill",
    vc: "180",
    fz: "0.08",
    z: "4",
    ap: "2",
    ae: "8",
    diameter: "12",
  },
};

const FIT_INIT: FitInputs = {
  shaft: "h7",
  hole: "H7",
  nominal: "40",
};

const WELD_INIT: WeldInputs = {
  throat: "4",
  length: "150",
  allowStress: "140",
  load: "12000",
};

const COPY = {
  tr: {
    badge: "Malzeme & İmalat",
    subBadge: "Çoklu Hesap",
    title: "Malzeme & İmalat Hızlı Paket",
    desc: "Öğrencilerin ve mühendislerin sık aradığı üç kısa kontrol: (1) talaşlı imalatta temel Vc/fz hesap ve rpm/f ilerleme tahmini, (2) ISO tolerans/fit seçimi için özet, (3) kaynak boğazı taşıma kapasitesi (basit). Katalog ve standartlara göre doğrulayın.",
    positivePrompt: "Pozitif değerler gir.",
    machiningTitle: "1) Talaşlı İmalat: Temel Kesme Parametresi Tahmini",
    materialLabel: "Malzeme (referans)",
    toolLabel: "Takım cinsi",
    vcLabel: "Kesme hızı Vc [m/dk]",
    fzLabel: "Diş başı ilerleme fz [mm/diş]",
    zLabel: "Diş sayısı z",
    diaLabel: "Takım çapı d [mm]",
    apLabel: "Kesme derinliği ap [mm]",
    aeLabel: "Radyal genişlik ae [mm]",
    rpmLabel: "Devir n",
    feedLabel: "İlerleme vf",
    machiningNote:
      "Not: Bu, katalogdan alınacak tipik başlangıç değerleri içindir. Takım üreticisi önerisi, talaş kırıcı ve kaplamaya göre Vc/fz ayarlanmalıdır.",
    fitTitle: "2) ISO Fit (Hızlı Referans)",
    holeLabel: "Delik toleransı",
    shaftLabel: "Mil toleransı",
    nomLabel: "Nominal çap [mm]",
    fitTypeLabel: "Fit tipi",
    fitNoteSuffix: "Detaylı tolerans değeri için ISO 286 tablosuna bakın.",
    fitFallback:
      "Bu hızlı örnek tablo sınırlıdır. ISO 286 detaylı tablolarından tolerans bandını alın.",
    weldTitle: "3) Kaynak Boğazı Taşıma Kapasitesi (basit)",
    throatLabel: "Boğaz kalınlığı a [mm]",
    weldLengthLabel: "Kaynak boyu L [mm]",
    allowStressLabel: "İzinli gerilme [MPa]",
    loadLabel: "Yük F [N]",
    effAreaLabel: "Etkin alan Aw",
    stressLabel: "Gerilme τ = F/Aw",
    safetyLabel: "Emniyet n",
    weldNote:
      "Not: Bu, tek doğrultulu statik yük için basit bir kontroldür. Gerçek tasarımda kaynak yönü, eksen dışı yük, yorulma ve kaynak kalitesi faktörleri dikkate alınmalıdır. Eurocode 3 / ASME / ISO 5817 tablolarına bakın.",
    fitsMap: {
      "H7/h6": {
        type: "Boşluklu geçme (kayma)",
        note: "Rulman iç bilezikleri, sökülebilir bağlantı ve pimler",
      },
      "H7/g6": {
        type: "Hassas kayma / hafif boşluklu",
        note: "Hassas merkezleme ve boşluksuz kayma hareketi",
      },
      "H7/p6": {
        type: "Sıkı geçme (pres)",
        note: "Daimi sıkı montaj (ör. dişli pinyon, presli burçlar)",
      },
    },
  },
  en: {
    badge: "Materials & Manufacturing",
    subBadge: "Multi-Calculator",
    title: "Materials & Manufacturing Fast Pack",
    desc: "Three core manufacturing calculations: (1) CNC machining cutting speed (Vc), feed per tooth (fz), spindle rpm, and table feed rate, (2) ISO 286 limit fits and tolerances quick guide, and (3) fillet/butt weld throat stress and load capacity. Sizing approximations for production planning.",
    positivePrompt: "Enter positive, valid numerical inputs.",
    machiningTitle: "1) Machining: Speeds & Feeds Estimation",
    materialLabel: "Workpiece Material",
    toolLabel: "Cutting Tool Type",
    vcLabel: "Cutting speed Vc [m/min]",
    fzLabel: "Feed per tooth fz [mm/tooth]",
    zLabel: "Number of teeth z",
    diaLabel: "Cutter diameter d [mm]",
    apLabel: "Depth of cut ap [mm]",
    aeLabel: "Width of cut ae [mm]",
    rpmLabel: "Spindle speed n",
    feedLabel: "Table feed vf",
    machiningNote:
      "Note: Baseline handbook starting parameters. Consult tooling vendor catalogs for insert grades, chipbreaker geometry, and coolant recommendations.",
    fitTitle: "2) ISO Limits & Fits (Quick Reference)",
    holeLabel: "Hole tolerance",
    shaftLabel: "Shaft tolerance",
    nomLabel: "Nominal diameter [mm]",
    fitTypeLabel: "Fit type",
    fitNoteSuffix: "Check ISO 286 tolerance charts for exact micron upper/lower limits.",
    fitFallback:
      "This quick guide covers primary pairings. Consult full ISO 286 / ANSI B4.1 tables for exact micron tolerance bands.",
    weldTitle: "3) Fillet Weld Throat Stress & Capacity",
    throatLabel: "Weld throat thickness a [mm]",
    weldLengthLabel: "Effective weld length L [mm]",
    allowStressLabel: "Allowable shear stress [MPa]",
    loadLabel: "Design load F [N]",
    effAreaLabel: "Throat area Aw",
    stressLabel: "Weld shear stress τ = F/Aw",
    safetyLabel: "Safety factor n",
    weldNote:
      "Note: Simplified static check on effective throat area. Structural design requires directional stress components, eccentric loading moments, and joint quality factors (per AWS D1.1, Eurocode 3, or ISO 5817).",
    fitsMap: {
      "H7/h6": {
        type: "Clearance / Sliding fit",
        note: "Locating pins, removable bearing fits, and hand-slide assemblies",
      },
      "H7/g6": {
        type: "Precision sliding fit",
        note: "Precision sliding motion without noticeable radial play",
      },
      "H7/p6": {
        type: "Interference / Press fit",
        note: "Permanent rigid assembly requiring arbor press or shrink fitting",
      },
    },
  },
} as const;

type MaterialsManufacturingClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function MaterialsManufacturingPage({
  initialDocs,
}: MaterialsManufacturingClientProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const t = COPY[isEn ? "en" : "tr"];

  return (
    <PageShell>
      <ToolDocTabs slug="materials-manufacturing" initialDocs={initialDocs}>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {t.badge}
            </span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
              {t.subBadge}
            </span>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">{t.title}</h1>
          <p className="mt-2 text-xs text-slate-600">{t.desc}</p>
        </section>

        <MachiningBlock t={t} isEn={isEn} />
        <FitBlock t={t} />
        <WeldBlock t={t} />
      </ToolDocTabs>
    </PageShell>
  );
}

function MachiningBlock({
  t,
  isEn,
}: {
  t: (typeof COPY)["tr"] | (typeof COPY)["en"];
  isEn: boolean;
}) {
  const [inp, setInp] = useState<MachiningInputs>(isEn ? MACHINING_INIT.en : MACHINING_INIT.tr);

  const res = useMemo(() => {
    const vc = Number(inp.vc);
    const fz = Number(inp.fz);
    const z = Number(inp.z);
    const ap = Number(inp.ap);
    const ae = Number(inp.ae);
    const d = Number(inp.diameter);
    if (vc <= 0 || fz <= 0 || z <= 0 || d <= 0) return null;
    const n = (1000 * vc) / (Math.PI * d); // rpm
    const f = fz * z * n; // mm/min
    return { n, f, ap, ae };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.machiningTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label={t.materialLabel}
          value={inp.material}
          onChange={(v) => setInp({ ...inp, material: v })}
        />
        <Field
          label={t.toolLabel}
          value={inp.tool}
          onChange={(v) => setInp({ ...inp, tool: v })}
        />
        <Field label={t.vcLabel} value={inp.vc} onChange={(v) => setInp({ ...inp, vc: v })} />
        <Field label={t.fzLabel} value={inp.fz} onChange={(v) => setInp({ ...inp, fz: v })} />
        <Field label={t.zLabel} value={inp.z} onChange={(v) => setInp({ ...inp, z: v })} />
        <Field
          label={t.diaLabel}
          value={inp.diameter}
          onChange={(v) => setInp({ ...inp, diameter: v })}
        />
        <Field label={t.apLabel} value={inp.ap} onChange={(v) => setInp({ ...inp, ap: v })} />
        <Field label={t.aeLabel} value={inp.ae} onChange={(v) => setInp({ ...inp, ae: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <ResultRow label={t.rpmLabel} value={`${res.n.toFixed(0)} rpm`} />
          <ResultRow label={t.feedLabel} value={`${res.f.toFixed(0)} mm/min`} />
          <ResultRow label="ap x ae" value={`${res.ap} x ${res.ae} mm`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.machiningNote}</p>
    </section>
  );
}

function FitBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<FitInputs>(FIT_INIT);

  const fits = useMemo(() => {
    const shaft = inp.shaft.toLowerCase();
    const hole = inp.hole.toUpperCase();
    const nominal = Number(inp.nominal);
    if (!nominal || nominal <= 0) return null;

    const key = `${hole}/${shaft}` as keyof typeof t.fitsMap;
    const fit = t.fitsMap[key] ?? null;
    return { fit, nominal };
  }, [inp, t.fitsMap]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.fitTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={t.holeLabel} value={inp.hole} onChange={(v) => setInp({ ...inp, hole: v })} />
        <Field
          label={t.shaftLabel}
          value={inp.shaft}
          onChange={(v) => setInp({ ...inp, shaft: v })}
        />
        <Field
          label={t.nomLabel}
          value={inp.nominal}
          onChange={(v) => setInp({ ...inp, nominal: v })}
        />
      </div>
      {fits && fits.fit ? (
        <div className="mt-3">
          <ResultRow label={t.fitTypeLabel} value={fits.fit.type} />
          <div className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
            {fits.fit.note} — {t.fitNoteSuffix}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-amber-700">{t.fitFallback}</p>
      )}
    </section>
  );
}

function WeldBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<WeldInputs>(WELD_INIT);

  const res = useMemo(() => {
    const a = Number(inp.throat);
    const L = Number(inp.length);
    const allow = Number(inp.allowStress);
    const F = Number(inp.load);
    if (a <= 0 || L <= 0 || allow <= 0 || F <= 0) return null;
    const A = a * L;
    const stress = F / A;
    const n = allow / stress;
    return { A, stress, n };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.weldTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          label={t.throatLabel}
          value={inp.throat}
          onChange={(v) => setInp({ ...inp, throat: v })}
        />
        <Field
          label={t.weldLengthLabel}
          value={inp.length}
          onChange={(v) => setInp({ ...inp, length: v })}
        />
        <Field
          label={t.allowStressLabel}
          value={inp.allowStress}
          onChange={(v) => setInp({ ...inp, allowStress: v })}
        />
        <Field label={t.loadLabel} value={inp.load} onChange={(v) => setInp({ ...inp, load: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <ResultRow label={t.effAreaLabel} value={`${res.A.toFixed(0)} mm²`} />
          <ResultRow label={t.stressLabel} value={`${res.stress.toFixed(2)} MPa`} />
          <ResultRow label={t.safetyLabel} value={`${res.n.toFixed(2)}`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.weldNote}</p>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        aria-label="Input field"
      />
      {helper && <span className="text-[10px] text-slate-500">{helper}</span>}
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5">
      <span className="text-[11px] text-slate-600">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}
