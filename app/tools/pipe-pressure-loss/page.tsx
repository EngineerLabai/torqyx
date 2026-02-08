import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function PipePressureLossPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("pipe-pressure-loss", locale);
  return <ToolPageClient toolId="pipe-pressure-loss" initialDocs={initialDocs} />;
}
