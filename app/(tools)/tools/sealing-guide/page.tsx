import SealingGuideClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("sealing-guide", locale);
}

export default async function SealingGuidePage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("sealing-guide", locale);
  return (
    <>
      <ToolSeo toolId="sealing-guide" locale={locale} />
      <SealingGuideClient initialDocs={initialDocs} />
    </>
  );
}


