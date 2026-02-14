"use client";

// app/tools/belt-length/page.tsx
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

type Inputs = {
  d1: string;
  d2: string;
  center: string;
};

const INITIAL: Inputs = {
  d1: "120",
  d2: "80",
  center: "400",
};

type BeltLengthClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function BeltLengthPage({ initialDocs }: BeltLengthClientProps) {
  const [inputs, setInputs] = useState<Inputs>(INITIAL);

  const results = useMemo(() => {
    const d1 = Number(inputs.d1);
    const d2 = Number(inputs.d2);
    const c = Number(inputs.center);
    if (d1 <= 0 || d2 <= 0 || c <= (d1 + d2) / 2) {
      return null;
    }
    // Açık kayış uzunluğu formülü
    const term1 = 2 * c;
    const term2 = (Math.PI / 2) * (d1 + d2);
    const term3 = ((d2 - d1) * (d2 - d1)) / (4 * c);
    const L = term1 + term2 + term3;

    // Sarma açısı (küçük kasnak) radyan ve derece
    const betaSmall = Math.PI - 2 * Math.asin((d2 - d1) / (2 * c));
    const betaSmallDeg = (betaSmall * 180) / Math.PI;

    return { length: L, betaSmallDeg };
  }, [inputs]);

  function handleChange<K extends keyof Inputs>(key: K, value: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <PageShell>
      <ToolDocTabs slug="belt-length" initialDocs={initialDocs}>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Kasnak
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            Kayış
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Kasnak Kayışı Uzunluğu ve Sarma Açısı
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Açık kayış konfigürasyonunda iki kasnak çapı ve merkez mesafesine göre kayış
          uzunluğunu ve küçük kasnak sarma açısını hesaplar. Formül düz hat tahmini içindir;
          germe, polikayış diş profili ve üretici toleransları ayrıca dikkate alınmalıdır.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Girişler</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Kasnak 1 çapı D1 [mm]"
              value={inputs.d1}
              onChange={(v) => handleChange("d1", v)}
            />
            <Field
              label="Kasnak 2 çapı D2 [mm]"
              value={inputs.d2}
              onChange={(v) => handleChange("d2", v)}
            />
            <Field
              label="Merkez mesafesi C [mm]"
              value={inputs.center}
              onChange={(v) => handleChange("center", v)}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-600">
            Koşul: C &gt; (D1+D2)/2; aksi halde kayış geometrisi oluşmaz. Germe payını
            uzunluk sonucuna eklemek gerekir (tipik %0.5–1).
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Sonuçlar</h3>
          {results ? (
            <div className="space-y-2">
              <ResultRow
                label="Kayış uzunluğu"
                value={`${results.length.toFixed(1)} mm`}
              />
              <ResultRow
                label="Küçük kasnak sarma açısı"
                value={`${results.betaSmallDeg.toFixed(1)}°`}
              />
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                Formül: L = 2C + π/2(D1+D2) + (D2−D1)²/(4C). Küçük kasnak sarma açısı:
                β = π − 2·arcsin((D2−D1)/(2C)). Kapalı kayış veya çapraz düzen için farklı
                formüller gerekir.
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-red-600">
              D1, D2 &gt; 0 ve C &gt; (D1+D2)/2 olacak şekilde değer girin.
            </p>
          )}
        </div>
      </section>
          </ToolDocTabs>
    </PageShell>
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
      />
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


