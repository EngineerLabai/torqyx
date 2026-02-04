import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "Devreye Alma Paneli",
    description: "Devreye alma checklisti: torklama, test, sicak/soguk cevrim ve loglama.",
  },
  en: {
    title: "Commissioning Panel",
    description: "Commissioning checklist for torque, tests, hot/cold cycles, and logs.",
  },
};

export default async function Head() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const { title, description } = copy[locale];

  return (
    <StaticHead
      title={`${title} | ${brandContent.siteName}`}
      description={description}
      path="/project-hub/devreye-alma"
      locale={locale}
    />
  );
}
