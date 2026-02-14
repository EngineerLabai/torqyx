"use client";

// app/tools/materials-manufacturing/page.tsx
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";

type MachiningInputs = {
  material: string;
  tool: string;
  vc: string; // m/min
  fz: string; // mm/tooth
  z: string; // teeth
  ap: string; // mm
  ae: string; // mm
  diameter: string; // mm
};

type FitInputs = {
  shaft: string;
  hole: string;
  nominal: string;
};

type WeldInputs = {
  throat: string; // a, mm
  length: string; // mm
  allowStress: string; // MPa
  load: string; // N
};

const MACHINING_INIT: MachiningInputs = {
  material: "C45",
  tool: "Karbid freze",
  vc: "180",
  fz: "0.08",
  z: "4",
  ap: "2",
  ae: "8",
  diameter: "12",
};

const FIT_INIT: FitInputs = {
  shaft: "h7",
  hole: "H7",
  nominal: "40",
};

const WELD_INIT: WeldInputs = {
  throat: "4",
  length: "150",
  allowStress: "140",
  load: "12000",
};

type MaterialsManufacturingClientProps = {
  initialDocs?: ToolDocsResponse | null;
};

export default function MaterialsManufacturingPage({ initialDocs }: MaterialsManufacturingClientProps) {
  return (
    <PageShell>
      <ToolDocTabs slug="materials-manufacturing" initialDocs={initialDocs}>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Malzeme & İmalat
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            Çoklu Hesap
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Malzeme & İmalat Hızlı Paket
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Öğrencilerin sık aradığı üç kısa kontrol: (1) talaşlı imalatta temel Vc/fz hesap
          ve rpm/f ilerleme tahmini, (2) ISO tolerans/fit seçimi için özet, (3) küt kaynak
          taşıma kapasitesi (basit). Katalog ve standartlara göre doğrulayın.
        </p>
      </section>

      <MachiningBlock />
      <FitBlock />
      <WeldBlock />
          </ToolDocTabs>
    </PageShell>
  );
}

