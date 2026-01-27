"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButtons from "@/components/auth/AuthButtons";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/utils/locale";

type NavSection = {
  id: "tools" | "resources" | "community" | "contact";
  label: string;
  description: string;
  links: { label: string; href: string; badge?: string }[];
};

type SidebarSection = {
  label: string;
  links: { label: string; href: string }[];
};

const navSectionsByLocale: Record<Locale, NavSection[]> = {
  tr: [
    {
      id: "tools",
      label: "Hesaplayicilar",
      description: "Disli, tork, kuvvet ve mekanik hesap araclari.",
      links: [
        { label: "Disli hesaplayicilari", href: "/tools/gear-design/calculators", badge: "Yeni" },
        { label: "Mekanik hesaplamalar", href: "/tools" },
        { label: "Tork / Guc", href: "/tools/torque-power" },
      ],
    },
    {
      id: "resources",
      label: "Araclar",
      description: "Sablon, rehber ve proje araclari.",
      links: [
        { label: "Proje alani", href: "/project-hub", badge: "Guncel" },
        { label: "Kalite araclari", href: "/quality-tools" },
        { label: "Fikstur & aparat", href: "/fixture-tools" },
      ],
    },
    {
      id: "community",
      label: "Forum",
      description: "Topluluk tartismalari ve paylasimlar.",
      links: [
        { label: "Topluluk", href: "/community" },
        { label: "Soru-cevap", href: "/forum" },
      ],
    },
    {
      id: "contact",
      label: "Iletisim",
      description: "Geri bildirim ve destek kanallari.",
      links: [{ label: "Bize ulasin", href: "/support" }],
    },
  ],
  en: [
    {
      id: "tools",
      label: "Calculators",
      description: "Gear, torque, force, and mechanical calculation tools.",
      links: [
        { label: "Gear calculators", href: "/tools/gear-design/calculators", badge: "New" },
        { label: "Mechanical calculators", href: "/tools" },
        { label: "Torque / Power", href: "/tools/torque-power" },
      ],
    },
    {
      id: "resources",
      label: "Workflows",
      description: "Templates, guides, and project tools.",
      links: [
        { label: "Project hub", href: "/project-hub", badge: "Updated" },
        { label: "Quality tools", href: "/quality-tools" },
        { label: "Fixture & tooling", href: "/fixture-tools" },
      ],
    },
    {
      id: "community",
      label: "Community",
      description: "Community discussions and knowledge sharing.",
      links: [
        { label: "Community", href: "/community" },
        { label: "Q&A", href: "/forum" },
      ],
    },
    {
      id: "contact",
      label: "Contact",
      description: "Feedback and support channels.",
      links: [{ label: "Get in touch", href: "/support" }],
    },
  ],
};

const sidebarSectionsByLocale: Record<Locale, SidebarSection[]> = {
  tr: [
    {
      label: "Genel",
      links: [
        { label: "Ana Sayfa", href: "/" },
        { label: "Hesaplayicilar", href: "/tools" },
      ],
    },
    {
      label: "Araclar",
      links: [
        { label: "Proje Alani", href: "/project-hub" },
        { label: "Kalite Araclari", href: "/quality-tools" },
        { label: "Fikstur Araclari", href: "/fixture-tools" },
      ],
    },
    {
      label: "Forum",
      links: [
        { label: "Topluluk", href: "/community" },
        { label: "Soru-cevap", href: "/forum" },
      ],
    },
    {
      label: "Iletisim",
      links: [{ label: "Bize ulasin", href: "/support" }],
    },
  ],
  en: [
    {
      label: "General",
      links: [
        { label: "Home", href: "/" },
        { label: "Calculators", href: "/tools" },
      ],
    },
    {
      label: "Workflows",
      links: [
        { label: "Project hub", href: "/project-hub" },
        { label: "Quality tools", href: "/quality-tools" },
        { label: "Fixture tools", href: "/fixture-tools" },
      ],
    },
    {
      label: "Community",
      links: [
        { label: "Community", href: "/community" },
        { label: "Q&A", href: "/forum" },
      ],
    },
    {
      label: "Contact",
      links: [{ label: "Get in touch", href: "/support" }],
    },
  ],
};

const headerCopyByLocale: Record<
  Locale,
  {
    brandTitle: string;
    brandSubtitle: string;
    premiumTitle: string;
    premiumItems: string[];
  }
> = {
  tr: {
    brandTitle: "AI Engineers Lab",
    brandSubtitle: "Acik ve ozgun muhendislik",
    premiumTitle: "Premium uyelik",
    premiumItems: [
      "Detayli tork ve dis tablolar",
      "Gelismis mekanik hesaplayicilar",
      "Malzeme ve kaplama oneri kartlari",
    ],
  },
  en: {
    brandTitle: "AI Engineers Lab",
    brandSubtitle: "Clear and original engineering",
    premiumTitle: "Premium membership",
    premiumItems: [
      "Detailed torque and gear tables",
      "Advanced mechanical calculators",
      "Material and coating suggestion cards",
    ],
  },
};

