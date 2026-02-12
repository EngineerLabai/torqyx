"use client";

import { useState } from "react";

type WaitlistCopy = {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  focusLabel: string;
  focusPlaceholder: string;
  cta: string;
  success: string;
  errorInvalid: string;
  disclaimer: string;
};

type CommunityWaitlistFormProps = {
  copy: WaitlistCopy;
};

const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export default function CommunityWaitlistForm({ copy }: CommunityWaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [focus, setFocus] = useState("");
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedFocus = focus.trim();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError(copy.errorInvalid);
      setStatus("idle");
      return;
    }

    setError("");
    setStatus("saved");

    try {
      const storageKey = "community-waitlist";
      const existing = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as Array<{
        email: string;
        focus?: string;
        createdAt: string;
      }>;
      existing.push({ email: trimmedEmail, focus: trimmedFocus || undefined, createdAt: new Date().toISOString() });
      window.localStorage.setItem(storageKey, JSON.stringify(existing.slice(-200)));
    } catch {
      // Ignore storage errors; the UI already confirmed submission.
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (status === "saved") {
      setStatus("idle");
    }
    if (error) {
      setError("");
    }
  };

  const handleFocusChange = (value: string) => {
    setFocus(value);
    if (status === "saved") {
      setStatus("idle");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-slate-900">{copy.title}</h3>
        <p className="text-sm text-slate-600">{copy.description}</p>
      </div>

      <label className="space-y-1">
        <span className="block text-[11px] font-semibold text-slate-700">{copy.emailLabel}</span>
        <input
          type="email"
          value={email}
          onChange={(event) => handleEmailChange(event.target.value)}
          placeholder={copy.emailPlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          aria-invalid={Boolean(error)}
          required
        />
        {error ? <span className="text-[10px] text-red-600">{error}</span> : null}
      </label>

      <label className="space-y-1">
        <span className="block text-[11px] font-semibold text-slate-700">{copy.focusLabel}</span>
        <input
          type="text"
          value={focus}
          onChange={(event) => handleFocusChange(event.target.value)}
          placeholder={copy.focusPlaceholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-emerald-600 px-4 py-2 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-500"
        >
          {copy.cta}
        </button>
        {status === "saved" ? (
          <span role="status" className="text-[11px] text-emerald-700">
            {copy.success}
          </span>
        ) : null}
      </div>

      <p className="text-[11px] text-slate-500">{copy.disclaimer}</p>
    </form>
  );
}
