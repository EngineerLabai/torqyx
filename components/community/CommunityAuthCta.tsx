"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";

type CommunityAuthCtaProps = {
  guestHref?: string;
};

export default function CommunityAuthCta({ guestHref = "#community-topics" }: CommunityAuthCtaProps) {
  const { user, loading, available, loginWithGoogle } = useAuth();
  const { locale } = useLocale();
  const copy = getMessages(locale).pages.community.authCta;

  if (loading || !available || user) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">{copy.title}</p>
        <p className="text-xs text-slate-600">{copy.description}</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={loginWithGoogle}
          className="tap-target inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
        >
          {copy.login}
        </button>
        <Link
          href={guestHref}
          className="tap-target inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          {copy.guest}
        </Link>
      </div>
    </div>
  );
}
