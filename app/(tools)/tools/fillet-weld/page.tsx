import { Suspense } from "react";
import ToolPageClient from "@/components/tools/ToolPageClient";
import ToolPageIntro from "@/components/tools/ToolPageIntro";
import ToolPageWithDocs from "@/components/tools/ToolPageWithDocs";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("fillet-weld", locale);
}

export default async function FilletWeldPage() {
  const locale = await getLocaleFromCookies();
  return (
    <>
      <ToolSeo toolId="fillet-weld" locale={locale} />
      <ToolPageIntro toolId="fillet-weld" locale={locale} />
      <Suspense fallback={<ToolPageClient toolId="fillet-weld" hideIntro />}>
        <ToolPageWithDocs toolId="fillet-weld" locale={locale} />
      </Suspense>
    </>
  );
}
