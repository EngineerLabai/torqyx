import SealingGuideClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function SealingGuidePage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("sealing-guide", locale);
  return <SealingGuideClient initialDocs={initialDocs} />;
}
