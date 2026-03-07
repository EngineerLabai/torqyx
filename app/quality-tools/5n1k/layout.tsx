import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "5N1K Analiz Araci" : "5W1H Analysis Tool";
  const description =
    locale === "tr"
      ? "5N1K soru seti ile problemi netlestirip aksiyon planini hizlandiran kalite odakli muhendislik hesaplayicilari destek aracidir."
      : "Quality-focused 5W1H page that clarifies problem scope and accelerates action planning within engineering calculators workflows.";

  return buildPageMetadata({
    title,
    description,
    path: "/quality-tools/5n1k",
    locale,
  });
}

export default function FiveN1kLayout({ children }: { children: ReactNode }) {
  return children;
}
