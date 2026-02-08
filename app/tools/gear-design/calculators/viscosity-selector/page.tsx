import ViscositySelectorClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function ViscositySelectorPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design/calculators/viscosity-selector", locale);
  return <ViscositySelectorClient initialDocs={initialDocs} />;
}
