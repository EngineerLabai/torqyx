import { redirect } from "next/navigation";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";

export default async function SupportRedirectPage() {
  const locale = await getLocaleFromCookies();
  redirect(withLocalePrefix("/iletisim", locale));
}
