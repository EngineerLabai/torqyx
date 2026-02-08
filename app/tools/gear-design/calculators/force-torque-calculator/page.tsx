import ForceTorqueCalculatorClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function ForceTorqueCalculatorPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design/calculators/force-torque-calculator", locale);
  return <ForceTorqueCalculatorClient initialDocs={initialDocs} />;
}
