import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Sıkıştırma Planlama Aracı" : "Clamping Planning Tool";
  const description =
    locale === "tr"
      ? "Sıkıştırma kuvveti, reaksiyon noktası ve proses sırası planlaması için mühendislik hesaplayıcıları odaklı teknik clamping sayfasıdır."
      : "Technical clamping planning page for engineering calculators, covering clamp force, reaction points, and process sequence design.";

  return buildPageMetadata({
    title,
    description,
    path: "/fixture-tools/clamping",
    locale,
  });
}

export default function ClampingLayout({ children }: { children: ReactNode }) {
  return children;
}
