"use client";

import { useEffect, useMemo, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import type { Locale } from "@/utils/locale";
import { getUiLabel, warnIfEnglishLabelsInTurkish } from "@/utils/ui-labels";

type RoughnessRow = {
  id: string;
  name: Record<Locale, string>;
  roughnessMm: number;
  note: Record<Locale, string>;
};

type TypicalFluidRow = {
  id: string;
  name: Record<Locale, string>;
  density: string;
  viscosity: string;
  note: Record<Locale, string>;
};

const TYPICAL_FLUIDS: TypicalFluidRow[] = [
  {
    id: "water",
    name: { tr: "Su", en: "Water" },
    density: "998",
    viscosity: "1.0",
    note: { tr: "20°C, temiz su", en: "20°C, clean water" },
  },
  {
    id: "air",
    name: { tr: "Hava", en: "Air" },
    density: "1.2",
    viscosity: "0.018",
    note: { tr: "1 atm, 20°C", en: "1 atm, 20°C" },
  },
  {
    id: "hydraulic-oil",
    name: { tr: "Hidrolik yağ", en: "Hydraulic oil" },
    density: "860-900",
    viscosity: "40-80",
    note: { tr: "ISO VG 46 civarı", en: "Around ISO VG 46" },
  },
  {
    id: "light-oil",
    name: { tr: "Mineral yağ", en: "Mineral oil" },
    density: "830-870",
    viscosity: "10-30",
    note: { tr: "Hafif yağlar", en: "Light oils" },
  },
];

const ROUGHNESS_ROWS: RoughnessRow[] = [
  {
    id: "drawn-steel",
    name: { tr: "Çekme çelik boru", en: "Drawn steel pipe" },
    roughnessMm: 0.0015,
    note: { tr: "Düşük pürüzlülük", en: "Very smooth internal finish" },
  },
  {
    id: "commercial-steel",
    name: { tr: "Ticari çelik boru", en: "Commercial steel pipe" },
    roughnessMm: 0.045,
    note: { tr: "Saha uygulamalarında yaygın", en: "Common practical assumption" },
  },
  {
    id: "cast-iron",
    name: { tr: "Dökme demir boru", en: "Cast iron pipe" },
    roughnessMm: 0.26,
    note: { tr: "Eski tesisatlarda daha yüksek olabilir", en: "Can be higher in aged systems" },
  },
  {
    id: "pvc",
    name: { tr: "PVC / CPVC", en: "PVC / CPVC" },
    roughnessMm: 0.0015,
    note: { tr: "Plastik boru, düşük sürtünme", en: "Smooth plastic pipe" },
  },
];

const STANDARDS_EYEBROW: Record<Locale, string> = {
  tr: getUiLabel("tr", "standards"),
  en: getUiLabel("en", "standards"),
};

const COPY: Record<Locale, {
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  props: { title: string; description: string; columns: string[] };
  mini: {
    label: string;
    title: string;
    description: string;
    density: string;
    viscosity: string;
    diameter: string;
    length: string;
    roughness: string;
    flowMode: string;
    modeQ: string;
    modeV: string;
    flowRate: string;
    velocity: string;
    efficiency: string;
    invalid: string;
    regime: string;
    reynolds: string;
    friction: string;
    pressureDrop: string;
    pumpPower: string;
    computedFlow: string;
    computedVelocity: string;
    regimeLabels: {
      laminar: string;
      transition: string;
      turbulent: string;
    };
    transitionWarning: string;
    formulas: string[];
  };
  roughness: { title: string; description: string; columns: string[]; useAction: string };
  unitHelper: {
    title: string;
    description: string;
    mPasLabel: string;
    pasLabel: string;
  };
  references: { title: string; items: string[] };
}> = {
  tr: {
    hero: {
      title: "Akışkanlar: mini hesap araçları",
      description:
        "Reynolds sayısı, sürtünme katsayısı, Darcy basınç düşümü ve pompa gücü için hafif ve deterministik hesap blokları.",
      eyebrow: STANDARDS_EYEBROW.tr,
      imageAlt: "Akışkan hesaplama referansı",
    },
    props: {
      title: "Tipik akışkan özellikleri (20°C civarı)",
      description: "Erken tasarım adımı için pratik referans değerler.",
      columns: ["Akışkan", "Yoğunluk (kg/m³)", "Dinamik viskozite (mPa·s)", "Not"],
    },
    mini: {
      label: getUiLabel("tr", "miniTool"),
      title: "Reynolds + Darcy + pompa gücü",
      description:
        "Girdi olarak ρ, μ, D, L, ε ve Q veya v kullanılır. Türbülans rejiminde Swamee-Jain yaklaşımı uygulanır.",
      density: "Yoğunluk ρ (kg/m³)",
      viscosity: "Dinamik viskozite μ (mPa·s)",
      diameter: "Boru iç çapı D (mm)",
      length: "Hat uzunluğu L (m)",
      roughness: "Mutlak pürüzlülük ε (mm)",
      flowMode: "Akış girdisi",
      modeQ: "Q kullan (m³/s)",
      modeV: "v kullan (m/s)",
      flowRate: "Debi Q (m³/s)",
      velocity: "Hız v (m/s)",
      efficiency: "Pompa verimi η (%)",
      invalid: "Geçerli ve pozitif girişler gereklidir.",
      regime: "Akış rejimi",
      reynolds: "Reynolds sayısı",
      friction: "Sürtünme katsayısı f",
      pressureDrop: "Basınç düşümü ΔP",
      pumpPower: "Pompa gücü P",
      computedFlow: "Hesaplanan debi",
      computedVelocity: "Hesaplanan hız",
      regimeLabels: {
        laminar: "Laminer",
        transition: "Geçiş",
        turbulent: "Türbülanslı",
      },
      transitionWarning: "Re 2300-4000 aralığında, sonuçlar geçiş bölgesi nedeniyle daha belirsizdir.",
      formulas: [
        "Re = (ρ × v × D) / μ",
        "Laminer: f = 64 / Re",
        "Türbülanslı: f = 0.25 / [log10(ε/(3.7D) + 5.74/Re^0.9)]²",
        "ΔP = f × (L/D) × (ρv²/2)",
        "P = (ΔP × Q) / η",
      ],
    },
    roughness: {
      title: "Tipik pürüzlülük tablosu",
      description: "Satır seçerek ε değerini doğrudan hesap aracına aktarabilirsiniz.",
      columns: ["Malzeme", "ε (mm)", "Not", "Aksiyon"],
      useAction: "Kullan",
    },
    unitHelper: {
      title: "Viskozite birim yardımcısı",
      description: "mPa·s ↔ Pa·s dönüşümü.",
      mPasLabel: "mPa·s",
      pasLabel: "Pa·s",
    },
    references: {
      title: getUiLabel("tr", "references"),
      items: [
        "ISO 5167: Akış ölçümü standartları",
        "Crane TP-410: Vana, bağlantı ve borularda akışkan akışı",
        "White, Akışkanlar Mekaniği (Darcy-Weisbach ve sürtünme katsayısı bölümleri)",
        "Fox & McDonald, Akışkanlar Mekaniğine Giriş",
      ],
    },
  },
  en: {
    hero: {
      title: "Fluids: practical mini calculators",
      description:
        "Deterministic tools for Reynolds number, friction factor, Darcy pressure drop, and pump power.",
      eyebrow: STANDARDS_EYEBROW.en,
      imageAlt: "Fluids calculations reference",
    },
    props: {
      title: "Typical fluid properties (around 20°C)",
      description: "Practical reference values for early-stage calculations.",
      columns: ["Fluid", "Density (kg/m³)", "Dynamic viscosity (mPa·s)", "Note"],
    },
    mini: {
      label: getUiLabel("en", "miniTool"),
      title: "Reynolds + Darcy + pump power",
      description:
        "Inputs include ρ, μ, D, L, ε and either Q or v. Swamee-Jain is used in turbulent flow.",
      density: "Density ρ (kg/m³)",
      viscosity: "Dynamic viscosity μ (mPa·s)",
      diameter: "Pipe inner diameter D (mm)",
      length: "Pipe length L (m)",
      roughness: "Absolute roughness ε (mm)",
      flowMode: "Flow input mode",
      modeQ: "Use Q (m³/s)",
      modeV: "Use v (m/s)",
      flowRate: "Flow rate Q (m³/s)",
      velocity: "Velocity v (m/s)",
      efficiency: "Pump efficiency η (%)",
      invalid: "Valid positive numeric inputs are required.",
      regime: "Flow regime",
      reynolds: "Reynolds number",
      friction: "Friction factor f",
      pressureDrop: "Pressure drop ΔP",
      pumpPower: "Pump power P",
      computedFlow: "Computed flow rate",
      computedVelocity: "Computed velocity",
      regimeLabels: {
        laminar: "Laminar",
        transition: "Transition",
        turbulent: "Turbulent",
      },
      transitionWarning: "Re between 2300 and 4000 indicates transition flow, so uncertainty is higher.",
      formulas: [
        "Re = (ρ × v × D) / μ",
        "Laminar: f = 64 / Re",
        "Turbulent: f = 0.25 / [log10(ε/(3.7D) + 5.74/Re^0.9)]²",
        "ΔP = f × (L/D) × (ρv²/2)",
        "P = (ΔP × Q) / η",
      ],
    },
    roughness: {
      title: "Typical roughness table",
      description: "Click a row action to push ε directly into the calculator input.",
      columns: ["Material", "ε (mm)", "Note", "Action"],
      useAction: "Use",
    },
    unitHelper: {
      title: "Viscosity unit helper",
      description: "mPa·s ↔ Pa·s conversion.",
      mPasLabel: "mPa·s",
      pasLabel: "Pa·s",
    },
    references: {
      title: getUiLabel("en", "references"),
      items: [
        "ISO 5167: Flow measurement standards",
        "Crane TP-410: Flow of Fluids Through Valves, Fittings, and Pipe",
        "White, Fluid Mechanics (Darcy-Weisbach and friction factor chapters)",
        "Fox & McDonald, Introduction to Fluid Mechanics",
      ],
    },
  },
};

type FlowMode = "q" | "v";

function parseNumber(value: string) {
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function compactNumber(value: number, digits = 6) {
  return Number(value.toFixed(digits)).toString();
}

function formatNumber(locale: Locale, value: number, digits = 4) {
  return value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
    maximumFractionDigits: digits,
  });
}

