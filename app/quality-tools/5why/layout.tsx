import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "5 Neden Kok Neden Analizi" : "5 Why Root Cause Analysis";
  const description =
    locale === "tr"
      ? "5 Neden metoduyla kok neden analizi yaparak duzeltici aksiyonlari sistematik sekilde planlayan kalite ve muhendislik hesaplayicilari araci."
      : "Root cause analysis page using the 5 Why method to structure corrective actions in quality and engineering calculators processes.";

  return buildPageMetadata({
    title,
    description,
    path: "/quality-tools/5why",
    locale,
  });
}

export default function FiveWhyLayout({ children }: { children: ReactNode }) {
  return children;
}
