import PageShell from "@/components/layout/PageShell";
import SavedCalculations from "@/components/tools/SavedCalculations";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function SavedCalculationsPage() {
  const locale = await getLocaleFromCookies();
  const copy =
    locale === "en"
      ? {
          kicker: "Saved Calculations",
          title: "My saved calculations",
          description: "Review, reopen, or clear the calculations you saved before.",
        }
      : {
          kicker: "Kayitli Hesaplar",
          title: "Kayitli Hesaplarim",
          description: "Daha once kaydettigin hesaplari gor, tekrar ac veya temizle.",
        };

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
