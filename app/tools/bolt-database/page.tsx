import BoltDatabaseClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function BoltDatabasePage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("bolt-database", locale);
  return <BoltDatabaseClient initialDocs={initialDocs} />;
}
