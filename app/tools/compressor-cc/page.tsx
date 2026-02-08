import CompressorCcClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function CompressorCcPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("compressor-cc", locale);
  return <CompressorCcClient initialDocs={initialDocs} />;
}
