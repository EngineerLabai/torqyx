"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LOCALE_COOKIE, LOCALE_STORAGE_KEY, type Locale } from "@/utils/locale";
import { localePath } from "@/utils/locale-path";
import type { Messages } from "@/utils/messages";

type LanguageSwitcherProps = {
  copy: Messages["languageSwitcher"];
  className?: string;
  size?: "sm" | "md";
  tone?: "dark" | "light";
  onLocaleChange?: (locale: Locale) => void;
};

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const stripLocale = (pathname: string) => {
  if (!pathname) return "/";
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withoutLocale = normalized.replace(/^\/(tr|en)(?=\/|$)/, "");
  return withoutLocale || "/";
};

export default function LanguageSwitcher({
  copy,
  className = "",
  size = "sm",
  tone = "dark",
  onLocaleChange,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const buttonClass =
    size === "md" ? "rounded-full border px-2 py-1.5" : "rounded-full border px-1.5 py-1";
  const inactiveClass =
    tone === "light" ? "border-slate-200 bg-white text-slate-800" : "border-white/15 bg-white/5 text-white";
  const activeClass =
    tone === "light" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-emerald-300 bg-emerald-500/15";

  const buildNewPath = (nextLocale: Locale) => {
    const strippedPath = stripLocale(pathname);
    const rawPath = strippedPath === "/" ? `/${nextLocale}` : `/${nextLocale}${strippedPath}`;
    return localePath(nextLocale, rawPath);
  };

  const handleSelect = (next: Locale) => {
    if (next === locale) return;

    const newPath = buildNewPath(next);
    const qs = searchParams?.toString() ?? "";
    const nextUrl = qs ? `${newPath}?${qs}` : newPath;

    if (typeof document !== "undefined") {
      document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
      document.cookie = `NEXT_LOCALE=${next}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      window.localStorage.setItem("preferredLocale", next);
    }

    setLocale(next);
    onLocaleChange?.(next);
    router.replace(nextUrl);
    router.refresh();
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
