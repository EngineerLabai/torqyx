import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("bolt-calculator", locale);
}

export default async function BoltCalculatorPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("bolt-calculator", locale);
  return (
    <>
      <ToolSeo toolId="bolt-calculator" locale={locale} />
      <ToolPageClient toolId="bolt-calculator" initialDocs={initialDocs} />
    </>
  );
}


