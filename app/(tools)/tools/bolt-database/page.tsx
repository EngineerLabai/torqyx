import BoltDatabaseClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("bolt-database", locale);
}

export default async function BoltDatabasePage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("bolt-database", locale);
  return (
    <>
      <ToolSeo toolId="bolt-database" locale={locale} />
      <BoltDatabaseClient initialDocs={initialDocs} />
    </>
  );
}


