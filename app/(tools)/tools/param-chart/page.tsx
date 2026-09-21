import { Suspense } from "react";
import ToolPageClient from "@/components/tools/ToolPageClient";
import ToolPageIntro from "@/components/tools/ToolPageIntro";
import ToolPageWithDocs from "@/components/tools/ToolPageWithDocs";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("param-chart", locale);
}

export default async function ParamChartPage() {
  const locale = await getLocaleFromCookies();
  return (
    <>
      <ToolSeo toolId="param-chart" locale={locale} />
      <ToolPageIntro toolId="param-chart" locale={locale} />
      <Suspense fallback={<ToolPageClient toolId="param-chart" hideIntro />}>
        <ToolPageWithDocs toolId="param-chart" locale={locale} />
      </Suspense>
    </>
  );
}
