import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";
import { INDEXING_CONFIG } from "@/config/indexing";
import LocatingCardClient from "./Client";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const brandContent = getBrandCopy(locale);
  const copy =
    locale === "tr"
      ? {
          title: "Referanslama",
          description:
            "3-2-1 referanslama, pim yerleştirilmesi ve pin planı için detaylı mühendislik kartı.",
        }
      : {
          title: "Locating",
          description:
            "Detailed engineering card for 3-2-1 locating, pin layout, and pin planning.",
        };

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/fixture-tools/locating",
    locale,
      robots: INDEXING_CONFIG.indexFixtureTools ? undefined : NOINDEX_FOLLOW_ROBOTS,
  });
}

export default function LocatingPage() {
  return <LocatingCardClient />;
}


