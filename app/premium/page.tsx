import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { BRAND_NAME } from "@/utils/brand";
import { buildCanonical } from "@/utils/seo";
import { getLocaleFromCookies } from "@/utils/locale-server";

const PREMIUM_DESCRIPTION =
  "Premium paket icin odeme altyapisi acik degil. Bekleme listesi ile planlanan ozellikleri paylasiyoruz.";

export const metadata: Metadata = {
  title: `Premium | ${BRAND_NAME}`,
  description: PREMIUM_DESCRIPTION,
  alternates: {
    canonical: buildCanonical("/premium") ?? "/premium",
  },
  openGraph: {
    title: `Premium | ${BRAND_NAME}`,
    description: PREMIUM_DESCRIPTION,
    type: "website",
    url: buildCanonical("/premium") ?? "/premium",
  },
  twitter: {
    card: "summary_large_image",
    title: `Premium | ${BRAND_NAME}`,
    description: PREMIUM_DESCRIPTION,
  },
};

export default async function PremiumPage() {
  const locale = await getLocaleFromCookies();

  const copy =
    locale === "en"
      ? {
          badge: "Premium waitlist",
          title: "Premium package waitlist",
          description:
            "Payments are not open. Join the waitlist to follow the Premium roadmap and planned features.",
          cta: "Join the waitlist",
          ctaNote: "Opens your email client.",
          support: "Contact support",
          mailto: "mailto:destek@aiengineerslab.com?subject=Premium%20Waitlist",
          packageTitle: "Package scope (planned)",
          packageItems: [
            "Detailed torque and gear tables",
            "Advanced mechanical calculators",
            "PDF/Excel exports (RFQ, quality tools, project lists)",
            "Multi-device access and saved projects",
            "Material and coating suggestion cards",
          ],
          statusTitle: "Status",
          statusBody:
            "There is no payment flow yet. We collect interest and prioritize development based on waitlist demand.",
          stepsTitle: "What happens next",
          steps: [
            "You join the waitlist",
            "We send a short questionnaire",
            "Beta access opens in small batches",
          ],
        }
      : {
          badge: "Premium bekleme listesi",
          title: "Premium paket bekleme listesi",
          description:
            "Odeme altyapisi acik degil. Premium yol haritasini ve planlanan ozellikleri bekleme listesiyle paylasiyoruz.",
          cta: "Bekleme listesine katil",
          ctaNote: "E-posta istemcisi acilir.",
          support: "Destek ekibi",
          mailto: "mailto:destek@aiengineerslab.com?subject=Premium%20Bekleme%20Listesi",
          packageTitle: "Paket icerigi (plan)",
          packageItems: [
            "Detayli tork ve disli tablolar",
            "Gelismis mekanik hesaplayicilar",
            "PDF/Excel disa aktarma (RFQ, kalite araclari, proje listeleri)",
            "Coklu cihaz erisimi ve kayitli projeler",
            "Malzeme ve kaplama oneri kartlari",
          ],
          statusTitle: "Durum",
          statusBody:
            "Odeme akisi yok. Ilgiyi topluyoruz ve bekleme listesine gore gelistirme onceliklerini belirliyoruz.",
          stepsTitle: "Sonraki adimlar",
          steps: [
            "Bekleme listesine kayit",
            "Kisa bir ihtiyac formu",
            "Kucuk gruplarla beta davetleri",
          ],
        };

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] text-amber-700 md:text-xs">
            <span className="font-semibold">{copy.badge}</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
            {copy.title}
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">{copy.description}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href={copy.mailto}
              className="rounded-full bg-amber-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-amber-500"
            >
              {copy.cta}
            </a>
            <Link
              href="/support"
              className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            >
              {copy.support}
            </Link>
            <span className="text-[11px] text-slate-500">{copy.ctaNote}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.packageTitle}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {copy.packageItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{copy.statusTitle}</h2>
          <p className="mt-2 text-sm text-slate-700">{copy.statusBody}</p>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {copy.stepsTitle}
          </p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {copy.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
