import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { threads } from "../data";

type PageProps = { params: { slug: string } };

export default function CommunityDetailPage({ params }: PageProps) {
  const thread = threads.find((t) => t.slug === params.slug);
  if (!thread) return notFound();

  return (
    <PageShell>
      <Link href="/community" className="tap-target inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-600">
        ← Tüm başlıklar
      </Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[11px] font-semibold text-slate-700">{thread.category}</span>
          <h1 className="text-xl font-semibold text-slate-900">{thread.title}</h1>
        </div>
        <p className="mt-2 text-sm text-slate-700">{thread.details}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
          <span>Yazan: {thread.author}</span>
          <span className="h-1 w-1 rounded-full bg-slate-400" />
          <span>{thread.updated}</span>
          <div className="flex flex-wrap gap-1">
            {thread.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Yanıtlar</h2>
        <div className="mt-3 space-y-2">
          {thread.replies.map((answer) => (
            <div key={`${answer.user}-${answer.time}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
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
            <button
              type="button"
              className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-500"
            >
              Yanıt paylaş
            </button>
          </div>
        </form>
      </section>
    </PageShell>
  );
}
