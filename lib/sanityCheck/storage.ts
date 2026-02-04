import { LabSessionSchema, type LabSession } from "@/lib/sanityCheck/types";

const LAST_SESSION_KEY = "aielab:sanity_check:last_session";
const SAVED_SESSIONS_KEY = "aielab:sanity_check:saved_sessions";

export type SavedSession = {
  id: string;
  title: string;
  updatedAt: string;
  session: LabSession;
};

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const readLastSession = (): LabSession | null => {
  if (!canUseStorage()) return null;
  const parsed = safeParse<unknown>(window.localStorage.getItem(LAST_SESSION_KEY), null);
  if (!parsed) return null;
  const result = LabSessionSchema.safeParse(parsed);
  return result.success ? result.data : null;
};

export const writeLastSession = (session: LabSession) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(session));
  } catch {
    return;
  }
};

export const readSavedSessions = (): SavedSession[] => {
  if (!canUseStorage()) return [];
  const parsed = safeParse<unknown>(window.localStorage.getItem(SAVED_SESSIONS_KEY), []);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => entry as SavedSession)
    .filter((entry) => typeof entry.id === "string" && typeof entry.title === "string" && !!entry.session)
    .slice(0, 25);
};

export const writeSavedSessions = (sessions: SavedSession[]) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    return;
  }
};

export const saveSession = (session: LabSession, title: string, id?: string) => {
  const now = new Date().toISOString();
  const entry: SavedSession = {
    id: id ?? `session-${Date.now()}`,
    title: title || "Untitled",
    updatedAt: now,
    session,
  };

  const current = readSavedSessions();
  const next = [entry, ...current.filter((item) => item.id !== entry.id)].slice(0, 25);
  writeSavedSessions(next);
  return entry;
};

export const deleteSavedSession = (id: string) => {
  const next = readSavedSessions().filter((entry) => entry.id !== id);
  writeSavedSessions(next);
  return next;
};
