import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import KeyTableClient from "@/components/reference/KeyTableClient";
import KeyTableContent from "@/components/reference/KeyTableContent";
import JsonLd from "@/components/seo/JsonLd";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";
import { buildLocalizedCanonical, SITE_URL } from "@/utils/seo";
import { withLocalePrefix } from "@/utils/locale-path";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const isTr = locale === "tr";

  return buildPageMetadata({
    title: isTr
      ? "Paralel Kama ve Tolerans Tablosu (DIN 6885-1)"
      : "Parallel Key Size & Tolerance Table (DIN 6885-1)",
    description: isTr
      ? "6–500 mm mil çapları için DIN 6885-1 / ISO 773 standart paralel kama ölçüleri, b×h kesitleri, t1/t2 kanal derinlikleri, P9/JS9 toleransları ve tork kapasitesi tablosu."
      : "Standard parallel key size and tolerance table for shaft diameters 6–500 mm per DIN 6885-1 and ISO 773. Includes keyway depths, P9/JS9 fits, and torque capacities.",
    path: "/reference/kama-olculeri-ve-tolerans-tablosu",
    locale,
  });
}

export default async function ParallelKeyTablePage() {
  const locale = await getLocaleFromCookies();
  const isTr = locale === "tr";

  const canonicalUrl = buildLocalizedCanonical("/reference/kama-olculeri-ve-tolerans-tablosu", locale);
  const referenceHubPath = withLocalePrefix("/reference", locale);

  const breadcrumbsData = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isTr ? "Ana Sayfa" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isTr ? "Referans Merkezi" : "Reference Center",
        item: `${SITE_URL}${referenceHubPath}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: isTr ? "Paralel Kama Ölçüleri Tablosu" : "Parallel Key Size Table",
        item: canonicalUrl,
      },
    ],
  };

  const articleData = {
    "@type": "TechArticle",
    headline: isTr
      ? "DIN 6885-1 Paralel Kama Ölçüleri, Kanal Derinlikleri ve Tolerans Tablosu"
      : "DIN 6885-1 Parallel Key Sizing, Keyway Depths, and Tolerance Table",
    description: isTr
      ? "6–500 mm mil çapları için DIN 6885-1 / ISO 773 standart paralel kama ölçüleri, b×h kesitleri, t1/t2 kanal derinlikleri, P9/JS9 toleransları ve tork kapasitesi tablosu."
      : "Standard parallel key size and tolerance table for shaft diameters 6–500 mm per DIN 6885-1 and ISO 773. Includes keyway depths, P9/JS9 fits, and torque capacities.",
    url: canonicalUrl,
    inLanguage: isTr ? "tr-TR" : "en-US",
    datePublished: "2026-05-15T00:00:00Z",
    dateModified: "2026-11-22T00:00:00Z",
    author: {
      "@type": "Person",
      name: "Şükrü Erdem Çitil",
      jobTitle: isTr ? "Makine Mühendisi & Kurucu" : "Mechanical Engineer & Founder",
      url: `${SITE_URL}/${locale}/hakkinda`,
    },
    publisher: {
      "@type": "Organization",
      name: "TORQYX",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <PageShell>
      <JsonLd data={breadcrumbsData} id="parallel-key-breadcrumbs-schema" />
      <JsonLd data={articleData} id="parallel-key-article-schema" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href={`/${locale}`} className="hover:text-slate-900 transition">
                {isTr ? "Ana Sayfa" : "Home"}
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">/</li>
            <li>
              <Link href={referenceHubPath} className="hover:text-slate-900 transition">
                {isTr ? "Referans" : "Reference"}
              </Link>
            </li>
            <li aria-hidden="true" className="text-slate-400">/</li>
            <li className="font-semibold text-slate-900" aria-current="page">
              {isTr ? "Paralel Kama Tablosu" : "Parallel Key Table"}
            </li>
          </ol>
        </nav>

        {/* Page Hero Header */}
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span>{isTr ? "Mühendislik Referans Tablosu" : "Engineering Reference Table"}</span>
            <span className="h-1 w-1 rounded-full bg-emerald-600" />
            <span>DIN 6885-1 &amp; ISO 773</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {isTr
              ? "DIN 6885-1 Paralel Kama Ölçüleri ve Tolerans Tablosu"
              : "DIN 6885-1 Parallel Key Size & Tolerance Table"}
          </h1>

          <p className="max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {isTr
              ? "DIN 6885-1 ve ISO 773 standartlarına göre 6 mm'den 500 mm'ye kadar tüm metrik şaft çapları için paralel kama (feder) kesitleri (b × h), şaft kanalı derinliği (t₁), göbek kanalı derinliği (t₂), ISO geçme toleransları (h9, P9, JS9) ve izin verilen yüzey ezilme torku değerleri. Tüm veriler DIN 6885-1 ve Niemann makine elemanları formülleri ile deterministik olarak hesaplanmıştır."
              : "Standard metric parallel key (feather key) dimensions per DIN 6885-1 and ISO 773 for shaft diameters from 6 mm to 500 mm. Includes cross-sections (b × h), shaft keyway depth (t₁), hub keyway depth (t₂), ISO tolerance classes (h9, P9, JS9), and allowable torque ratings. All values are deterministically derived from DIN 6885-1 and Niemann machine element standards."}
          </p>
        </header>

        {/* Interactive Filterable Table */}
        <section aria-labelledby="key-table-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="key-table-heading" className="text-lg font-bold text-slate-900 sm:text-xl">
              {isTr ? "Paralel Kama ve Kanal Boyutları Veri Tablosu" : "Parallel Key & Keyway Dimensions Table"}
            </h2>
          </div>

          <KeyTableClient />
        </section>

        {/* Technical Guide, Theory, Worked Example, Pitfalls, and Related Links */}
        <section className="border-t border-slate-200 pt-10">
          <KeyTableContent locale={locale} />
        </section>
      </div>
    </PageShell>
  );
}
