"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useAuth } from "./AuthProvider";
import { getMessages } from "@/utils/messages";
import { withLocalePrefix } from "@/utils/locale-path";

export default function AuthButtons() {
  const { user, loading, available, error, loginWithGoogle, logout } = useAuth();
  const { locale } = useLocale();
  const copy = getMessages(locale).authButtons;
  const premiumHref = withLocalePrefix("/premium", locale);

  if (loading) {
    return <div className="h-9 w-28 animate-pulse rounded-full bg-white/20" />;
  }

  if (!available) {
    const detail = process.env.NODE_ENV !== "production" && error ? ` (${error})` : "";
    return (
      <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-semibold text-amber-700">
        {copy.unavailable}
        {detail}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={loginWithGoogle}
          className="tap-target inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
        >
          {copy.login}
        </button>
        <Link
          className="tap-target inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500"
          href={premiumHref}
        >
          {copy.premium}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/80 px-3 py-1.5 font-semibold text-slate-900 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="max-w-[120px] truncate">{user.displayName ?? user.email ?? copy.userFallback}</span>
      </div>
      <button
        type="button"
        onClick={logout}
        className="tap-target inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
      >
        {copy.logout}
      </button>
    </div>
  );
}
