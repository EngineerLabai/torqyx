// app/project-hub/rfq/page.tsx
"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import PageShell from "@/components/layout/PageShell";

type RfqItem = {
  id: number;
  customer: string;
  projectCode: string;
  partName: string;
  annualVolume: string;
  sopDate: string;
  qualityNotes: string;
  status: "Açık" | "Çalışılıyor" | "Kapatıldı";
};

type StatusFilter = "all" | RfqItem["status"];

const STATUS_OPTIONS: RfqItem["status"][] = [
  "Açık",
  "Çalışılıyor",
  "Kapatıldı",
];

let nextId = 1;

export default function RfqSummaryPage() {
  const [items, setItems] = useState<RfqItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [form, setForm] = useState({
    customer: "",
    projectCode: "",
    partName: "",
    annualVolume: "",
    sopDate: "",
    qualityNotes: "",
    status: "Açık" as RfqItem["status"],
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

    if (!form.customer || !form.projectCode || !form.partName) {
      setError("Müşteri, Proje Kodu ve Parça alanları zorunludur.");
      return;
    }

    const newItem: RfqItem = {
      id: nextId++,
      customer: form.customer,
      projectCode: form.projectCode,
      partName: form.partName,
      annualVolume: form.annualVolume,
      sopDate: form.sopDate,
      qualityNotes: form.qualityNotes,
      status: form.status,
    };

    setItems((prev) => [newItem, ...prev]);

    // Formu kısmen sıfırlayalım
    setForm((prev) => ({
      ...prev,
      partName: "",
      annualVolume: "",
      sopDate: "",
      qualityNotes: "",
    }));
  }

  function handleDelete(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleStatusChange(id: number, status: RfqItem["status"]) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  const filteredItems =
    statusFilter === "all"
      ? items
      : items.filter((item) => item.status === statusFilter);

  return (
    <PageShell>
      {/* Baş kısım */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Proje Mühendisleri Alanı
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
            RFQ / Teknik Şartname Özeti
          </span>
        </div>

        <h1 className="text-lg font-semibold text-slate-900">
          RFQ / Teknik Şartname Özeti
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Müşteriden gelen RFQ ve teknik şartnameleri; müşteri, proje kodu, parça adı, hedef adet ve SOP bilgisi ile
          özetlemek için hafif bir takip ekranı. Girdiğin satırlar bu sayfada tutulur. PDF/Excel dışa aktarma premium
          paketinin özel beta kapsamındadır. Erken erişim için{" "}
          <Link href="/pricing" className="font-semibold text-amber-700 hover:underline">
            ücretlendirmeye göz at
          </Link>.
        </p>
      </section>

      {/* Form + Liste + Premium export alanı */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Sol: RFQ formu */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Yeni RFQ / Teknik Şartname Satırı
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
                  placeholder="Örn. OEM X, Tier1 Y"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Proje Kodu
                </label>
                <input
                  type="text"
                  value={form.projectCode}
                  onChange={(e) => handleChange("projectCode", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  placeholder="Örn. P-2025-01"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Parça Adı / Kodu
              </label>
              <input
                type="text"
                value={form.partName}
                onChange={(e) => handleChange("partName", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Ön amortisör üst bağlantı braketi"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Hedef adet / yıl
                </label>
                <input
                  type="text"
                  value={form.annualVolume}
                  onChange={(e) =>
                    handleChange("annualVolume", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                  placeholder="Örn. 50.000"
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

              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-700">
                  Durum
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as RfqItem["status"])
                  }
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Özel kalite / test notları
              </label>
              <textarea
                value={form.qualityNotes}
                onChange={(e) =>
                  handleChange("qualityNotes", e.target.value)
                }
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Özel tuz testi, ek sızdırmazlık testi, müşteri şartnamesi XYZ-123'e referans..."
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
              Satıra ekle
            </button>
          </form>
        </div>

        {/* Sağ: Liste + Premium export box */}
        <div className="space-y-4">
          {/* Liste */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                RFQ Listesi
              </h2>
              <StatusFilterChips
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>

            {filteredItems.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                Henüz kayıt yok. Soldaki formdan bir RFQ satırı ekleyebilirsin.
              </p>
            ) : (
              <div className="max-h-80 space-y-2 overflow-auto pr-1">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-slate-900">
                          {item.customer} – {item.projectCode}
                        </span>
                        <span className="text-[11px] text-slate-600">
                          {item.partName}
                        </span>
                      </div>
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {item.status}
                      </span>
                    </div>

                    <div className="mb-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
                      {item.annualVolume && (
                        <span>Hedef adet/yıl: {item.annualVolume}</span>
                      )}
                      {item.sopDate && (
                        <span>
                          Hedef SOP:{" "}
                          {new Date(item.sopDate).toLocaleDateString("tr-TR")}
                        </span>
                      )}
                    </div>

                    {item.qualityNotes && (
                      <p className="text-[11px] text-slate-600">
                        Not: {item.qualityNotes}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-slate-600">
                          Durumu değiştir
                        </span>
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              item.id,
                              e.target.value as RfqItem["status"],
                            )
                          }
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[10px] text-slate-700 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
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

          {/* Premium export kutusu */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[11px] text-amber-900 shadow-sm">
            <h3 className="mb-1 text-sm font-semibold">PDF / Excel&apos;e Aktar - Premium (özel beta)</h3>
            <p className="mb-2">
              RFQ listenizi PDF veya Excel olarak dışa aktarma ve ekiplerle paylaşma özelliği premium paketinin özel beta
              kapsamındadır. Erken erişim için{" "}
              <Link href="/pricing" className="font-semibold text-amber-700 hover:underline">
                ücretlendirmeye göz at
              </Link>.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled
                className="flex-1 rounded-full border border-amber-300 px-3 py-1.5 font-semibold text-amber-700 opacity-60"
              >
                PDF&apos;e Aktar (Premium)
              </button>
              <button
                type="button"
                disabled
                className="flex-1 rounded-full border border-amber-300 px-3 py-1.5 font-semibold text-amber-700 opacity-60"
              >
                Excel&apos;e Aktar (Premium)
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

type StatusFilterChipsProps = {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
};

function StatusFilterChips({ value, onChange }: StatusFilterChipsProps) {
  const options: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Tümü" },
    ...STATUS_OPTIONS.map((status) => ({ value: status, label: status })),
  ];

  return (
    <div className="inline-flex gap-1">
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
