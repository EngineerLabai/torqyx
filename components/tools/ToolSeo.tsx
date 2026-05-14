import FaqPageJsonLd from "@/components/seo/FaqPageJsonLd";
import HowToJsonLd from "@/components/seo/HowToJsonLd";
import ToolApplicationJsonLd from "@/components/seo/ToolApplicationJsonLd";
import { getToolMethodNotes } from "@/lib/tool-method-notes";
import type { Locale } from "@/utils/locale";
import { buildToolHowToJsonLd, buildToolJsonLd, buildToolSeo } from "@/utils/tool-seo";

type ToolSeoProps = {
  toolId: string;
  locale: Locale;
};

export default function ToolSeo({ toolId, locale }: ToolSeoProps) {
  const data = buildToolJsonLd(toolId, locale);
  const seo = buildToolSeo(toolId, locale);
  const howToSchema = buildToolHowToJsonLd(toolId, locale);
  const fallbackSteps = buildFallbackSteps({
    name: seo.tool ? seo.title.replace(/\s+\|\s+.+$/, "") : data.name,
    type: seo.tool?.type ?? "calculator",
    locale,
  });
  const notes = getToolMethodNotes(toolId, locale);
  const idPrefix = toolId.replace(/[^a-z0-9_-]+/gi, "-");
  const howToSteps = howToSchema?.step.map((step) => step.text ?? step.name) ?? fallbackSteps;
  const howToName =
    howToSchema?.name ??
    (locale === "tr" ? `${data.name} kullanim adimlari` : `${data.name} usage steps`);

  return (
    <>
      <ToolApplicationJsonLd id={`${idPrefix}-software-jsonld`} data={data} schemaType="SoftwareApplication" />
      {howToSteps.length > 0 ? (
        <HowToJsonLd
          id={`${idPrefix}-howto-jsonld`}
          name={howToName}
          description={howToSchema?.description ?? data.description}
          url={howToSchema?.url ?? data.url}
          inLanguage={howToSchema?.inLanguage ?? (locale === "tr" ? "tr-TR" : "en-US")}
          steps={howToSteps}
        />
      ) : null}
      {notes?.faqs?.length ? (
        <FaqPageJsonLd
          id={`${idPrefix}-faq-jsonld`}
          items={notes.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))}
          inLanguage={locale === "tr" ? "tr-TR" : "en-US"}
        />
      ) : null}
    </>
  );
}

function buildFallbackSteps({
  name,
  type,
  locale,
}: {
  name: string;
  type: "calculator" | "bundle" | "guide";
  locale: Locale;
}) {
  if (locale === "en") {
    if (type === "guide") {
      return [
        `Open the ${name} reference page.`,
        "Select the relevant material, standard, or engineering condition.",
        "Compare assumptions, limits, and related calculator links before applying the result.",
      ];
    }

    if (type === "bundle") {
      return [
        `Open the ${name} tool bundle.`,
        "Choose the calculator or workflow that matches the engineering problem.",
        "Enter consistent units, review assumptions, and continue with related checks if needed.",
      ];
    }

    return [
      `Open the ${name} calculator.`,
      "Enter the required input values with consistent engineering units.",
      "Review the calculated result, assumptions, references, and related validation notes.",
    ];
  }

  if (type === "guide") {
    return [
      `${name} referans sayfasini acin.`,
      "Ilgili malzeme, standart veya muhendislik kosulunu secin.",
      "Sonucu uygulamadan once varsayimlari, sinirlari ve ilgili hesaplayici baglantilarini karsilastirin.",
    ];
  }

  if (type === "bundle") {
    return [
      `${name} arac grubunu acin.`,
      "Muhendislik problemine uygun hesaplayiciyi veya is akisini secin.",
      "Birimleri tutarli girin, varsayimlari inceleyin ve gerekirse ilgili kontrollerle devam edin.",
    ];
  }

  return [
    `${name} hesaplayicisini acin.`,
    "Gerekli girdi degerlerini tutarli muhendislik birimleriyle girin.",
    "Hesaplanan sonucu, varsayimlari, referanslari ve dogrulama notlarini inceleyin.",
  ];
}
