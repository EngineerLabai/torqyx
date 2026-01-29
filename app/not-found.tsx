import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { DEFAULT_OG_IMAGE_META, buildCanonical } from "@/utils/seo";

const NOT_FOUND_DESCRIPTION = "Aradigin sayfa bulunamadi. Hesaplayici Kutuphanesi ile devam et.";

export const metadata: Metadata = {
  title: "Sayfa bulunamadi",
  description: NOT_FOUND_DESCRIPTION,
  alternates: {
    canonical: buildCanonical("/404") ?? "/404",
  },
  openGraph: {
    title: "Sayfa bulunamadi",
    description: NOT_FOUND_DESCRIPTION,
    type: "website",
    images: [DEFAULT_OG_IMAGE_META],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sayfa bulunamadi",
    description: NOT_FOUND_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_META.url],
  },
};

export default function NotFound() {
  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[11px] text-rose-700 md:text-xs">
            <span className="font-semibold">404</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-4xl">
            Sayfa bulunamadi
          </h1>
          <p className="text-[15px] leading-relaxed text-slate-700 md:text-base">
            Bu baglanti kaldirilmis veya tasinmis olabilir. Hesaplayici Kutuphanesi ile hesaplayicilara hizli ulasabilirsin.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tools"
              className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Hesaplayici Kutuphanesi
            </Link>
            <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-700">
              Ana sayfaya don
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
