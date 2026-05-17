import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Devreye Alma Kontrol Paneli" : "Commissioning Checklist Panel";
  const description =
    locale === "tr"
      ? "Devreye alma adımları, test kontrolleri ve operasyonel doğrulama maddelerini yönetmek için proje ekiplerine özel teknik kontrol paneli."
      : "Commissioning panel for project teams to track startup steps, test checkpoints, and operational validation tasks in one workflow.";

  return buildPageMetadata({
    title,
    description,
    path: "/project-hub/devreye-alma",
    locale,
  });
}

export default function CommissioningLayout({ children }: { children: ReactNode }) {
  return children;
}
