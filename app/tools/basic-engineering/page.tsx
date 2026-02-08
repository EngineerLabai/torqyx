import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function BasicEngineeringPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("basic-engineering", locale);
  return <ToolPageClient toolId="basic-engineering" initialDocs={initialDocs} />;
}
