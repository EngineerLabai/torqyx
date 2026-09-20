import { permanentRedirect } from "next/navigation";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";

export default async function PremiumPage() {
  const locale = await getLocaleFromCookies();
  permanentRedirect(withLocalePrefix("/tools", locale));
}
