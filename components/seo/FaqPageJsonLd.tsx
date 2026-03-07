import JsonLd from "@/components/seo/JsonLd";
import type { FAQPageSchemaInput } from "@/types/structured-data";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqPageJsonLdProps = {
  items: FaqItem[];
  inLanguage?: string;
  id?: string;
};

export default function FaqPageJsonLd({ items, inLanguage, id }: FaqPageJsonLdProps) {
  if (items.length === 0) return null;

  const data: FAQPageSchemaInput = {
    ...(inLanguage ? { inLanguage } : {}),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLd type="FAQPage" data={data} id={id} />;
}

