import JsonLd from "@/components/seo/JsonLd";
import type { Locale } from "@/utils/locale";
import { buildToolJsonLd } from "@/utils/tool-seo";

type ToolSeoProps = {
  toolId: string;
  locale: Locale;
};

export default function ToolSeo({ toolId, locale }: ToolSeoProps) {
  const data = buildToolJsonLd(toolId, locale);
  return <JsonLd data={data} />;
}
