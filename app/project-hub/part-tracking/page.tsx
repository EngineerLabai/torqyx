// app/project-hub/part-tracking/page.tsx
"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import PageShell from "@/components/layout/PageShell";

type Stage =
  | "Kick-off"
  | "Tasarım"
  | "Numune"
  | "PPAP"
  | "SOP";

type RiskFlag = "Yok" | "Orta" | "Yüksek";

type PartRow = {
  id: number;
  customer: string;
  projectCode: string;
  partCode: string;
  partName: string;
  stage: Stage;
  ppapStatus: string;
  sopDate: string;
  risk: RiskFlag;
  notes: string;
};

type StageFilter = "all" | Stage;

let nextId = 1;

export default function PartTrackingPage() {
  const [rows, setRows] = useState<PartRow[]>([]);
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");

  const [form, setForm] = useState({
    customer: "",
    projectCode: "",
    partCode: "",
    partName: "",
    stage: "Kick-off" as Stage,
    ppapStatus: "",
    sopDate: "",
    risk: "Yok" as RiskFlag,
    notes: "",
  });

  const [error, setError] = useState<string | null>(null);

  function handleChange<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.customer || !form.projectCode || !form.partCode || !form.partName) {
      setError("Müşteri, Proje Kodu, Parça Kodu ve Parça Adı alanları zorunludur.");
      return;
    }

    const newRow: PartRow = {
      id: nextId++,
      customer: form.customer,
      projectCode: form.projectCode,
      partCode: form.partCode,
      partName: form.partName,
      stage: form.stage,
      ppapStatus: form.ppapStatus,
      sopDate: form.sopDate,
      risk: form.risk,
      notes: form.notes,
    };

    setRows((prev) => [newRow, ...prev]);

    setForm((prev) => ({
      ...prev,
      partCode: "",
      partName: "",
      ppapStatus: "",
      sopDate: "",
      notes: "",
    }));
  }

  function handleDelete(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleStageQuickChange(id: number, stage: Stage) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, stage } : r)),
    );
  }

  const filteredRows =
    stageFilter === "all"
      ? rows
      : rows.filter((r) => r.stage === stageFilter);

  // Basit istatistikler
  const total = rows.length;
  const byStageCount: Record<Stage, number> = {
    "Kick-off": rows.filter((r) => r.stage === "Kick-off").length,
    "Tasarım": rows.filter((r) => r.stage === "Tasarım").length,
    "Numune": rows.filter((r) => r.stage === "Numune").length,
    "PPAP": rows.filter((r) => r.stage === "PPAP").length,
    "SOP": rows.filter((r) => r.stage === "SOP").length,
  };

  return (
    <PageShell>
      {/* Başlık */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Proje Mühendisleri Alanı
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
            Parça Durumu Takip Panosu
          </span>
        </div>

        <h1 className="text-lg font-semibold text-slate-900">
          Parça Durumu Takip Panosu
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Kick-off&apos;tan SOP&apos;a kadar proje parçalarının durumunu takip etmek için hafif bir dashboard. Aşamalar:
          Kick-off, Tasarım, Numune, PPAP, SOP. Girdiğin satırlar bu sayfada tutulur. Dışa aktarma (PDF/Excel) premium
          paketinin özel beta kapsamındadır. Erken erişim için{" "}
          <Link href="/pricing" className="font-semibold text-amber-700 hover:underline">
            ücretlendirmeye göz at
          </Link>.
        </p>
      </section>

      {/* İstatistik + Form + Liste */}
      <section className="space-y-4">
        {/* Küçük özet kutuları */}
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <MiniStat label="Toplam parça" value={total.toString()} />
          <MiniStat label="Kick-off" value={byStageCount["Kick-off"].toString()} />
          <MiniStat label="Tasarım" value={byStageCount["Tasarım"].toString()} />
          <MiniStat label="Numune" value={byStageCount["Numune"].toString()} />
          <MiniStat label="PPAP / SOP" value={(byStageCount["PPAP"] + byStageCount["SOP"]).toString()} />
        </div>

        {/* Form + Liste */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.3fr)]">
          {/* Sol: form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Yeni Parça Kaydı
            </h2>

            <form className="space-y-3" onSubmit={handleAdd}>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Müşteri
                  </label>
                  <input
                    type="text"
                    value={form.customer}
                    onChange={(e) => handleChange("customer", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder="Örn. OEM X"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Proje Kodu
                  </label>
                  <input
                    type="text"
                    value={form.projectCode}
                    onChange={(e) =>
                      handleChange("projectCode", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder="Örn. P-2025-01"
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Parça Kodu
                  </label>
                  <input
                    type="text"
                    value={form.partCode}
                    onChange={(e) => handleChange("partCode", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder="Örn. 1234-567-890"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Parça Adı
                  </label>
                  <input
                    type="text"
                    value={form.partName}
                    onChange={(e) => handleChange("partName", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder="Örn. Ön amortisör üst braketi"
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Aşama
                  </label>
                  <select
                    value={form.stage}
                    onChange={(e) =>
                      handleChange("stage", e.target.value as Stage)
                    }
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  >
                    <option>Kick-off</option>
                    <option>Tasarım</option>
                    <option>Numune</option>
                    <option>PPAP</option>
                    <option>SOP</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    PPAP Durumu
                  </label>
                  <input
                    type="text"
                    value={form.ppapStatus}
                    onChange={(e) =>
                      handleChange("ppapStatus", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder="Örn. PPAP level 3, beklemede"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Hedef SOP tarihi
                  </label>
                  <input
                    type="date"
                    value={form.sopDate}
                    onChange={(e) => handleChange("sopDate", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Risk seviyesi
                </label>
                <select
                  value={form.risk}
                  onChange={(e) =>
                    handleChange("risk", e.target.value as RiskFlag)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  <option>Yok</option>
                  <option>Orta</option>
                  <option>Yüksek</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Notlar
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  placeholder="Örn. Tedarikçi riski, kalite açık aksiyonları, müşteri özel isteği..."
                />
              </div>

              {error && (
                <p className="text-[11px] text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
              >
                Parça ekle
              </button>
            </form>
          </div>

          {/* Sağ: liste + filtre */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Parça Listesi
              </h2>
              <StageFilterChips value={stageFilter} onChange={setStageFilter} />
            </div>

            {filteredRows.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                Henüz kayıt yok veya seçili aşamaya uygun parça bulunamadı.
              </p>
            ) : (
              <div className="max-h-80 space-y-2 overflow-auto pr-1">
                {filteredRows.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-slate-900">
                          {row.customer} – {row.projectCode}
                        </span>
                        <span className="text-[11px] text-slate-600">
                          {row.partCode} – {row.partName}
                        </span>
                      </div>
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {row.stage}
                      </span>
                    </div>

                    <div className="mb-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
                      {row.ppapStatus && <span>PPAP: {row.ppapStatus}</span>}
                      {row.sopDate && (
                        <span>
                          SOP:{" "}
                          {new Date(row.sopDate).toLocaleDateString("tr-TR")}
                        </span>
                      )}
                      <span>
                        Risk:{" "}
                        {row.risk === "Yüksek" ? "⚠️ Yüksek" : row.risk}
                      </span>
                    </div>

                    {row.notes && (
                      <p className="text-[11px] text-slate-600">
                        Not: {row.notes}
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {/* Hızlı aşama geçiş butonları */}
                        <QuickStageButton
                          label="Tasarım"
                          onClick={() => handleStageQuickChange(row.id, "Tasarım")}
                        />
                        <QuickStageButton
                          label="Numune"
                          onClick={() => handleStageQuickChange(row.id, "Numune")}
                        />
                        <QuickStageButton
                          label="PPAP"
                          onClick={() => handleStageQuickChange(row.id, "PPAP")}
                        />
                        <QuickStageButton
                          label="SOP"
                          onClick={() => handleStageQuickChange(row.id, "SOP")}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

type MiniStatProps = {
  label: string;
  value: string;
};

function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

type StageFilterChipsProps = {
  value: StageFilter;
  onChange: (v: StageFilter) => void;
};

function StageFilterChips({ value, onChange }: StageFilterChipsProps) {
  const options: { value: StageFilter; label: string }[] = [
    { value: "all", label: "Tümü" },
    { value: "Kick-off", label: "Kick-off" },
    { value: "Tasarım", label: "Tasarım" },
    { value: "Numune", label: "Numune" },
    { value: "PPAP", label: "PPAP" },
    { value: "SOP", label: "SOP" },
  ];

  return (
    <div className="inline-flex flex-wrap gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${
            value === opt.value
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

type QuickStageButtonProps = {
  label: Stage;
  onClick: () => void;
};

function QuickStageButton({ label, onClick }: QuickStageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-slate-300 px-2 py-0.5 text-[10px] text-slate-700 hover:border-slate-400 hover:bg-slate-50"
    >
      {label}
    </button>
  );
}
