import ContactRatioCalculatorClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("gear-design/calculators/contact-ratio-calculator", locale);
}

export default async function ContactRatioCalculatorPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design/calculators/contact-ratio-calculator", locale);
  return (
    <>
      <ToolSeo toolId="gear-design/calculators/contact-ratio-calculator" locale={locale} />
      <ContactRatioCalculatorClient initialDocs={initialDocs} />
    </>
  );
}


