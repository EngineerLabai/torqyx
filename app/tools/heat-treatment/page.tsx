import HeatTreatmentClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function HeatTreatmentPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("heat-treatment", locale);
  return <HeatTreatmentClient initialDocs={initialDocs} />;
}
