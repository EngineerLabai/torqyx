import ToolApplicationJsonLd from "@/components/seo/ToolApplicationJsonLd";
import type { Locale } from "@/utils/locale";
import { buildToolJsonLd } from "@/utils/tool-seo";

type ToolSeoProps = {
  toolId: string;
  locale: Locale;
};

/**
 * Emits only the truthful application entity. Visible how-to and FAQ content
 * remains on the page, but it is not duplicated as unsupported rich-result markup.
 */
export default function ToolSeo({ toolId, locale }: ToolSeoProps) {
  const data = buildToolJsonLd(toolId, locale);
  const idPrefix = toolId.replace(/[^a-z0-9_-]+/gi, "-");

  return <ToolApplicationJsonLd id={`${idPrefix}-software-jsonld`} data={data} schemaType="SoftwareApplication" />;
}
