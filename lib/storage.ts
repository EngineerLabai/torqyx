const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function getJSON<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON<T>(key: string, value: T) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export function removeKey(key: string) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}

export function listKeys(prefix = ""): string[] {
  if (!canUseStorage()) return [];

  const keys: string[] = [];

  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      if (!prefix || key.startsWith(prefix)) {
        keys.push(key);
      }
    }
  } catch {
    return [];
  }

  return keys.sort();
}
