"use client";

import type { ReactNode } from "react";
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

  const detail = process.env.NODE_ENV !== "production" && error ? ` (${error})` : "";
  const unavailableBanner = (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
      {copy.unavailable}
      {detail}
    </div>
  );

  if (loading) {
    const skeleton = <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-200/40" />;
    return mode === "notice" ? (
      <div className="space-y-4">
        {skeleton}
        {children}
      </div>
    ) : (
      skeleton
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
