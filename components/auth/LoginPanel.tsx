"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import type { Messages } from "@/utils/messages";

type LoginPanelProps = {
  copy: Messages["authButtons"];
};

export default function LoginPanel({ copy }: LoginPanelProps) {
  const { user, loading, available, error, loginWithGoogle, logout } = useAuth();

  if (loading) {
    return <div className="h-14 w-full animate-pulse rounded-2xl bg-slate-200/60" />;
  }

  if (!available) {
    const detail = process.env.NODE_ENV !== "production" && error ? ` (${error})` : "";
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
        {copy.unavailable}
        {detail}
      </div>
    );
  }

  if (user) {
    return (
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-900">{user.displayName ?? user.email ?? copy.userFallback}</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Online
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          {copy.logout}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
      <p className="text-slate-600">{copy.loginHint}</p>
      <button
        type="button"
        onClick={loginWithGoogle}
        className="w-full rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        {copy.login}
      </button>
    </div>
  );
}
