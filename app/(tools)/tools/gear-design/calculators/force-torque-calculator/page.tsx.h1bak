import ForceTorqueCalculatorClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("gear-design/calculators/force-torque-calculator", locale);
}

export default async function ForceTorqueCalculatorPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design/calculators/force-torque-calculator", locale);
  return (
    <>
      <ToolSeo toolId="gear-design/calculators/force-torque-calculator" locale={locale} />
      <ForceTorqueCalculatorClient initialDocs={initialDocs} />
    </>
  );
}


