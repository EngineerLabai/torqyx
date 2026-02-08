import MaterialCardsClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function MaterialCardsPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("material-cards", locale);
  return <MaterialCardsClient initialDocs={initialDocs} />;
}
