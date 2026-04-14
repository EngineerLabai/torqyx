import dynamic from "next/dynamic";
import PageShell from "@/components/layout/PageShell";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

function SanityCheckSkeleton() {
  return (
    <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm animate-pulse">
      <h1 className="text-3xl font-bold tracking-tight">
        Engineering Sanity Check Lab
      </h1>

      <div className="h-4 w-48 rounded bg-slate-200" />
      <div className="h-3 w-72 rounded bg-slate-100" />
      <div className="h-64 rounded-2xl border border-slate-100 bg-slate-50" />
    </section>
  );
}

// Bundle estimate (webpack analyzer, parsed): sanity-check route first-load JS expected to drop ~20-40KB.
const SanityCheckLab = dynamic(() => import("@/components/sanity-check/SanityCheckLab"), {
  loading: () => <SanityCheckSkeleton />,
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

