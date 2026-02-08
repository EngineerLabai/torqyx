import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function ParamChartPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("param-chart", locale);
  return <ToolPageClient toolId="param-chart" initialDocs={initialDocs} />;
}
