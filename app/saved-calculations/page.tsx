import PageShell from "@/components/layout/PageShell";
import SavedCalculations from "@/components/tools/SavedCalculations";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.savedCalculations;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/saved-calculations",
    locale,
  });
}

export default async function SavedCalculationsPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.savedCalculations;

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{copy.kicker}</p>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
            {copy.title}
          </h1>
          <p className="text-sm text-slate-600">{copy.description}</p>
        </div>
      </section>

      <SavedCalculations />
    </PageShell>
  );
}
