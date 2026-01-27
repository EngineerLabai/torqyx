// app/quality-tools/poka-yoke/page.tsx
"use client";

import { useState } from "react";
import PageShell from "@/components/layout/PageShell";

type StatusOption = "planlandı" | "devam" | "tamam";

type ActionRow = {
  id: string;
  task: string;
  owner: string;
  due: string;
  status: StatusOption;
};

type PokaYokeForm = {
  title: string;
  process: string;
  station: string;
  part: string;
  owner: string;
  date: string;
  problem: string;
  failureMode: string;
  currentControl: string;
  severity: string;
  occurrence: string;
  detection: string;
  idea: string;
  ideaType: string;
  principle: string;
  expectedEffect: string;
  feasibility: string;
  cost: string;
  risk: string;
  validation: string;
};

const INITIAL_FORM: PokaYokeForm = {
  title: "",
  process: "",
  station: "",
  part: "",
  owner: "",
  date: "",
  problem: "",
  failureMode: "",
  currentControl: "",
  severity: "",
  occurrence: "",
  detection: "",
  idea: "",
  ideaType: "önleyici",
  principle: "fiziksel kılavuz",
  expectedEffect: "",
  feasibility: "",
  cost: "",
  risk: "",
  validation: "",
};

const STATUS_OPTIONS: StatusOption[] = ["planlandı", "devam", "tamam"];

