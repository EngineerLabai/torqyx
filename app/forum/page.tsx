// app/forum/page.tsx
"use client";

import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";

type Topic = {
  slug: string;
  title: string;
  author: string;
  category: string;
  details: string;
  updated: string;
  tags: string[];
  replies: number;
};

type Answer = { user: string; text: string; time: string };

const topics: Topic[] = [
  {
    slug: "m12-civata-torku",
    title: "M12 10.9 cıvata torku ve yağlama",
    author: "Ayşe Yılmaz",
    category: "Tork / Bağlantı",
    details:
      "Tablo değerleriyle gerçek sıkma arasında fark var. Moment anahtarı kalibrasyonu ve yağlama seçimi torku nasıl etkiler?",
    updated: "2 saat önce",
    tags: ["tork", "cıvata", "yağlama"],
    replies: 4,
  },
  {
    slug: "kaynak-sonrasi-sehim",
    title: "S235 plakada kaynak sonrası sehim",
    author: "Mehmet A.",
    category: "Kaynak / Yapı",
    details:
      "300x500x10 mm plakayı köşe kaynağı ile birleştirdikten sonra sehim oluştu; fikstürleme ve ön ısıtma önerisi?",
    updated: "5 saat önce",
    tags: ["kaynak", "sehim", "fikstür"],
    replies: 3,
  },
  {
    slug: "h8d9-yuzey-puruzluluk",
    title: "H8/d9 geçme için yüzey pürüzlülüğü",
    author: "Selin K.",
    category: "Tolerans / GD&T",
    details: "Ø25 delik ve mil için H8/d9 seçtim. Preslemede gevşeme olmaması için yüzey pürüzlülüğü ne olmalı?",
    updated: "1 gün önce",
    tags: ["tolerans", "geçme", "yüzey"],
    replies: 1,
  },
];

const answersByTopic: Record<string, Answer[]> = {
  "m12-civata-torku": [
    {
      user: "Kadir",
      text: "DIN tablosu yağsız değer verir, yağlı kullanıyorsan %20-25 düş. Moment anahtarını yılda bir kalibre ettir.",
      time: "1s önce",
    },
    {
      user: "Elif",
      text: "M12 10.9 için tipik ~90 Nm (kuru). Yağlıysa 65-70 Nm aralığı yeterli. Yüzeyleri temiz tut.",
      time: "12s önce",
    },
    {
      user: "Selim",
      text: "Kaymalı rondela kullanıyorsan sürtünme düşer; torku biraz azalt. Turn-of-nut ile ön yükü kontrol edebilirsin.",
      time: "25s önce",
    },
  ],
  "kaynak-sonrasi-sehim": [
    { user: "Hakan", text: "Simetrik puntolar ve karşılıklı kaynat, sonra tamamını doldur. Ön ısı 120-150°C işe yarar.", time: "10dk önce" },
    { user: "Derya", text: "Sehim için ters kamber verip kaynatmayı dene. Fikstürle baskı altına almak da işe yarar.", time: "35dk önce" },
  ],
  "h8d9-yuzey-puruzluluk": [
    { user: "Elif", text: "Ra 1.6-3.2 µm aralığı genelde yeterli. Temizlik ve çapaksızlık kritik.", time: "2s önce" },
  ],
};

export default function ForumPage() {
  const [selectedSlug, setSelectedSlug] = useState<Topic["slug"]>("m12-civata-torku");
  const selectedTopic = useMemo(() => topics.find((t) => t.slug === selectedSlug) ?? topics[0], [selectedSlug]);
  const answers = answersByTopic[selectedTopic.slug] ?? [];

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <p className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
            Topluluk &amp; soru-cevap
          </p>
          <h1 className="text-2xl font-semibold leading-snug text-slate-900">Topluluk forumu</h1>
          <p className="text-sm leading-relaxed text-slate-700">
            Soru sor, kisa yanitlar al ve deneyim paylas.
          </p>
        </div>
      </section>

      <section id="soru-cevap" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">{selectedTopic.category}</span>
          <h2 className="text-base font-semibold text-slate-900">{selectedTopic.title}</h2>
        </div>
        <p className="mt-2 text-sm text-slate-700">{selectedTopic.details}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
          <span>Yazan: {selectedTopic.author}</span>
          <span className="h-1 w-1 rounded-full bg-slate-400" />
          <span>{selectedTopic.updated}</span>
          <div className="flex flex-wrap gap-1">
            {selectedTopic.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-slate-900">Yanıtlar</h3>
          {answers.map((answer) => (
            <div key={answer.user + answer.time} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex items-center justify-between text-[12px] text-slate-600">
                <span className="font-semibold text-slate-800">{answer.user}</span>
                <span>{answer.time}</span>
              </div>
              <p className="text-sm text-slate-700">{answer.text}</p>
            </div>
          ))}
        </div>

        <form className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
          <label className="text-xs font-semibold text-slate-700" htmlFor="reply">
            Senin yanıtın
          </label>
          <textarea
            id="reply"
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder="Tecrübeni, hesabını veya önerini yaz..."
          />
          <div className="flex justify-end">
            <button type="button" className="tap-target inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-500">
              Yanıt paylaş
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">Aktif başlıklar</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{topics.length} başlık</span>
        </div>
        <div className="mt-3 space-y-2">
          {topics.map((topic) => (
            <button
              key={topic.slug}
              onClick={() => setSelectedSlug(topic.slug)}
              className="flex w-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-sm shadow-sm transition hover:border-sky-200 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{topic.category}</span>
                <span className="font-semibold text-slate-900">{topic.title}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
                <span>{topic.replies} yanıt</span>
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                <span>{topic.updated}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
