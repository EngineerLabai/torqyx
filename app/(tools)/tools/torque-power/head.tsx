import ToolApplicationJsonLd from "@/components/seo/ToolApplicationJsonLd";
import { buildToolApplicationSchema } from "@/tools/_shared/seo";
import { getLocaleFromCookies } from "@/utils/locale-server";

const toolPath = "torque-power";

export default async function Head() {
  const locale = await getLocaleFromCookies();
  return <ToolApplicationJsonLd id="torque-power-app-jsonld" data={buildToolApplicationSchema(toolPath, locale)} schemaType="WebApplication" />;
}
