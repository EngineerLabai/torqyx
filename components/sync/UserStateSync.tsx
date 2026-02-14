"use client";

import { useEffect, useRef } from "react";
import { useOptionalAuth } from "@/components/auth/AuthProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LOCALE_STORAGE_KEY, isLocale, type Locale } from "@/utils/locale";
import { RECENTS_EVENT, RECENTS_STORAGE_KEY, readRecents, writeRecents, type RecentToolEntry } from "@/utils/tool-storage";

type SyncState = {
  locale: Locale | null;
  recents: RecentToolEntry[];
};

type UserStateResponse = {
  ok: boolean;
  state: SyncState | null;
};

const SYNC_ENDPOINT = "/api/user-state";
const SYNC_DEBOUNCE_MS = 900;
const MAX_RECENTS = 12;

const normalizeRecents = (recents: RecentToolEntry[]) => {
  const deduped = new Map<string, RecentToolEntry>();
  for (const entry of recents) {
    if (!entry?.toolId || !entry?.lastUsedAt) continue;
    const iso = new Date(entry.lastUsedAt).toISOString();
    const current = deduped.get(entry.toolId);
    if (!current || current.lastUsedAt < iso) {
      deduped.set(entry.toolId, { toolId: entry.toolId, lastUsedAt: iso });
    }
  }

  return [...deduped.values()]
    .sort((a, b) => (a.lastUsedAt > b.lastUsedAt ? -1 : 1))
    .slice(0, MAX_RECENTS);
};

const mergeRecents = (localRecents: RecentToolEntry[], remoteRecents: RecentToolEntry[]) =>
  normalizeRecents([...localRecents, ...remoteRecents]);

const hashState = (state: SyncState) => JSON.stringify({ locale: state.locale, recents: normalizeRecents(state.recents) });

const recentsEqual = (a: RecentToolEntry[], b: RecentToolEntry[]) => hashState({ locale: null, recents: a }) === hashState({ locale: null, recents: b });

const getAuthHeaders = async (user: { getIdToken: () => Promise<string> }) => {
  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export default function UserStateSync() {
  const auth = useOptionalAuth();
  const { locale, setLocale } = useLocale();
  const syncedHashRef = useRef<string>("");
  const debounceRef = useRef<number | null>(null);

  const user = auth?.user ?? null;
  const canSync = Boolean(user && auth?.available && !auth?.loading);

  useEffect(() => {
    if (!canSync || !user) return;
    let active = true;

    const pullState = async () => {
      try {
        const headers = await getAuthHeaders(user);
        const response = await fetch(SYNC_ENDPOINT, { method: "GET", headers, cache: "no-store" });
        if (!response.ok) return;

        const payload = (await response.json()) as UserStateResponse;
        if (!active || !payload?.ok || !payload.state) return;

        const remoteLocale = payload.state.locale;
        if (remoteLocale && remoteLocale !== locale) {
          setLocale(remoteLocale);
        }

        const remoteRecents = normalizeRecents(payload.state.recents ?? []);
        const localRecents = readRecents();
        const mergedRecents = mergeRecents(localRecents, remoteRecents);
        if (!recentsEqual(localRecents, mergedRecents)) {
          writeRecents(mergedRecents);
        }

        syncedHashRef.current = hashState({
          locale: isLocale(remoteLocale) ? remoteLocale : locale,
          recents: mergedRecents,
        });
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[user-state] pull failed", error);
        }
      }
    };

    pullState();
    return () => {
      active = false;
    };
  }, [canSync, user, setLocale, locale]);

  useEffect(() => {
    if (!canSync || !user || typeof window === "undefined") return;

    const pushState = async () => {
      try {
        const recents = normalizeRecents(readRecents());
        const nextState: SyncState = { locale, recents };
        const nextHash = hashState(nextState);
        if (syncedHashRef.current === nextHash) return;

        const headers = await getAuthHeaders(user);
        const response = await fetch(SYNC_ENDPOINT, {
          method: "PUT",
          headers,
          body: JSON.stringify(nextState),
          keepalive: true,
        });
        if (!response.ok) return;
        syncedHashRef.current = nextHash;
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[user-state] push failed", error);
        }
      }
    };

    const schedulePush = () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
      }
      debounceRef.current = window.setTimeout(() => {
        debounceRef.current = null;
        pushState();
      }, SYNC_DEBOUNCE_MS);
    };

    const onStorage = (event: StorageEvent) => {
      if (!event.key) return;
      if (event.key === RECENTS_STORAGE_KEY || event.key === LOCALE_STORAGE_KEY) {
        schedulePush();
      }
    };

    const onRecentsUpdate = () => schedulePush();

    schedulePush();
    window.addEventListener("storage", onStorage);
    window.addEventListener(RECENTS_EVENT, onRecentsUpdate);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(RECENTS_EVENT, onRecentsUpdate);
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [canSync, user, locale]);

  return null;
}
