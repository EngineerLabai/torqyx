import MachineElementsClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("machine-elements", locale);
}

export default async function MachineElementsPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("machine-elements", locale);
  return (
    <>
      <ToolSeo toolId="machine-elements" locale={locale} />
      <MachineElementsClient initialDocs={initialDocs} />
    </>
  );
}


