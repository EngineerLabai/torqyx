"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

type HxInputs = {
  q: string; // kW
  tHotIn: string; // C
  tHotOut: string; // C
  tColdIn: string; // C
  tColdOut: string; // C
  U: string; // W/m2K
};

type ConductionInputs = {
  k: string; // W/mK
  tInside: string; // C
  tOutside: string; // C
  thickness: string; // mm
  hInside: string; // W/m2K
  hOutside: string; // W/m2K
  area: string; // m2
};

type PvInputs = {
  area: string; // m2
  irradiance: string; // W/m2
  efficiency: string; // %
  tempCoeff: string; // %/C
  deltaT: string; // C above STC
};

const HX_INIT: HxInputs = {
  q: "50",
  tHotIn: "120",
  tHotOut: "90",
  tColdIn: "40",
  tColdOut: "70",
  U: "800",
};

const COND_INIT: ConductionInputs = {
  k: "0.04",
  tInside: "20",
  tOutside: "-5",
  thickness: "100",
  hInside: "8",
  hOutside: "20",
  area: "50",
};

const PV_INIT: PvInputs = {
  area: "30",
  irradiance: "950",
  efficiency: "18",
  tempCoeff: "-0.35",
  deltaT: "25",
};

const COPY = {
  tr: {
    badge: "Isı Transferi & Enerji",
    subBadge: "Çoklu Hesap",
    title: "Isı Transferi & Enerji Hızlı Paket",
    desc: "Öğrencilerin ve mühendislerin sık aradığı üç temel kontrol: (1) LMTD ile ısı değiştirici alan tahmini, (2) 1D iletim + iç/dış konveksiyon ile ısı kaybı, (3) PV panel güç tahmini (irradians, verim, sıcaklık katsayısı). Hızlı ön boyutlandırma içindir.",
    positivePrompt: "Pozitif değerler gir.",
    hxTitle: "1) LMTD ile Isı Değiştirici Alan Tahmini",
    qLabel: "Isı yükü Q [kW]",
    thInLabel: "T sıcak giriş [°C]",
    thOutLabel: "T sıcak çıkış [°C]",
    tcInLabel: "T soğuk giriş [°C]",
    tcOutLabel: "T soğuk çıkış [°C]",
    uLabel: "U [W/m²K]",
    uHelper: "Plakalı ~500-1200, borulu daha düşük",
    hxArea: "Alan A",
    hxInvalid: "Mantıklı sıcaklıklar ve pozitif değerler gir.",
    hxNote:
      "Not: Karşı akış varsayıldı. Geçiş düzeltme faktörü (F) ve faz değişimi/gaz tarafındaki değişken U dikkate alınmamıştır; ön boyutlandırma içindir.",
    condTitle: "2) 1D İletim + Konveksiyon ile Isı Kaybı",
    kLabel: "İletkenlik k [W/mK]",
    tiLabel: "T iç [°C]",
    toLabel: "T dış [°C]",
    thickLabel: "Kalınlık [mm]",
    hiLabel: "h iç [W/m²K]",
    hoLabel: "h dış [W/m²K]",
    wallAreaLabel: "Alan A [m²]",
    heatLossLabel: "Isı kaybı q",
    rCondLabel: "Riletim",
    rConvLabel: "Rkonveksiyon (iç/dış)",
    condNote:
      "Not: 1D düzlem duvar varsayımı. Köşe etkileri, radyasyon ve çok katmanlı yapı için detaylı hesap gerekir. HVAC kabuğu veya basit izolasyon kaybı için ilk tahmindir.",
    pvTitle: "3) PV Panel Basit Güç Tahmini",
    pvAreaLabel: "Alan A [m²]",
    irradLabel: "İrradians G [W/m²]",
    effLabel: "Verim ηSTC [%]",
    coeffLabel: "Sıcaklık katsayısı [%/°C]",
    coeffHelper: "Kristalin için -0.3 ila -0.5",
    deltaTLabel: "ΔT (STC üstü) [°C]",
    deratedEffLabel: "Düzeltilmiş verim η",
    powerLabel: "Güç P",
    pvNote:
      "Not: Güneşlenme açısı, gölgeleme, kirlenme, inverter verimi ve kablo kayıpları dahil değildir; kaba tahmindir.",
  },
  en: {
    badge: "Heat Transfer & Energy",
    subBadge: "Multi-Calculator",
    title: "Heat Transfer & Energy Fast Pack",
    desc: "Three essential thermal & renewable calculations: (1) heat exchanger area sizing with LMTD (Log Mean Temperature Difference), (2) 1D conduction & combined convection heat loss, and (3) solar photovoltaic power estimation with cell temperature derating. Engineering preliminary sizing approximations.",
    positivePrompt: "Enter positive, valid numerical inputs.",
    hxTitle: "1) Heat Exchanger Sizing (LMTD)",
    qLabel: "Heat duty Q [kW]",
    thInLabel: "Hot inlet temp Th,in [°C]",
    thOutLabel: "Hot outlet temp Th,out [°C]",
    tcInLabel: "Cold inlet temp Tc,in [°C]",
    tcOutLabel: "Cold outlet temp Tc,out [°C]",
    uLabel: "Overall U-value [W/m²K]",
    uHelper: "Plate ~500–1200, shell & tube typically lower",
    hxArea: "Exchanger area A",
    hxInvalid: "Enter thermodynamically valid temperatures and positive heat duty.",
    hxNote:
      "Note: Pure counterflow assumed. Crossflow correction factor (F) and phase-change variable U are not modeled; intended for preliminary engineering sizing.",
    condTitle: "2) 1D Conduction + Convection Heat Loss",
    kLabel: "Thermal conductivity k [W/m·K]",
    tiLabel: "Indoor temp Ti [°C]",
    toLabel: "Outdoor temp To [°C]",
    thickLabel: "Wall thickness [mm]",
    hiLabel: "Inside film coeff hi [W/m²K]",
    hoLabel: "Outside film coeff ho [W/m²K]",
    wallAreaLabel: "Surface area A [m²]",
    heatLossLabel: "Heat loss rate q",
    rCondLabel: "Rconduction",
    rConvLabel: "Rconvection (in / out)",
    condNote:
      "Note: 1D planar wall model. Thermal bridging at corners, radiation exchange, and multi-layer wall assemblies require detailed composite thermal analysis.",
    pvTitle: "3) Photovoltaic Array Sizing & Derating",
    pvAreaLabel: "Array gross area A [m²]",
    irradLabel: "Solar irradiance G [W/m²]",
    effLabel: "STC efficiency η [%]",
    coeffLabel: "Temp coefficient [%/°C]",
    coeffHelper: "Typically -0.35 to -0.45 %/°C for c-Si",
    deltaTLabel: "ΔT above 25°C STC [°C]",
    deratedEffLabel: "Derated efficiency η",
    powerLabel: "Array power output P",
    pvNote:
      "Note: DC array estimate. Inverter conversion efficiency, soiling, shading, cabling voltage drop, and sun incident angle modifier (IAM) are excluded.",
  },
} as const;

type HeatEnergyClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function HeatEnergyPage({ initialDocs }: HeatEnergyClientProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const t = COPY[isEn ? "en" : "tr"];

  return (
    <PageShell>
      <ToolDocTabs slug="heat-energy" initialDocs={initialDocs}>
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

        <HxBlock t={t} />
        <ConductionBlock t={t} />
        <PvBlock t={t} />
      </ToolDocTabs>
    </PageShell>
  );
}

function HxBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<HxInputs>(HX_INIT);

  const res = useMemo(() => {
    const q = Number(inp.q) * 1000;
    const thIn = Number(inp.tHotIn);
    const thOut = Number(inp.tHotOut);
    const tcIn = Number(inp.tColdIn);
    const tcOut = Number(inp.tColdOut);
    const U = Number(inp.U);
    const ok = q > 0 && U > 0 && thIn > thOut && tcOut > tcIn;
    if (!ok) return null;
    const dT1 = thIn - tcOut;
    const dT2 = thOut - tcIn;
    if (dT1 <= 0 || dT2 <= 0) return null;
    const lmtd = (dT1 - dT2) / Math.log(dT1 / dT2);
    const A = q / (U * lmtd);
    return { lmtd, A };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.hxTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={t.qLabel} value={inp.q} onChange={(v) => setInp({ ...inp, q: v })} />
        <Field
          label={t.thInLabel}
          value={inp.tHotIn}
          onChange={(v) => setInp({ ...inp, tHotIn: v })}
        />
        <Field
          label={t.thOutLabel}
          value={inp.tHotOut}
          onChange={(v) => setInp({ ...inp, tHotOut: v })}
        />
        <Field
          label={t.tcInLabel}
          value={inp.tColdIn}
          onChange={(v) => setInp({ ...inp, tColdIn: v })}
        />
        <Field
          label={t.tcOutLabel}
          value={inp.tColdOut}
          onChange={(v) => setInp({ ...inp, tColdOut: v })}
        />
        <Field
          label={t.uLabel}
          value={inp.U}
          onChange={(v) => setInp({ ...inp, U: v })}
          helper={t.uHelper}
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <ResultRow
            label="ΔT1 = Th,in - Tc,out"
            value={`${(Number(inp.tHotIn) - Number(inp.tColdOut)).toFixed(1)} K`}
          />
          <ResultRow
            label="ΔT2 = Th,out - Tc,in"
            value={`${(Number(inp.tHotOut) - Number(inp.tColdIn)).toFixed(1)} K`}
          />
          <ResultRow label="LMTD" value={`${res.lmtd.toFixed(2)} K`} />
          <ResultRow label={t.hxArea} value={`${res.A.toFixed(2)} m²`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.hxInvalid}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.hxNote}</p>
    </section>
  );
}

function ConductionBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<ConductionInputs>(COND_INIT);

  const res = useMemo(() => {
    const k = Number(inp.k);
    const Ti = Number(inp.tInside);
    const To = Number(inp.tOutside);
    const L = Number(inp.thickness) / 1000;
    const hi = Number(inp.hInside);
    const ho = Number(inp.hOutside);
    const A = Number(inp.area);
    if (k <= 0 || L <= 0 || hi <= 0 || ho <= 0 || A <= 0) return null;
    const R_cond = L / (k * A);
    const R_conv_in = 1 / (hi * A);
    const R_conv_out = 1 / (ho * A);
    const R_total = R_cond + R_conv_in + R_conv_out;
    const q = (Ti - To) / R_total;
    return { R_total, q, R_cond, R_conv_in, R_conv_out };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.condTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={t.kLabel} value={inp.k} onChange={(v) => setInp({ ...inp, k: v })} />
        <Field label={t.tiLabel} value={inp.tInside} onChange={(v) => setInp({ ...inp, tInside: v })} />
        <Field label={t.toLabel} value={inp.tOutside} onChange={(v) => setInp({ ...inp, tOutside: v })} />
        <Field
          label={t.thickLabel}
          value={inp.thickness}
          onChange={(v) => setInp({ ...inp, thickness: v })}
        />
        <Field label={t.hiLabel} value={inp.hInside} onChange={(v) => setInp({ ...inp, hInside: v })} />
        <Field label={t.hoLabel} value={inp.hOutside} onChange={(v) => setInp({ ...inp, hOutside: v })} />
        <Field label={t.wallAreaLabel} value={inp.area} onChange={(v) => setInp({ ...inp, area: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label="Rtotal" value={`${res.R_total.toFixed(4)} K/W`} />
          <ResultRow label={t.heatLossLabel} value={`${res.q.toFixed(1)} W`} />
          <ResultRow label={t.rCondLabel} value={`${res.R_cond.toFixed(4)} K/W`} />
          <ResultRow
            label={t.rConvLabel}
            value={`${res.R_conv_in.toFixed(4)} / ${res.R_conv_out.toFixed(4)} K/W`}
          />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.condNote}</p>
    </section>
  );
}

function PvBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<PvInputs>(PV_INIT);

  const res = useMemo(() => {
    const A = Number(inp.area);
    const G = Number(inp.irradiance);
    const eta = Number(inp.efficiency) / 100;
    const coeff = Number(inp.tempCoeff);
    const dT = Number(inp.deltaT);
    if (A <= 0 || G <= 0 || eta <= 0) return null;
    const eta_temp = eta * (1 + (coeff / 100) * dT);
    const P = A * G * eta_temp;
    return { eta_temp, P };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.pvTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={t.pvAreaLabel} value={inp.area} onChange={(v) => setInp({ ...inp, area: v })} />
        <Field
          label={t.irradLabel}
          value={inp.irradiance}
          onChange={(v) => setInp({ ...inp, irradiance: v })}
        />
        <Field
          label={t.effLabel}
          value={inp.efficiency}
          onChange={(v) => setInp({ ...inp, efficiency: v })}
        />
        <Field
          label={t.coeffLabel}
          value={inp.tempCoeff}
          onChange={(v) => setInp({ ...inp, tempCoeff: v })}
          helper={t.coeffHelper}
        />
        <Field
          label={t.deltaTLabel}
          value={inp.deltaT}
          onChange={(v) => setInp({ ...inp, deltaT: v })}
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <ResultRow label={t.deratedEffLabel} value={`${(res.eta_temp * 100).toFixed(2)} %`} />
          <ResultRow label={t.powerLabel} value={`${(res.P / 1000).toFixed(2)} kW`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.pvNote}</p>
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
