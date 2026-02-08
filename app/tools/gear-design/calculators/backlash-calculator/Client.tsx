"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

const STEEL_ALPHA = 12e-6; // 1/°C

type BacklashCalculatorClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function BacklashCalculatorPage({ initialDocs }: BacklashCalculatorClientProps) {
  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators/backlash-calculator" initialDocs={initialDocs}>
      <Header
        title="Backlash Hesaplayıcı"
        description="Modül, yüz genişliği, merkez mesafesi ve sıcaklık farkı ile min/nom/max backlash tahmini yapar (basit rehber)."
      />
      <BacklashCalculator />
          </ToolDocTabs>
    </PageShell>
  );
}

function BacklashCalculator() {
  const [inp, setInp] = useState({
    module: "2",
    faceWidth: "30",
    centerDistance: "150",
    deltaT: "10",
    alphaTh: "12",
  });

  const res = useMemo(() => {
    const m = Number(inp.module);
    const b = Number(inp.faceWidth);
    const a = Number(inp.centerDistance);
    const dT = Number(inp.deltaT);
    const alphaTh = Number(inp.alphaTh) * 1e-6 || STEEL_ALPHA;
    const ok = m > 0 && b > 0 && a > 0;
    if (!ok) return null;
    const jNom = 0.04 * m + 0.001 * b; // basit nominal backlash tahmini
    const jMin = 0.8 * jNom;
    const jMax = 1.2 * jNom;
    const thermal = a * alphaTh * dT; // merkez mesafesi termal genleşme
    const jNomAdj = jNom + thermal;
    const jMinAdj = jMin + thermal;
    const jMaxAdj = jMax + thermal;
    return { jNom, jMin, jMax, thermal, jNomAdj, jMinAdj, jMaxAdj };
  }, [inp]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Backlash Hesaplayıcı</h2>
          <p className="text-sm text-slate-700">
            Modül, yüz genişliği, merkez mesafesi ve sıcaklık farkı ile min/nom/max backlash tahmini yapar (basit rehber).
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">Aktif</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Modül m [mm]" value={inp.module} onChange={(v) => setInp({ ...inp, module: v })} />
        <Field label="Yüz genişliği b [mm]" value={inp.faceWidth} onChange={(v) => setInp({ ...inp, faceWidth: v })} />
        <Field
          label="Merkez mesafesi a [mm]"
          value={inp.centerDistance}
          onChange={(v) => setInp({ ...inp, centerDistance: v })}
        />
        <Field label="Sıcaklık farkı ΔT [°C]" value={inp.deltaT} onChange={(v) => setInp({ ...inp, deltaT: v })} />
        <Field
          label="Isıl genleşme α_th [µm/m·°C]"
          value={inp.alphaTh}
          onChange={(v) => setInp({ ...inp, alphaTh: v })}
        />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() =>
              setInp({ module: "2", faceWidth: "30", centerDistance: "150", deltaT: "10", alphaTh: "12" })
            }
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            Örnek değerlerle doldur
          </button>
        </div>
      </div>

      {res ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label="Min backlash j_min [mm]" value={`${res.jMin.toFixed(3)} mm`} />
          <Result label="Nominal backlash j_nom [mm]" value={`${res.jNom.toFixed(3)} mm`} />
          <Result label="Maksimum backlash j_max [mm]" value={`${res.jMax.toFixed(3)} mm`} />
          <Result label="Termal düzeltme Δa [mm]" value={`${res.thermal.toFixed(4)} mm`} />
          <Result label="Nominal (ΔT sonrası)" value={`${res.jNomAdj.toFixed(3)} mm`} />
          <Result label="Min/Max (ΔT sonrası)" value={`${res.jMinAdj.toFixed(3)} / ${res.jMaxAdj.toFixed(3)} mm`} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">Pozitif değerler giriniz.</p>
      )}

      <p className="mt-3 text-[11px] text-slate-600">
        Bu tahmin ISO/DIN rehber mantığına uygun basit bir ön hesap yaklaşımıdır; gerçek tolerans sınıfı ve çizim gereksinimleri
        için standart tablolara bakınız.
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
            Backlash
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


