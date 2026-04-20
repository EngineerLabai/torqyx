"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { withLocalePrefix } from "@/utils/locale-path";

type ContactRatioCalculatorClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

const t = (locale: "tr" | "en", tr: string, en: string) => (locale === "tr" ? tr : en);

export default function ContactRatioCalculatorPage({ initialDocs }: ContactRatioCalculatorClientProps) {
  const { locale } = useLocale();
  const title = t(locale, "Kontak Oranı Hesaplayıcı", "Contact Ratio Calculator");
  const description = t(
    locale,
    "ISO/DIN full-depth varsayımlarıyla e_alpha (profil) ve e_beta (overlap) hesaplar, toplam temas oranını verir.",
    "Calculates e_alpha (profile) and e_beta (overlap) with ISO/DIN full-depth assumptions and returns total contact ratio.",
  );

  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators/contact-ratio-calculator" initialDocs={initialDocs}>
        <Header title={title} description={description} />
        <ContactRatioCalculator />
      </ToolDocTabs>
    </PageShell>
  );
}

function ContactRatioCalculator() {
  const { locale } = useLocale();
  const [inp, setInp] = useState({
    module: "2",
    z1: "18",
    z2: "54",
    alpha: "20",
    beta: "15",
    faceWidth: "35",
    addendum: "1",
  });

  const res = useMemo(() => {
    const mn = Number(inp.module);
    const z1 = Number(inp.z1);
    const z2 = Number(inp.z2);
    const alphaN = Number(inp.alpha);
    const beta = Number(inp.beta);
    const b = Number(inp.faceWidth);
    const haStar = Number(inp.addendum);

    const valid =
      mn > 0 && z1 > 0 && z2 > 0 && alphaN > 0 && alphaN < 89 && beta >= 0 && beta < 75 && b >= 0 && haStar >= 0;
    if (!valid) return null;

    const betaRad = (beta * Math.PI) / 180;
    const alphaNRad = (alphaN * Math.PI) / 180;
    const cosBeta = Math.cos(betaRad);
    if (cosBeta <= 0) return null;

    const mTrans = mn / cosBeta;
    const alphaTRad = Math.atan(Math.tan(alphaNRad) / cosBeta);
    const basePitch = Math.PI * mTrans * Math.cos(alphaTRad);

    const addendum = haStar * mn;
    const r1 = 0.5 * mTrans * z1;
    const r2 = 0.5 * mTrans * z2;
    const ra1 = r1 + addendum;
    const ra2 = r2 + addendum;
    const rb1 = r1 * Math.cos(alphaTRad);
    const rb2 = r2 * Math.cos(alphaTRad);
    const centerDistance = 0.5 * mTrans * (z1 + z2);

    const path1 = ra1 > rb1 ? Math.sqrt(Math.max(ra1 * ra1 - rb1 * rb1, 0)) : 0;
    const path2 = ra2 > rb2 ? Math.sqrt(Math.max(ra2 * ra2 - rb2 * rb2, 0)) : 0;

    const eAlpha = (path1 + path2 - centerDistance * Math.sin(alphaTRad)) / basePitch;
    const eBeta = beta > 0 && b > 0 ? (b * Math.sin(betaRad)) / (Math.PI * mn) : 0;
    const eTotal = eAlpha + eBeta;

    return { eAlpha, eBeta, eTotal, alphaT: alphaTRad, mTrans, centerDistance };
  }, [inp]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{t(locale, "Kontak Oranı Hesaplayıcı", "Contact Ratio Calculator")}</h2>
          <p className="text-sm text-slate-700">
            {t(
              locale,
              "ISO/DIN standart full-depth (ha* ~ 1, hf* ~ 1.25) için e_alpha (profil) ve e_beta (overlap) hesaplar. Beta = 0 için helis katkısı 0 olur.",
              "Computes e_alpha (profile) and e_beta (overlap) for ISO/DIN standard full-depth (ha* ~ 1, hf* ~ 1.25). For beta = 0, helix contribution is zero.",
            )}
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">{t(locale, "Aktif", "Active")}</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={t(locale, "Modül mn [mm]", "Module mn [mm]")} value={inp.module} onChange={(v) => setInp({ ...inp, module: v })} />
        <Field label={t(locale, "Pinyon diş sayısı z1", "Pinion tooth count z1")} value={inp.z1} onChange={(v) => setInp({ ...inp, z1: v })} />
        <Field label={t(locale, "Çark diş sayısı z2", "Gear tooth count z2")} value={inp.z2} onChange={(v) => setInp({ ...inp, z2: v })} />
        <Field label={t(locale, "Normal basınç açısı α_n [deg]", "Normal pressure angle α_n [deg]")} value={inp.alpha} onChange={(v) => setInp({ ...inp, alpha: v })} />
        <Field label={t(locale, "Helis açısı β [deg]", "Helix angle β [deg]")} value={inp.beta} onChange={(v) => setInp({ ...inp, beta: v })} />
        <Field label={t(locale, "Yüz genişliği b [mm]", "Face width b [mm]")} value={inp.faceWidth} onChange={(v) => setInp({ ...inp, faceWidth: v })} />
        <Field label={t(locale, "Addendum katsayısı ha*", "Addendum coefficient ha*")} value={inp.addendum} onChange={(v) => setInp({ ...inp, addendum: v })} />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setInp({ module: "2", z1: "18", z2: "54", alpha: "20", beta: "15", faceWidth: "35", addendum: "1" })}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            {t(locale, "Örnek değerlerle doldur", "Fill with sample values")}
          </button>
        </div>
      </div>

      {res ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label={t(locale, "Profil kontak oranı e_alpha", "Profile contact ratio e_alpha")} value={res.eAlpha.toFixed(3)} />
          <Result label={t(locale, "Overlap oranı e_beta", "Overlap ratio e_beta")} value={res.eBeta.toFixed(3)} />
          <Result
            label={t(locale, "Toplam kontak oranı e", "Total contact ratio e")}
            value={res.eTotal.toFixed(3)}
            tone={res.eTotal >= 1.2 ? "ok" : res.eTotal >= 1 ? "neutral" : "warn"}
          />
          <Result label={t(locale, "Transvers modül m_t [mm]", "Transverse module m_t [mm]")} value={res.mTrans.toFixed(3)} />
          <Result label={t(locale, "Transvers basınç açısı α_t [deg]", "Transverse pressure angle α_t [deg]")} value={((res.alphaT * 180) / Math.PI).toFixed(2)} />
          <Result label={t(locale, "Merkez mesafesi a [mm]", "Center distance a [mm]")} value={res.centerDistance.toFixed(2)} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">{t(locale, "Pozitif ve geçerli standart değerler giriniz.", "Enter positive and valid standard values.")}</p>
      )}

      <p className="mt-3 text-[11px] text-slate-600">
        {t(
          locale,
          "e_alpha formülünde baz hatvesi p_b = π·m_t·cos(α_t) kullanıldı. e_beta = b*sin(β)/(π·mn); beta = 0 için e_beta = 0. ha* = 1 (standart addendum). hf* ~ 1.25 için dip emniyeti kontrolü ayrıca yapılmalıdır.",
          "In the e_alpha formula, base pitch p_b = π·m_t·cos(α_t) is used. e_beta = b*sin(β)/(π·mn); for beta = 0, e_beta = 0. ha* = 1 (standard addendum). Root safety should be checked separately for hf* ~ 1.25.",
        )}
      </p>
    </section>
  );
}

function Header({ title, description }: { title: string; description: string }) {
  const { locale } = useLocale();
  const calculatorsHref = withLocalePrefix("/tools/gear-design/calculators", locale);
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
      <div className="relative space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={calculatorsHref}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {t(locale, "← Tüm hesaplayıcılar", "← All calculators")}
          </Link>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            {t(locale, "Kontak Oranı", "Contact Ratio")}
          </span>
        </div>
        <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">{title}</h1>
        <p className="text-sm leading-relaxed text-slate-700">{description}</p>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
        aria-label="Number input"
      />
    </label>
  );
}

function Result({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "warn" | "ok" }) {
  const toneClass =
    tone === "warn"
      ? "bg-amber-50 text-amber-800"
      : tone === "ok"
        ? "bg-emerald-50 text-emerald-800"
        : "bg-slate-50 text-slate-800";

  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${toneClass}`}>
      <span className="text-slate-600">{label}</span>
      <span className="font-mono text-[12px] font-semibold">{value}</span>
    </div>
  );
}
