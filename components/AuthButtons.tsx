"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function AuthButtons() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  if (loading) {
    return <div className="h-9 w-28 animate-pulse rounded-full bg-white/20" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={loginWithGoogle}
          className="rounded-full border border-slate-300 px-3 py-1.5 font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
        >
          Giriş Yap
        </button>
        <Link
          className="rounded-full bg-sky-600 px-3 py-1.5 font-semibold text-white shadow-sm transition hover:bg-sky-500"
          href="#"
        >
          Premium
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/80 px-3 py-1.5 font-semibold text-slate-900 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="max-w-[120px] truncate">{user.displayName ?? user.email ?? "Kullanıcı"}</span>
      </div>
      <button
        type="button"
        onClick={logout}
        className="rounded-full border border-slate-200 px-3 py-1.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
      >
        Çıkış
      </button>
    </div>
  );
}
