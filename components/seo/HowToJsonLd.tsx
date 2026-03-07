import JsonLd from "@/components/seo/JsonLd";
import type { HowToSchemaInput } from "@/types/structured-data";

type HowToJsonLdProps = {
  name: string;
  steps: string[];
  description?: string;
  url?: string;
  inLanguage?: string;
  id?: string;
};

export default function HowToJsonLd({
  name,
  steps,
  description,
  url,
  inLanguage,
  id,
}: HowToJsonLdProps) {
  if (steps.length === 0) return null;

  const data: HowToSchemaInput = {
    name,
    ...(description ? { description } : {}),
    ...(url ? { url } : {}),
    ...(inLanguage ? { inLanguage } : {}),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step,
      text: step,
    })),
  };

  return <JsonLd type="HowTo" data={data} id={id} />;
}

