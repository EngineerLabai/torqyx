import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Mühendislik Referans Tablolari" : "Engineering Reference Tables";
  const description =
    locale === "tr"
      ? "Mühendislik hesaplayıcıları ile uyumlu referans tablolarına hızlı erişim sağlayan sayfa; birimler, malzemeler ve teknik değerler tek noktada."
      : "Reference page for engineering calculators with quick access to units, materials, and technical table values in a structured format.";

  return buildPageMetadata({
    title,
    description,
    path: "/reference",
    locale,
  });
}

export default async function TablesAliasPage() {
  const locale = await getLocaleFromCookies();
  redirect(`/${locale}/reference`);
}


