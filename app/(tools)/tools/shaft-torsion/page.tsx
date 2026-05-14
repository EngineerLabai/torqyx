import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("shaft-torsion", locale);
}

export default async function ShaftTorsionPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("shaft-torsion", locale);
  return (
    <>
      <ToolSeo toolId="shaft-torsion" locale={locale} />
      <ToolPageClient toolId="shaft-torsion" initialDocs={initialDocs} />
    </>
  );
}


