import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Poka Yoke Hata Onleme Araci" : "Poka Yoke Error Proofing Tool";
  const description =
    locale === "tr"
      ? "Poka yoke prensipleriyle hata onleme fikirlerini degerlendiren, risk ve dogrulama adimlarini kaydeden kalite odakli teknik sayfa."
      : "Poka yoke page for evaluating error-proofing ideas with risk checks and validation steps in practical engineering calculators workflows.";

  return buildPageMetadata({
    title,
    description,
    path: "/quality-tools/poka-yoke",
    locale,
  });
}

export default function PokaYokeLayout({ children }: { children: ReactNode }) {
  return children;
}
