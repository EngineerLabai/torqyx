export type ConsentStatus = "accept" | "reject" | "custom";

export type ConsentPrefs = {
  analytics: boolean;
  advertising: boolean;
};

export const CONSENT_STORAGE_KEY = "ael_consent";
export const CONSENT_PREFS_KEY = "ael_consent_prefs";
export const CONSENT_COOKIE = "ael_consent";

const isConsentStatus = (value: string | null | undefined): value is ConsentStatus =>
  value === "accept" || value === "reject" || value === "custom";

const parseCookieValue = (cookie: string, key: string) => {
  if (!cookie) return null;
  const parts = cookie.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (part.startsWith(`${key}=`)) {
      return decodeURIComponent(part.slice(key.length + 1));
    }
  }
  return null;
};

export const readConsentStatus = (): ConsentStatus | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (isConsentStatus(stored)) {
      return stored;
    }
  } catch {
    // ignore storage errors
  }

  const cookieValue = parseCookieValue(document.cookie ?? "", CONSENT_COOKIE);
  return isConsentStatus(cookieValue) ? cookieValue : null;
};

export const readConsentPrefs = (): ConsentPrefs | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_PREFS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentPrefs> | null;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
    };
  } catch {
    return null;
  }
};

export const resolveConsentPrefs = (
  status: ConsentStatus | null,
  stored: ConsentPrefs | null = null,
): ConsentPrefs => {
  if (status === "accept") {
    return { analytics: true, advertising: true };
  }
  if (status === "reject") {
    return { analytics: false, advertising: false };
  }
  if (status === "custom") {
    return stored ?? { analytics: false, advertising: false };
  }
  return { analytics: false, advertising: false };
};

export const isAnalyticsAllowed = (): boolean => {
  const status = readConsentStatus();
  if (!status) return false;
  const prefs = resolveConsentPrefs(status, readConsentPrefs());
  return prefs.analytics;
};

export const isAdvertisingAllowed = (): boolean => {
  const status = readConsentStatus();
  if (!status) return false;
  const prefs = resolveConsentPrefs(status, readConsentPrefs());
  return prefs.advertising;
};
