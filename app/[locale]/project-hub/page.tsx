import PageHero from "@/components/layout/PageHero";
import PageShell from "@/components/layout/PageShell";
import ActionCard from "@/components/ui/ActionCard";
import { getHeroImageSrc } from "@/lib/assets";
import { buildPageMetadata } from "@/utils/metadata";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/utils/locale";
import { withLocalePrefix } from "@/utils/locale-path";
import { getUiLabel, warnIfEnglishLabelsInTurkish } from "@/utils/ui-labels";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const resolveLocale = (value?: string): Locale => (isLocale(value) ? value : DEFAULT_LOCALE);

const LABELS_BY_LOCALE: Record<
  Locale,
  {
    projectHub: string;
    workflow: string;
    tracker: string;
    rfq: string;
    revision: string;
  }
> = {
  tr: {
    projectHub: getUiLabel("tr", "projectHub"),
    workflow: getUiLabel("tr", "workflow"),
    tracker: getUiLabel("tr", "tracker"),
    rfq: getUiLabel("tr", "rfq"),
    revision: getUiLabel("tr", "revision"),
  },
  en: {
    projectHub: getUiLabel("en", "projectHub"),
    workflow: getUiLabel("en", "workflow"),
    tracker: getUiLabel("en", "tracker"),
    rfq: getUiLabel("en", "rfq"),
    revision: getUiLabel("en", "revision"),
  },
};

const COPY: Record<Locale, {
  seo: { title: string; description: string };
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  cta: string;
  modules: Array<{ title: string; description: string; href: string; badge?: string }>;
}> = {
  tr: {
    seo: {
      title: "Proje Merkezi | TORQYX",
      description: "Devreye alma, proje takip, RFQ ve revizyon yönetimi için lokal çalışan mühendis panelleri.",
    },
    hero: {
      title: "Proje Merkezi",
      description:
        "Mühendislik ekipleri için hızlı, hafif ve tarayıcı-içinde çalışan takip modülleri. Kayıtlar cihazınızda tutulur.",
      eyebrow: LABELS_BY_LOCALE.tr.projectHub,
      imageAlt: "Proje merkezi genel görünümü",
    },
    cta: "Modülü Aç",
    modules: [
      {
        title: "Devreye Alma Paneli",
        description: "Komisyoning akışını adım adım kontrol et, checklist kaydet ve el teslim paketi oluştur.",
        href: "/project-hub/devreye-alma",
        badge: LABELS_BY_LOCALE.tr.workflow,
      },
      {
        title: "Proje & İyileştirme Takip Paneli",
        description: "Proje ve Kaizen çalışmalarını sahip, tarih, öncelik ve durum bazlı yönet.",
        href: "/project-hub/project-tools",
        badge: LABELS_BY_LOCALE.tr.tracker,
      },
      {
        title: "Teklif İsteği / Teknik Şartname Özeti",
        description: "Teknik şartname ve teklif isteklerini ekiplerle takip et, teslim tarihlerini gör.",
        href: "/project-hub/rfq",
        badge: LABELS_BY_LOCALE.tr.rfq,
      },
      {
        title: "Parça / Revizyon Takip Panosu",
        description: "Parça revizyonlarını, sorumluları ve onay durumlarını tek tabloda gör.",
        href: "/project-hub/part-tracking",
        badge: LABELS_BY_LOCALE.tr.revision,
      },
    ],
  },
  en: {
    seo: {
      title: "Project Hub | TORQYX",
      description: "Local-first engineering trackers for commissioning, projects, RFQs, and revisions.",
    },
    hero: {
      title: "Project Hub",
      description:
        "Lightweight, local-first modules for engineering teams. Data stays in your browser unless exported.",
      eyebrow: LABELS_BY_LOCALE.en.projectHub,
      imageAlt: "Project hub overview",
    },
    cta: "Open Module",
    modules: [
      {
        title: "Commissioning Panel",
        description: "Run the full commissioning workflow with checklists, logs, and handover package.",
        href: "/project-hub/devreye-alma",
        badge: LABELS_BY_LOCALE.en.workflow,
      },
      {
        title: "Project & Improvement Tracker",
        description: "Track projects and Kaizen work with owner, due dates, priority, and status.",
        href: "/project-hub/project-tools",
        badge: LABELS_BY_LOCALE.en.tracker,
      },
      {
        title: "RFQ / Technical Spec Summary",
        description: "Capture RFQs and spec summaries with owners, deadlines, and quick links.",
        href: "/project-hub/rfq",
        badge: LABELS_BY_LOCALE.en.rfq,
      },
      {
        title: "Part / Revision Tracker",
        description: "Monitor part revisions, owners, approvals, and impacts in a single view.",
        href: "/project-hub/part-tracking",
        badge: LABELS_BY_LOCALE.en.revision,
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const seo = COPY[locale].seo;
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: "/project-hub",
    locale,
    useLocalizedCanonical: true,
  });
}

export default async function ProjectHubPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const copy = COPY[locale];
  const heroImage = getHeroImageSrc("projectHub") || getHeroImageSrc("tools");
  const localizedModules = copy.modules.map((module) => ({
    ...module,
    href: withLocalePrefix(module.href, locale),
  }));

  warnIfEnglishLabelsInTurkish("ProjectHubPage", locale, {
    hero: {
      title: copy.hero.title,
      eyebrow: copy.hero.eyebrow,
    },
    modules: localizedModules.map((module) => ({
      title: module.title,
      badge: module.badge,
    })),
  });

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

        {localizedModules.map((module) => (
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
