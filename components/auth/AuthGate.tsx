"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { getMessages } from "@/utils/messages";

type AuthGateProps = {
  children: ReactNode;
  mode?: "block" | "notice";
};

export default function AuthGate({ children, mode = "block" }: AuthGateProps) {
  const { loading, available, error } = useAuth();
  const { locale } = useLocale();
  const copy = getMessages(locale).authButtons;
  const [showReadOnlyHint, setShowReadOnlyHint] = useState(false);

  useEffect(() => {
    if (!loading || mode !== "notice") {
      const reset = setTimeout(() => setShowReadOnlyHint(false), 0);
      return () => clearTimeout(reset);
    }
    const timer = setTimeout(() => setShowReadOnlyHint(true), 2500);
    return () => clearTimeout(timer);
  }, [loading, mode]);

  const detail = process.env.NODE_ENV !== "production" && error ? ` (${error})` : "";
  const unavailableBanner = (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
      {copy.unavailable}
      {detail}
    </div>
  );

  if (loading) {
    const skeleton = <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-200/40" />;
    const loadingBanner = (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        <p className="font-semibold">{copy.checking}</p>
        {showReadOnlyHint ? <p className="mt-1 text-xs text-slate-500">{copy.readOnlyFallback}</p> : null}
      </div>
    );
    return mode === "notice" ? (
      <div className="space-y-4">
        {loadingBanner}
        {children}
      </div>
    ) : (
      skeleton
    );
  }

  if (error) {
    const errorBanner = (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <p className="font-semibold">{copy.errorTitle}</p>
        <p className="mt-1 text-xs text-rose-700/90">
          {copy.errorDescription}
          {detail}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          {copy.retry}
        </button>
      </div>
    );

    return mode === "notice" ? (
      <div className="space-y-4">
        {errorBanner}
        {children}
      </div>
    ) : (
      errorBanner
    );
  }

  if (!available) {
    return mode === "notice" ? (
      <div className="space-y-4">
        {unavailableBanner}
        {children}
      </div>
    ) : (
      unavailableBanner
    );
  }

  return <>{children}</>;
}
