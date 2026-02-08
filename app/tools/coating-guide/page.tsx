import CoatingGuideClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function CoatingGuidePage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("coating-guide", locale);
  return <CoatingGuideClient initialDocs={initialDocs} />;
}
