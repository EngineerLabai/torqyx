import HeatEnergyClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function HeatEnergyPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("heat-energy", locale);
  return <HeatEnergyClient initialDocs={initialDocs} />;
}
