"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/utils/locale";

const navItemsByLocale: Record<Locale, { label: string; href: string }[]> = {
  tr: [
    { label: "Ana Sayfa", href: "#home" },
    { label: "Hakkinda", href: "#about" },
    { label: "Hizmetler", href: "#services" },
    { label: "Projeler", href: "#projects" },
    { label: "Blog", href: "#blog" },
    { label: "Iletisim", href: "#contact" },
  ],
  en: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ],
};

const drawerSectionsByLocale: Record<
  Locale,
  { title: string; items: { label: string; href: string }[] }[]
> = {
  tr: [
    {
      title: "Hesaplayicilar",
      items: [
        { label: "Hesaplayici Kutuphanesi", href: "/tools" },
        { label: "Disli hesaplayicilari", href: "/tools/gear-design/calculators" },
        { label: "Tork / Guc", href: "/tools/torque-power" },
        { label: "Basit gerilme", href: "/tools/simple-stress" },
        { label: "Egilme / Sehim", href: "/tools/bending-stress" },
      ],
    },
    {
      title: "Proje Alani",
      items: [
        { label: "Proje merkezi", href: "/project-hub" },
        { label: "RFQ takip", href: "/project-hub/rfq" },
        { label: "Devreye alma", href: "/project-hub/devreye-alma" },
        { label: "Parca takip", href: "/project-hub/part-tracking" },
        { label: "Proje araclari", href: "/project-hub/project-tools" },
      ],
    },
    {
      title: "Kalite Araclari",
      items: [
        { label: "Kalite merkezi", href: "/quality-tools" },
        { label: "5N1K", href: "/quality-tools/5n1k" },
        { label: "5 Neden", href: "/quality-tools/5why" },
        { label: "8D", href: "/quality-tools/8d" },
        { label: "Poka-yoke", href: "/quality-tools/poka-yoke" },
        { label: "Kaizen", href: "/quality-tools/kaizen" },
      ],
    },
    {
      title: "Fikstur & Aparat",
      items: [
        { label: "Fikstur araclari", href: "/fixture-tools" },
        { label: "Konumlama", href: "/fixture-tools/locating" },
        { label: "Sikistirma", href: "/fixture-tools/clamping" },
        { label: "Taban plakasi", href: "/fixture-tools/base-plate" },
      ],
    },
    {
      title: "Icerik",
      items: [
        { label: "Blog", href: "/blog" },
        { label: "Rehberler", href: "/guides" },
        { label: "Sozluk", href: "/glossary" },
      ],
    },
    {
      title: "Topluluk",
      items: [
        { label: "Topluluk", href: "/community" },
        { label: "Forum", href: "/forum" },
        { label: "Destek", href: "/support" },
      ],
    },
  ],
  en: [
    {
      title: "Calculators",
      items: [
        { label: "Tool Library", href: "/tools" },
        { label: "Gear calculators", href: "/tools/gear-design/calculators" },
        { label: "Torque / Power", href: "/tools/torque-power" },
        { label: "Simple stress", href: "/tools/simple-stress" },
        { label: "Bending / Deflection", href: "/tools/bending-stress" },
      ],
    },
    {
      title: "Project Hub",
      items: [
        { label: "Project hub", href: "/project-hub" },
        { label: "RFQ tracker", href: "/project-hub/rfq" },
        { label: "Commissioning", href: "/project-hub/devreye-alma" },
        { label: "Part tracking", href: "/project-hub/part-tracking" },
        { label: "Project tools", href: "/project-hub/project-tools" },
      ],
    },
    {
      title: "Quality Tools",
      items: [
        { label: "Quality hub", href: "/quality-tools" },
        { label: "5W1H", href: "/quality-tools/5n1k" },
        { label: "5 Why", href: "/quality-tools/5why" },
        { label: "8D", href: "/quality-tools/8d" },
        { label: "Poka-yoke", href: "/quality-tools/poka-yoke" },
        { label: "Kaizen", href: "/quality-tools/kaizen" },
      ],
    },
    {
      title: "Fixture Tools",
      items: [
        { label: "Fixture hub", href: "/fixture-tools" },
        { label: "Locating", href: "/fixture-tools/locating" },
        { label: "Clamping", href: "/fixture-tools/clamping" },
        { label: "Base plate", href: "/fixture-tools/base-plate" },
      ],
    },
    {
      title: "Content",
      items: [
        { label: "Blog", href: "/blog" },
        { label: "Guides", href: "/guides" },
        { label: "Glossary", href: "/glossary" },
      ],
    },
    {
      title: "Community",
      items: [
        { label: "Community", href: "/community" },
        { label: "Forum", href: "/forum" },
        { label: "Support", href: "/support" },
      ],
    },
  ],
};

const uiCopyByLocale: Record<
  Locale,
  {
    brandKicker: string;
    brandTitle: string;
    menuAria: string;
    drawerKicker: string;
    drawerTitle: string;
    drawerClose: string;
    drawerGo: string;
    allLabel: string;
    allAria: string;
  }
