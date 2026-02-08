import ContactRatioCalculatorClient from "./Client";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function ContactRatioCalculatorPage() {
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse("gear-design/calculators/contact-ratio-calculator", locale);
  return <ContactRatioCalculatorClient initialDocs={initialDocs} />;
}
