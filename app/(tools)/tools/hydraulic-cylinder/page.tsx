import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("hydraulic-cylinder", locale);
}

export default async function HydraulicCylinderPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("hydraulic-cylinder", locale);
  return (
    <>
      <ToolSeo toolId="hydraulic-cylinder" locale={locale} />
      <ToolPageClient toolId="hydraulic-cylinder" initialDocs={initialDocs} />
    </>
  );
}


