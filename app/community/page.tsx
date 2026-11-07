import { redirect } from "next/navigation";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";
import { INDEXING_CONFIG } from "@/config/indexing";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy = getMessages(locale).components.qaBoard;

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/community",
    locale,
    robots: INDEXING_CONFIG.indexCommunity ? undefined : NOINDEX_FOLLOW_ROBOTS,
  });
}

export default async function CommunityPage() {
  const locale = await getLocaleFromCookies();
  redirect(withLocalePrefix("/faq", locale));
}
