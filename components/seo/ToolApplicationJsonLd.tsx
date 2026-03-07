import JsonLd from "@/components/seo/JsonLd";
import type { SoftwareApplicationSchemaInput, WebApplicationSchemaInput } from "@/types/structured-data";

type ToolApplicationType = "SoftwareApplication" | "WebApplication";

type ToolApplicationJsonLdProps = {
  data: SoftwareApplicationSchemaInput | WebApplicationSchemaInput;
  schemaType?: ToolApplicationType;
  id?: string;
};

export default function ToolApplicationJsonLd({
  data,
  schemaType = "WebApplication",
  id,
}: ToolApplicationJsonLdProps) {
  return <JsonLd type={schemaType} data={data} id={id} />;
}

