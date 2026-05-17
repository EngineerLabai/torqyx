import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Kaizen İyileştirme Takip Aracı" : "Kaizen Improvement Tracker";
  const description =
    locale === "tr"
      ? "Kaizen iyileştirme fikirlerini, aksiyon planlarını ve sonuç metriklerini izleyerek sürekli gelişimi destekleyen mühendislik hesaplayıcıları aracı."
      : "Kaizen tracker for engineering calculators teams to monitor improvement ideas, action plans, and measurable outcomes in one view.";

  return buildPageMetadata({
    title,
    description,
    path: "/quality-tools/kaizen",
    locale,
  });
}

export default function KaizenLayout({ children }: { children: ReactNode }) {
  return children;
}
