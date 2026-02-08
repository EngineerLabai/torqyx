import ProductionProjectClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function ProductionProjectPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("production-project", locale);
  return <ProductionProjectClient initialDocs={initialDocs} />;
}
