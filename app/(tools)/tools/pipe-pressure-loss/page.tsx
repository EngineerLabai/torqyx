import { Suspense } from "react";
import ToolPageClient from "@/components/tools/ToolPageClient";
import ToolPageIntro from "@/components/tools/ToolPageIntro";
import ToolPageWithDocs from "@/components/tools/ToolPageWithDocs";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("pipe-pressure-loss", locale);
}

export default async function PipePressureLossPage() {
  const locale = await getLocaleFromCookies();
  return (
    <>
      <ToolSeo toolId="pipe-pressure-loss" locale={locale} />
      <ToolPageIntro toolId="pipe-pressure-loss" locale={locale} />
      <Suspense fallback={<ToolPageClient toolId="pipe-pressure-loss" hideIntro />}>
        <ToolPageWithDocs toolId="pipe-pressure-loss" locale={locale} />
      </Suspense>
    </>
  );
}
