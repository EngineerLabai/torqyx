import PageShell from "@/components/layout/PageShell";
import ToolLibrary from "@/components/tools/ToolLibrary";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function ToolsIndexPage() {
  const locale = await getLocaleFromCookies();
  const copy =
    locale === "en"
      ? {
          badge: "Tool Library",
          title: "All calculators in one place",
          description: "Browse tools by use case and open the one you need in a click.",
        }
      : {
          badge: "Tool Library",
          title: "Tum hesaplama araclari tek sayfada",
          description: "Araclari kullanim alanina gore incele, ihtiyacin olani tek tikla ac.",
        };

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <svg
              className="hero-illustration text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
              <path d="M6 12h12M6 8h12M6 16h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 md:text-xs">
              <span className="font-semibold">{copy.badge}</span>
            </div>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">
            {copy.title}
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">{copy.description}</p>
        </div>
      </section>

      <ToolLibrary />
    </PageShell>
  );
}
