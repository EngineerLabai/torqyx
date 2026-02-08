"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

type ViscositySelectorClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function ViscositySelectorPage({ initialDocs }: ViscositySelectorClientProps) {
  return (
    <PageShell>
      <ToolDocTabs
        slug="gear-design/calculators/viscosity-selector"
        initialDocs={initialDocs}
      >
      <Header
        title="Yağ Viskozitesi Seçici"
        description="ks/v faktörüne ve yağlama yöntemine göre ISO VG önerir; hız ve sıcaklığa göre ayarlanır."
      />
      <ViscositySelector />
          </ToolDocTabs>
    </PageShell>
  );
}

function ViscositySelector() {
  const [inp, setInp] = useState({
    ks: "25", // N/mm
    speed: "12", // m/s
    method: "splash",
    temp: "70", // °C
  });

  const res = useMemo(() => {
    const ks = Number(inp.ks);
    const v = Number(inp.speed);
    const temp = Number(inp.temp);
    const method = inp.method;
    const valid = ks > 0 && v >= 0 && temp > 0 && ["splash", "bath", "spray"].includes(method);
    if (!valid) return null;

    const ISO_VG = [46, 68, 100, 150, 220, 320, 460, 680];
    const factor = ks / Math.max(v, 0.1); // ks/v

    let idx = 1; // start at VG 68
    if (factor < 0.8) idx = 0;
    else if (factor < 2) idx = 1;
    else if (factor < 4) idx = 2;
    else if (factor < 7) idx = 3;
    else if (factor < 12) idx = 4;
    else if (factor < 25) idx = 5;
    else if (factor < 45) idx = 6;
    else idx = 7;

    if (method === "spray" && v > 15 && idx > 0) idx -= 1; // yüksek hızda jet/spreyle daha düşük VG
    if (method !== "spray" && ks > 40 && v < 6 && idx < ISO_VG.length - 1) idx += 1; // yüksek ks + düşük hız için daha yüksek VG
    if (temp > 85 && idx < ISO_VG.length - 1) idx += 1; // yüksek sıcaklıkta film için artır
    if (temp < 50 && v > 12 && method === "spray" && idx > 0) idx -= 1; // soğuk ve yüksek hızda bir alt VG

    const grade = ISO_VG[idx];
    const lower = ISO_VG[Math.max(0, idx - 1)];
    const upper = ISO_VG[Math.min(ISO_VG.length - 1, idx + 1)];

    return { grade, lower, upper, factor, method, ks, v, temp };
  }, [inp]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Yağ Viskozitesi Seçici</h2>
          <p className="text-sm text-slate-700">
            ks/v faktörüne ve yağlama yöntemine göre ISO VG önerir. Jet/püskürtme için yüksek hızda daha düşük VG, yüksek ks ve
            düşük hız için daha yüksek VG önerilir.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">Aktif</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="ks [N/mm]" value={inp.ks} onChange={(v) => setInp({ ...inp, ks: v })} />
        <Field label="Hatve hızı v [m/s]" value={inp.speed} onChange={(v) => setInp({ ...inp, speed: v })} />
        <SelectField
          label="Yağlama yöntemi"
          value={inp.method}
          onChange={(v) => setInp({ ...inp, method: v })}
          options={[
            { value: "splash", label: "Sarmal/splash" },
            { value: "bath", label: "Daldırma/bath" },
            { value: "spray", label: "Püskürtme/jet" },
          ]}
        />
        <Field label="Hedef yağ sıcaklığı [°C]" value={inp.temp} onChange={(v) => setInp({ ...inp, temp: v })} />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setInp({ ks: "25", speed: "12", method: "splash", temp: "70" })}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            Örnek değerlerle doldur
          </button>
        </div>
      </div>

      {res ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label="Önerilen ISO VG" value={`VG ${res.grade}`} />
          <Result label="Alternatif aralık" value={`VG ${res.lower} - VG ${res.upper}`} />
          <Result label="ks/v faktörü" value={res.factor.toFixed(2)} />
          <Result label="Yöntem" value={res.method === "spray" ? "Püskürtme/jet" : res.method === "bath" ? "Daldırma" : "Splash"} />
          <Result label="Hız v [m/s]" value={res.v.toFixed(2)} />
          <Result label="Hedef yağ T [°C]" value={res.temp.toFixed(1)} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">Pozitif ks, hız ve sıcaklık değerleri giriniz.</p>
      )}

      <p className="mt-3 text-[11px] text-slate-600">
        ks/v yaklaşımı DIN/ISO yağlama seçim tablolarına benzer şekilde kullanıldı. Püskürtme (jet) için yüksek hızlarda bir alt
        VG seçilir; daldırma/splash ve yüksek ks + düşük hız için bir üst VG seçilir. Sıcaklık 85 °C üzerindeyse bir üst VG
        tercih edin. Detaylı seçim için kendi tablolarınızı referans alın.
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
            Yağlama
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/30"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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


