import PageShell from "@/components/layout/PageShell";
import SanityCheckLab from "@/components/sanity-check/SanityCheckLab";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

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


