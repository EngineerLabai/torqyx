import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";
import { INDEXING_CONFIG } from "@/config/indexing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Parça Revizyon Takip Paneli" : "Part Revision Tracking Panel";
  const description =
    locale === "tr"
      ? "Parça revizyonları, PPAP durumu ve SOP aşamalarını izlemek için proje mühendisleri tarafından kullanılan teknik takip panelidir."
      : "Part tracking panel for project engineers to monitor revision status, PPAP progress, and SOP stage transitions with clear visibility.";

  return buildPageMetadata({
    title,
    description,
    path: "/project-hub/part-tracking",
    locale,
      robots: INDEXING_CONFIG.indexProjectHub ? undefined : NOINDEX_FOLLOW_ROBOTS,
  });
}

export default function PartTrackingLayout({ children }: { children: ReactNode }) {
  return children;
}
