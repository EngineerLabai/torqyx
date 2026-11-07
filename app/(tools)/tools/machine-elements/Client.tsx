"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

type BearingInputs = {
  C: string; // kN
  P: string; // kN
  n: string; // rpm
};

type KeyInputs = {
  torque: string; // Nm
  shaftDia: string; // mm
  keyWidth: string; // mm
  keyHeight: string; // mm
  keyLength: string; // mm
  shearAllow: string; // MPa
  bearingAllow: string; // MPa
};

type GearInputs = {
  power: string; // kW
  rpm: string; // rpm
  pinionDia: string; // mm
  face: string; // mm
  pressureAngle: string; // deg
  gearRatio: string; // i = z2/z1
};

const BEARING_INIT: BearingInputs = {
  C: "25",
  P: "5",
  n: "1500",
};

const KEY_INIT: KeyInputs = {
  torque: "180",
  shaftDia: "40",
  keyWidth: "12",
  keyHeight: "8",
  keyLength: "50",
  shearAllow: "100",
  bearingAllow: "200",
};

const GEAR_INIT: GearInputs = {
  power: "5.5",
  rpm: "1450",
  pinionDia: "120",
  face: "40",
  pressureAngle: "20",
  gearRatio: "3",
};

const COPY = {
  tr: {
    badge: "Makine Elemanları",
    subBadge: "Çoklu Hesap",
    title: "Makine Elemanları Hızlı Paket",
    desc: "Öğrenciler ve mühendislerin sık aradığı üç temel kontrol: (1) rulman L10 ömrü, (2) kamalı milde kesme/ezilme, (3) basit düz dişli yükleri (Ft, Fr) ve tork. Hızlı kontrol amaçlıdır; katalog/standart değerleri mutlaka doğrulayın.",
    positivePrompt: "Pozitif değerler gir.",
    bearingTitle: "1) Rulman L10 Ömrü (temel)",
    cLabel: "C dinamik [kN]",
    pLabel: "P eşdeğer [kN]",
    nLabel: "n [rpm]",
    lifeRevLabel: "L10 (devir)",
    lifeHoursLabel: "L10h (saat)",
    bearingNote:
      "Not: p=3 (bilyalı) varsayıldı. Eşdeğer yük ve çalışma koşullarını katalogdan kontrol edin; güvenilirlik katsayısı a1 ve aISO düzeltmeleri burada yok.",
    keyTitle: "2) Kamalı Mil Kesme / Ezilme Kontrolü",
    torqueLabel: "Tork T [Nm]",
    shaftDiaLabel: "Şaft çapı d [mm]",
    keyWidthLabel: "Kama genişliği b [mm]",
    keyHeightLabel: "Kama yüksekliği h [mm]",
    keyLengthLabel: "Kama boyu L [mm]",
    shearAllowLabel: "İzinli kesme τallow [MPa]",
    bearingAllowLabel: "İzinli ezilme σallow [MPa]",
    forceLabel: "Kuvvet F",
    shearStressLabel: "Kesme gerilmesi τ",
    crushStressLabel: "Ezilme gerilmesi σ",
    safetyFactorLabel: "Emniyet (kesme / ezilme)",
    keyNote:
      "Not: Basit bir kesme/ezilme kontrolüdür. Gerilme yoğunlaşmaları, yüzey durumu ve darbe/yük spektrumu için güvenlik katsayısı eklenmelidir.",
    gearTitle: "3) Basit Dişli Yükleri (düz dişli)",
    powerLabel: "Giriş güç P [kW]",
    inRpmLabel: "Giriş devir n1 [rpm]",
    pinionDiaLabel: "Pinyon çapı d1 [mm]",
    faceLabel: "Yüz genişliği b [mm]",
    angleLabel: "Basınç açısı α [deg]",
    ratioLabel: "Dişli oranı i = z2/z1",
    torque1Label: "Tork T1",
    ftLabel: "Tangansiyel kuvvet Ft",
    frLabel: "Radyal kuvvet Fr",
    outRpmLabel: "Çıkış devri n2",
    gearNote:
      "Not: Bu basit düz dişli yük tahminidir; temas/diş eğilme gerilmesi için AGMA/ISO faktörleri gereklidir. Helis açısı, dinamik faktör ve yüz yüklenme dağılımı burada yoktur.",
    galleryTitle: "Makine Elemanları Galeri",
    gallerySubtitle: "Ortak makine bileşenlerinin görsel referansları",
    components: [
      {
        name: "Cıvata & Somun",
        image: "/images/bolt-assembly.webp",
        description: "Vida ve somun bileşenleri",
      },
      {
        name: "Dişli (Gear)",
        image: "/images/Gear.webp",
        description: "Dişli aktarım elemanları",
      },
      {
        name: "Rulman (Bearing)",
        image: "/images/bearing-section.webp",
        description: "Dönen makine elemanları",
      },
      {
        name: "Kayış & Kasnak",
        image: "/images/belt-pulley.webp",
        description: "Kayış-kasnak sistemi",
      },
      {
        name: "Pim & Yay",
        image: "/images/pin-spring.webp",
        description: "Bağlantı ve elastik elemanlar",
      },
      {
        name: "Vida & Diş Açma",
        image: "/images/screw-thread.webp",
        description: "Vida ve dişli bağlantılar",
      },
      {
        name: "Mil & Yatak",
        image: "/images/shaft.webp",
        description: "Mil ve yatak sistemleri",
      },
    ],
  },
  en: {
    badge: "Machine Elements",
    subBadge: "Multi-Calculator",
    title: "Machine Elements Fast Pack",
    desc: "Three essential mechanical component checks: (1) rolling bearing ISO 281 L10 life in hours/revolutions, (2) parallel keyway shear and surface bearing stress, and (3) spur gear pitchline tangential and radial tooth forces. Preliminary sizing approximations.",
    positivePrompt: "Enter positive, valid numerical inputs.",
    bearingTitle: "1) Rolling Bearing L10 Life (ISO 281)",
    cLabel: "Dynamic capacity C [kN]",
    pLabel: "Equivalent load P [kN]",
    nLabel: "Speed n [rpm]",
    lifeRevLabel: "Rating life L10 (revs)",
    lifeHoursLabel: "Rating life L10h (hours)",
    bearingNote:
      "Note: Exponent p=3 assumed (ball bearings; for roller bearings p=10/3). Adjust for operating temperature, lubrication viscosity ratio (κ), and ISO 281 life factors (aISO) for detailed design.",
    keyTitle: "2) Parallel Keyway Shear & Crushing Stress",
    torqueLabel: "Torque T [Nm]",
    shaftDiaLabel: "Shaft diameter d [mm]",
    keyWidthLabel: "Key width b [mm]",
    keyHeightLabel: "Key height h [mm]",
    keyLengthLabel: "Key length L [mm]",
    shearAllowLabel: "Allowable shear τallow [MPa]",
    bearingAllowLabel: "Allowable bearing σallow [MPa]",
    forceLabel: "Transmitted force F",
    shearStressLabel: "Shear stress τ",
    crushStressLabel: "Crushing stress σ",
    safetyFactorLabel: "Safety factor (shear / bearing)",
    keyNote:
      "Note: Simplified check according to DIN 6885. Include service factor (Ka) and chamfer allowance for real hub and keyway fits.",
    gearTitle: "3) Spur Gear Pitchline Forces (Ft, Fr)",
    powerLabel: "Input power P [kW]",
    inRpmLabel: "Pinion speed n1 [rpm]",
    pinionDiaLabel: "Pinion pitch dia d1 [mm]",
    faceLabel: "Face width b [mm]",
    angleLabel: "Pressure angle α [deg]",
    ratioLabel: "Gear ratio i = z2/z1",
    torque1Label: "Pinion torque T1",
    ftLabel: "Tangential load Ft",
    frLabel: "Radial separating load Fr",
    outRpmLabel: "Output speed n2",
    gearNote:
      "Note: Nominal force estimation at pitch line. Complete ISO 6336 or AGMA 2001 ratings require dynamic factor (Kv), face load factor (KHβ), and surface durability calculation.",
    galleryTitle: "Machine Elements Visual Gallery",
    gallerySubtitle: "Visual engineering reference of standard machine elements",
    components: [
      {
        name: "Bolts & Threaded Fasteners",
        image: "/images/bolt-assembly.webp",
        description: "ISO/DIN structural bolts, studs, and heavy hex nuts",
      },
      {
        name: "Gears & Transmission",
        image: "/images/Gear.webp",
        description: "Spur, helical, bevel, and worm gear power train elements",
      },
      {
        name: "Bearings & Housings",
        image: "/images/bearing-section.webp",
        description: "Deep groove, angular contact, tapered, and spherical roller bearings",
      },
      {
        name: "Belts & Pulleys",
        image: "/images/belt-pulley.webp",
        description: "V-belt, timing belt, and flat belt synchronous drive systems",
      },
      {
        name: "Pins & Springs",
        image: "/images/pin-spring.webp",
        description: "Dowel pins, coil compression springs, and Belleville washers",
      },
      {
        name: "Power Screws & Threading",
        image: "/images/screw-thread.webp",
        description: "Lead screws, ball screws, and trapezoidal metric threads",
      },
      {
        name: "Shafting & Bushings",
        image: "/images/shaft.webp",
        description: "Precision ground shafting, plain sleeve bushings, and pillow blocks",
      },
    ],
  },
} as const;

type MachineElementsClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function MachineElementsPage({ initialDocs }: MachineElementsClientProps) {
  const { locale } = useLocale();
  const isEn = locale === "en";
  const t = COPY[isEn ? "en" : "tr"];

  return (
    <PageShell>
      <ToolDocTabs slug="machine-elements" initialDocs={initialDocs}>
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

        <BearingBlock t={t} />
        <KeyBlock t={t} />
        <GearBlock t={t} />
        <ComponentGallery t={t} />
      </ToolDocTabs>
    </PageShell>
  );
}

function BearingBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<BearingInputs>(BEARING_INIT);

  const res = useMemo(() => {
    const C = Number(inp.C) * 1000;
    const P = Number(inp.P) * 1000;
    const n = Number(inp.n);
    if (C <= 0 || P <= 0 || n <= 0) return null;
    const life_rev = Math.pow(C / P, 3) * 1_000_000;
    const life_h = life_rev / (60 * n);
    return { life_rev, life_h };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.bearingTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={t.cLabel} value={inp.C} onChange={(v) => setInp({ ...inp, C: v })} />
        <Field label={t.pLabel} value={inp.P} onChange={(v) => setInp({ ...inp, P: v })} />
        <Field label={t.nLabel} value={inp.n} onChange={(v) => setInp({ ...inp, n: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <ResultRow label={t.lifeRevLabel} value={`${res.life_rev.toFixed(0)} rev`} />
          <ResultRow label={t.lifeHoursLabel} value={`${res.life_h.toFixed(1)} h`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.bearingNote}</p>
    </section>
  );
}

function KeyBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<KeyInputs>(KEY_INIT);

  const res = useMemo(() => {
    const T = Number(inp.torque) * 1000;
    const d = Number(inp.shaftDia);
    const b = Number(inp.keyWidth);
    const h = Number(inp.keyHeight);
    const L = Number(inp.keyLength);
    const tauAllow = Number(inp.shearAllow);
    const sigAllow = Number(inp.bearingAllow);
    const ok = T > 0 && d > 0 && b > 0 && h > 0 && L > 0 && tauAllow > 0 && sigAllow > 0;
    if (!ok) return null;
    const F = (2 * T) / d;
    const tau = F / (b * L);
    const sigma = F / ((h / 2) * L);
    const n_shear = tauAllow / tau;
    const n_bearing = sigAllow / sigma;
    return { tau, sigma, n_shear, n_bearing, F };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.keyTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Field
          label={t.torqueLabel}
          value={inp.torque}
          onChange={(v) => setInp({ ...inp, torque: v })}
        />
        <Field
          label={t.shaftDiaLabel}
          value={inp.shaftDia}
          onChange={(v) => setInp({ ...inp, shaftDia: v })}
        />
        <Field
          label={t.keyWidthLabel}
          value={inp.keyWidth}
          onChange={(v) => setInp({ ...inp, keyWidth: v })}
        />
        <Field
          label={t.keyHeightLabel}
          value={inp.keyHeight}
          onChange={(v) => setInp({ ...inp, keyHeight: v })}
        />
        <Field
          label={t.keyLengthLabel}
          value={inp.keyLength}
          onChange={(v) => setInp({ ...inp, keyLength: v })}
        />
        <Field
          label={t.shearAllowLabel}
          value={inp.shearAllow}
          onChange={(v) => setInp({ ...inp, shearAllow: v })}
        />
        <Field
          label={t.bearingAllowLabel}
          value={inp.bearingAllow}
          onChange={(v) => setInp({ ...inp, bearingAllow: v })}
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label={t.forceLabel} value={`${res.F.toFixed(0)} N`} />
          <ResultRow label={t.shearStressLabel} value={`${res.tau.toFixed(1)} MPa`} />
          <ResultRow label={t.crushStressLabel} value={`${res.sigma.toFixed(1)} MPa`} />
          <ResultRow
            label={t.safetyFactorLabel}
            value={`${res.n_shear.toFixed(2)} / ${res.n_bearing.toFixed(2)}`}
          />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.keyNote}</p>
    </section>
  );
}

function GearBlock({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  const [inp, setInp] = useState<GearInputs>(GEAR_INIT);

  const res = useMemo(() => {
    const P = Number(inp.power);
    const n1 = Number(inp.rpm);
    const d1 = Number(inp.pinionDia);
    const b = Number(inp.face);
    const alpha = Number(inp.pressureAngle);
    const i = Number(inp.gearRatio);
    const ok = P > 0 && n1 > 0 && d1 > 0 && b > 0 && alpha > 0 && i > 0;
    if (!ok) return null;
    const torque1 = (9550 * P) / n1;
    const Ft = (2 * torque1 * 1000) / d1;
    const Fr = Ft * Math.tan((alpha * Math.PI) / 180);
    const n2 = n1 / i;
    return { torque1, Ft, Fr, n2 };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{t.gearTitle}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label={t.powerLabel}
          value={inp.power}
          onChange={(v) => setInp({ ...inp, power: v })}
        />
        <Field
          label={t.inRpmLabel}
          value={inp.rpm}
          onChange={(v) => setInp({ ...inp, rpm: v })}
        />
        <Field
          label={t.pinionDiaLabel}
          value={inp.pinionDia}
          onChange={(v) => setInp({ ...inp, pinionDia: v })}
        />
        <Field
          label={t.faceLabel}
          value={inp.face}
          onChange={(v) => setInp({ ...inp, face: v })}
        />
        <Field
          label={t.angleLabel}
          value={inp.pressureAngle}
          onChange={(v) => setInp({ ...inp, pressureAngle: v })}
        />
        <Field
          label={t.ratioLabel}
          value={inp.gearRatio}
          onChange={(v) => setInp({ ...inp, gearRatio: v })}
        />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <ResultRow label={t.torque1Label} value={`${res.torque1.toFixed(1)} Nm`} />
          <ResultRow label={t.ftLabel} value={`${res.Ft.toFixed(0)} N`} />
          <ResultRow label={t.frLabel} value={`${res.Fr.toFixed(0)} N`} />
          <ResultRow label={t.outRpmLabel} value={`${res.n2.toFixed(0)} rpm`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">{t.positivePrompt}</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">{t.gearNote}</p>
    </section>
  );
}

function ComponentGallery({ t }: { t: (typeof COPY)["tr"] | (typeof COPY)["en"] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">{t.galleryTitle}</h2>
        <p className="mt-1 text-xs text-slate-600">{t.gallerySubtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.components.map((component) => (
          <div
            key={component.name}
            className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition hover:shadow-md"
          >
            <div className="relative h-32 w-full bg-slate-100">
              <Image
                src={component.image}
                alt={component.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-slate-900">{component.name}</h3>
              <p className="mt-1 text-xs text-slate-600">{component.description}</p>
            </div>
          </div>
        ))}
      </div>
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
