import FaqPageJsonLd from "@/components/seo/FaqPageJsonLd";
import HowToJsonLd from "@/components/seo/HowToJsonLd";
import ToolApplicationJsonLd from "@/components/seo/ToolApplicationJsonLd";
import { getToolMethodNotes } from "@/lib/tool-method-notes";
import { buildToolApplicationSchema, buildToolHowToSchema } from "@/tools/_shared/seo";
import { getLocaleFromCookies } from "@/utils/locale-server";

const toolPath = "torque-power";

export default async function Head() {
  const locale = await getLocaleFromCookies();
  const notes = getToolMethodNotes(toolPath, locale);
  const appSchema = buildToolApplicationSchema(toolPath, locale);
  const howToSchema = buildToolHowToSchema(toolPath, locale);

  return (
    <>
      <ToolApplicationJsonLd id="torque-power-app-jsonld" data={appSchema} schemaType="WebApplication" />
      {howToSchema ? (
        <HowToJsonLd
          id="torque-power-howto-jsonld"
          name={howToSchema.name}
          description={howToSchema.description}
          url={howToSchema.url}
          inLanguage={howToSchema.inLanguage}
          steps={howToSchema.step.map((step) => step.text ?? step.name)}
        />
      ) : null}
      {notes?.faqs?.length ? (
        <FaqPageJsonLd
          id="torque-power-faq-jsonld"
          items={notes.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))}
          inLanguage={locale === "tr" ? "tr-TR" : "en-US"}
        />
      ) : null}
    </>
  );
}

