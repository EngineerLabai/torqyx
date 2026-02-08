import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function BearingLifePage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("bearing-life", locale);
  return <ToolPageClient toolId="bearing-life" initialDocs={initialDocs} />;
}