function MachiningBlock() {
  const [inp, setInp] = useState<MachiningInputs>(MACHINING_INIT);

  const res = useMemo(() => {
    const vc = Number(inp.vc);
    const fz = Number(inp.fz);
    const z = Number(inp.z);
    const ap = Number(inp.ap);
    const ae = Number(inp.ae);
    const d = Number(inp.diameter);
    if (vc <= 0 || fz <= 0 || z <= 0 || d <= 0) return null;
    const n = (1000 * vc) / (Math.PI * d); // rpm
    const f = fz * z * n; // mm/min
    return { n, f, ap, ae };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        1) Talaşlı İmalat: Temel Kesme Parametresi Tahmini
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Malzeme (not)" value={inp.material} onChange={(v) => setInp({ ...inp, material: v })} />
        <Field label="Takım" value={inp.tool} onChange={(v) => setInp({ ...inp, tool: v })} />
        <Field label="Kesme hızı Vc [m/dk]" value={inp.vc} onChange={(v) => setInp({ ...inp, vc: v })} />
        <Field label="Diş başı ilerleme fz [mm/diş]" value={inp.fz} onChange={(v) => setInp({ ...inp, fz: v })} />
        <Field label="Diş sayısı z" value={inp.z} onChange={(v) => setInp({ ...inp, z: v })} />
        <Field label="Takım çapı d [mm]" value={inp.diameter} onChange={(v) => setInp({ ...inp, diameter: v })} />
        <Field label="ap [mm]" value={inp.ap} onChange={(v) => setInp({ ...inp, ap: v })} />
        <Field label="ae [mm]" value={inp.ae} onChange={(v) => setInp({ ...inp, ae: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <ResultRow label="Devir n" value={`${res.n.toFixed(0)} rpm`} />
          <ResultRow label="İlerleme f" value={`${res.f.toFixed(0)} mm/dk`} />
          <ResultRow label="ap x ae" value={`${res.ap} x ${res.ae} mm`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: Bu, katalogdan alınacak tipik başlangıç değerleri içindir. Takım üreticisi
        önerisi, talaş kırıcı ve bağ materyaline göre Vc/fz ayarlanmalıdır.
      </p>
    </section>
  );
}

function FitBlock() {
  const [inp, setInp] = useState<FitInputs>(FIT_INIT);

  const fits = useMemo(() => {
    const shaft = inp.shaft.toLowerCase();
    const hole = inp.hole.toUpperCase();
    const nominal = Number(inp.nominal);
    if (!nominal || nominal <= 0) return null;

    // Çok basitleştirilmiş tablo: örnek açıklama
    const map: Record<string, { type: string; note: string }> = {
      "H7/h6": { type: "Geçme yok (kayma)", note: "Rulman iç bilezikleri, sökülebilir bağlantı" },
      "H7/g6": { type: "Hafif sıkı", note: "Hafif baskı gereken yerler" },
      "H7/p6": { type: "Sıkı geçme", note: "Daimi sıkı montaj (ör. dişli-pinyon)" },
    };
    const key = `${hole}/${shaft}`;
    const fit = map[key] ?? null;
    return { fit, nominal };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        2) ISO Fit (Hızlı Referans)
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Delik toleransı" value={inp.hole} onChange={(v) => setInp({ ...inp, hole: v })} />
        <Field label="Mil toleransı" value={inp.shaft} onChange={(v) => setInp({ ...inp, shaft: v })} />
        <Field label="Nominal çap [mm]" value={inp.nominal} onChange={(v) => setInp({ ...inp, nominal: v })} />
      </div>
      {fits && fits.fit ? (
        <div className="mt-3">
          <ResultRow label="Fit tipi" value={fits.fit.type} />
          <div className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
            {fits.fit.note} — Detaylı tolerans değeri için ISO 286 tablosuna bakın.
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-amber-700">
          Bu hızlı örnek tablo sınırlıdır. ISO 286 detaylı tablolarından tolerans bandını alın.
        </p>
      )}
    </section>
  );
}

function WeldBlock() {
  const [inp, setInp] = useState<WeldInputs>(WELD_INIT);

  const res = useMemo(() => {
    const a = Number(inp.throat); // mm
    const L = Number(inp.length); // mm
    const allow = Number(inp.allowStress); // MPa
    const F = Number(inp.load); // N
    if (a <= 0 || L <= 0 || allow <= 0 || F <= 0) return null;
    // Fillet weld throat area: A = a * L (basit tek hat)
    const A = a * L; // mm2
    const stress = F / A; // MPa
    const n = allow / stress;
    return { A, stress, n };
  }, [inp]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        3) Kaynak (Küt) Taşıma Kapasitesi (basit)
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Boğaz kalınlığı a [mm]" value={inp.throat} onChange={(v) => setInp({ ...inp, throat: v })} />
        <Field label="Kaynak boyu L [mm]" value={inp.length} onChange={(v) => setInp({ ...inp, length: v })} />
        <Field label="İzinli gerilme [MPa]" value={inp.allowStress} onChange={(v) => setInp({ ...inp, allowStress: v })} />
        <Field label="Yük F [N]" value={inp.load} onChange={(v) => setInp({ ...inp, load: v })} />
      </div>
      {res ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <ResultRow label="Etkin alan A" value={`${res.A.toFixed(0)} mm²`} />
          <ResultRow label="Gerilme F/A" value={`${res.stress.toFixed(2)} MPa`} />
          <ResultRow label="Emniyet n" value={`${res.n.toFixed(2)}`} />
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-red-600">Pozitif değerler gir.</p>
      )}
      <p className="mt-2 text-[11px] text-slate-600">
        Not: Bu, tek doğrultulu statik yük için basit bir kontroldür. Gerçek tasarımda
        kaynak yönü, eksen dışı yük, yorulma ve kaynak kalitesi faktörleri dikkate
        alınmalıdır. Eurocode/ASME/ISO kaynak dayanımı tablolarına bakın.
      </p>
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
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
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


