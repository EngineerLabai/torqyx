import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";
import { INDEXING_CONFIG } from "@/config/indexing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Taban Plaka Boyutlandırma Aracı" : "Base Plate Sizing Tool";
  const description =
    locale === "tr"
      ? "Taban plaka kalınlığı, seçim ve ağırlık kestirimi için mühendislik hesaplayıcıları ile uyumlu hızlı boyutlandırma ve kontrol sayfası."
      : "Base plate sizing page for engineering calculators, estimating thickness, deflection, and weight with practical design checks.";

  return buildPageMetadata({
    title,
    description,
    path: "/fixture-tools/base-plate",
    locale,
      robots: INDEXING_CONFIG.indexFixtureTools ? undefined : NOINDEX_FOLLOW_ROBOTS,
  });
}

export default function BasePlateLayout({ children }: { children: ReactNode }) {
  return children;
}
