import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function HydraulicCylinderPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("hydraulic-cylinder", locale);
  return <ToolPageClient toolId="hydraulic-cylinder" initialDocs={initialDocs} />;
}
