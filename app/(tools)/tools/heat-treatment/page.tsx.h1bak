import HeatTreatmentClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("heat-treatment", locale);
}

export default async function HeatTreatmentPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("heat-treatment", locale);
  return (
    <>
      <ToolSeo toolId="heat-treatment" locale={locale} />
      <HeatTreatmentClient initialDocs={initialDocs} />
    </>
  );
}