export default function FluidsStandardsClient({ locale, heroImage }: { locale: Locale; heroImage: string }) {
  const copy = COPY[locale];
  const [density, setDensity] = useState("998");
  const [viscosityMpas, setViscosityMpas] = useState("1.0");
  const [diameterMm, setDiameterMm] = useState("20");
  const [lengthM, setLengthM] = useState("8");
  const [roughnessMm, setRoughnessMm] = useState("0.045");
  const [flowMode, setFlowMode] = useState<FlowMode>("q");
  const [flowRate, setFlowRate] = useState("0.0015");
  const [velocity, setVelocity] = useState("2.0");
  const [efficiencyPct, setEfficiencyPct] = useState("65");

  const [helperMpas, setHelperMpas] = useState("1.0");
  const [helperPas, setHelperPas] = useState("0.001");

  const calculation = useMemo(() => {
    const rho = parseNumber(density);
    const muMpas = parseNumber(viscosityMpas);
    const dMm = parseNumber(diameterMm);
    const l = parseNumber(lengthM);
    const epsMm = parseNumber(roughnessMm);
    const etaPct = parseNumber(efficiencyPct);
    const qInput = parseNumber(flowRate);
    const vInput = parseNumber(velocity);

    if (
      rho === null ||
      muMpas === null ||
      dMm === null ||
      l === null ||
      epsMm === null ||
      etaPct === null ||
      rho <= 0 ||
      muMpas <= 0 ||
      dMm <= 0 ||
      l <= 0 ||
      epsMm < 0 ||
      etaPct <= 0 ||
      etaPct > 100
    ) {
      return { valid: false as const };
    }

    const d = dMm / 1000;
    const muPaS = muMpas / 1000;
    const epsilon = epsMm / 1000;
    const area = (Math.PI * d * d) / 4;

    let q = 0;
    let v = 0;
    if (flowMode === "q") {
      if (qInput === null || qInput <= 0) return { valid: false as const };
      q = qInput;
      v = q / area;
    } else {
      if (vInput === null || vInput <= 0) return { valid: false as const };
      v = vInput;
      q = v * area;
    }

    const reynolds = (rho * v * d) / muPaS;
    if (!Number.isFinite(reynolds) || reynolds <= 0) return { valid: false as const };

    const relativeRoughness = epsilon / d;
    let regime: "laminar" | "transition" | "turbulent" = "laminar";
    if (reynolds >= 4000) regime = "turbulent";
    if (reynolds >= 2300 && reynolds < 4000) regime = "transition";

    let frictionFactor = 64 / reynolds;
    if (regime === "turbulent" || regime === "transition") {
      const term = relativeRoughness / 3.7 + 5.74 / Math.pow(reynolds, 0.9);
      if (term <= 0) return { valid: false as const };
      frictionFactor = 0.25 / Math.pow(Math.log10(term), 2);
    }

    const pressureDropPa = frictionFactor * (l / d) * ((rho * v * v) / 2);
    const eta = etaPct / 100;
    const pumpPowerW = (pressureDropPa * q) / eta;

    if (!Number.isFinite(pressureDropPa) || !Number.isFinite(pumpPowerW)) {
      return { valid: false as const };
    }

    return {
      valid: true as const,
      reynolds,
      regime,
      frictionFactor,
      pressureDropPa,
      pumpPowerW,
      flowRate: q,
      velocity: v,
      isTransition: regime === "transition",
    };
  }, [density, viscosityMpas, diameterMm, lengthM, roughnessMm, flowMode, flowRate, velocity, efficiencyPct]);

  useEffect(() => {
    warnIfEnglishLabelsInTurkish("FluidsStandardsClient", locale, {
      hero: {
        eyebrow: copy.hero.eyebrow,
        title: copy.hero.title,
      },
      labels: {
        miniLabel: copy.mini.label,
        roughnessTitle: copy.roughness.title,
        referencesTitle: copy.references.title,
      },
    });
  }, [copy.hero.eyebrow, copy.hero.title, copy.mini.label, copy.references.title, copy.roughness.title, locale]);

  const handleHelperMpasChange = (value: string) => {
    setHelperMpas(value);
    const parsed = parseNumber(value);
    if (parsed === null) {
      setHelperPas("");
      return;
    }
    setHelperPas(compactNumber(parsed / 1000));
  };

  const handleHelperPasChange = (value: string) => {
    setHelperPas(value);
    const parsed = parseNumber(value);
    if (parsed === null) {
      setHelperMpas("");
      return;
    }
    setHelperMpas(compactNumber(parsed * 1000));
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

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.props.title}</h2>
          <p className="text-sm text-slate-600">{copy.props.description}</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {copy.props.columns.map((column) => (
                  <th key={column} className="border-b border-slate-200 px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TYPICAL_FLUIDS.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-2 text-slate-700">{row.name[locale]}</td>
                  <td className="px-4 py-2 text-slate-700">{row.density}</td>
                  <td className="px-4 py-2 text-slate-700">{row.viscosity}</td>
                  <td className="px-4 py-2 text-slate-700">{row.note[locale]}</td>
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
          <Input label={copy.mini.density} value={density} onChange={setDensity} />
          <Input label={copy.mini.viscosity} value={viscosityMpas} onChange={setViscosityMpas} />
          <Input label={copy.mini.diameter} value={diameterMm} onChange={setDiameterMm} />
          <Input label={copy.mini.length} value={lengthM} onChange={setLengthM} />
          <Input label={copy.mini.roughness} value={roughnessMm} onChange={setRoughnessMm} />

          <label className="space-y-1 text-[11px] font-medium text-slate-700">
            <span>{copy.mini.flowMode}</span>
            <select
              value={flowMode}
              onChange={(event) => setFlowMode(event.target.value as FlowMode)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
             aria-label="Select field">
              <option value="q">{copy.mini.modeQ}</option>
              <option value="v">{copy.mini.modeV}</option>
            </select>
          </label>

          {flowMode === "q" ? (
            <Input label={copy.mini.flowRate} value={flowRate} onChange={setFlowRate} />
          ) : (
            <Input label={copy.mini.velocity} value={velocity} onChange={setVelocity} />
          )}

          <Input label={copy.mini.efficiency} value={efficiencyPct} onChange={setEfficiencyPct} />
        </div>

        {!calculation.valid ? (
          <p className="mt-4 text-sm text-rose-700">{copy.mini.invalid}</p>
        ) : (
          <>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ResultCard
                title={copy.mini.regime}
                value={copy.mini.regimeLabels[calculation.regime]}
              />
              <ResultCard
                title={copy.mini.reynolds}
                value={formatNumber(locale, calculation.reynolds, 0)}
              />
              <ResultCard
                title={copy.mini.friction}
                value={formatNumber(locale, calculation.frictionFactor, 5)}
              />
              <ResultCard
                title={copy.mini.pressureDrop}
                value={`${formatNumber(locale, calculation.pressureDropPa / 1000, 3)} kPa`}
              />
              <ResultCard
                title={copy.mini.pumpPower}
                value={`${formatNumber(locale, calculation.pumpPowerW, 1)} W (${formatNumber(
                  locale,
                  calculation.pumpPowerW / 1000,
                  3,
                )} kW)`}
              />
              <ResultCard
                title={copy.mini.computedFlow}
                value={`${formatNumber(locale, calculation.flowRate, 6)} m³/s`}
              />
              <ResultCard
                title={copy.mini.computedVelocity}
                value={`${formatNumber(locale, calculation.velocity, 4)} m/s`}
              />
            </div>

            {calculation.isTransition ? (
              <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                {copy.mini.transitionWarning}
              </div>
            ) : null}
          </>
        )}

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
          <ul className="list-disc space-y-1 pl-5">
            {copy.mini.formulas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.roughness.title}</h2>
          <p className="text-sm text-slate-600">{copy.roughness.description}</p>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                {copy.roughness.columns.map((column) => (
                  <th key={column} className="border-b border-slate-200 px-4 py-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROUGHNESS_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-2 text-slate-700">{row.name[locale]}</td>
                  <td className="px-4 py-2 text-slate-700">{row.roughnessMm}</td>
                  <td className="px-4 py-2 text-slate-700">{row.note[locale]}</td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => setRoughnessMm(compactNumber(row.roughnessMm, 4))}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      {copy.roughness.useAction}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{copy.unitHelper.title}</h2>
          <p className="text-sm text-slate-600">{copy.unitHelper.description}</p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input label={copy.unitHelper.mPasLabel} value={helperMpas} onChange={handleHelperMpasChange} />
          <Input label={copy.unitHelper.pasLabel} value={helperPas} onChange={handleHelperPasChange} />
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
       aria-label="Input field"/>
    </label>
  );
}

function ResultCard({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</h3>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </article>
  );
}
