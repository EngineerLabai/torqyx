import ProductionProjectClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("production-project", locale);
}

export default async function ProductionProjectPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("production-project", locale);
  return (
    <>
      <ToolSeo toolId="production-project" locale={locale} />
      <ProductionProjectClient initialDocs={initialDocs} />
    </>
  );
}


