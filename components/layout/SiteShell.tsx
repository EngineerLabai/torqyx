"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButtons from "@/components/auth/AuthButtons";
import BrandLogo from "@/components/brand/BrandLogo";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import PremiumCTA from "@/components/premium/PremiumCTA";
import { getBrandCopy } from "@/config/brand";
import { navConfig, type NavLinkConfig, type NavSectionConfig } from "@/config/nav";
import { stripLocaleFromPath, withLocalePrefix } from "@/utils/locale-path";
import { getMessages } from "@/utils/messages";

type NavSection = {
  label: string;
  description: string;
  links: { label: string; href: string; badge?: string }[];
};

type SidebarSection = {
  label: string;
  links: { label: string; href: string }[];
};

export default function SiteShell({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const brandContent = getBrandCopy(locale);
  const messages = getMessages(locale);
  const navCopy = messages.nav as {
    labels: Record<string, string>;
    descriptions?: Record<string, string>;
    badges?: Record<string, string>;
  };
  const isDebug = process.env.NODE_ENV !== "production";
  const resolveLabel = (key: string) => navCopy.labels?.[key] ?? key;
  const resolveDescription = (key?: string) => (key ? navCopy.descriptions?.[key] ?? "" : "");
  const resolveBadge = (key?: string) => (key ? navCopy.badges?.[key] : undefined);
  const withDebug = (label: string, id: string) => (isDebug ? `${label} (${id})` : label);
  const localizeHref = (href: string) => withLocalePrefix(href, locale);

  const navSections: NavSection[] = (navConfig.megaMenu as unknown as NavSectionConfig[]).map((section) => ({
    label: withDebug(resolveLabel(section.labelKey), section.id),
    description: resolveDescription(section.descriptionKey ?? section.labelKey),
    links: (section.links as NavLinkConfig[]).map((link) => ({
      label: withDebug(resolveLabel(link.labelKey), link.id),
      href: localizeHref(link.href),
      badge: resolveBadge(link.badgeKey),
    })),
  }));

  const sidebarSections: SidebarSection[] = (navConfig.sidebar as unknown as NavSectionConfig[]).map((section) => ({
    label: withDebug(resolveLabel(section.labelKey), section.id),
    links: (section.links as NavLinkConfig[]).map((link) => ({
      label: withDebug(resolveLabel(link.labelKey), link.id),
      href: localizeHref(link.href),
    })),
  }));
  const pathname = usePathname() ?? "/";
  const isHome = stripLocaleFromPath(pathname) === "/";
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.08),transparent_35%)]">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -left-[8%] -top-[12%] h-[420px] w-[420px] rounded-full bg-emerald-300/40 blur-[120px]" />
        <div className="absolute -bottom-[18%] -right-[12%] h-[520px] w-[520px] rounded-full bg-sky-300/35 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-[160px]" />
      </div>

      <header className="site-header sticky top-0 z-50 border-b border-slate-200/80 bg-white/80">
        <div className="site-container flex items-center justify-between gap-6 py-4">
          <Link href={localizeHref("/")} className="flex items-center gap-3" aria-label={brandContent.siteName}>
            <BrandLogo
              name={brandContent.siteName}
              markClassName="h-9 w-9"
              wordClassName="h-7"
              textClassName="text-[15px] font-semibold"
            />
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navSections.map((section) => (
              <MegaMenuItem key={section.label} section={section} />
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher tone="light" />
            <AuthButtons />
          </div>
        </div>

        <div className="border-t border-slate-100 bg-white/85 px-4 py-2 lg:hidden">
          <div className="mx-auto flex max-w-8xl flex-wrap gap-2">
            {navSections.slice(0, 3).map((section) => (
              <Link
                key={section.label}
                href={section.links[0]?.href ?? "#"}
                className="tap-target inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm"
              >
                {section.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {isHome ? (
        children
      ) : (
        <main className="flex-1">
          <div className="mx-auto flex max-w-8xl flex-col gap-6 px-4 py-6 lg:flex-row">
            <aside className="lg:w-64 lg:shrink-0">
              <div className="sticky top-4 space-y-3 text-xs">
                {sidebarSections.map((section) => (
                  <SidebarSectionCard key={section.label} section={section} />
                ))}
              </div>
            </aside>

            <section className="flex-1">{children}</section>
          </div>
        </main>
      )}

      <footer className="border-t border-slate-200 bg-white/90">
        <div className="site-container grid gap-6 py-8 md:grid-cols-[1.1fr_2fr]">
          <div className="space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{brandContent.siteName}</div>
            <p className="text-sm text-slate-700">{brandContent.description}</p>
            <PremiumCTA variant="compact" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sidebarSections.map((section) => (
              <div key={section.label} className="space-y-2 text-xs">
                <div className="font-semibold uppercase tracking-[0.12em] text-slate-500">{section.label}</div>
                <div className="space-y-1">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-[13px] font-semibold text-slate-700 hover:text-slate-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="site-container flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 py-4 text-[11px] text-slate-500">
          <span>(c) {year} {brandContent.siteName}</span>
          <span>{brandContent.description}</span>
        </div>
      </footer>
    </div>
  );
}

function MegaMenuItem({ section }: { section: NavSection }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
        aria-expanded="false"
      >
        {section.label}
        <span className="text-[10px] text-slate-400">v</span>
      </button>
      <div className="pointer-events-none absolute left-0 top-full z-30 w-[360px] translate-y-2 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-3 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-3 group-focus-within:opacity-100">
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[10px_10px_0px_0px_rgba(15,23,42,0.06)] ring-1 ring-emerald-200/40 backdrop-blur">
          <p className="mb-3 text-[11px] leading-relaxed text-slate-500">{section.description}</p>
          <div className="grid gap-2">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group/card relative block overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-colors duration-200 hover:border-emerald-300"
              >
                <h3 className="mb-1 text-sm font-semibold text-slate-900 group-hover/card:text-slate-950">{link.label}</h3>
                {link.badge ? (
                  <span className="mt-2 inline-flex items-center gap-1 rounded border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {link.badge}
                  </span>
                ) : null}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-emerald-500 transition-all duration-300 group-hover/card:w-full" />
              </Link>
            ))}
          </div>
        </div>
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
