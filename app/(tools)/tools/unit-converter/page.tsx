import ToolPageClient from "@/components/tools/ToolPageClient";
import ToolPageIntro from "@/components/tools/ToolPageIntro";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("unit-converter", locale);
}

export default async function UnitConverterPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("unit-converter", locale);
  return (
    <>
      <ToolSeo toolId="unit-converter" locale={locale} />
      <ToolPageIntro toolId="unit-converter" locale={locale} />
      <ToolPageClient toolId="unit-converter" initialDocs={initialDocs} hideIntro />
    </>
  );
}