export default function SiteShell({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const navSections = navSectionsByLocale[locale];
  const sidebarSections = sidebarSectionsByLocale[locale];
  const headerCopy = headerCopyByLocale[locale];
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_20%_20%,rgba(100,116,139,0.05),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.05),transparent_25%)]">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-green-500/20 blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[150px]" />
      </div>

      <header className="site-header sticky top-0 z-50 border-b border-slate-200">
        <div className="site-container flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center">
              <img src="/icons/logo-mark.svg" alt="AI" className="h-10 w-10 anim-blob" />
              <span className="absolute -inset-1 rounded-2xl blur-2xl opacity-30 brand-gradient" aria-hidden />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {headerCopy.brandTitle}
              </span>
              <span className="text-sm font-semibold text-slate-900">{headerCopy.brandSubtitle}</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navSections.map((section) => {
              if (section.id === "tools") {
                return (
                  <Link
                    key={section.id}
                    href="/tools"
                    className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-200 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/40"
                  >
                    {section.label}
                  </Link>
                );
              }

              if (section.id === "contact") {
                return (
                  <Link
                    key={section.id}
                    href="/support"
                    className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-200 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/40"
                  >
                    {section.label}
                  </Link>
                );
              }

              return <MegaMenuItem key={section.id} section={section} />;
            })}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher tone="light" />
            <AuthButtons />
          </div>
        </div>

        <div className="border-t border-slate-100 bg-white/80 px-4 py-2 lg:hidden">
          <div className="mx-auto flex max-w-8xl flex-wrap gap-2">
            {navSections.slice(0, 3).map((section, index) => (
              <Link
                key={section.id}
                href={index === 0 ? "/tools" : section.links[0]?.href ?? "#"}
                className="tap-target inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                {section.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

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

          <aside className="hidden w-72 shrink-0 xl:block">
            <div className="sticky top-4 space-y-4 text-xs">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <h2 className="mb-1 text-sm font-semibold text-slate-900">{headerCopy.premiumTitle}</h2>
                <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-600">
                  {headerCopy.premiumItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function MegaMenuItem({ section }: { section: NavSection }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-200 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/40"
        aria-expanded="false"
      >
        {section.label}
        <span className="text-[10px] text-slate-500">v</span>
      </button>
      <div className="pointer-events-none absolute left-0 top-full z-30 w-[360px] translate-y-2 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-3 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-3 group-focus-within:opacity-100">
        <div className="rounded-2xl border border-white/15 bg-black/80 p-4 shadow-[10px_10px_0px_0px_rgba(0,255,65,0.12)] ring-1 ring-green-500/10 backdrop-blur">
          <p className="mb-3 text-[11px] leading-relaxed text-slate-300">{section.description}</p>
          <div className="grid gap-2">
            {section.links.map((link, idx) => {
              const id = String(idx + 1).padStart(3, "0");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group/card relative block overflow-hidden border border-white/10 bg-black/40 p-4 transition-colors duration-200 hover:border-green-500/50"
                >
                  <div className="absolute top-2 right-2 text-[10px] font-mono text-gray-500 group-hover/card:text-green-400">
                    SYS_ID: {id}
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-200 group-hover/card:text-white">{link.label}</h3>
                  {link.badge ? (
                    <span className="mt-2 inline-flex items-center gap-1 rounded border border-green-500/30 px-2 py-0.5 text-[10px] font-semibold text-green-300">
                      {link.badge}
                    </span>
                  ) : null}
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-green-500 transition-all duration-300 group-hover/card:w-full" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarSectionCard({ section }: { section: SidebarSection }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 shadow-[6px_6px_0px_0px_rgba(0,255,65,0.08)] backdrop-blur">
      <h3 className="mb-3 text-[12px] font-mono font-semibold uppercase tracking-[0.08em] text-green-300">
        {section.label}
      </h3>
      <div className="space-y-2">
        {section.links.map((link, idx) => {
          const id = String(idx + 1).padStart(2, "0");
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group relative block overflow-hidden border border-white/10 bg-black/40 p-3 text-[11px] font-semibold text-gray-200 transition-colors duration-200 hover:border-green-500/50 hover:text-white"
            >
              <div className="absolute top-2 right-2 text-[10px] font-mono text-gray-500 group-hover:text-green-400">
                ID: {id}
              </div>
              <div className="text-sm">{link.label}</div>
              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-green-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
