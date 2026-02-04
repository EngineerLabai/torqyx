import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";

export default async function Head() {
  const locale = await getLocaleFromCookies();
  const brand = getBrandCopy(locale);
  const messages = getMessages(locale);

  const title = messages.components.sanityCheck.report.title;
  const description = messages.pages.sanityCheck.description;

  return (
    <StaticHead
      title={`${title} | ${brand.siteName}`}
      description={description}
      path="/tools/sanity-check/report"
      locale={locale}
    />
  );
}
