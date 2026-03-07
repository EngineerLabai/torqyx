import dynamic from "next/dynamic";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import ReportPageShell from "@/components/tools/ReportPageShell";
import { decodeSession } from "@/lib/sanityCheck/share";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

type ReportPageProps = {
  searchParams?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
};

const resolveParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

function ReportViewSkeleton() {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-4 w-40 rounded bg-slate-200" />
      <div className="h-3 w-72 rounded bg-slate-100" />
      <div className="h-56 rounded-xl border border-slate-100 bg-slate-50" />
    </section>
  );
}

// Bundle estimate (webpack analyzer, parsed): sanity-check report first-load JS expected to drop ~8-14KB.
const ReportView = dynamic(() => import("@/components/sanity-check/ReportView"), {
  loading: () => <ReportViewSkeleton />,
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Sanity Check Raporu" : "Sanity Check Report";
  const description =
    locale === "tr"
      ? "Sanity check muhendislik hesaplayicilari raporunu paylasim, dogrulama ve teknik gozden gecirme icin duzenli formatta sunan rapor sayfasi."
      : "Structured report page for sanity check engineering calculators output, built for sharing, validation, and technical review workflows.";

  return buildPageMetadata({
    title,
    description,
    path: "/tools/sanity-check/report",
    locale,
  });
}

export default async function SanityCheckReportPage({ searchParams }: ReportPageProps) {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).components.sanityCheck.report;
  const resolvedSearchParams = (await searchParams) ?? undefined;
  const sessionParam = resolveParam(resolvedSearchParams?.session);
  const session = sessionParam ? decodeSession(sessionParam) : null;

  return (
    <PageShell className="report-page">
      <ReportPageShell>
        <section id="report-area">
          {session ? (
            <ReportView session={session} />
          ) : (
            <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
              {copy.missing}
            </section>
          )}
        </section>
      </ReportPageShell>
    </PageShell>
  );
}

