import { Suspense } from "react";
import ToolPageClient from "@/components/tools/ToolPageClient";
import ToolPageIntro from "@/components/tools/ToolPageIntro";
import ToolPageWithDocs from "@/components/tools/ToolPageWithDocs";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("bolt-calculator", locale);
}

export default async function BoltCalculatorPage() {
  const locale = await getLocaleFromCookies();
  return (
    <>
      <ToolSeo toolId="bolt-calculator" locale={locale} />
      <ToolPageIntro toolId="bolt-calculator" locale={locale} />
      <Suspense fallback={<ToolPageClient toolId="bolt-calculator" hideIntro />}>
        <ToolPageWithDocs toolId="bolt-calculator" locale={locale} />
      </Suspense>
    </>
  );
}
