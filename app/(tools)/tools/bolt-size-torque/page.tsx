import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Civata Boyut ve Tork Hesabi" : "Bolt Size and Torque Calculator";
  const description =
    locale === "tr"
      ? "Civata boyutu ve tork hesaplayıcısı için mühendislik hesaplayıcıları aracına yönlendiren teknik geçiş sayfası ve doğru canonical yönetimi."
      : "Redirect page for engineering calculators that routes users to the bolt size and torque tool with canonical metadata for SEO consistency.";

  return buildPageMetadata({
    title,
    description,
    path: "/tools/bolt-calculator",
    locale,
  });
}

export default async function BoltSizeTorqueRedirect() {
  const locale = await getLocaleFromCookies();
  redirect(withLocalePrefix("/tools/bolt-calculator", locale));
}


