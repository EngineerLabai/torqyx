import BendingStressClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("bending-stress", locale);
}

export default async function BendingStressPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("bending-stress", locale);
  return (
    <>
      <ToolSeo toolId="bending-stress" locale={locale} />
      <BendingStressClient initialDocs={initialDocs} />
    </>
  );
}