function uuid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function PokaYokePage() {
  const [form, setForm] = useState<PokaYokeForm>(INITIAL_FORM);
  const [actions, setActions] = useState<ActionRow[]>([
    { id: uuid(), task: "", owner: "", due: "", status: "planlandı" },
  ]);

  function handleChange<K extends keyof PokaYokeForm>(key: K, value: PokaYokeForm[K]) {
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
            Poka-Yoke
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-medium text-indigo-700">
            Hata Önleme
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-medium text-emerald-700">
            Beta
          </span>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Poka-Yoke Fikir Kartı
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Hata önleyici fikirlerini tanımla, tipini belirle (önleyici/algılayıcı/uyarıcı),
          uygulanabilirliğini ve beklenen etkiyi yaz, aksiyonlarla takip et. Basit bir
          onay ve doğrulama planı için temel alanlar içerir.
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
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Fikir / Proje adı"
            value={form.title}
            onChange={(v) => handleChange("title", v)}
            placeholder="Örn: Yanlış parça montajını fiziksel kılavuzla engelleme"
          />
          <Field
            label="Proses / Hat"
            value={form.process}
            onChange={(v) => handleChange("process", v)}
            placeholder="Örn: Montaj Hattı B"
          />
          <Field
            label="İstasyon"
            value={form.station}
            onChange={(v) => handleChange("station", v)}
            placeholder="Örn: İstasyon 12"
          />
          <Field
            label="Ürün / Parça kodu"
            value={form.part}
            onChange={(v) => handleChange("part", v)}
            placeholder="Örn: ABC123-04"
          />
          <Field
            label="Hazırlayan / Sorumlu"
            value={form.owner}
            onChange={(v) => handleChange("owner", v)}
            placeholder="İsim / departman"
          />
          <Field
            label="Tarih"
            value={form.date}
            onChange={(v) => handleChange("date", v)}
            placeholder="GG.AA.YYYY"
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Problem ve Hata Modu</h3>
          <div className="space-y-3">
            <TextArea
              label="Problem / şikayet"
              value={form.problem}
              onChange={(v) => handleChange("problem", v)}
              placeholder="Örn: Yanlış yönlü montaj, müşteri montajında takılma; hata PPM: 12.000."
            />
            <TextArea
              label="Hata modu (FMEA referansı)"
              value={form.failureMode}
              onChange={(v) => handleChange("failureMode", v)}
              placeholder="Örn: Yanlış yön montaj (FM-12); etkisi: sahada montaj yapılamıyor."
            />
            <TextArea
              label="Mevcut kontrol / tespit noktası"
              value={form.currentControl}
              onChange={(v) => handleChange("currentControl", v)}
              placeholder="Örn: Operatör görsel kontrol; hat sonu %10 örnekleme."
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field
                label="Şiddet (S)"
                value={form.severity}
                onChange={(v) => handleChange("severity", v)}
                placeholder="Örn: 8"
              />
              <Field
                label="Olasılık (O)"
                value={form.occurrence}
                onChange={(v) => handleChange("occurrence", v)}
                placeholder="Örn: 6"
              />
              <Field
                label="Tespit (D)"
                value={form.detection}
                onChange={(v) => handleChange("detection", v)}
                placeholder="Örn: 6"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Poka-Yoke Fikri</h3>
          <div className="space-y-3">
            <TextArea
              label="Fikir / çözüm"
              value={form.idea}
              onChange={(v) => handleChange("idea", v)}
              placeholder="Örn: Parça yönünü kılavuzlayan simetrik olmayan fixtür + pin; doğru yön dışında parça oturmuyor."
              rows={5}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SelectField
                label="Tip"
                value={form.ideaType}
                onChange={(v) => handleChange("ideaType", v)}
                options={[
                  { value: "önleyici", label: "Önleyici (prevention)" },
                  { value: "algılayıcı", label: "Algılayıcı (detection)" },
                  { value: "uyarıcı", label: "Uyarı (warning)" },
                ]}
              />
              <SelectField
                label="Prensip / yöntem"
                value={form.principle}
                onChange={(v) => handleChange("principle", v)}
                options={[
                  { value: "fiziksel kılavuz", label: "Fiziksel kılavuz / geometri" },
                  { value: "kilitleme", label: "Kilitleme / zorlama" },
                  { value: "sensör", label: "Sensör (foto, proximity, switch)" },
                  { value: "sayaç", label: "Sayaç / sekans kontrol" },
                  { value: "etiket/renk", label: "Renk/etiketleme" },
                ]}
              />
            </div>
            <TextArea
              label="Beklenen etki"
              value={form.expectedEffect}
              onChange={(v) => handleChange("expectedEffect", v)}
              placeholder="Örn: Yanlış yön montajını fiziksel olarak engelle; hedef O=2, D=3; PPM < 100."
            />
            <TextArea
              label="Uygulanabilirlik / kaynak"
              value={form.feasibility}
              onChange={(v) => handleChange("feasibility", v)}
              placeholder="Örn: Mevcut fikstüre ek parça; CNC işleme 2 saat; montaj 30 dk; bakım desteği gerekiyor."
            />
            <TextArea
              label="Maliyet / süre"
              value={form.cost}
              onChange={(v) => handleChange("cost", v)}
              placeholder="Örn: Parça maliyeti 120 USD, işçilik 2 saat; devreye alma hedefi 10.01.2026."
            />
            <TextArea
              label="Riskler / yan etkiler"
              value={form.risk}
              onChange={(v) => handleChange("risk", v)}
              placeholder="Örn: Yanlış pozisyonda sıkışma riski; çevrim süresinde +2 sn artış olabilir."
            />
            <TextArea
              label="Doğrulama planı"
              value={form.validation}
              onChange={(v) => handleChange("validation", v)}
              placeholder="Örn: 3 vardiya pilot; 0 hata ve doğru yönden başka montaj imkansız testi; bakım onayı."
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Aksiyon Listesi</h3>
            <p className="text-[11px] text-slate-600">
              Sahip, tarih ve durum ile takip et. Satır ekle/sil ile listeyi daralt ya da genişlet.
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
                placeholder="Aksiyon (Örn: Kılavuz pimi tasarla ve üret)"
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
                    handleActionChange(row.id, "status", e.target.value as StatusOption)
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
          <li>Hata modu, mevcut kontrol ve FMEA dereceleri (S/O/D) yazıldı mı?</li>
          <li>Poka-yoke tipi ve prensibi net mi (önleyici/algılayıcı/uyarıcı)?</li>
          <li>Beklenen etki (hedef S/O/D veya PPM) belirtildi mi?</li>
          <li>Uygulanabilirlik, maliyet ve riskler kaydedildi mi?</li>
          <li>Doğrulama planı ve aksiyon sorumluları atanmış mı?</li>
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
        className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
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
