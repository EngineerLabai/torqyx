import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Proje Iyilestirme Takip Paneli" : "Project Improvement Tracker";
  const description =
    locale === "tr"
      ? "Musteri projeleri, iyilestirme aksiyonlari ve teknik notlari tek yerde yonetmek icin hazirlanan proje takip ve planlama paneli."
      : "Project tracking panel that consolidates customer projects, improvement actions, and technical notes in a practical workflow.";

  return buildPageMetadata({
    title,
    description,
    path: "/project-hub/project-tools",
    locale,
  });
}

export default function ProjectToolsLayout({ children }: { children: ReactNode }) {
  return children;
}
