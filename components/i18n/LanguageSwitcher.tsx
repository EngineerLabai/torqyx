"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/utils/locale";
import { localePath, stripLocaleFromPath } from "@/utils/locale-path";
import { getMessages } from "@/utils/messages";

type LanguageSwitcherProps = {
  className?: string;
  size?: "sm" | "md";
  tone?: "dark" | "light";
};

export default function LanguageSwitcher({ className = "", size = "sm", tone = "dark" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const messages = getMessages(locale);
  const copy = messages.languageSwitcher;
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const buttonClass =
    size === "md" ? "rounded-full border px-2 py-1.5" : "rounded-full border px-1.5 py-1";
  const inactiveClass =
    tone === "light" ? "border-slate-200 bg-white text-slate-800" : "border-white/15 bg-white/5 text-white";
  const activeClass =
    tone === "light" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-emerald-300 bg-emerald-500/15";

  const handleSelect = (next: Locale) => {
    if (next === locale) return;
    const basePath = stripLocaleFromPath(pathname);
    const nextPath = localePath(next, basePath);
    const query = searchParams?.toString();
    setLocale(next);
    router.push(query ? `${nextPath}?${query}` : nextPath);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <button
        type="button"
        onClick={() => handleSelect("tr")}
        className={`${buttonClass} transition ${locale === "tr" ? activeClass : inactiveClass}`}
        aria-label={copy.trLabel}
      >
        <FlagTR size={size} />
      </button>
      <button
        type="button"
        onClick={() => handleSelect("en")}
        className={`${buttonClass} transition ${locale === "en" ? activeClass : inactiveClass}`}
        aria-label={copy.enLabel}
      >
        <FlagEN size={size} />
      </button>
    </div>
  );
}

function FlagTR({ size }: { size: "sm" | "md" }) {
  const width = size === "md" ? 26 : 22;
  const height = size === "md" ? 16 : 14;
  return (
    <svg width={width} height={height} viewBox="0 0 22 14" role="img" aria-hidden="true">
      <rect width="22" height="14" fill="#E30A17" rx="2" />
      <circle cx="9" cy="7" r="4" fill="#fff" />
      <circle cx="10.3" cy="7" r="3.2" fill="#E30A17" />
      <polygon
        fill="#fff"
        points="15.2,5 15.67,6.35 17.1,6.38 15.96,7.25 16.38,8.62 15.2,7.8 14.02,8.62 14.44,7.25 13.3,6.38 14.73,6.35"
      />
    </svg>
  );
}

function FlagEN({ size }: { size: "sm" | "md" }) {
  const width = size === "md" ? 26 : 22;
  const height = size === "md" ? 16 : 14;
  return (
    <svg width={width} height={height} viewBox="0 0 22 14" role="img" aria-hidden="true">
      <rect width="22" height="14" fill="#fff" rx="2" />
      <rect x="9" width="4" height="14" fill="#CE1126" />
      <rect y="5" width="22" height="4" fill="#CE1126" />
    </svg>
  );
}
