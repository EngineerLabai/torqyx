import { redirect } from "next/navigation";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function TablesAliasPage() {
  const locale = await getLocaleFromCookies();
  redirect(`/${locale}/reference`);
}
