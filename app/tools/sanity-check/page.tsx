import PageShell from "@/components/layout/PageShell";
import SanityCheckLab from "@/components/sanity-check/SanityCheckLab";
import ToolDocTabs from "@/components/tools/ToolDocTabs";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function SanityCheckPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("sanity-check", locale);
  return (
    <PageShell>
      <ToolDocTabs slug="sanity-check" initialDocs={initialDocs}>
        <SanityCheckLab />
      </ToolDocTabs>
    </PageShell>
  );
}
