"use client";

import { useMemo, useState } from "react";

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
    title: "M12 10.9 civata torku ve yaglama",
    author: "Ayse Yilmaz",
    category: "Tork / Baglanti",
    details:
      "Tablo degerleriyle gercek sikma arasinda fark var. Moment anahtari kalibrasyonu ve yaglama secimi torku nasil etkiler?",
    updated: "2 saat once",
    tags: ["tork", "civata", "yaglama"],
    replies: 4,
  },
  {
    slug: "kaynak-sonrasi-sehim",
    title: "S235 plakada kaynak sonrasi sehim",
    author: "Mehmet A.",
    category: "Kaynak / Yapi",
    details:
      "300x500x10 mm plakayi kose kaynak ile birlestirdikten sonra sehim olustu; fiksturleme ve on isitma onerisi?",
    updated: "5 saat once",
    tags: ["kaynak", "sehim", "fikstur"],
    replies: 3,
  },
  {
    slug: "h8d9-yuzey-puruzluluk",
    title: "H8/d9 gecme icin yuzey puruzlulugu",
    author: "Selin K.",
    category: "Tolerans / GD&T",
    details: "Ã˜25 delik ve mil icin H8/d9 sectim. Preslemede gevseme olmamasi icin yuzey puruzlulugu ne olmali?",
    updated: "1 gun once",
    tags: ["tolerans", "gecme", "yuzey"],
    replies: 1,
  },
];

const answersByTopic: Record<string, Answer[]> = {
  "m12-civata-torku": [
    {
      user: "Kadir",
      text: "DIN tablosu yagsiz deger verir, yagli kullaniyorsan %20-25 dus. Moment anahtarini yilda bir kalibre ettir.",
      time: "1s once",
    },
    {
      user: "Elif",
      text: "M12 10.9 icin tipik ~90 Nm (kuru). Yagliysa 65-70 Nm araligi yeterli. Yuzeyleri temiz tut.",
      time: "12s once",
    },
    {
      user: "Selim",
      text: "Kaymali rondela kullaniyorsan surtunme duser; torku biraz azalt. Turn-of-nut ile on yuku kontrol edebilirsin.",
      time: "25s once",
    },
  ],
  "kaynak-sonrasi-sehim": [
    { user: "Hakan", text: "Simetrik puntolar ve karsilikli kaynat, sonra tamamini doldur. On isi 120-150C ise yarar.", time: "10dk once" },
    { user: "Derya", text: "Sehim icin ters kamber verip kaynatmayi dene. Fiksturle baski altina almak da ise yarar.", time: "35dk once" },
  ],
  "h8d9-yuzey-puruzluluk": [
    { user: "Elif", text: "Ra 1.6-3.2 um araligi genelde yeterli. Temizlik ve capaksizlik kritik.", time: "2s once" },
  ],
};

const isSampleContent = true;

export default function QaBoard() {
  const [selectedSlug, setSelectedSlug] = useState<Topic["slug"]>("m12-civata-torku");
  const selectedTopic = useMemo(() => topics.find((t) => t.slug === selectedSlug) ?? topics[0], [selectedSlug]);
  const answers = answersByTopic[selectedTopic.slug] ?? [];

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700">
              Soru-cevap
            </span>
            {isSampleContent ? (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-700">
                Örnek
              </span>
            ) : null}
          </div>
          <h1 className="text-2xl font-semibold leading-snug text-slate-900">Soru-cevap alani</h1>
          <p className="text-sm leading-relaxed text-slate-700">
            Soru sor, kisa yanitlar al ve deneyim paylas.
          </p>
        </div>
      </section>

      <section id="soru-cevap" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">{selectedTopic.category}</span>
          {isSampleContent ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
              Örnek
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
          <h3 className="text-sm font-semibold text-slate-900">Yanitlar</h3>
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
            Senin yanitin
          </label>
          <textarea
            id="reply"
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            placeholder="Tecrubeni, hesabini veya onerini yaz..."
          />
          <div className="flex justify-end">
            <button type="button" className="tap-target inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-500">
              Yanit paylas
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">Aktif basliklar</h2>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{topics.length} baslik</span>
            {isSampleContent ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                Örnek
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
                {isSampleContent ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    Örnek
                  </span>
                ) : null}
                <span className="font-semibold text-slate-900">{topic.title}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
                <span>{topic.replies} yanit</span>
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                <span>{topic.updated}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

