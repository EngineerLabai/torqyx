import MaterialCardsClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("material-cards", locale);
}

export default async function MaterialCardsPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("material-cards", locale);
  return (
    <>
      <ToolSeo toolId="material-cards" locale={locale} />
      <MaterialCardsClient initialDocs={initialDocs} />
    </>
  );
}


