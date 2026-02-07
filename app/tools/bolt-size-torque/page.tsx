import { redirect } from "next/navigation";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";

export default async function BoltSizeTorqueRedirect() {
  const locale = await getLocaleFromCookies();
  redirect(withLocalePrefix("/tools/bolt-calculator", locale));
}
