import HeatEnergyClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("heat-energy", locale);
}

export default async function HeatEnergyPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("heat-energy", locale);
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Heat Transfer & Energy — ASHRAE
      </h1>

      <ToolSeo toolId="heat-energy" locale={locale} />
      <HeatEnergyClient initialDocs={initialDocs} />
    </>
  );
}


