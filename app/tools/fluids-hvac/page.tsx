import FluidsHvacClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("fluids-hvac", locale);
}

export default async function FluidsHvacPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("fluids-hvac", locale);
  return (
    <>
      <ToolSeo toolId="fluids-hvac" locale={locale} />
      <FluidsHvacClient initialDocs={initialDocs} />
    </>
  );
}


