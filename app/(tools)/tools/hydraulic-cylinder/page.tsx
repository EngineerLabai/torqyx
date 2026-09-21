import { Suspense } from "react";
import ToolPageClient from "@/components/tools/ToolPageClient";
import ToolPageIntro from "@/components/tools/ToolPageIntro";
import ToolPageWithDocs from "@/components/tools/ToolPageWithDocs";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("hydraulic-cylinder", locale);
}

export default async function HydraulicCylinderPage() {
  const locale = await getLocaleFromCookies();
  return (
    <>
      <ToolSeo toolId="hydraulic-cylinder" locale={locale} />
      <ToolPageIntro toolId="hydraulic-cylinder" locale={locale} />
      <Suspense fallback={<ToolPageClient toolId="hydraulic-cylinder" hideIntro />}>
        <ToolPageWithDocs toolId="hydraulic-cylinder" locale={locale} />
      </Suspense>
    </>
  );
}
