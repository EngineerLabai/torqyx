import SimpleStressClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("simple-stress", locale);
}

export default async function SimpleStressPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("simple-stress", locale);
  return (
    <>
      <ToolSeo toolId="simple-stress" locale={locale} />
      <SimpleStressClient initialDocs={initialDocs} />
    </>
  );
}


