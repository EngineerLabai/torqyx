import StrengthStaticsClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("strength-statics", locale);
}

export default async function StrengthStaticsPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("strength-statics", locale);
  return (
    <>
      <ToolSeo toolId="strength-statics" locale={locale} />
      <StrengthStaticsClient initialDocs={initialDocs} />
    </>
  );
}


