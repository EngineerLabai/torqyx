import MaterialsManufacturingClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function MaterialsManufacturingPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("materials-manufacturing", locale);
  return <MaterialsManufacturingClient initialDocs={initialDocs} />;
}
