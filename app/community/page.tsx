// app/community/page.tsx
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { threads } from "./data";

export default function CommunityPage() {
  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <p className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-[11px] font-semibold text-purple-700">
            Topluluk forumu
          </p>
          <h1 className="text-2xl font-semibold leading-snug text-slate-900">Topluluk alanı</h1>
          <p className="text-sm leading-relaxed text-slate-700">
            Teknik basliklar ac, deneyim paylas ve kisa notlarla tartismayi baslat.
          </p>
        </div>

        <form className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700" htmlFor="topic-title">
                Başlık
              </label>
              <input
                id="topic-title"
                name="topic-title"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                placeholder="Örn: Üç eksenli fikstür için 3-2-1 referans seçimi"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700" htmlFor="topic-category">
                Kategori
              </label>
              <select
                id="topic-category"
                name="topic-category"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              >
                <option>Fikstür / Aparat</option>
                <option>Kalite / Ölçüm</option>
                <option>Malzeme / Isıl İşlem</option>
                <option>Proje / Süreç</option>
                <option>Genel</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700" htmlFor="topic-body">
              Açıklama
            </label>
            <textarea
              id="topic-body"
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              placeholder="Detaylı anlatım, fotoğraf/link referansları, çizim veya tablo notları..."
            />
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-[11px] text-slate-600">Hassas verileri paylasma.</p>
            <button
              type="button"
              className="tap-target inline-flex items-center justify-center rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-500"
            >
              Başlık aç
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">Son başlıklar</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{threads.length} başlık</span>
        </div>

        <div className="mt-3 space-y-2">
          {threads.map((thread) => (
            <Link
              key={thread.slug}
              href={`/community/${thread.slug}`}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm transition hover:border-purple-200 hover:bg-purple-50"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{thread.category}</span>
                <h3 className="font-semibold text-slate-900">{thread.title}</h3>
              </div>
              <p className="mt-2 text-slate-700">{thread.excerpt}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
                <span>{thread.replies.length} yanıt</span>
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                <span>{thread.updated}</span>
                <div className="flex flex-wrap gap-1">
                  {thread.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
