"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import useDevRenderLogger from "@/components/monitoring/useDevRenderLogger";
import { openCommandPalette } from "@/components/search/commandPaletteEvents";
import { UnitSystemSwitcher } from "@/components/units/UnitSystemSwitcher";
import { getBrandCopy, SITE_CONTACT_EMAIL } from "@/config/brand";
import { getRoute } from "@/config/routes";
import { navConfig, type NavLinkConfig } from "@/config/nav";
import { INDEXING_CONFIG } from "@/config/indexing";
import { stripLocaleFromPath } from "@/utils/locale-path";
import { isAdsAllowedPath } from "@/utils/ads";
import type { Messages } from "@/utils/messages";

type NavSectionLink = {
  label: string;
  href: string;
  route: NavLinkConfig["route"];
  description?: string;
  badge?: string;
};

type NavSection = {
  id: string;
  label: string;
  description: string;
  links: NavSectionLink[];
};

type DirectNavLink = {
  id: string;
  label: string;
  href: string;
  route: NavLinkConfig["route"];
};

type SidebarSection = {
  label: string;
  links: { label: string; href: string }[];
};

export type SiteShellMessages = {
  nav: Messages["nav"];
  languageSwitcher: Messages["languageSwitcher"];
  components: Pick<Messages["components"], "search" | "consent">;
};

function OverlaySkeleton() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[110] bg-slate-900/5 opacity-0 animate-pulse"
    />
  );
}

function BannerSkeleton() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[110] h-14 rounded-2xl border border-slate-200 bg-white/80 shadow-sm animate-pulse"
    />
  );
}

// Bundle estimate (webpack analyzer, parsed): ~10-18KB expected to move out of shared app chunk.
const CommandPalette = dynamic(() => import("@/components/search/CommandPalette"), {
  ssr: false,
  loading: () => <OverlaySkeleton />,
});

const ConsentBanner = dynamic(() => import("@/components/consent/ConsentBanner"), {
  ssr: false,
  loading: () => <BannerSkeleton />,
});

