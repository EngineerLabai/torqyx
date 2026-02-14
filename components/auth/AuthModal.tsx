"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import LoginPanel from "@/components/auth/LoginPanel";
import { AUTH_MODAL_OPEN_EVENT } from "@/components/auth/authModalEvents";
import type { Messages } from "@/utils/messages";

type AuthModalProps = {
  copy: Messages["components"]["authModal"];
  authCopy: Messages["authButtons"];
};

export default function AuthModal({ copy, authCopy }: AuthModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(AUTH_MODAL_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(AUTH_MODAL_OPEN_EVENT, handleOpen);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label={copy.close}
        className="absolute inset-0 bg-slate-900/50"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={copy.close}
          className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
        >
          <X size={16} />
        </button>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">{copy.badge}</p>
          <h2 className="text-balance text-2xl font-semibold text-slate-900">{copy.title}</h2>
          <p className="text-sm text-slate-600">{copy.description}</p>
        </div>

        <div className="mt-5">
          <LoginPanel copy={authCopy} />
        </div>

        <p className="mt-4 text-[11px] text-slate-500">{copy.note}</p>
      </div>
    </div>
  );
}
