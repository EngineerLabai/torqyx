import JsonLd from "@/components/seo/JsonLd";
import { buildFaqJsonLd, getToolMethodNotes } from "@/lib/tool-method-notes";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function Head() {
  const locale = await getLocaleFromCookies();
  const notes = getToolMethodNotes("basic-engineering", locale);
  if (!notes?.faqs?.length) {
    return null;
  }
  return <JsonLd data={buildFaqJsonLd(notes, locale)} />;
}
