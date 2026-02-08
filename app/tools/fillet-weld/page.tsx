import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function FilletWeldPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("fillet-weld", locale);
  return <ToolPageClient toolId="fillet-weld" initialDocs={initialDocs} />;
}
