import ToolApplicationJsonLd from "@/components/seo/ToolApplicationJsonLd";
import { buildToolApplicationSchema } from "@/tools/_shared/seo";
import { getLocaleFromCookies } from "@/utils/locale-server";

const toolPath = "simple-stress";

export default async function Head() {
  const locale = await getLocaleFromCookies();
  return <ToolApplicationJsonLd id="simple-stress-app-jsonld" data={buildToolApplicationSchema(toolPath, locale)} schemaType="WebApplication" />;
}
