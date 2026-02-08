import BendingStressClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function BendingStressPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("bending-stress", locale);
  return <BendingStressClient initialDocs={initialDocs} />;
}
