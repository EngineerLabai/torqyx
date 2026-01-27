// app/quality-tools/kaizen/page.tsx
"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";

type ActionRow = {
  id: string;
  task: string;
  owner: string;
  due: string;
  status: "planlandı" | "devam" | "tamam";
};

type KaizenForm = {
  title: string;
  area: string;
  problem: string;
  currentState: string;
  targetState: string;
  rootCause: string;
  metricsBefore: string;
  metricsAfter: string;
  gains: string;
  lessons: string;
  risks: string;
};

const INITIAL_FORM: KaizenForm = {
  title: "",
  area: "",
  problem: "",
  currentState: "",
  targetState: "",
  rootCause: "",
  metricsBefore: "",
  metricsAfter: "",
  gains: "",
  lessons: "",
  risks: "",
};

const STATUS_OPTIONS: ActionRow["status"][] = ["planlandı", "devam", "tamam"];

function uuid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function KaizenPage() {
  const [form, setForm] = useState<KaizenForm>(INITIAL_FORM);
  const [actions, setActions] = useState<ActionRow[]>([
    {
      id: uuid(),
      task: "",
      owner: "",
      due: "",
      status: "planlandı",
    },
  ]);

  function handleFormChange(key: keyof KaizenForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleActionChange(id: string, key: keyof ActionRow, value: string) {
    setActions((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    );
  }

  function addAction() {
    setActions((prev) => [
      ...prev,
      { id: uuid(), task: "", owner: "", due: "", status: "planlandı" },
    ]);
  }

  function removeAction(id: string) {
    setActions((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setActions([{ id: uuid(), task: "", owner: "", due: "", status: "planlandı" }]);
  }

  return (
    <PageShell>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Kaizen
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-medium text-emerald-700">
            Beta
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Kaizen / Sürekli İyileştirme Kartı
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Küçük ama sürekli iyileştirmeleri hızlıca tanımla, aksiyonları
          sahiplen, sonuç ve kazanımları kaydet. Bu taslak; problem, hedef,
          aksiyon listesi ve “önce/sonra” metrikleri tek sayfada toplar.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Temel Bilgiler</h2>
          <button
            onClick={handleReset}
            className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
          >
            Formu temizle
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            label="Başlık / Kaizen adı"
            value={form.title}
            onChange={(v) => handleFormChange("title", v)}
            placeholder="Örn: Operasyon 30 çevrim süresi iyileştirme"
          />
          <Field
            label="Alan / Hat / Hücre"
            value={form.area}
            onChange={(v) => handleFormChange("area", v)}
            placeholder="Örn: Hat B, Operasyon 30"
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Problem & Hedef</h3>
          <div className="space-y-3">
            <TextArea
              label="Problem / Mevcut durum"
              value={form.problem}
              onChange={(v) => handleFormChange("problem", v)}
              placeholder="Örn: Çevrim süresi ort. 54 sn, hedef 45 sn; darboğaz Operasyon 30, bekleme ve malzeme besleme eksik."
            />
            <TextArea
              label="Kök neden (özet)"
              value={form.rootCause}
              onChange={(v) => handleFormChange("rootCause", v)}
              placeholder="Örn: Besleme operatörü iki hatta bakıyor; malzeme arabası tasarımı çift yönlü değil; standart iş yok."
            />
            <TextArea
              label="Hedef durum"
              value={form.targetState}
              onChange={(v) => handleFormChange("targetState", v)}
              placeholder="Örn: Çevrim süresi ≤ 45 sn, malzeme besleme gecikmesi sıfır, WIP dengeli."
            />
            <TextArea
              label="Ölçülebilir metrikler (önce)"
              value={form.metricsBefore}
              onChange={(v) => handleFormChange("metricsBefore", v)}
              placeholder="Örn: Çevrim ort 54 sn, OEE 68%, hurda %1.2, operatör adım sayısı 24."
            />
            <TextArea
              label="Ölçülebilir metrikler (sonra)"
              value={form.metricsAfter}
              onChange={(v) => handleFormChange("metricsAfter", v)}
              placeholder="Hedef/gerçekleşen: çevrim ≤45 sn, OEE ≥75%, hurda <%1, adım sayısı ≤16."
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Kazanımlar</h3>
          <div className="space-y-3">
            <TextArea
              label="Beklenen / elde edilen kazanımlar"
              value={form.gains}
              onChange={(v) => handleFormChange("gains", v)}
              placeholder="Örn: Çevrim -9 sn, hat kapasitesi +20%; ergonomi: eğilme hareketi %50 azaldı; stok alanı 3 paletten 1 palete indi; güvenlik: kesici uç koruyucu eklendi."
              rows={6}
            />
            <TextArea
              label="Riskler / engeller"
              value={form.risks}
              onChange={(v) => handleFormChange("risks", v)}
              placeholder="Örn: Yeni arabaların tedarik süresi; operatör rotasyonu için eğitim süresi; bakım yükü artışı."
              rows={4}
            />
            <TextArea
              label="Öğrenilmiş dersler"
              value={form.lessons}
              onChange={(v) => handleFormChange("lessons", v)}
              placeholder="Örn: Malzeme akışının tek yönlü tasarımı çevrim süresini düşürdü; standart iş kartı şart."
              rows={4}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Aksiyon Listesi</h3>
            <p className="text-[11px] text-slate-600">
              Sahip, tarih ve durumla takip et. İstersen tamamlananları silmek için çöp kutusu.
            </p>
          </div>
          <button
            onClick={addAction}
            className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
          >
            Aksiyon ekle
          </button>
        </div>

        <div className="space-y-3">
          {actions.map((row) => (
            <div
              key={row.id}
              className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_150px_120px]"
            >
              <input
                type="text"
                value={row.task}
                onChange={(e) => handleActionChange(row.id, "task", e.target.value)}
                placeholder="Aksiyon (Örn: Malzeme arabası tek yönlü düzenle)"
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
              <input
                type="text"
                value={row.owner}
                onChange={(e) => handleActionChange(row.id, "owner", e.target.value)}
                placeholder="Sorumlu"
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
              <input
                type="text"
                value={row.due}
                onChange={(e) => handleActionChange(row.id, "due", e.target.value)}
                placeholder="Hedef tarih"
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
              <div className="flex items-center gap-2">
                <select
                  value={row.status}
                  onChange={(e) =>
                    handleActionChange(row.id, "status", e.target.value as ActionRow["status"])
                  }
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "planlandı"
                        ? "Planlandı"
                        : opt === "devam"
                        ? "Devam ediyor"
                        : "Tamamlandı"}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeAction(row.id)}
                  className="rounded-full border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100"
                  title="Satırı sil"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Hızlı Kontrol Listesi</h3>
        <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-700">
          <li>Problem, kök neden ve hedef durum tanımlı mı?</li>
          <li>“Önce/sonra” metrikleri sayısal olarak yazıldı mı?</li>
          <li>Aksiyonlarda sahip, tarih ve durum bilgisi eksiksiz mi?</li>
          <li>Kazanımlar (SQDCM) ve öğrenilmiş dersler not edildi mi?</li>
          <li>Riskler ve engeller için B planı var mı?</li>
        </ul>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        placeholder={placeholder}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
      />
    </label>
  );
}
