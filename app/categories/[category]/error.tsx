"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { withLocalePrefix } from "@/utils/locale-path";

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useLocale();

  useEffect(() => {
    console.error("[categories] error boundary caught error:", error);
  }, [error]);

  const isTr = locale === "tr";
  const title = isTr ? "Kategori yüklenirken bir sorun oluştu" : "Error loading category";
  const description = isTr
    ? "Bu kategorideki içerikler yüklenirken beklenmeyen bir hata meydana geldi. Sayfayı yenileyebilir veya kategorilere göz atabilirsiniz."
    : "An unexpected error occurred while loading content for this category. You can refresh the page or return to the categories list.";
  const refreshLabel = isTr ? "Sayfayı yenile" : "Refresh page";
  const backLabel = isTr ? "Tüm Kategoriler" : "All Categories";
  const backHref = withLocalePrefix("/categories", locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            {refreshLabel}
          </button>
          <Link
            href={backHref}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
          >
            {backLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
