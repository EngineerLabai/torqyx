"use client";

import { useState } from "react";
import Link from "next/link";
import CommentDemo from "@/components/CommentDemo";
import ParticleBackground from "@/src/components/ParticleBackground";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const GlitchTitle = () => {
  return (
    <div className="group relative inline-block w-full max-w-5xl overflow-hidden">
      <h1 className="relative z-10 text-5xl font-black tracking-tighter text-white mix-blend-difference md:text-8xl lg:text-9xl">
        MUHENDISLER
        <br />
        <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          LABORATUVARI
        </span>
      </h1>

      <div className="pointer-events-none absolute left-1 top-0 h-full w-full select-none text-6xl font-black text-red-500 opacity-0 mix-blend-difference transition-opacity duration-150 group-hover:animate-pulse group-hover:opacity-30 md:text-8xl lg:text-9xl">
        MUHENDISLER
        <br />
        LABORATUVARI
      </div>
      <div className="pointer-events-none absolute -left-1 top-0 h-full w-full select-none text-6xl font-black text-blue-500 opacity-0 mix-blend-difference transition-opacity duration-150 group-hover:animate-bounce group-hover:opacity-30 md:text-8xl lg:text-9xl">
        MUHENDISLER
        <br />
        LABORATUVARI
      </div>
    </div>
  );
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <ParticleBackground />

      <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-neutral-950/90 via-neutral-900/50 to-transparent backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:flex-nowrap md:px-8">
          <Link href="/" className="group flex items-center gap-3" onClick={closeMenu}>
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/70 to-green-400/30 p-[1px] shadow-[0_0_25px_rgba(74,222,128,0.35)]">
              <div className="flex h-full w-full items-center justify-center rounded-[0.9rem] bg-neutral-950 text-xs font-black uppercase tracking-[0.18em] text-emerald-200 transition duration-150 group-hover:scale-105 group-hover:text-white">
                AI
              </div>
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Engineers Lab</p>
              <p className="text-sm font-semibold text-white">Navigation</p>
            </div>
          </Link>

          <button
            type="button"
            className="relative flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-xl border border-white/10 bg-white/5 text-white transition hover:border-emerald-400/40 hover:text-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 md:hidden"
            aria-label="Menuyu ac/kapat"
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
              item.label === "Contact" ? (
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
              )
            )}
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
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-300">GO</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <section
        id="home"
        className="relative flex min-h-screen flex-col justify-center px-4 pb-20 pt-28 md:px-10 lg:px-16"
      >
        <GlitchTitle />

        <div className="relative z-10 -mt-12 ml-auto mr-0 w-full max-w-xl md:-mt-20 md:mr-8 lg:-mt-28 lg:mr-16">
          <div className="border-2 border-white bg-neutral-900/90 p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] backdrop-blur-sm">
            <div className="mb-4 flex justify-between border-b border-neutral-700 pb-2 font-mono text-xs text-cyan-400">
              <span>SYS_STATUS: ONLINE</span>
              <span className="animate-pulse">?</span>
            </div>

            <p className="mb-8 font-mono text-base leading-relaxed text-neutral-300 md:text-lg">
              &gt; Standartlari reddediyoruz. <br />
              Kaos ve duzen arasindaki ince cizgide, noral aglarin sinirlarini zorlayan algoritmalar gelistiriyoruz.
            </p>

            <button className="group relative overflow-hidden border border-green-500/50 bg-transparent px-8 py-4 transition-all duration-300 hover:border-green-400">
              <div className="absolute inset-0 w-0 bg-green-500 opacity-10 transition-all duration-[250ms] ease-out group-hover:w-full" />
              <div className="absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2 border-green-500" />
              <div className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-green-500" />

              <span className="relative font-mono text-sm uppercase tracking-widest text-green-400 group-hover:text-green-300">
                {`> SISTEME_GIRIS()`}
                <span className="absolute -right-2 top-0 h-1 w-1 animate-ping rounded-full bg-green-500 opacity-75" />
              </span>
            </button>
          </div>
        </div>
      </section>

      <section id="comments" className="relative z-10 px-4 pb-20 md:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Canlı</p>
            <h2 className="text-2xl font-bold text-white md:text-3xl">Giriş yapan kullanıcıların yorum akışı</h2>
            <p className="max-w-2xl text-sm text-slate-300 md:text-base">
              Auth aktifken formdan gönderilen mesajlar Firestore&apos;a düşer; canlı listede son 6 yorum görünür.
            </p>
          </div>
          <CommentDemo />
        </div>
      </section>
    </main>
  );
}
