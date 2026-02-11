import PageShell from "@/components/layout/PageShell";
import ReportView from "@/components/sanity-check/ReportView";
import { decodeSession } from "@/lib/sanityCheck/share";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";

type ReportPageProps = {
  searchParams?: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
};

const resolveParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

export default async function SanityCheckReportPage({ searchParams }: ReportPageProps) {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).components.sanityCheck.report;
  const resolvedSearchParams = (await searchParams) ?? undefined;
  const sessionParam = resolveParam(resolvedSearchParams?.session);
  const session = sessionParam ? decodeSession(sessionParam) : null;

  return (
    <PageShell>
      <section id="report-print-area">
        {session ? (
          <ReportView session={session} />
        ) : (
          <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
            {copy.missing}
          </section>
        )}
      </section>
    </PageShell>
  );
}
