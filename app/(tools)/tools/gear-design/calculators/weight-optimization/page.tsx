import WeightOptimizationClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("gear-design/calculators/weight-optimization", locale);
}

export default async function WeightOptimizationPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design/calculators/weight-optimization", locale);
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight no-underline border-0">
        Gear Design Calculator – ISO 6336
      </h1>

      <ToolSeo toolId="gear-design/calculators/weight-optimization" locale={locale} />
      <WeightOptimizationClient initialDocs={initialDocs} />
    </>
  );
}



