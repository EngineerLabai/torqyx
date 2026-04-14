import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("pipe-pressure-loss", locale);
}

export default async function PipePressureLossPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("pipe-pressure-loss", locale);
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Pipe Pressure Loss — ISO 5167
      </h1>

      <ToolSeo toolId="pipe-pressure-loss" locale={locale} />
      <ToolPageClient toolId="pipe-pressure-loss" initialDocs={initialDocs} />
    </>
  );
}


