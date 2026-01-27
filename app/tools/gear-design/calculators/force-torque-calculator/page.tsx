"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";

export default function ForceTorqueCalculatorPage() {
  return (
    <PageShell>
      <ToolDocTabs slug="gear-design/calculators/force-torque-calculator">
      <Header
        title="Çevresel Kuvvet / Tork Hesaplayıcı"
        description="Güç/rpm veya tork gir; Ft, Fr (basınç açısı) ve Fa (helis açısı) otomatik hesaplanır."
      />
      <ForceTorqueCalculator />
          </ToolDocTabs>
    </PageShell>
  );
}

function ForceTorqueCalculator() {
  const [inp, setInp] = useState({
    power: "5",
    rpm: "1500",
    torque: "",
    diameter: "120",
    alpha: "20",
    beta: "0",
  });

  const res = useMemo(() => {
    const P = Number(inp.power);
    const n = Number(inp.rpm);
    const Tinput = Number(inp.torque);
    const d = Number(inp.diameter);
    const alpha = Number(inp.alpha);
    const beta = Number(inp.beta);
    const okGeom = d > 0 && alpha > 0;
    const hasPowerTorque = (P > 0 && n > 0) || Tinput > 0;
    if (!okGeom || !hasPowerTorque) return null;
    const T = Tinput > 0 ? Tinput : (9550 * P) / n; // Nm
    const Ft = (2000 * T) / d; // N (d in mm)
    const Fr = Ft * Math.tan((alpha * Math.PI) / 180);
    const Fa = Ft * Math.tan((beta * Math.PI) / 180);
    return { T, Ft, Fr, Fa };
  }, [inp]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Çevresel Kuvvet / Tork Hesaplayıcı</h2>
          <p className="text-sm text-slate-700">
            Güç/rpm veya tork gir; Ft, Fr (basınç açısı) ve Fa (helis açısı) otomatik hesaplanır.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">Aktif</span>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Güç P [kW]" value={inp.power} onChange={(v) => setInp({ ...inp, power: v })} />
        <Field label="Devir n [rpm]" value={inp.rpm} onChange={(v) => setInp({ ...inp, rpm: v })} />
        <Field
          label="Tork T [Nm] (opsiyonel, P ve n yoksa)"
          value={inp.torque}
          onChange={(v) => setInp({ ...inp, torque: v })}
        />
        <Field label="Pinyon çapı d [mm]" value={inp.diameter} onChange={(v) => setInp({ ...inp, diameter: v })} />
        <Field label="Basınç açısı α [deg]" value={inp.alpha} onChange={(v) => setInp({ ...inp, alpha: v })} />
        <Field label="Helis açısı β [deg]" value={inp.beta} onChange={(v) => setInp({ ...inp, beta: v })} />
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-600">
        <button
          type="button"
          onClick={() => setInp({ power: "5", rpm: "1500", torque: "", diameter: "120", alpha: "20", beta: "0" })}
          className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
        >
          Örnek değerlerle doldur
        </button>
        <span>Ft = 2·π·T/d; Fr = Ft·tan(α); Fa = Ft·tan(β).</span>
      </div>

      {res ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Result label="Tork T [Nm]" value={`${res.T.toFixed(2)} Nm`} />
          <Result label="Ft [N]" value={`${res.Ft.toFixed(1)} N`} />
          <Result label="Fr [N]" value={`${res.Fr.toFixed(1)} N`} />
          <Result label="Fa [N]" value={`${res.Fa.toFixed(1)} N`} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-red-600">P/n veya T ile pozitif geometri değerleri giriniz.</p>
      )}
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
            Kuvvet/Tork
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