export default function SiteShell({ children, messages }: { children: ReactNode; messages: SiteShellMessages }) {
  const { locale } = useLocale();
  useDevRenderLogger("Layout");
  const brandContent = getBrandCopy(locale);
  const searchCopy = messages.components.search;
  const navCopy = messages.nav as {
    labels: Record<string, string>;
    descriptions?: Record<string, string>;
    badges?: Record<string, string>;
  };

  const {
    calculatorSection,
    referenceSection,
    guidesLink,
    blogLink,
    aboutLink,
    contactLink,
    sidebarSections,
    footerCategoryLinks,
    footerMainLinks,
  } = useMemo(() => {
    const resolveLabel = (key: string) => navCopy.labels?.[key] ?? key;
    const resolveDescription = (key?: string) => (key ? navCopy.descriptions?.[key] ?? "" : "");
    const resolveBadge = (key?: string) => (key ? navCopy.badges?.[key] : undefined);
    const resolveHref = (route: NavLinkConfig["route"]) => getRoute(route, locale);

    // 1. Calculators Mega Menu
    const calcCategoryLinks: NavSectionLink[] = navConfig.calculatorCategories.map((cat) => ({
      label: resolveLabel(cat.labelKey),
      description: resolveDescription(cat.descriptionKey),
      href: resolveHref(cat.route),
      route: cat.route,
    }));

    const calcSection: NavSection = {
      id: "calculators",
      label: resolveLabel("sectionCalculators"),
      description: resolveDescription("sectionCalculators"),
      links: [
        ...calcCategoryLinks,
        {
          label: resolveLabel("allCalculators"),
          description: resolveDescription("sectionCalculators"),
          href: resolveHref("tools"),
          route: "tools",
          badge: resolveBadge("new"),
        },
      ],
    };

    // 2. Reference Dropdown
    const refSection: NavSection = {
      id: "reference",
      label: resolveLabel("sectionReference"),
      description: resolveDescription("sectionReference"),
      links: navConfig.referenceLinks.map((item) => ({
        label: resolveLabel(item.labelKey),
        href: resolveHref(item.route),
        route: item.route,
      })),
    };

    // 3. Direct Header Links
    const guides: DirectNavLink = {
      id: "guides",
      label: resolveLabel("linkGuides"),
      href: resolveHref("guides"),
      route: "guides",
    };

    const blog: DirectNavLink = {
      id: "blog",
      label: resolveLabel("linkBlog"),
      href: resolveHref("blog"),
      route: "blog",
    };

    const about: DirectNavLink = {
      id: "about",
      label: resolveLabel("linkAbout"),
      href: resolveHref("about"),
      route: "about",
    };

    const contact: DirectNavLink = {
      id: "contact",
      label: resolveLabel("linkContact"),
      href: resolveHref("contact"),
      route: "contact",
    };

    // 4. Sidebar Sections
    const sideSections: SidebarSection[] = navConfig.sidebar.map((section) => ({
      label: resolveLabel(section.labelKey),
      links: section.links.map((link) => ({
        label: resolveLabel(link.labelKey),
        href: resolveHref(link.route),
      })),
    }));

    // 5. Footer Links
    const footerCats = navConfig.calculatorCategories.map((cat) => ({
      label: resolveLabel(cat.labelKey),
      href: resolveHref(cat.route),
    }));
    footerCats.push({
      label: resolveLabel("allCalculators"),
      href: resolveHref("tools"),
    });

    const footerMain = navConfig.footerLinks.map((item) => ({
      label: resolveLabel(item.labelKey),
      href: resolveHref(item.route),
    }));

    return {
      calculatorSection: calcSection,
      referenceSection: refSection,
      guidesLink: guides,
      blogLink: blog,
      aboutLink: about,
      contactLink: contact,
      sidebarSections: sideSections,
      footerCategoryLinks: footerCats,
      footerMainLinks: footerMain,
    };
  }, [locale, navCopy]);

  const pathname = usePathname() ?? "/";
  const isHome = stripLocaleFromPath(pathname) === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenSectionId, setMobileOpenSectionId] = useState<string | null>("calculators");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const mobileMenuToggleCopy = locale === "tr" ? { open: "Menu", close: "Kapat" } : { open: "Menu", close: "Close" };
  const currentPath = stripLocaleFromPath(pathname);
  const showAdDisclosure = isAdsAllowedPath(pathname);

  const mobileLegalLinks = [
    { label: navCopy.labels.linkPrivacy, href: getRoute("privacy", locale) },
    { label: navCopy.labels.linkCookies, href: getRoute("cookies", locale) },
    { label: navCopy.labels.linkTerms, href: getRoute("terms", locale) },
    ...(INDEXING_CONFIG.showSalesPolicy
      ? [{ label: navCopy.labels.linkSalesPolicy, href: getRoute("salesPolicy", locale) }]
      : []),
    { label: navCopy.labels.linkDisclaimer, href: getRoute("disclaimer", locale) },
  ];
  const contactEmail = SITE_CONTACT_EMAIL;

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.08),transparent_35%)]">
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:not-sr-only focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        {locale === "tr" ? "İçeriğe geç" : "Skip to content"}
      </a>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[8%] -top-[12%] h-[420px] w-[420px] rounded-full bg-emerald-300/40 blur-[120px]" />
        <div className="absolute -bottom-[18%] -right-[12%] h-[520px] w-[520px] rounded-full bg-sky-300/35 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[160px]" />
      </div>

      <header
        key={pathname}
        className="site-header sticky top-0 z-50 h-16 overflow-visible border-b border-gray-100 bg-white shadow-sm"
      >
        <NavbarRenderProbe />
        <div className="site-container h-full px-0">
          <div className="flex h-full items-center justify-between overflow-visible px-4 md:px-6">
            <Link
              href={getRoute("home", locale)}
              className="flex flex-shrink-0 items-center gap-2 md:gap-3"
              aria-label={brandContent.siteName}
            >
              <Image
                src="/images/logo.png"
                alt={`${brandContent.siteName} logo`}
                width={36}
                height={40}
                className="h-8 max-h-9 w-auto flex-shrink-0 object-contain md:h-9"
                style={{ width: "auto" }}
                priority
              />
              <div className="flex flex-col justify-center gap-0.5">
                <span className="whitespace-nowrap text-sm font-semibold text-gray-900 md:text-base">
                  {brandContent.siteName}
                </span>
                <span className="hidden whitespace-nowrap text-[11px] text-gray-500 sm:block">
                  Deterministik mühendislik hesaplayıcıları
                </span>
              </div>
            </Link>

            {/* Desktop Navigation: Calculators ▾ | Guides | Reference ▾ | Blog | About */}
            <nav className="hidden items-center gap-4 text-[13px] font-medium text-gray-600 lg:flex lg:gap-5">
              <MegaMenuItem section={calculatorSection} currentPath={currentPath} isWide />
              <DirectNavItem link={guidesLink} currentPath={currentPath} />
              <MegaMenuItem section={referenceSection} currentPath={currentPath} />
              <DirectNavItem link={blogLink} currentPath={currentPath} />
              <DirectNavItem link={aboutLink} currentPath={currentPath} />
            </nav>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                openCommandPalette(headerSearchQuery.trim());
              }}
              className="hidden items-center gap-2 md:flex lg:flex"
            >
              <label htmlFor="site-global-search" className="sr-only">
                {searchCopy.palettePlaceholder}
              </label>
              <input
                id="site-global-search"
                type="search"
                value={headerSearchQuery}
                onChange={(event) => setHeaderSearchQuery(event.target.value)}
                placeholder={searchCopy.palettePlaceholder}
                className="h-10 w-56 min-w-[14rem] rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                aria-label={searchCopy.palettePlaceholder}
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-90"
              >
                {locale === "tr" ? "Ara" : "Search"}
              </button>
              <LanguageSwitcher
                tone="light"
                size="sm"
                copy={messages.languageSwitcher}
                onLocaleChange={() => setMobileMenuOpen(false)}
              />
              <UnitSystemSwitcher />
            </form>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="tap-target inline-flex h-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm lg:hidden"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? mobileMenuToggleCopy.close : mobileMenuToggleCopy.open}
            >
              {mobileMenuOpen ? mobileMenuToggleCopy.close : mobileMenuToggleCopy.open}
            </button>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen ? (
            <div className="border-t border-slate-100 bg-white pb-3 pt-3 shadow-sm lg:hidden">
              <div className="flex max-h-[calc(100vh-4rem)] flex-col gap-3 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => openCommandPalette()}
                  className="tap-target mx-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm"
                  aria-label={searchCopy.paletteOpen}
                >
                  {searchCopy.paletteTitle}
                </button>
                <div className="mx-4 flex items-center justify-between gap-3">
                  <LanguageSwitcher
                    tone="light"
                    copy={messages.languageSwitcher}
                    onLocaleChange={() => setMobileMenuOpen(false)}
                  />
                  <UnitSystemSwitcher />
                </div>

                <div className="space-y-2 px-4 pt-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {locale === "tr" ? "Menü" : "Menu"}
                  </p>

                  {/* Mobile Calculators Accordion */}
                  <MobileAccordionSection
                    section={calculatorSection}
                    currentPath={currentPath}
                    isOpen={mobileOpenSectionId === calculatorSection.id}
                    onToggle={() =>
                      setMobileOpenSectionId((current) =>
                        current === calculatorSection.id ? null : calculatorSection.id
                      )
                    }
                    onNavigate={() => setMobileMenuOpen(false)}
                  />

                  {/* Mobile Guides Link */}
                  <MobileDirectLink link={guidesLink} currentPath={currentPath} onNavigate={() => setMobileMenuOpen(false)} />

                  {/* Mobile Reference Accordion */}
                  <MobileAccordionSection
                    section={referenceSection}
                    currentPath={currentPath}
                    isOpen={mobileOpenSectionId === referenceSection.id}
                    onToggle={() =>
                      setMobileOpenSectionId((current) =>
                        current === referenceSection.id ? null : referenceSection.id
                      )
                    }
                    onNavigate={() => setMobileMenuOpen(false)}
                  />

                  {/* Mobile Blog Link */}
                  <MobileDirectLink link={blogLink} currentPath={currentPath} onNavigate={() => setMobileMenuOpen(false)} />

                  {/* Mobile About Link */}
                  <MobileDirectLink link={aboutLink} currentPath={currentPath} onNavigate={() => setMobileMenuOpen(false)} />

                  {/* Mobile Contact Link */}
                  <MobileDirectLink link={contactLink} currentPath={currentPath} onNavigate={() => setMobileMenuOpen(false)} />
                </div>

                <div className="space-y-2 px-4 pt-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {locale === "tr" ? "Yasal ve Referans" : "Legal & Reference"}
                  </p>
                  <div className="grid gap-2">
                    {mobileLegalLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        prefetch={false}
                        onClick={() => setMobileMenuOpen(false)}
                        className="tap-target flex min-h-11 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand hover:text-brand"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="sticky bottom-0 border-t border-slate-100 bg-white px-4 py-3">
                  <Link
                    href={getRoute("tools", locale)}
                    prefetch={false}
                    onClick={() => setMobileMenuOpen(false)}
                    className="tap-target inline-flex min-h-11 w-full items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-90"
                  >
                    {locale === "tr" ? "Hesaplayıcıları Aç" : "Open Calculators"}
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {isHome ? (
        <main id="main-content" className="w-full flex-1">
          {children}
        </main>
      ) : (
        <main id="main-content" className="w-full flex-1">
          <div className="site-container flex w-full min-w-0 flex-col gap-6 py-6 lg:flex-row">
            <aside className="hidden min-w-0 lg:block lg:w-56 lg:shrink-0 xl:w-64">
              <div className="sticky top-4 space-y-3 text-xs">
                {sidebarSections.map((section) => (
                  <SidebarSectionCard key={section.label} section={section} />
                ))}
              </div>
            </aside>

            <section className="min-w-0 flex-1">{children}</section>
          </div>
        </main>
      )}

      {showAdDisclosure ? (
        <aside className="border-t border-slate-100 bg-white/80 py-3 text-center text-[11px] text-slate-500">
          {locale === "tr"
            ? "Ücretsiz araçlar bu reklamların desteğiyle sunulmaktadır."
            : "Free tools are supported by these ads."}
        </aside>
      ) : null}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/90">
        <div className="site-container grid gap-8 py-8 md:grid-cols-3">
          {/* Column 1: Brand Info */}
          <div className="space-y-3">
            <Link href={getRoute("home", locale)} className="inline-flex items-center gap-2" aria-label={brandContent.siteName}>
              <Image
                src="/images/logo.png"
                alt={`${brandContent.siteName} logo`}
                width={40}
                height={44}
                className="h-10 w-10 object-contain"
              />
              <span className="text-sm font-semibold text-slate-950">{brandContent.siteName}</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-700">
              {locale === "tr"
                ? "Görünür formüller ve araca özgü referanslarla mekanik hesap motoru."
                : "A mechanical calculation engine with visible formulas and tool-specific references."}
            </p>
            <a className="block text-sm font-semibold text-brand hover:brightness-90" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          </div>

          {/* Column 2: Calculator Categories */}
          <FooterLinkColumn
            title={locale === "tr" ? "Hesaplayıcılar" : "Calculators"}
            links={footerCategoryLinks}
          />

          {/* Column 3: Corporate & Legal (About, Methodology & Validation, Contact, Privacy, Cookies, Terms, Disclaimer, Sitemap) */}
          <FooterLinkColumn
            title={locale === "tr" ? "Kurumsal & Yasal" : "Corporate & Legal"}
            links={footerMainLinks}
          />
        </div>

        <div className="site-container border-t border-slate-100 py-4 text-[11px] text-slate-500">
          <span>© 2026 {brandContent.siteName}. {locale === "tr" ? "Tüm hesaplamalar referans amaçlıdır." : "All calculations are for reference only."}</span>
        </div>
      </footer>

      <ConsentBanner copy={messages.components.consent} />
      <CommandPalette copy={messages.components.search} />
    </div>
  );
}

