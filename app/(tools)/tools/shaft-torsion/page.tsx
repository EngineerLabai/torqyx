import { Suspense } from "react";
import ToolPageClient from "@/components/tools/ToolPageClient";
import ToolPageIntro from "@/components/tools/ToolPageIntro";
import ToolPageWithDocs from "@/components/tools/ToolPageWithDocs";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("shaft-torsion", locale);
}

export default async function ShaftTorsionPage() {
  const locale = await getLocaleFromCookies();
  return (
    <>
      <ToolSeo toolId="shaft-torsion" locale={locale} />
      <ToolPageIntro toolId="shaft-torsion" locale={locale} />
      <Suspense fallback={<ToolPageClient toolId="shaft-torsion" hideIntro />}>
        <ToolPageWithDocs toolId="shaft-torsion" locale={locale} />
      </Suspense>
    </>
  );
}
