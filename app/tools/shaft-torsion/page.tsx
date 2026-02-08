import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function ShaftTorsionPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("shaft-torsion", locale);
  return <ToolPageClient toolId="shaft-torsion" initialDocs={initialDocs} />;
}
