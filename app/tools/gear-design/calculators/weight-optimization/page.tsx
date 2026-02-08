import WeightOptimizationClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function WeightOptimizationPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design/calculators/weight-optimization", locale);
  return <WeightOptimizationClient initialDocs={initialDocs} />;
}
