import { Suspense } from "react";
import ToolPageClient from "@/components/tools/ToolPageClient";
import ToolPageIntro from "@/components/tools/ToolPageIntro";
import ToolPageWithDocs from "@/components/tools/ToolPageWithDocs";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("unit-converter", locale);
}

export default async function UnitConverterPage() {
  const locale = await getLocaleFromCookies();
  return (
    <>
      <ToolSeo toolId="unit-converter" locale={locale} />
      <ToolPageIntro toolId="unit-converter" locale={locale} />
      <Suspense fallback={<ToolPageClient toolId="unit-converter" hideIntro />}>
        <ToolPageWithDocs toolId="unit-converter" locale={locale} />
      </Suspense>
    </>
  );
}
