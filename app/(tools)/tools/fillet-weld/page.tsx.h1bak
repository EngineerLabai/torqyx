import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("fillet-weld", locale);
}

export default async function FilletWeldPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("fillet-weld", locale);
  return (
    <>
      <ToolSeo toolId="fillet-weld" locale={locale} />
      <ToolPageClient toolId="fillet-weld" initialDocs={initialDocs} />
    </>
  );
}


