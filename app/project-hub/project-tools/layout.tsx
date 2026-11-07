import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata, NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";
import { INDEXING_CONFIG } from "@/config/indexing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Proje İyileştirme Takip Paneli" : "Project Improvement Tracker";
  const description =
    locale === "tr"
      ? "Müşteri projeleri, iyileştirme aksiyonları ve teknik notları tek yerde yönetmek için hazırlanan proje takip ve planlama paneli."
      : "Project tracking panel that consolidates customer projects, improvement actions, and technical notes in a practical workflow.";

  return buildPageMetadata({
    title,
    description,
    path: "/project-hub/project-tools",
    locale,
      robots: INDEXING_CONFIG.indexProjectHub ? undefined : NOINDEX_FOLLOW_ROBOTS,
  });
}

export default function ProjectToolsLayout({ children }: { children: ReactNode }) {
  return children;
}
