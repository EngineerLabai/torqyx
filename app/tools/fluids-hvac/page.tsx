import FluidsHvacClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function FluidsHvacPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("fluids-hvac", locale);
  return <FluidsHvacClient initialDocs={initialDocs} />;
}
