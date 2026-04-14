"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "./AuthProvider";
import type { Messages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";

type AuthButtonsProps = {
  copy: Messages["authButtons"];
};

export default function AuthButtons({ copy }: AuthButtonsProps) {
  const { user, loading, available, error, loginWithGoogle, logout } = useAuth();
  const { locale } = useLocale();
  const { track } = useAnalytics();
  const premiumHref = withLocalePrefix("/pricing", locale);

  const handleLogin = () => {
    track("signup_start", { source: "cta" });
    void loginWithGoogle();
  };

  const handleUpgradeClick = () => {
    track("upgrade_click", {
      plan: "pro",
      source: "header",
    });
  };

  if (loading) {
    return <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-100" />;
  }

  if (!available) {
    const detail = process.env.NODE_ENV !== "production" && error ? ` (${error})` : "";
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
        {copy.unavailable}
        {detail}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={handleLogin}
          className="tap-target inline-flex items-center justify-center whitespace-nowrap text-[13px] font-medium text-gray-700 transition-colors hover:text-gray-900"
        >
          {copy.login}
        </button>
        <Link
          onClick={handleUpgradeClick}
          title={copy.premiumTooltip}
          aria-label={`${copy.premium}. ${copy.premiumTooltip}`}
          className="tap-target inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-blue-600 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-blue-700 md:px-4 md:py-2 md:text-[13px]"
          href={premiumHref}
        >
          {copy.premium}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="max-w-[120px] truncate">{user.displayName ?? user.email ?? copy.userFallback}</span>
      </div>
      <button
        type="button"
        onClick={logout}
        className="tap-target inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        {copy.logout}
      </button>
    </div>
  );
}
