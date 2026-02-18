import dynamic from "next/dynamic";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

const SanityCheckLab = dynamic(() => import("@/components/sanity-check/SanityCheckLab"), {
  loading: () => (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
      Loading...
    </section>
  ),
});

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("sanity-check", locale);
}

export default async function SanityCheckPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("sanity-check", locale);
  return (
    <>
      <ToolSeo toolId="sanity-check" locale={locale} />
      <PageShell>
        <ToolDocTabs slug="sanity-check" initialDocs={initialDocs}>
          <SanityCheckLab />
        </ToolDocTabs>
      </PageShell>
    </>
  );
}

