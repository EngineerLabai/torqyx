import HelixAxialCalculatorClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function HelixAxialCalculatorPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design/calculators/helix-axial-calculator", locale);
  return <HelixAxialCalculatorClient initialDocs={initialDocs} />;
}
