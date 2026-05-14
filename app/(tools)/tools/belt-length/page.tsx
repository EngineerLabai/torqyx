import BeltLengthClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("belt-length", locale);
}

export default async function BeltLengthPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("belt-length", locale);
  return (
    <>
      <ToolSeo toolId="belt-length" locale={locale} />
      <BeltLengthClient initialDocs={initialDocs} />
    </>
  );
}


