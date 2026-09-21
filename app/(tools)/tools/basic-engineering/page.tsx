import { Suspense } from "react";
import ToolPageClient from "@/components/tools/ToolPageClient";
import ToolPageIntro from "@/components/tools/ToolPageIntro";
import ToolPageWithDocs from "@/components/tools/ToolPageWithDocs";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("basic-engineering", locale);
}

export default async function BasicEngineeringPage() {
  const locale = await getLocaleFromCookies();
  return (
    <>
      <ToolSeo toolId="basic-engineering" locale={locale} />
      <ToolPageIntro toolId="basic-engineering" locale={locale} />
      <Suspense fallback={<ToolPageClient toolId="basic-engineering" hideIntro />}>
        <ToolPageWithDocs toolId="basic-engineering" locale={locale} />
      </Suspense>
    </>
  );
}
