import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Taban Plaka Boyutlandirma Araci" : "Base Plate Sizing Tool";
  const description =
    locale === "tr"
      ? "Taban plaka kalinligi, sehim ve agirlik kestirimi icin muhendislik hesaplayicilari ile uyumlu hizli boyutlandirma ve kontrol sayfasi."
      : "Base plate sizing page for engineering calculators, estimating thickness, deflection, and weight with practical design checks.";

  return buildPageMetadata({
    title,
    description,
    path: "/fixture-tools/base-plate",
    locale,
  });
}

export default function BasePlateLayout({ children }: { children: ReactNode }) {
  return children;
}
