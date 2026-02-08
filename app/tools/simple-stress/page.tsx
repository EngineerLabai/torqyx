import SimpleStressClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function SimpleStressPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("simple-stress", locale);
  return <SimpleStressClient initialDocs={initialDocs} />;
}
