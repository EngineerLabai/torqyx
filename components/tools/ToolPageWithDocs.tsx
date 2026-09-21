import ToolPageClient from "@/components/tools/ToolPageClient";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import type { Locale } from "@/utils/locale";

type ToolPageWithDocsProps = {
  toolId: string;
  locale: Locale;
};

/**
 * Loads the documentation payload behind a Suspense boundary so the
 * server-rendered tool introduction can stream without waiting for related
 * content lookups.
 */
export default async function ToolPageWithDocs({ toolId, locale }: ToolPageWithDocsProps) {
  const initialDocs = await getToolDocsResponse(toolId, locale);

  return <ToolPageClient toolId={toolId} initialDocs={initialDocs} hideIntro />;
}
