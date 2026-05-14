import CompressorCcClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("compressor-cc", locale);
}

export default async function CompressorCcPage() {
  const locale = await getLocaleFromCookies();
  let initialDocs = null;
  try {
    initialDocs = await getToolDocsResponse("compressor-cc", locale);
  } catch {
    initialDocs = null;
  }
  return (
    <>
      <ToolSeo toolId="compressor-cc" locale={locale} />
      <CompressorCcClient initialDocs={initialDocs} />
    </>
  );
}


