import BeltLengthClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function BeltLengthPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("belt-length", locale);
  return <BeltLengthClient initialDocs={initialDocs} />;
}
