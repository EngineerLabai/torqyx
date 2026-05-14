import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("basic-engineering", locale);
}

export default async function BasicEngineeringPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("basic-engineering", locale);
  return (
    <>
      <ToolSeo toolId="basic-engineering" locale={locale} />
      <ToolPageClient toolId="basic-engineering" initialDocs={initialDocs} />
    </>
  );
}


