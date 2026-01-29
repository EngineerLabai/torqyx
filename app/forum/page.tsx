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
    title: "M12 10.9 cÄ±vata torku ve yaÄŸlama",
    author: "AyÅŸe YÄ±lmaz",
    category: "Tork / BaÄŸlantÄ±",
    details:
      "Tablo deÄŸerleriyle gerÃ§ek sÄ±kma arasÄ±nda fark var. Moment anahtarÄ± kalibrasyonu ve yaÄŸlama seÃ§imi torku nasÄ±l etkiler?",
    updated: "2 saat Ã¶nce",
    tags: ["tork", "cÄ±vata", "yaÄŸlama"],
    replies: 4,
  },
  {
    slug: "kaynak-sonrasi-sehim",
    title: "S235 plakada kaynak sonrasÄ± sehim",
    author: "Mehmet A.",
    category: "Kaynak / YapÄ±",
    details:
      "300x500x10 mm plakayÄ± kÃ¶ÅŸe kaynaÄŸÄ± ile birleÅŸtirdikten sonra sehim oluÅŸtu; fikstÃ¼rleme ve Ã¶n Ä±sÄ±tma Ã¶nerisi?",
    updated: "5 saat Ã¶nce",
    tags: ["kaynak", "sehim", "fikstÃ¼r"],
    replies: 3,
  },
  {
    slug: "h8d9-yuzey-puruzluluk",
    title: "H8/d9 geÃ§me iÃ§in yÃ¼zey pÃ¼rÃ¼zlÃ¼lÃ¼ÄŸÃ¼",
    author: "Selin K.",
    category: "Tolerans / GD&T",
    details: "Ã˜25 delik ve mil iÃ§in H8/d9 seÃ§tim. Preslemede gevÅŸeme olmamasÄ± iÃ§in yÃ¼zey pÃ¼rÃ¼zlÃ¼lÃ¼ÄŸÃ¼ ne olmalÄ±?",
    updated: "1 gÃ¼n Ã¶nce",
    tags: ["tolerans", "geÃ§me", "yÃ¼zey"],
    replies: 1,
  },
];

const answersByTopic: Record<string, Answer[]> = {
  "m12-civata-torku": [
    {
      user: "Kadir",
      text: "DIN tablosu yaÄŸsÄ±z deÄŸer verir, yaÄŸlÄ± kullanÄ±yorsan %20-25 dÃ¼ÅŸ. Moment anahtarÄ±nÄ± yÄ±lda bir kalibre ettir.",
      time: "1s Ã¶nce",
    },
    {
      user: "Elif",
      text: "M12 10.9 iÃ§in tipik ~90 Nm (kuru). YaÄŸlÄ±ysa 65-70 Nm aralÄ±ÄŸÄ± yeterli. YÃ¼zeyleri temiz tut.",
      time: "12s Ã¶nce",
    },
    {
      user: "Selim",
      text: "KaymalÄ± rondela kullanÄ±yorsan sÃ¼rtÃ¼nme dÃ¼ÅŸer; torku biraz azalt. Turn-of-nut ile Ã¶n yÃ¼kÃ¼ kontrol edebilirsin.",
      time: "25s Ã¶nce",
    },
  ],
  "kaynak-sonrasi-sehim": [
    { user: "Hakan", text: "Simetrik puntolar ve karÅŸÄ±lÄ±klÄ± kaynat, sonra tamamÄ±nÄ± doldur. Ã–n Ä±sÄ± 120-150Â°C iÅŸe yarar.", time: "10dk Ã¶nce" },
    { user: "Derya", text: "Sehim iÃ§in ters kamber verip kaynatmayÄ± dene. FikstÃ¼rle baskÄ± altÄ±na almak da iÅŸe yarar.", time: "35dk Ã¶nce" },
  ],
  "h8d9-yuzey-puruzluluk": [
    { user: "Elif", text: "Ra 1.6-3.2 Âµm aralÄ±ÄŸÄ± genelde yeterli. Temizlik ve Ã§apaksÄ±zlÄ±k kritik.", time: "2s Ã¶nce" },
  ],
};

const isDemoContent = true;

export default function ForumPage() {
  const [selectedSlug, setSelectedSlug] = useState<Topic["slug"]>("m12-civata-torku");
  const selectedTopic = useMemo(() => topics.find((t) => t.slug === selectedSlug) ?? topics[0], [selectedSlug]);
  const answers = answersByTopic[selectedTopic.slug] ?? [];

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
              Topluluk &amp; soru-cevap
            </span>
            {isDemoContent ? (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-700">
                Demo
              </span>
            ) : null}
          </div>
          <h1 className="text-2xl font-semibold leading-snug text-slate-900">Topluluk forumu</h1>
          <p className="text-sm leading-relaxed text-slate-700">
            Soru sor, kisa yanitlar al ve deneyim paylas.
          </p>
        </div>
      </section>

      <section id="soru-cevap" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">{selectedTopic.category}</span>
          {isDemoContent ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
              Demo
            </span>
          ) : null}
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
          <h3 className="text-sm font-semibold text-slate-900">YanÄ±tlar</h3>
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
            Senin yanÄ±tÄ±n
          </label>
          <textarea
            id="reply"
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder="TecrÃ¼beni, hesabÄ±nÄ± veya Ã¶nerini yaz..."
          />
          <div className="flex justify-end">
            <button type="button" className="tap-target inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-500">
              YanÄ±t paylaÅŸ
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">Aktif baÅŸlÄ±klar</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{topics.length} baÅŸlÄ±k</span>
            {isDemoContent ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                Demo
              </span>
            ) : null}
          </div>
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
                {isDemoContent ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    Demo
                  </span>
                ) : null}
                <span className="font-semibold text-slate-900">{topic.title}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
                <span>{topic.replies} yanÄ±t</span>
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

