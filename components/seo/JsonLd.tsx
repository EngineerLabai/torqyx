import type { StructuredDataByType, StructuredDataType } from "@/types/structured-data";

type JsonLdProps<TType extends StructuredDataType = StructuredDataType> = {
  type?: TType;
  data: StructuredDataByType[TType] | Record<string, unknown>;
  id?: string;
};

export default function JsonLd<TType extends StructuredDataType = StructuredDataType>({
  type,
  data,
  id,
}: JsonLdProps<TType>) {
  const payload: Record<string, unknown> = type
    ? {
        ...(data as Record<string, unknown>),
        "@context": "https://schema.org",
        "@type": type,
      }
    : (data as Record<string, unknown>);

  return (
    // Google Rich Results Test: https://search.google.com/test/rich-results
    <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}

