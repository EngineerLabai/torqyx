import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";
import { INDEXING_CONFIG } from "@/config/indexing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "8D Problem Çözme Raporu" : "8D Problem Solving Report";
  const description =
    locale === "tr"
      ? "8D adımlarını kullanarak disiplinli problem çözüm raporu oluşturan, ekip koordinasyonunu ve takip sürecini kolaylaştıran teknik araçtır."
      : "8D report page for disciplined problem solving, improving team coordination and follow-up in technical engineering calculators workflows.";

  return buildPageMetadata({
    title,
    description,
    path: "/quality-tools/8d",
    locale,
      robots: INDEXING_CONFIG.indexQualityTools ? undefined : NOINDEX_FOLLOW_ROBOTS,
  });
}

export default function EightDLayout({ children }: { children: ReactNode }) {
  return children;
}
