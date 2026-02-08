import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function UnitConverterPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("unit-converter", locale);
  return <ToolPageClient toolId="unit-converter" initialDocs={initialDocs} />;
}
