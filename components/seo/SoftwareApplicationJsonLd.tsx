import JsonLd from "@/components/seo/JsonLd";
import type { SoftwareApplicationSchemaInput } from "@/types/structured-data";

type SoftwareApplicationJsonLdProps = {
  data: SoftwareApplicationSchemaInput;
  id?: string;
};

export default function SoftwareApplicationJsonLd({ data, id }: SoftwareApplicationJsonLdProps) {
  return <JsonLd type="SoftwareApplication" data={data} id={id} />;
}

