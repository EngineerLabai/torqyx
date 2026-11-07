"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

type CombinedInputs = {
  axial: string; // N
  shear: string; // N
  area: string; // mm2
  yield: string; // MPa
};

type BucklingInputs = {
  length: string; // mm
  k: string; // dimensionless
  E: string; // GPa
  I: string; // mm4
  area: string; // mm2
};

type ShaftInputs = {
  moment: string; // Nm
  torque: string; // Nm
  diameter: string; // mm
  yield: string; // MPa
};

const COMBINED_INIT: CombinedInputs = {
  axial: "12000",
  shear: "6000",
  area: "450",
  yield: "250",
};

const BUCKLING_INIT: BucklingInputs = {
  length: "1200",
  k: "1.0",
  E: "210",
  I: "32000",
  area: "900",
};

const SHAFT_INIT: ShaftInputs = {
  moment: "250",
  torque: "180",
  diameter: "40",
  yield: "350",
};

const COPY = {
  tr: {
    badge: "Mukavemet",
    subBadge: "Çoklu Hesap",
    title: "Mukavemet & Statik Hızlı Paket",
    desc: "Öğrenciler ve mühendislerin sık baktığı üç hesap: (1) eksenel+kesme birleşik gerilme ve emniyet, (2) Euler burkulma ve narinlik, (3) dairesel milde eğilme+tork birleşik gerilme. Hızlı kontrol amaçlıdır; detaylı tasarımda ilgili standartları ve güvenlik katsayılarını kontrol edin.",
    positivePrompt: "Pozitif ve mantıklı değerler gir.",
    combinedTitle: "1) Eksenel + Kesme Birleşik Gerilme (von Mises)",
    axialLabel: "Eksenel yük N [N]",
    shearLabel: "Kesme yükü V [N]",
    areaLabel: "Kesit alanı A [mm²]",
    yieldLabel: "Akma dayanımı Sy [MPa]",
    safetyFactor: "Emniyet n = Sy/σvm",
    bucklingTitle: "2) Euler Burkulma & Narinlik",
    lengthLabel: "Serbest boy L [mm]",
    kLabel: "K (uç koşulu)",
    kHelper: "Sabit-sabit ~0.7, sabit-serbest 2.0, mafsal-mafsal 1.0",
    eLabel: "E [GPa]",
    iLabel: "Atalet I [mm⁴]",
    bucklingAreaLabel: "Alan A [mm²] (opsiyonel)",
    bucklingAreaHelper: "Narinlik için",
    slendernessLabel: "Narinlik λ = Leff/r",
    bucklingNote:
      "İnce çubuk varsayımı: elastik burkulma, malzeme doğrusal. Plastik sınır, yerel burkulma ve başlangıç kusurları için ilgili standardı kontrol edin.",
    shaftTitle: "3) Mil Eğilme + Tork (Dairesel, tam kesit)",
    momentLabel: "Eğilme momenti M [Nm]",
    torqueLabel: "Tork T [Nm]",
    diaLabel: "Çap d [mm]",
    shaftYieldLabel: "Akma dayanımı Sy [MPa]",
    shaftNote:
      "Not: Dolu dairesel kesit için J = πd⁴/32, Wb = πd³/32. Yivli/kanallı miller için zayıflama katsayısı ve gerilme yoğunlaşması dikkate alınmalıdır.",
  },
  en: {
    badge: "Strength & Statics",
    subBadge: "Multi-Calculator",
    title: "Strength & Statics Fast Pack",
    desc: "Three essential structural mechanics checks: (1) combined axial & shear stress (von Mises), (2) Euler column buckling & slenderness ratio, and (3) combined shaft bending & torsion. Sizing approximations for preliminary engineering analysis.",
    positivePrompt: "Enter positive, valid numerical inputs.",
    combinedTitle: "1) Combined Axial & Shear Stress (von Mises)",
    axialLabel: "Axial load N [N]",
    shearLabel: "Shear load V [N]",
    areaLabel: "Cross-section area A [mm²]",
    yieldLabel: "Yield strength Sy [MPa]",
    safetyFactor: "Safety factor n = Sy/σvm",
    bucklingTitle: "2) Euler Column Buckling & Slenderness",
    lengthLabel: "Column length L [mm]",
    kLabel: "End condition factor K",
    kHelper: "Fixed-fixed ~0.5–0.7, fixed-free 2.0, pinned-pinned 1.0",
    eLabel: "Young's modulus E [GPa]",
    iLabel: "Inertia I [mm⁴]",
    bucklingAreaLabel: "Area A [mm²] (optional)",
    bucklingAreaHelper: "For slenderness ratio",
    slendernessLabel: "Slenderness ratio λ = Leff/r",
    bucklingNote:
      "Long slender column assumption: elastic buckling, linear material behavior. Check Johnson parabolic formula or AISC/Eurocode 3 for inelastic buckling and initial imperfections.",
    shaftTitle: "3) Circular Solid Shaft: Bending + Torsion",
    momentLabel: "Bending moment M [Nm]",
    torqueLabel: "Torque T [Nm]",
    diaLabel: "Shaft diameter d [mm]",
    shaftYieldLabel: "Yield strength Sy [MPa]",
    shaftNote:
      "Note: Solid circular section with J = πd⁴/32, Wb = πd³/32. Account for keyways, snap ring grooves, and stress concentration factors (Kt) in critical shaft design.",
  },
} as const;

type StrengthStaticsClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function StrengthStaticsPage({ initialDocs }: StrengthStaticsClientProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const t = COPY[isEn ? "en" : "tr"];

  return (
    <PageShell>
      <ToolDocTabs slug="strength-statics" initialDocs={initialDocs}>
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

        <CombinedBlock t={t} />
        <BucklingBlock t={t} />
        <ShaftBlock t={t} />
      </ToolDocTabs>
    </PageShell>
  );
}

function CombinedBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<CombinedInputs>(COMBINED_INIT);

  const res = useMemo(() => {
    const axial = Number(inp.axial);
    const shear = Number(inp.shear);
    const A = Number(inp.area);
    const sy = Number(inp.yield);
    const ok = axial > 0 && A > 0 && sy > 0 && shear >= 0;
    if (!ok) return null;
    const sigma = axial / A; // MPa (N/mm2)
    const tau = shear / A;
    const mises = Math.sqrt(sigma * sigma + 3 * tau * tau);
    const n = sy / mises;
    return { sigma, tau, mises, n };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.combinedTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          label={t.axialLabel}
          value={inp.axial}
          onChange={(v) => setInp({ ...inp, axial: v })}
        />
        <Field
          label={t.shearLabel}
          value={inp.shear}
          onChange={(v) => setInp({ ...inp, shear: v })}
        />
        <Field
          label={t.areaLabel}
          value={inp.area}
          onChange={(v) => setInp({ ...inp, area: v })}
        />
        <Field
          label={t.yieldLabel}
          value={inp.yield}
          onChange={(v) => setInp({ ...inp, yield: v })}
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="σ = N/A" value={`${res.sigma.toFixed(2)} MPa`} />
          <ResultRow label="τ = V/A" value={`${res.tau.toFixed(2)} MPa`} />
          <ResultRow label="σvm" value={`${res.mises.toFixed(2)} MPa`} />
          <ResultRow label={t.safetyFactor} value={`${res.n.toFixed(2)}`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
    </section>
  );
}

function BucklingBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<BucklingInputs>(BUCKLING_INIT);

  const res = useMemo(() => {
    const L = Number(inp.length);
    const k = Number(inp.k);
    const E = Number(inp.E);
    const I = Number(inp.I);
    const A = Number(inp.area);
    const ok = L > 0 && k > 0 && E > 0 && I > 0;
    if (!ok) return null;
    const L_eff = k * L;
    const E_mpa = E * 1000;
    const Pcr = (Math.PI * Math.PI * E_mpa * I) / (L_eff * L_eff);
    let slender: number | null = null;
    if (A > 0) {
      const r = Math.sqrt(I / A);
      slender = L_eff / r;
    }
    return { Pcr, L_eff, slender };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.bucklingTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field
          label={t.lengthLabel}
          value={inp.length}
          onChange={(v) => setInp({ ...inp, length: v })}
        />
        <Field
          label={t.kLabel}
          value={inp.k}
          onChange={(v) => setInp({ ...inp, k: v })}
          helper={t.kHelper}
        />
        <Field label={t.eLabel} value={inp.E} onChange={(v) => setInp({ ...inp, E: v })} />
        <Field label={t.iLabel} value={inp.I} onChange={(v) => setInp({ ...inp, I: v })} />
        <Field
          label={t.bucklingAreaLabel}
          value={inp.area}
          onChange={(v) => setInp({ ...inp, area: v })}
          helper={t.bucklingAreaHelper}
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="Leff = K·L" value={`${res.L_eff.toFixed(0)} mm`} />
          <ResultRow label="Pcr (Euler)" value={`${res.Pcr.toFixed(0)} N`} />
          {res.slender !== null && (
            <ResultRow label={t.slendernessLabel} value={`${res.slender.toFixed(0)}`} />
          )}
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700 sm:col-span-2 lg:col-span-2">
            {t.bucklingNote}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
    </section>
  );
}

function ShaftBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<ShaftInputs>(SHAFT_INIT);

  const res = useMemo(() => {
    const M_Nm = Number(inp.moment);
    const T_Nm = Number(inp.torque);
    const d = Number(inp.diameter);
    const sy = Number(inp.yield);
    const ok = M_Nm >= 0 && T_Nm >= 0 && d > 0 && sy > 0;
    if (!ok) return null;
    const M = M_Nm * 1000;
    const T = T_Nm * 1000;
    const denom = Math.PI * Math.pow(d, 3);
    const sigma_b = (32 * M) / denom;
    const tau_t = (16 * T) / denom;
    const mises = Math.sqrt(sigma_b * sigma_b + 3 * tau_t * tau_t);
    const n = sy / mises;
    return { sigma_b, tau_t, mises, n };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.shaftTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          label={t.momentLabel}
          value={inp.moment}
          onChange={(v) => setInp({ ...inp, moment: v })}
        />
        <Field
          label={t.torqueLabel}
          value={inp.torque}
          onChange={(v) => setInp({ ...inp, torque: v })}
        />
        <Field
          label={t.diaLabel}
          value={inp.diameter}
          onChange={(v) => setInp({ ...inp, diameter: v })}
        />
        <Field
          label={t.shaftYieldLabel}
          value={inp.yield}
          onChange={(v) => setInp({ ...inp, yield: v })}
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="σb" value={`${res.sigma_b.toFixed(1)} MPa`} />
          <ResultRow label="τt" value={`${res.tau_t.toFixed(1)} MPa`} />
          <ResultRow label="σvm" value={`${res.mises.toFixed(1)} MPa`} />
          <ResultRow label={t.safetyFactor} value={`${res.n.toFixed(2)}`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.shaftNote}</p>
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
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        aria-label="Number input"
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
