import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.notFound;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.title} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/404",
    locale,
  });
}

export default async function NotFound() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.notFound;

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[11px] text-rose-700 md:text-xs">
            <span className="font-semibold">404</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">
            {copy.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-slate-700 md:text-base">
            {copy.description}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tools"
              className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {copy.primaryCta}
            </Link>
            <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-700">
              {copy.secondaryCta}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
