import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import BoltTorqueTableClient from "@/components/reference/BoltTorqueTableClient";
import BoltTorqueContent from "@/components/reference/BoltTorqueContent";
import JsonLd from "@/components/seo/JsonLd";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";
import { buildLocalizedCanonical, SITE_URL } from "@/utils/seo";
import { withLocalePrefix } from "@/utils/locale-path";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const isTr = locale === "tr";

  return buildPageMetadata({
    title: isTr ? "Cıvata Sıkma Torku Tablosu" : "Bolt Tightening Torque Table",
    description: isTr
      ? "M3–M36 metrik kaba ve ince adımlı cıvatalar için 8.8, 10.9 ve 12.9 kalitede kuru ve yağlı sıkma torku tablosu. ISO 898-1 ve VDI 2230 hesapları."
      : "Metric bolt tightening torque table for M3–M36 threads in classes 8.8, 10.9, and 12.9 under dry and oiled conditions. ISO 898-1 verified.",
    path: "/reference/civata-sikma-torku-tablosu",
    locale,
  });
}

export default async function BoltTorqueTablePage() {
  const locale = await getLocaleFromCookies();
  const isTr = locale === "tr";

  const canonicalUrl = buildLocalizedCanonical("/reference/civata-sikma-torku-tablosu", locale);
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
        name: isTr ? "Cıvata Sıkma Torku Tablosu" : "Bolt Tightening Torque Table",
        item: canonicalUrl,
      },
    ],
  };

  const articleData = {
    "@type": "TechArticle",
    headline: isTr
      ? "Metrik Cıvata Sıkma Torku Tablosu (M3–M36, 8.8, 10.9, 12.9)"
      : "Metric Bolt Tightening Torque Table (M3–M36, Classes 8.8, 10.9, 12.9)",
    description: isTr
      ? "M3–M36 metrik kaba ve ince adımlı cıvatalar için 8.8, 10.9 ve 12.9 kalitede kuru ve yağlı sıkma torku tablosu. ISO 898-1 ve VDI 2230 ön yük hesapları."
      : "Standard metric bolt tightening torque table from M3 to M36 covering coarse and fine pitches for property classes 8.8, 10.9, and 12.9 under dry and lubricated conditions.",
    url: canonicalUrl,
    inLanguage: isTr ? "tr-TR" : "en-US",
    datePublished: "2026-04-15T00:00:00Z",
    dateModified: "2026-11-21T00:00:00Z",
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
      <JsonLd data={breadcrumbsData} id="bolt-torque-breadcrumbs-schema" />
      <JsonLd data={articleData} id="bolt-torque-article-schema" />

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
              {isTr ? "Cıvata Sıkma Torku Tablosu" : "Bolt Tightening Torque Table"}
            </li>
          </ol>
        </nav>

        {/* Page Hero Header */}
        <header className="space-y-3 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span>{isTr ? "Mühendislik Referans Tablosu" : "Engineering Reference Table"}</span>
            <span className="h-1 w-1 rounded-full bg-emerald-600" />
            <span>ISO 898-1 &amp; VDI 2230</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            {isTr
              ? "Metrik Cıvata Sıkma Torku Tablosu (M3 – M36)"
              : "Metric Bolt Tightening Torque Table (M3 – M36)"}
          </h1>

          <p className="max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {isTr
              ? "ISO 898-1 standardına göre 8.8, 10.9 ve 12.9 mukavemet sınıflarındaki metrik cıvataların (M3'ten M36'ya, kaba ve ince diş) kuru (K=0.25) ve hafif yağlı (K=0.20) montaj koşullarında %70 akma dayanımı (0.70·Re) ile hesaplanmış sıkma torkları, etkin gerilme alanları ve ön yük kuvvetleri. Tüm değerler TORQYX Bolt Calculator motoru ile deterministik olarak üretilmiştir."
              : "Standard metric bolt tightening torque table from M3 to M36 covering coarse and fine pitches for property classes 8.8, 10.9, and 12.9 under dry (K=0.25) and lightly oiled (K=0.20) conditions calculated at 70% yield strength (0.70·Re) per ISO 898-1 and VDI 2230. All values are deterministically generated by the TORQYX Bolt Calculator engine."}
          </p>
        </header>

        {/* Interactive Filterable Table */}
        <section aria-labelledby="torque-table-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="torque-table-heading" className="text-lg font-bold text-slate-900 sm:text-xl">
              {isTr ? "Tork ve Ön Yük Veri Tablosu" : "Torque and Preload Data Table"}
            </h2>
          </div>

          <BoltTorqueTableClient />
        </section>

        {/* Technical Guide, Theory, Worked Example, Pitfalls, and Related Links */}
        <section className="border-t border-slate-200 pt-10">
          <BoltTorqueContent locale={locale} />
        </section>
      </div>
    </PageShell>
  );
}
