// app/quality-tools/5n1k/page.tsx
"use client";

import { useState, ChangeEvent } from "react";
import PageShell from "@/components/layout/PageShell";

type FiveN1KForm = {
  what: string;   // Ne?
  where: string;  // Nerede?
  when: string;   // Ne zaman?
  who: string;    // Kim?
  why: string;    // Neden? (ilk yorum)
  how: string;    // Nasıl?
};

type SavedSummary = {
  id: number;
  summary: string;
  form: FiveN1KForm;
};

const INITIAL_FORM: FiveN1KForm = {
  what: "",
  where: "",
  when: "",
  who: "",
  why: "",
  how: "",
};

export default function FiveN1KPage() {
  const [form, setForm] = useState<FiveN1KForm>(INITIAL_FORM);
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([]);
  const [filterText, setFilterText] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleChange(
    key: keyof FiveN1KForm,
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function handleSave() {
    setSaveError(null);

    if (Object.values(form).every((v) => !v.trim())) {
      setSaveError("Kaydedilecek problem özeti yok. Lütfen alanları doldurun.");
      return;
    }

    const summary = buildOneLineSummary(form);
    setSavedSummaries((prev) => [
      ...prev,
      { id: prev.length + 1, summary, form },
    ]);
    setForm(INITIAL_FORM);
  }

  const isEmpty = Object.values(form).every((v) => !v.trim());

  return (
    <PageShell>
      {/* Başlık ve açıklama */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Kalite Aracı
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
            5N1K · Problem Tanımlama
          </span>
        </div>

        <h1 className="text-lg font-semibold text-slate-900">
          5N1K – Problem Tanımlama Formu
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Kalite problemi, müşteri şikayeti veya üretim hattı uygunsuzluğunu
          netleştirmek için 5N1K sorularını doldur. Aşağıdaki alanlara girdikçe
          sağ tarafta otomatik olarak kısa bir problem özeti oluşur. Bu özet
          daha sonra 8D, 5 Why ve FMEA çalışmalarında giriş verisi olarak
          kullanılabilir.
        </p>
      </section>

      {/* Sol: form · Sağ: özet kartı */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Form paneli */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              5N1K Giriş Alanları
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white hover:bg-slate-800"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setForm(INITIAL_FORM)}
                className="rounded-full border border-slate-300 px-3 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
              >
                Formu Temizle
              </button>
            </div>
          </div>

          {saveError && (
            <p className="mb-2 text-[11px] text-red-600">{saveError}</p>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {/* What */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700">
                Ne? (What) – Problem nedir?
              </label>
              <textarea
                rows={2}
                value={form.what}
                onChange={(e) => handleChange("what", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Ön sağ amortisör bağlantı cıvatasında gevşeme şikayeti..."
              />
            </div>

            {/* Where */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Nerede? (Where)
              </label>
              <textarea
                rows={2}
                value={form.where}
                onChange={(e) => handleChange("where", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Montaj hattı 2, istasyon 4 / saha aracı, Avrupa pazarı..."
              />
            </div>

            {/* When */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Ne zaman? (When)
              </label>
              <textarea
                rows={2}
                value={form.when}
                onChange={(e) => handleChange("when", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Soğuk havalarda, 10.000 km sonrası, son 3 ay içinde..."
              />
            </div>

            {/* Who */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Kim? (Who)
              </label>
              <textarea
                rows={2}
                value={form.who}
                onChange={(e) => handleChange("who", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Araç kullanıcısı, montaj operatörü, kalite kontrol, bayi teknik ekibi..."
              />
            </div>

            {/* Why */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700">
                Neden? (Why) – İlk tahmin / hipotez
              </label>
              <textarea
                rows={2}
                value={form.why}
                onChange={(e) => handleChange("why", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Tork değerinin düşük olması, uygun olmayan rondela kullanımı, hatalı fikstür konumlandırması..."
              />
            </div>

            {/* How */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700">
                Nasıl? (How) – Problem nasıl ortaya çıkıyor?
              </label>
              <textarea
                rows={2}
                value={form.how}
                onChange={(e) => handleChange("how", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Araç darbeye maruz kaldığında, belirli tork altında, belirli hız/sıcaklık koşullarında..."
              />
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            Not: Buraya girilen bilgiler yalnızca bu tarayıcı oturumunda saklanır.
            Gelecekte PDF/Excel çıktı ve hesap açarak kayıt tutma özellikleri
            premium paket kapsamında eklenebilir.
          </p>
        </div>

        {/* Özet paneli */}
        <div className="space-y-4">
          <FiveN1KSummaryCard form={form} isEmpty={isEmpty} />
          <SavedSummariesList
            items={savedSummaries}
            filterText={filterText}
            onFilterTextChange={setFilterText}
          />
          <PremiumExportNotice />
        </div>
      </section>
    </PageShell>
  );
}

/* --------------------- ÖZET KARTI BİLEŞENİ --------------------- */

type SummaryProps = {
  form: FiveN1KForm;
  isEmpty: boolean;
};

function FiveN1KSummaryCard({ form, isEmpty }: SummaryProps) {
  const { what, where, when, who, why, how } = form;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-slate-900">
        Problem Özeti (5N1K)
      </h2>

      {isEmpty ? (
        <p className="text-[11px] text-slate-500">
          Soldaki alanları doldurdukça burada otomatik olarak kısa bir problem
          özeti oluşacaktır. Bu özet; 8D raporu, 5 Why analizi ve FMEA
          çalışmalarında doğrudan kullanılabilecek şekilde kurgulanmıştır.
        </p>
      ) : (
        <div className="space-y-2 text-[11px] text-slate-700">
          {what && (
            <p>
              <span className="font-semibold">Ne?</span> {what}
            </p>
          )}
          {where && (
            <p>
              <span className="font-semibold">Nerede?</span> {where}
            </p>
          )}
          {when && (
            <p>
              <span className="font-semibold">Ne zaman?</span> {when}
            </p>
          )}
          {who && (
            <p>
              <span className="font-semibold">Kim?</span> {who}
            </p>
          )}
          {why && (
            <p>
              <span className="font-semibold">İlk tahmin (Neden?):</span> {why}
            </p>
          )}
          {how && (
            <p>
              <span className="font-semibold">Nasıl ortaya çıkıyor?</span> {how}
            </p>
          )}

          <div className="mt-3 rounded-lg bg-slate-50 p-3">
            <p className="mb-1 font-semibold text-slate-900">
              Kısa Problem Tanımı (tek satır)
            </p>
            <p className="font-mono text-[11px] text-slate-800">
              {buildOneLineSummary(form)}
            </p>
          </div>
        </div>
      )}

      <hr className="my-3 border-slate-200" />

      <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-600">
        <li>
          Bu özet, 8D&apos;nin D2 (Problem Tanımı) ve D3 (Geçici Önlem) adımlarına
          temel oluşturabilir.
        </li>
        <li>
          Aynı problem için 5 Why analizine geçtiğinde, buradaki <em>&quot;Ne?&quot;</em> ve{" "}
          <em>&quot;Neden?&quot;</em> cümleleri başlangıç noktası olarak kullanılabilir.
        </li>
      </ul>
    </aside>
  );
}

type SavedSummariesProps = {
  items: SavedSummary[];
  filterText: string;
  onFilterTextChange: (value: string) => void;
};

function SavedSummariesList({
  items,
  filterText,
  onFilterTextChange,
}: SavedSummariesProps) {
  const normalizedQuery = filterText.trim().toLowerCase();
  const filtered =
    normalizedQuery.length === 0
      ? items
      : items.filter((item) => {
          const haystack = [
            item.summary,
            item.form.what,
            item.form.where,
            item.form.when,
            item.form.who,
            item.form.why,
            item.form.how,
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(normalizedQuery);
        });

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">
          Kaydedilen Problem Özetleri
        </h3>
        <input
          type="text"
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
          placeholder="Özetlerde ara..."
          className="w-40 rounded-lg border border-slate-300 px-2 py-1 text-[11px] text-slate-700 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-[11px] text-slate-500">
          Henüz kaydedilmiş problem özeti yok veya filtreye uyan sonuç bulunamadı.
        </p>
      ) : (
        <ol className="space-y-2 text-[11px] text-slate-700">
          {filtered.map((item, idx) => (
            <li
              key={item.id}
              className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                {idx + 1}
              </span>
              <div className="space-y-1">
                <p className="font-medium text-slate-900">{item.summary}</p>
                <p className="text-[10px] text-slate-500">
                  Ne: {item.form.what || "-"} · Nerede: {item.form.where || "-"} · Ne
                  zaman: {item.form.when || "-"} · Kim: {item.form.who || "-"}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

function PremiumExportNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[11px] text-amber-900 shadow-sm">
      <h3 className="mb-1 text-sm font-semibold">
        PDF / Excel&apos;e Aktar – Premium Özellik
      </h3>
      <p className="mb-2">
        5N1K problem tanımlama kayıtlarını PDF veya Excel olarak dışa aktarma
        ve ekiplerle paylaşma özelliği <strong>Premium üyelik</strong> kapsamında
        planlanmaktadır.
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
  );
}

function buildOneLineSummary(form: FiveN1KForm): string {
  const parts: string[] = [];

  if (form.what.trim()) {
    parts.push(form.what.trim());
  }

  if (form.where.trim()) {
    parts.push(`Konum: ${form.where.trim()}`);
  }

  if (form.when.trim()) {
    parts.push(`Zaman: ${form.when.trim()}`);
  }

  if (form.who.trim()) {
    parts.push(`İlgili: ${form.who.trim()}`);
  }

  if (form.why.trim()) {
    parts.push(`İlk tahmin: ${form.why.trim()}`);
  }

  if (form.how.trim()) {
    parts.push(`Ortaya çıkış şekli: ${form.how.trim()}`);
  }

  if (parts.length === 0) {
    return "Problem tanımı henüz tamamlanmamış.";
  }

  return parts.join(" | ");
}
