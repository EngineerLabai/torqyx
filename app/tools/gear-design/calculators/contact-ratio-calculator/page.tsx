"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

export default function ContactRatioCalculatorPage() {
  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators/contact-ratio-calculator">
      <Header
        title="Kontak Oranı Hesaplayıcı"
        description="ISO/DIN full-depth varsayımlarıyla e_alpha (profil) ve e_beta (overlap) hesaplar, toplam temas oranını verir."
      />
      <ContactRatioCalculator />
          </ToolDocTabs>
    </PageShell>
  );
}

function ContactRatioCalculator() {
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

    const mTrans = mn / cosBeta; // transverse module (ISO 21771 dönüşümü)
    const alphaTRad = Math.atan(Math.tan(alphaNRad) / cosBeta);
    const basePitch = Math.PI * mTrans * Math.cos(alphaTRad);

    const addendum = haStar * mn; // standart full-depth için ha* = 1
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

    return { eAlpha, eBeta, eTotal, alphaT: alphaTRad, mTrans, basePitch, centerDistance };
  }, [inp]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Kontak Oranı Hesaplayıcı</h2>
          <p className="text-sm text-slate-700">
            ISO/DIN standart full-depth (ha* ~ 1, hf* ~ 1.25) için e_alpha (profil) ve e_beta (overlap) hesaplar. Beta = 0
            için helis katkısı 0 olur.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">Aktif</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Modül mn [mm]" value={inp.module} onChange={(v) => setInp({ ...inp, module: v })} />
        <Field label="Pinyon diş sayısı z1" value={inp.z1} onChange={(v) => setInp({ ...inp, z1: v })} />
        <Field label="Çark diş sayısı z2" value={inp.z2} onChange={(v) => setInp({ ...inp, z2: v })} />
        <Field label="Normal basınç açısı α_n [deg]" value={inp.alpha} onChange={(v) => setInp({ ...inp, alpha: v })} />
        <Field label="Helis açısı β [deg]" value={inp.beta} onChange={(v) => setInp({ ...inp, beta: v })} />
        <Field label="Yüz genişliği b [mm]" value={inp.faceWidth} onChange={(v) => setInp({ ...inp, faceWidth: v })} />
        <Field label="Addendum katsayısı ha*" value={inp.addendum} onChange={(v) => setInp({ ...inp, addendum: v })} />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() =>
              setInp({ module: "2", z1: "18", z2: "54", alpha: "20", beta: "15", faceWidth: "35", addendum: "1" })
            }
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            Örnek değerlerle doldur
          </button>
        </div>
      </div>

      {res ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label="Profil kontak oranı e_alpha" value={res.eAlpha.toFixed(3)} />
          <Result label="Overlap oranı e_beta" value={res.eBeta.toFixed(3)} />
          <Result
            label="Toplam kontak oranı e"
            value={res.eTotal.toFixed(3)}
            tone={res.eTotal >= 1.2 ? "ok" : res.eTotal >= 1 ? "neutral" : "warn"}
          />
          <Result label="Transvers modül m_t [mm]" value={res.mTrans.toFixed(3)} />
          <Result label="Transvers basınç açısı α_t [deg]" value={((res.alphaT * 180) / Math.PI).toFixed(2)} />
          <Result label="Merkez mesafesi a [mm]" value={res.centerDistance.toFixed(2)} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">Pozitif ve geçerli standart değerler giriniz.</p>
      )}

      <p className="mt-3 text-[11px] text-slate-600">
        e_alpha formülünde baz hatvesi p_b = π·m_t·cos(α_t) kullanıldı. e_beta = b*sin(β)/(π·mn); beta = 0 için e_beta = 0.
        ha* = 1 (standart addendum). hf* ~ 1.25 için dip emniyeti kontrolü ayrıca yapılmalıdır.
      </p>
    </section>
  );
}

function Header({ title, description }: { title: string; description: string }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_24%)]" />
      <div className="relative space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/tools/gear-design/calculators"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            ← Tüm hesaplayıcılar
          </Link>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
            Kontak Oranı
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


