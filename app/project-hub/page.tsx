// app/project-hub/page.tsx
import PageShell from "@/components/layout/PageShell";
import ActionCard from "@/components/ui/ActionCard";
import { getBrandCopy } from "@/config/brand";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { getMessages } from "@/utils/messages";
import { buildPageMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.projectHub;
  const brandContent = getBrandCopy(locale);

  return buildPageMetadata({
    title: `${copy.badgeTitle} | ${brandContent.siteName}`,
    description: copy.description,
    path: "/project-hub",
    locale,
  });
}

type HubCardProps = {
  title: string;
  description: string;
  href: string;
  badge?: string;
};

const hubsByLocale = {
  tr: [
    {
      title: "Devreye Alma Paneli",
      description: "Komisyoning adimlari: hazirlik, temizlik, torklama, on test, sicak/soguk cevrim, loglama.",
      href: "/project-hub/devreye-alma",
      badge: "Yeni",
    },
    {
      title: "Yeni Proje / Iyilestirme Takip Paneli",
      description:
        "Musteri projeleri, hat iyilestirmeleri ve Kaizen calismalarini kayit altina al ve durum / oncelik bazli takip et.",
      href: "/project-hub/project-tools",
      badge: "Aktif",
    },
    {
      title: "RFQ / Teklif Takip Paneli",
      description:
        "Musteri RFQ'larinin (Request for Quotation) son tarihlerini, durumlarini ve sorumlu kisileri kaydet.",
      href: "/project-hub/rfq",
      badge: "Aktif",
    },
    {
      title: "Parca / Revizyon Takip Paneli",
      description:
        "Parca revizyonlari, degisen cizimler ve etkilenen dokumanlari izlemek icin hafif bir takip listesi.",
      href: "/project-hub/part-tracking",
      badge: "Aktif",
    },
  ],
  en: [
    {
      title: "Commissioning Panel",
      description: "Steps: prep, cleaning, torqueing, pre-test, hot/cold cycles, logging.",
      href: "/project-hub/devreye-alma",
      badge: "New",
    },
    {
      title: "New Project / Improvement Tracker",
      description:
        "Track customer projects, line improvements, and Kaizen work with status and priority.",
      href: "/project-hub/project-tools",
      badge: "Active",
    },
    {
      title: "RFQ / Quotation Tracker",
      description:
        "Record RFQ deadlines, statuses, and responsible owners for Request for Quotation items.",
      href: "/project-hub/rfq",
      badge: "Active",
    },
    {
      title: "Part / Revision Tracker",
      description:
        "Lightweight list to track part revisions, changing drawings, and impacted documents.",
      href: "/project-hub/part-tracking",
      badge: "Active",
    },
  ],
};

export default async function ProjectHubPage() {
  const locale = await getLocaleFromCookies();
  const copy = getMessages(locale).pages.projectHub;
  const hubs = hubsByLocale[locale];

  return (
    <PageShell>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] text-sky-700 md:text-xs">
            <span className="font-semibold">{copy.badgeTitle}</span>
            <span className="hidden text-slate-500 sm:inline">{copy.badgeSubtitle}</span>
          </div>

          <h1 className="text-balance text-2xl font-semibold leading-snug text-slate-900 md:text-3xl">
            {copy.title}
          </h1>
          <p className="text-sm leading-relaxed text-slate-700">{copy.description}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {hubs.map((hub) => (
          <ActionCard key={hub.title} {...hub} ctaLabel={copy.cta} />
        ))}
      </section>
    </PageShell>
  );
}
