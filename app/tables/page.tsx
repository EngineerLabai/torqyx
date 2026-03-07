import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Muhendislik Referans Tablolari" : "Engineering Reference Tables";
  const description =
    locale === "tr"
      ? "Muhendislik hesaplayicilari ile uyumlu referans tablolarina hizli erisim saglayan sayfa; birimler, malzemeler ve teknik degerler tek noktada."
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
