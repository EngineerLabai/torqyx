import MachineElementsClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function MachineElementsPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("machine-elements", locale);
  return <MachineElementsClient initialDocs={initialDocs} />;
}