> = {
  tr: {
    brandKicker: "Muhendisler Lab",
    brandTitle: "Navigasyon",
    menuAria: "Menuyu ac/kapat",
    drawerKicker: "Tum erisim",
    drawerTitle: "Tum bolumler",
    drawerClose: "Kapat",
    drawerGo: "GIT",
    allLabel: "Tum",
    allAria: "Tum bolumler menusu",
  },
  en: {
    brandKicker: "Engineers Lab",
    brandTitle: "Navigation",
    menuAria: "Open/close menu",
    drawerKicker: "All access",
    drawerTitle: "All sections",
    drawerClose: "Close",
    drawerGo: "GO",
    allLabel: "All",
    allAria: "All sections menu",
  },
};

export default function HomeNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { locale } = useLocale();

  const navItems = useMemo(() => navItemsByLocale[locale], [locale]);
  const drawerSections = useMemo(() => drawerSectionsByLocale[locale], [locale]);
  const uiCopy = useMemo(() => uiCopyByLocale[locale], [locale]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen]);

  return (
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-neutral-950/90 via-neutral-900/50 to-transparent backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:flex-nowrap md:px-8">
        <Link href="/" className="group flex items-center gap-3" onClick={closeMenu}>
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/70 to-green-400/30 p-[1px] shadow-[0_0_25px_rgba(74,222,128,0.35)]">
            <div className="flex h-full w-full items-center justify-center rounded-[0.9rem] bg-neutral-950 text-xs font-black uppercase tracking-[0.18em] text-emerald-200 transition duration-150 group-hover:scale-105 group-hover:text-white">
              AI
            </div>
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              {uiCopy.brandKicker}
            </p>
            <p className="text-sm font-semibold text-white">{uiCopy.brandTitle}</p>
          </div>
        </Link>

        <button
          type="button"
          className="relative flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-xl border border-white/10 bg-white/5 text-white transition hover:border-emerald-400/40 hover:text-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 md:hidden"
          aria-label={uiCopy.menuAria}
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span
            className={`block h-[2px] w-6 rounded-full bg-current transition-transform duration-200 ${isMenuOpen ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <span
            className={`block h-[2px] w-6 rounded-full bg-current transition-opacity duration-150 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`block h-[2px] w-6 rounded-full bg-current transition-transform duration-200 ${isMenuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </button>

        <div className="hidden flex-1 flex-wrap items-center justify-end gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] md:flex md:gap-6 md:text-xs">
          {navItems.map((item) =>
            item.label === "Contact" || item.label === "Iletisim" ? (
              <Link
                key={item.label}
                href={item.href}
                className="group relative overflow-hidden rounded-full border border-orange-400/70 bg-gradient-to-r from-emerald-500/20 via-neutral-900/0 to-orange-500/25 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-orange-100 shadow-[0_0_25px_rgba(251,146,60,0.35)] transition duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:text-white md:text-xs"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-orange-400/35 via-emerald-400/20 to-transparent opacity-0 transition duration-200 group-hover:opacity-100" />
              </Link>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="group relative px-2 py-1 text-slate-200 transition duration-150 hover:text-white"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-emerald-400 via-orange-400 to-orange-500 transition duration-200 group-hover:scale-x-100" />
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openDrawer}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-500/20"
            aria-label={uiCopy.allAria}
            aria-expanded={isDrawerOpen}
            aria-controls="home-side-drawer"
          >
            {uiCopy.allLabel}
            <span className="text-[10px] text-emerald-200">-&gt;</span>
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      <div
        className={`md:hidden ${isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-opacity duration-200`}
      >
        <div className="absolute inset-x-0 top-full z-40 bg-neutral-900/95 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-4 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-100 transition hover:border-emerald-400/40 hover:bg-white/10"
              >
                <span className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-400 to-orange-400 opacity-70" />
                  {item.label}
                </span>
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-300">
                  {uiCopy.drawerGo}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] ${isDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-opacity duration-200`}
        aria-hidden={!isDrawerOpen}
      >
        <div
          className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
          role="presentation"
          onClick={closeDrawer}
        />
        <aside
          id="home-side-drawer"
          className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-neutral-950/95 p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-transform duration-200 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
          role="dialog"
          aria-modal="true"
          aria-label={uiCopy.drawerTitle}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">{uiCopy.drawerKicker}</p>
              <h2 className="text-lg font-semibold text-white">{uiCopy.drawerTitle}</h2>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white transition hover:border-emerald-400/50"
            >
              {uiCopy.drawerClose}
            </button>
          </div>

          <div className="mt-6 space-y-5 overflow-y-auto pr-2">
            {drawerSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{section.title}</p>
                <div className="grid gap-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeDrawer}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400/40 hover:bg-white/10"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] font-mono text-emerald-200 opacity-0 transition group-hover:opacity-100">
                        {uiCopy.drawerGo}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </nav>
  );
}
