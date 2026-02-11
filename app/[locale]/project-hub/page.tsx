import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import ActionCard from "@/components/ui/ActionCard";
import { getHeroImageSrc } from "@/lib/assets";
import { buildPageMetadata } from "@/utils/metadata";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";

type PageProps = {
  params: { locale: string };
};

const resolveLocale = (value?: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

const COPY: Record<Locale, {
  seo: { title: string; description: string };
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  cta: string;
  modules: Array<{ title: string; description: string; href: string; badge?: string }>;
}> = {
  tr: {
    seo: {
      title: "Proje Merkezi | AI Engineers Lab",
      description: "Devreye alma, proje takip, RFQ ve revizyon yonetimi icin lokal calisan muhendis panelleri.",
    },
    hero: {
      title: "Proje Merkezi",
      description:
        "Muhendislik ekipleri icin hizli, hafif ve tarayici-icinde calisan takip modulleri. Kayitlar cihazinizda tutulur.",
      eyebrow: "Project Hub",
      imageAlt: "Project hub overview",
    },
    cta: "Modulu Ac",
    modules: [
      {
        title: "Devreye Alma Paneli",
        description: "Komisyoning akisini adim adim kontrol et, checklist kaydet ve el teslim paketi olustur.",
        href: "/project-hub/devreye-alma",
        badge: "Workflow",
      },
      {
        title: "Proje & Iyilestirme Takip Paneli",
        description: "Proje ve Kaizen calismalarini sahip, tarih, oncelik ve durum bazli yonet.",
        href: "/project-hub/project-tools",
        badge: "Tracker",
      },
      {
        title: "RFQ / Teknik Sartname Ozeti",
        description: "Teknik sartname ve teklif isteklerini ekiplerle takip et, teslim tarihlerini gor.",
        href: "/project-hub/rfq",
        badge: "RFQ",
      },
      {
        title: "Parca / Revizyon Takip Panosu",
        description: "Parca revizyonlarini, sorumlulari ve onay durumlarini tek tabloda gor.",
        href: "/project-hub/part-tracking",
        badge: "Revision",
      },
    ],
  },
  en: {
    seo: {
      title: "Project Hub | AI Engineers Lab",
      description: "Local-first engineering trackers for commissioning, projects, RFQs, and revisions.",
    },
    hero: {
      title: "Project Hub",
      description:
        "Lightweight, local-first modules for engineering teams. Data stays in your browser unless exported.",
      eyebrow: "Project Hub",
      imageAlt: "Project hub overview",
    },
    cta: "Open Module",
    modules: [
      {
        title: "Commissioning Panel",
        description: "Run the full commissioning workflow with checklists, logs, and handover package.",
        href: "/project-hub/devreye-alma",
        badge: "Workflow",
      },
      {
        title: "Project & Improvement Tracker",
        description: "Track projects and Kaizen work with owner, due dates, priority, and status.",
        href: "/project-hub/project-tools",
        badge: "Tracker",
      },
      {
        title: "RFQ / Technical Spec Summary",
        description: "Capture RFQs and spec summaries with owners, deadlines, and quick links.",
        href: "/project-hub/rfq",
        badge: "RFQ",
      },
      {
        title: "Part / Revision Tracker",
        description: "Monitor part revisions, owners, approvals, and impacts in a single view.",
        href: "/project-hub/part-tracking",
        badge: "Revision",
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  const seo = COPY[locale].seo;
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/project-hub",
    locale,
  });
}

export default function ProjectHubPage({ params }: PageProps) {
  const locale = resolveLocale(params.locale);
  const copy = COPY[locale];
  const heroImage = getHeroImageSrc("projectHub") || getHeroImageSrc("tools");

  return (
    <PageShell>
      <PageHero
        title={copy.hero.title}
        description={copy.hero.description}
        eyebrow={copy.hero.eyebrow}
        imageSrc={heroImage}
        imageAlt={copy.hero.imageAlt}
      />

      <section className="grid gap-4 md:grid-cols-2">
        {copy.modules.map((module) => (
          <ActionCard
            key={module.title}
            title={module.title}
            description={module.description}
            href={module.href}
            badge={module.badge}
            ctaLabel={copy.cta}
          />
        ))}
      </section>
    </PageShell>
  );
}
