import { headers } from "next/headers";
import type { Metadata } from "next";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const title = locale === "tr" ? "Sistem Saglik Durumu" : "System Health Status";
  const description =
    locale === "tr"
      ? "Sistem saglik durumu, locale header bilgisi ve render zamani gibi operasyonel metrikleri izlemek icin teknik kontrol ekrani."
      : "Technical health page to monitor system status, locale header context, and render timestamp for operational reliability.";

  return buildPageMetadata({
    title,
    description,
    path: "/health",
    locale,
  });
}

export default async function HealthPage() {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") ?? "unknown";
  const now = new Date().toISOString();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold text-slate-900">Health</h1>
      <p className="mt-2 text-sm text-slate-700">status: ok</p>
      <p className="mt-1 text-sm text-slate-700">renderedAt: {now}</p>
      <p className="mt-1 text-sm text-slate-700">localeHeader: {locale}</p>
    </main>
  );
}
