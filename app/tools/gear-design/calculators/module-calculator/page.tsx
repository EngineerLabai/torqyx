import ModuleCalculatorClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function ModuleCalculatorPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design/calculators/module-calculator", locale);
  return <ModuleCalculatorClient initialDocs={initialDocs} />;
}
