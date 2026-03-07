import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "8D Problem Cozme Raporu" : "8D Problem Solving Report";
  const description =
    locale === "tr"
      ? "8D adimlarini kullanarak disiplinli problem cozum raporu olusturan, ekip koordinasyonunu ve takip surecini kolaylastiran teknik aractir."
      : "8D report page for disciplined problem solving, improving team coordination and follow-up in technical engineering calculators workflows.";

  return buildPageMetadata({
    title,
    description,
    path: "/quality-tools/8d",
    locale,
  });
}

export default function EightDLayout({ children }: { children: ReactNode }) {
  return children;
}
