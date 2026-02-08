import StrengthStaticsClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function StrengthStaticsPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("strength-statics", locale);
  return <StrengthStaticsClient initialDocs={initialDocs} />;
}
