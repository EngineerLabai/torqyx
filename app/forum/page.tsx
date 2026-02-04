import { redirect } from "next/navigation";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy =
    locale === "tr"
      ? { title: "Forum", description: "Topluluk forumuna yonlendirilir." }
      : { title: "Forum", description: "Redirects to the community Q&A." };

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/forum",
    locale,
  });
}

export default async function ForumRedirect() {
  const locale = await getLocaleFromCookies();
  redirect(withLocalePrefix("/qa", locale));
}
