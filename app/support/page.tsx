import PageShell from "@/components/layout/PageShell";
export default function SupportPage() {
  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
            Teknik destek
          </p>
          <h1 className="text-2xl font-semibold leading-snug text-slate-900">Hızlı teknik destek ve yönlendirme</h1>
          <p className="text-sm leading-relaxed text-slate-700">
            Kisa bir talep birak, uzman ekip hizlica geri donsun.
          </p>
        </div>

        <form
          className="mt-4 space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 shadow-sm"
          action="mailto:destek@aiengineerslab.com?subject=Teknik%20Destek%20Talebi"
          method="POST"
          encType="multipart/form-data"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700" htmlFor="name">
                Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="Örn: Burak Yılmaz"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700" htmlFor="email">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="ornek@domain.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700" htmlFor="message">
              Talep detayları
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              placeholder="Konu, varsa hesap değerleri, standartlar, sınırlar..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700" htmlFor="attachment">
              Dosya yükle (isteğe bağlı)
            </label>
            <input
              id="attachment"
              name="attachment"
              type="file"
              className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-500"
            />
            <p className="text-[11px] text-slate-600">Not: E-posta istemcisi acilir, dosya orada ekli kalir.</p>
          </div>

          <button
            type="submit"
            className="tap-target w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Gönder
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Talep oluştururken öneriler</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Kısa bir konu başlığı ekle (örn. &quot;M12 10.9 cıvata torku&quot;).</li>
          <li>Varsa malzeme, yük, limit veya standartları belirt.</li>
        </ul>
      </section>
    </PageShell>
  );
}
