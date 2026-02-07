import { getBrandCopy } from "@/config/brand";
import StaticHead from "@/components/seo/StaticHead";
import { getLocaleFromCookies } from "@/utils/locale-server";

const copy = {
  tr: {
    title: "Proje ve İyileştirme Takip",
    description: "Proje, değişiklik ve iyileştirme aksiyonlarını tek panelde takip et.",
  },
  en: {
    title: "Project & Improvement Tracking",
    description: "Track project, change, and improvement actions in one panel.",
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
      path="/project-hub/project-tools"
      locale={locale}
    />
  );
}
