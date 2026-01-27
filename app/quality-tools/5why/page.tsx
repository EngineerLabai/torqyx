// app/quality-tools/5why/page.tsx
"use client";

import { useState, ChangeEvent } from "react";
import PageShell from "@/components/layout/PageShell";

type WhyStep = {
  why: string;       // Neden cevabı
  actionHint: string; // O nedene yönelik aksiyon / not
};

type FiveWhyForm = {
  problem: string;
  steps: WhyStep[];
};

const INITIAL_FORM: FiveWhyForm = {
  problem: "",
  steps: [
    { why: "", actionHint: "" },
    { why: "", actionHint: "" },
    { why: "", actionHint: "" },
    { why: "", actionHint: "" },
    { why: "", actionHint: "" },
  ],
};

export default function FiveWhyPage() {
  const [form, setForm] = useState<FiveWhyForm>(INITIAL_FORM);

  function handleProblemChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, problem: e.target.value }));
  }

  function handleWhyChange(
    index: number,
    key: keyof WhyStep,
    e: ChangeEvent<HTMLTextAreaElement>
  ) {
    const value = e.target.value;
    setForm((prev) => {
      const steps = [...prev.steps];
      steps[index] = { ...steps[index], [key]: value };
      return { ...prev, steps };
    });
  }

  function handleReset() {
    setForm(INITIAL_FORM);
  }

  const rootCause = getRootCause(form);
  const classification = classifyRootCause(rootCause);
  const isEmpty =
    !form.problem.trim() &&
    form.steps.every((s) => !s.why.trim() && !s.actionHint.trim());

  return (
    <PageShell>
      {/* Başlık ve açıklama */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Kalite Aracı
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
            5 Why · Kök Neden Analizi
          </span>
        </div>

        <h1 className="text-lg font-semibold text-slate-900">
          5 Why – Kök Neden Analizi Formu
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Tekrarlayan kalite problemleri için, problemi 5 kez &quot;Neden?&quot;
          sorusuyla derinleştirerek kök nedeni bulmaya yardımcı olur. Solda
          problem ve 5 adet &quot;Neden?&quot; sorusunu doldur, sağda kök neden
          özeti ve aksiyon yorumları otomatik oluşsun.
        </p>
      </section>

      {/* Sol: form · Sağ: özet / kök neden */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Form paneli */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Problem ve 5 Adım &quot;Neden?&quot; Zinciri
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-slate-300 px-3 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
            >
              Formu Temizle
            </button>
          </div>

          {/* Problem tanımı */}
          <div className="mb-4 space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Problem Tanımı (1–2 cümle)
            </label>
            <textarea
              rows={3}
              value={form.problem}
              onChange={handleProblemChange}
              className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              placeholder="Örn. Müşteri, ön süspansiyon bağlantısından gelen tıkırtı sesi şikayeti bildiriyor. Araç 15.000 km civarında, soğuk havalarda ses artıyor."
            />
          </div>

          {/* 5 Why adımları */}
          <div className="space-y-3">
            {form.steps.map((step, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <p className="mb-2 text-[11px] font-semibold text-slate-800">
                  {index + 1}. Neden?
                </p>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    {index + 1}. &quot;Neden?&quot; sorusunun cevabı
                  </label>
                  <textarea
                    rows={2}
                    value={step.why}
                    onChange={(e) => handleWhyChange(index, "why", e)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder={
                      index === 0
                        ? "Örn. Çünkü bağlantı cıvatası zamanla gevşiyor..."
                        : "Örn. Çünkü montaj torku her zaman hedef değere ulaşmıyor..."
                    }
                  />
                </div>

                <div className="mt-2 space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Bu nedene yönelik olası aksiyon / not
                  </label>
                  <textarea
                    rows={2}
                    value={step.actionHint}
                    onChange={(e) => handleWhyChange(index, "actionHint", e)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                    placeholder="Örn. Tork anahtarlarının periyodik kalibrasyonunu artırmak, operatör eğitimini güncellemek..."
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-slate-500">
            Not: Gerçek hayatta her zaman tam olarak 5 adım gerekmez; bazı
            problemler 3–4 adımda kök nedene ulaşırken, bazı durumlarda 5
            adım bile yetmeyebilir. Buradaki amaç, düşünce zincirini kayıt
            altına almak ve tekrar eden hataları önlemektir.
          </p>
        </div>

        {/* Sağ panel: kök neden özeti */}
        <FiveWhySummary
          form={form}
          isEmpty={isEmpty}
          rootCause={rootCause}
          classification={classification}
        />
      </section>
    </PageShell>
  );
}

/* --------------------- ÖZET / KÖK NEDEN KARTI --------------------- */

type Classification =
  | "process"
  | "design"
  | "human"
  | "material"
  | "other";

type SummaryProps = {
  form: FiveWhyForm;
  isEmpty: boolean;
  rootCause: string | null;
  classification: Classification;
};

function FiveWhySummary({
  form,
  isEmpty,
  rootCause,
  classification,
}: SummaryProps) {
  if (isEmpty) {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">
          Kök Neden Özeti
        </h2>
        <p className="text-[11px] text-slate-500">
          Soldaki problem ve &quot;Neden?&quot; adımlarını doldurdukça burada
          olası kök neden özeti ve aksiyon önerileri görünecektir. Bu özet,
          8D raporunun kök neden ve düzeltici aksiyon adımlarına doğrudan
          taşınabilir.
        </p>
      </aside>
    );
  }

  const badge = buildClassificationBadge(classification);

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-slate-900">
        Kök Neden Özeti
      </h2>

      {badge}

      {/* Problem ve neden zinciri */}
      <div className="mt-3 space-y-2 text-[11px] text-slate-700">
        {form.problem.trim() && (
          <div>
            <p className="font-semibold text-slate-900">Problem:</p>
            <p>{form.problem.trim()}</p>
          </div>
        )}

        <div>
          <p className="mb-1 font-semibold text-slate-900">
            Neden zinciri (özet):
          </p>
          <ol className="list-inside list-decimal space-y-1">
            {form.steps
              .map((s) => s.why.trim())
              .filter((w) => w.length > 0)
              .map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
          </ol>
        </div>

        {rootCause && (
          <div className="mt-2 rounded-lg bg-slate-50 p-3">
            <p className="mb-1 font-semibold text-slate-900">
              Olası kök neden:
            </p>
            <p className="text-slate-800">{rootCause}</p>
          </div>
        )}

        {/* Aksiyon fikri özetleri */}
        {form.steps.some((s) => s.actionHint.trim()) && (
          <div className="mt-2">
            <p className="mb-1 font-semibold text-slate-900">
              Aksiyon fikirleri (özet):
            </p>
            <ul className="list-inside list-disc space-y-1">
              {form.steps
                .map((s) => s.actionHint.trim())
                .filter((a) => a.length > 0)
                .map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <hr className="my-3 border-slate-200" />

      <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-600">
        <li>
          Kök neden olarak belirlediğiniz cümleyi, 8D raporunun D4 (kök neden
          analizi) bölümüne doğrudan taşıyabilirsiniz.
        </li>
        <li>
          Aksiyon fikirlerinden seçtiklerinizi D5 (kalıcı düzeltici aksiyon)
          tablosuna dönüştürmek, tekrar oluşum ihtimalini azaltacaktır.
        </li>
        <li>
          Eğer neden zincirinde sıkça &quot;operatör hatası&quot; geçiyorsa,
          sistem/ekipman tasarımını (Poka‑Yoke) gözden geçirmek gerekir.
        </li>
      </ul>
    </aside>
  );
}

/* --------------------- YARDIMCI FONKSİYONLAR --------------------- */

function getRootCause(form: FiveWhyForm): string | null {
  // En alttan başlayarak ilk dolu "why" cevabını kök neden olarak al
  for (let i = form.steps.length - 1; i >= 0; i--) {
    const w = form.steps[i].why.trim();
    if (w.length > 0) return w;
  }
  return null;
}

function classifyRootCause(text: string | null): Classification {
  if (!text) return "other";
  const t = text.toLowerCase();

  if (
    t.includes("operatör") ||
    t.includes("insan") ||
    t.includes("eğitim") ||
    t.includes("dikkat")
  ) {
    return "human";
  }

  if (
    t.includes("proses") ||
    t.includes("iş akışı") ||
    t.includes("talimat") ||
    t.includes("standart") ||
    t.includes("kontrol planı")
  ) {
    return "process";
  }

  if (
    t.includes("tasarım") ||
    t.includes("tolerans") ||
    t.includes("geometri") ||
    t.includes("konumlandırma") ||
    t.includes("fikstür")
  ) {
    return "design";
  }

  if (
    t.includes("malzeme") ||
    t.includes("sertlik") ||
    t.includes("kaplama") ||
    t.includes("çelik") ||
    t.includes("alüminyum")
  ) {
    return "material";
  }

  return "other";
}

function buildClassificationBadge(classification: Classification) {
  switch (classification) {
    case "human":
      return (
        <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-800">
          İnsan / Operatör ilişkili kök neden
        </div>
      );
    case "process":
      return (
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-semibold text-sky-800">
          Proses / Talimat kaynaklı kök neden
        </div>
      );
    case "design":
      return (
        <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-semibold text-indigo-800">
          Tasarım / Fikstür kaynaklı kök neden
        </div>
      );
    case "material":
      return (
        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-800">
          Malzeme / Kaplama ilişkili kök neden
        </div>
      );
    default:
      return (
        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-medium text-slate-700">
          Genel kök neden (sınıflandırma yapılamadı)
        </div>
      );
  }
}
