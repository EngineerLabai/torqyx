import MaterialsManufacturingClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("materials-manufacturing", locale);
}

export default async function MaterialsManufacturingPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("materials-manufacturing", locale);
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Materials & Manufacturing
      </h1>

      <ToolSeo toolId="materials-manufacturing" locale={locale} />
      <MaterialsManufacturingClient initialDocs={initialDocs} />
    </>
  );
}


