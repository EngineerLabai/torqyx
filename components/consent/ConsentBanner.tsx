"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/utils/messages";
import {
  CONSENT_COOKIE,
  CONSENT_PREFS_KEY,
  CONSENT_STORAGE_KEY,
  readConsentPrefs,
  readConsentStatus,
  resolveConsentPrefs,
  type ConsentPrefs,
  type ConsentStatus,
} from "@/utils/consent";

const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

const DEFAULT_PREFS: ConsentPrefs = {
  analytics: false,
  advertising: false,
};

export default function ConsentBanner() {
  const { locale } = useLocale();
  const copy = getMessages(locale).components.consent;
  const [mounted, setMounted] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [prefs, setPrefs] = useState<ConsentPrefs>(DEFAULT_PREFS);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const status = readConsentStatus();
    const storedPrefs = readConsentPrefs();
    if (!status) {
      setBannerVisible(true);
      setPrefs(storedPrefs ?? DEFAULT_PREFS);
      return;
    }
    setBannerVisible(false);
    setPrefs(resolveConsentPrefs(status, storedPrefs));
  }, []);

  useEffect(() => {
    if (!prefsOpen) return;
    const modal = modalRef.current;
    if (!modal) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(modal.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (node) => !node.hasAttribute("disabled"),
      );

    const focusables = getFocusable();
    (focusables[0] ?? modal).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setPrefsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [prefsOpen]);

  const persistConsent = (status: ConsentStatus, nextPrefs: ConsentPrefs) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
      window.localStorage.setItem(CONSENT_PREFS_KEY, JSON.stringify(nextPrefs));
    } catch {
      // ignore storage errors
    }

    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(status)}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax`;
    document.documentElement.dataset.consent = status;
  };

  const handleAccept = () => {
    const nextPrefs = { analytics: true, advertising: true };
    setPrefs(nextPrefs);
    persistConsent("accept", nextPrefs);
    setBannerVisible(false);
    setPrefsOpen(false);
  };

  const handleReject = () => {
    setPrefs(DEFAULT_PREFS);
    persistConsent("reject", DEFAULT_PREFS);
    setBannerVisible(false);
    setPrefsOpen(false);
  };

  const handleSavePrefs = () => {
    persistConsent("custom", prefs);
    setBannerVisible(false);
    setPrefsOpen(false);
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    setPrefsOpen(false);
  };

  if (!mounted) return null;

  return (
    <>
      {prefsOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
          aria-describedby="consent-description"
          onClick={handleOverlayClick}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl outline-none"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="consent-title" className="text-lg font-semibold text-slate-900">
                  {copy.preferencesTitle}
                </h2>
                <p id="consent-description" className="mt-2 text-sm text-slate-600">
                  {copy.preferencesDescription}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
                onClick={() => setPrefsOpen(false)}
                aria-label={copy.close}
              >
                {copy.close}
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <ConsentToggle
                label={copy.necessaryLabel}
                description={copy.necessaryDescription}
                checked
                locked
                helper={copy.alwaysOn}
              />
              <ConsentToggle
                label={copy.analyticsLabel}
                description={copy.analyticsDescription}
                checked={prefs.analytics}
                onChange={(value) => setPrefs((prev) => ({ ...prev, analytics: value }))}
              />
              <ConsentToggle
                label={copy.advertisingLabel}
                description={copy.advertisingDescription}
                checked={prefs.advertising}
                onChange={(value) => setPrefs((prev) => ({ ...prev, advertising: value }))}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                onClick={handleReject}
              >
                {copy.reject}
              </button>
              <button
                type="button"
                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                onClick={handleSavePrefs}
              >
                {copy.save}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {bannerVisible ? (
        <div className="fixed inset-x-0 bottom-4 z-40 px-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-900">{copy.title}</h2>
              <p className="text-xs text-slate-600 sm:text-sm">{copy.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
                onClick={handleReject}
              >
                {copy.reject}
              </button>
              <button
                type="button"
                className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                onClick={() => setPrefsOpen(true)}
              >
                {copy.preferences}
              </button>
              <button
                type="button"
                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                onClick={handleAccept}
              >
                {copy.accept}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

type ConsentToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (value: boolean) => void;
  locked?: boolean;
  helper?: string;
};

function ConsentToggle({ label, description, checked, onChange, locked = false, helper }: ConsentToggleProps) {
  const id = `consent-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label
      htmlFor={id}
      className={`flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 ${
        locked ? "opacity-80" : ""
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{label}</span>
          {locked && helper ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              {helper}
            </span>
          ) : null}
        </div>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
      <span className="relative inline-flex h-6 w-11 items-center">
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={locked}
          onChange={(event) => onChange?.(event.target.checked)}
          aria-checked={checked}
        />
        <span className="absolute h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-emerald-500 peer-disabled:bg-slate-300" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition peer-checked:translate-x-5 peer-disabled:bg-slate-100" />
      </span>
    </label>
  );
}
