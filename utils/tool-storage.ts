export const FAVORITES_STORAGE_KEY = "aielab:favorites";
export const RECENTS_STORAGE_KEY = "aielab:recents";
export const FAVORITES_EVENT = "aielab:favorites-updated";
export const RECENTS_EVENT = "aielab:recents-updated";

export type RecentToolEntry = {
  toolId: string;
  lastUsedAt: string;
};

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const safeGetItem = (key: string) => {
  if (!canUseStorage()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
};

export const readFavorites = (): string[] => {
  if (!canUseStorage()) return [];
  const parsed = safeParse<unknown>(safeGetItem(FAVORITES_STORAGE_KEY), []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is string => typeof item === "string");
};

export const writeFavorites = (favorites: string[]) => {
  if (!canUseStorage()) return;
  const unique = Array.from(new Set(favorites.filter((id) => typeof id === "string" && id.trim().length > 0)));
  safeSetItem(FAVORITES_STORAGE_KEY, JSON.stringify(unique));
  window.dispatchEvent(new Event(FAVORITES_EVENT));
};

export const toggleFavorite = (toolId: string) => {
  if (!toolId) return readFavorites();
  const current = readFavorites();
  const next = current.includes(toolId) ? current.filter((id) => id !== toolId) : [toolId, ...current];
  writeFavorites(next);
  return next;
};

export const readRecents = (): RecentToolEntry[] => {
  if (!canUseStorage()) return [];
  const parsed = safeParse<unknown>(safeGetItem(RECENTS_STORAGE_KEY), []);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (entry): entry is RecentToolEntry =>
        Boolean(entry) &&
        typeof entry === "object" &&
        "toolId" in entry &&
        "lastUsedAt" in entry &&
        typeof (entry as { toolId?: unknown }).toolId === "string" &&
        typeof (entry as { lastUsedAt?: unknown }).lastUsedAt === "string",
    )
    .slice(0, 12);
};

export const writeRecents = (recents: RecentToolEntry[]) => {
  if (!canUseStorage()) return;
  const sanitized = recents.filter((entry) => entry.toolId && entry.lastUsedAt).slice(0, 12);
  safeSetItem(RECENTS_STORAGE_KEY, JSON.stringify(sanitized));
  window.dispatchEvent(new Event(RECENTS_EVENT));
};

export const addRecent = (toolId: string) => {
  if (!toolId) return;
  const now = new Date().toISOString();
  const current = readRecents().filter((entry) => entry.toolId !== toolId);
  const next = [{ toolId, lastUsedAt: now }, ...current].slice(0, 12);
  writeRecents(next);
};
