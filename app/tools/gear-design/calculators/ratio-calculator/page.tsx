"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

export default function RatioCalculatorPage() {
  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators/ratio-calculator">
      <Header
        title="Dişli Oranı Hesaplayıcı"
        description="Diş sayıları ve giriş devrini gir; oran, çıkış devri ve torku (verim dahil) hesaplar."
      />
      <RatioCalculator />
          </ToolDocTabs>
    </PageShell>
  );
}

function RatioCalculator() {
  const [inp, setInp] = useState({
    z1: "20",
    z2: "60",
    rpm1: "1500",
    torque1: "50",
    efficiency: "0.97",
  });

  const res = useMemo(() => {
    const z1 = Number(inp.z1);
    const z2 = Number(inp.z2);
    const rpm1 = Number(inp.rpm1);
    const torque1 = Number(inp.torque1);
    const eta = Number(inp.efficiency);
    const ok = z1 > 0 && z2 > 0 && eta > 0 && eta <= 1;
    if (!ok) return null;
    const ratio = z2 / z1;
    const rpm2 = isFinite(rpm1) && rpm1 > 0 ? rpm1 / ratio : null;
    const torque2 = isFinite(torque1) && torque1 > 0 ? torque1 * ratio * eta : null;
    return { ratio, rpm2, torque2, eta };
  }, [inp]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Dişli Oranı Hesaplayıcı</h2>
          <p className="text-sm text-slate-700">
            Diş sayılarını ve giriş devrini gir; oran, çıkış devri ve torku (verim dahil) hesapla.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">Aktif</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Giriş diş sayısı z1" value={inp.z1} onChange={(v) => setInp({ ...inp, z1: v })} />
        <Field label="Çıkış diş sayısı z2" value={inp.z2} onChange={(v) => setInp({ ...inp, z2: v })} />
        <Field label="Giriş devri n1 [rpm]" value={inp.rpm1} onChange={(v) => setInp({ ...inp, rpm1: v })} />
        <Field label="Giriş torku T1 [Nm]" value={inp.torque1} onChange={(v) => setInp({ ...inp, torque1: v })} />
        <Field label="Verim η (0-1)" value={inp.efficiency} onChange={(v) => setInp({ ...inp, efficiency: v })} />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setInp({ z1: "20", z2: "60", rpm1: "1500", torque1: "50", efficiency: "0.97" })}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
          >
            Örnek değerlerle doldur
          </button>
        </div>
      </div>

      {res ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label="Oran i = z2/z1" value={res.ratio.toFixed(3)} />
          <Result label="Çıkış devri n2 [rpm]" value={res.rpm2 ? res.rpm2.toFixed(1) : "?"} />
          <Result label="Çıkış torku T2 [Nm]" value={res.torque2 ? res.torque2.toFixed(1) : "?"} />
          <Result label="Verim η" value={res.eta.toFixed(3)} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">z1, z2 ve verim değerlerini pozitif giriniz (η ≤ 1).</p>
      )}

      <p className="mt-3 text-[11px] text-slate-600">
        Not: T2 hesabında verim katsayısı η çarpılır. Giriş rpm/tork girilmezse sadece oran hesaplanır.
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
            Oranlar
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