function isPathActive(currentPath: string, href: string) {
  const targetPath = stripLocaleFromPath(href);
  return currentPath === targetPath || (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`));
}

function DirectNavItem({ link, currentPath }: { link: DirectNavLink; currentPath: string }) {
  const isActive = isPathActive(currentPath, link.href);

  return (
    <Link
      href={link.href}
      prefetch={false}
      className={`text-[13px] font-semibold transition hover:text-brand ${isActive ? "text-brand" : "text-gray-600"}`}
    >
      {link.label}
    </Link>
  );
}

function MegaMenuItem({
  section,
  currentPath,
  isWide = false,
}: {
  section: NavSection;
  currentPath: string;
  isWide?: boolean;
}) {
  const isActive = section.links.some((link) => isPathActive(currentPath, link.href));

  return (
    <div className="group relative">
      <button
        type="button"
        className={`flex cursor-pointer items-center gap-1 text-[13px] font-semibold transition-colors hover:text-brand focus:outline-none ${
          isActive ? "text-brand" : "text-gray-600"
        }`}
        aria-expanded="false"
      >
        {section.label}
        <span aria-hidden="true" className="text-[10px] text-slate-400">▾</span>
      </button>
      <div
        className={`pointer-events-none absolute left-0 top-full z-[60] pt-3 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 ${
          isWide ? "w-[560px]" : "w-[360px]"
        }`}
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl ring-1 ring-slate-100">
          <p className="mb-3 text-[11px] leading-relaxed text-slate-500">{section.description}</p>
          <div className={isWide ? "grid grid-cols-2 gap-2.5" : "grid gap-2"}>
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="group/card relative block overflow-hidden rounded-xl border border-slate-200 bg-white p-3 transition-colors duration-150 hover:border-brand hover:bg-slate-50/50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 group-hover/card:text-brand">
                    {link.label}
                  </h3>
                  {link.badge ? (
                    <span className="inline-flex items-center rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                      {link.badge}
                    </span>
                  ) : null}
                </div>
                {link.description ? (
                  <p className="mt-1 line-clamp-2 text-[11px] leading-normal text-slate-500">
                    {link.description}
                  </p>
                ) : null}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-brand transition-all duration-200 group-hover/card:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDirectLink({
  link,
  currentPath,
  onNavigate,
}: {
  link: DirectNavLink;
  currentPath: string;
  onNavigate: () => void;
}) {
  const isActive = isPathActive(currentPath, link.href);
  return (
    <Link
      href={link.href}
      prefetch={false}
      onClick={onNavigate}
      className={`tap-target flex min-h-11 items-center rounded-lg border px-4 text-sm font-semibold shadow-sm transition ${
        isActive
          ? "border-brand bg-brand/10 text-brand"
          : "border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand"
      }`}
    >
      {link.label}
    </Link>
  );
}

function MobileAccordionSection({
  section,
  currentPath,
  isOpen,
  onToggle,
  onNavigate,
}: {
  section: NavSection;
  currentPath: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const isActive = section.links.some((link) => isPathActive(currentPath, link.href));

  return (
    <div className={`overflow-hidden rounded-lg border shadow-sm transition ${isOpen || isActive ? "border-brand/30 bg-slate-50" : "border-slate-200 bg-white"}`}>
      <button
        type="button"
        onClick={onToggle}
        className="tap-target flex min-h-11 w-full items-center justify-between px-4 text-left text-sm font-semibold text-slate-800"
        aria-expanded={isOpen}
      >
        <span>{section.label}</span>
        <span className={`text-xs text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? `${section.links.length * 64 + 16}px` : "0px" }}
      >
        <div className="space-y-1 px-2 pb-2">
          {section.links.map((link) => {
            const linkActive = isPathActive(currentPath, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={onNavigate}
                className={`flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition ${
                  linkActive ? "bg-brand text-white" : "text-slate-700 hover:bg-white hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FooterLinkColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <div className="space-y-3 text-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</div>
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            className="block font-semibold text-slate-700 transition hover:text-brand"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SidebarSectionCard({ section }: { section: SidebarSection }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <h3 className="mb-3 text-[12px] font-mono font-semibold uppercase tracking-[0.08em] text-emerald-700">
        {section.label}
      </h3>
      <div className="space-y-2">
        {section.links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-[11px] font-semibold text-slate-700 transition-colors duration-200 hover:border-emerald-300 hover:text-slate-900"
          >
            <div className="text-sm">{link.label}</div>
            <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function NavbarRenderProbe() {
  useDevRenderLogger("Navbar");
  return null;
}
