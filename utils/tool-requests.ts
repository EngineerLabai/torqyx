export const REQUESTS_STORAGE_KEY = "aielab:requests";
export const REQUESTS_EVENT = "aielab:requests-updated";

export type ToolRequestData = {
  problem: string;
  inputs: string;
  outputs: string;
  standards: string;
  examples: string;
};

export type ToolRequestEntry = {
  id: string;
  createdAt: string;
  data: ToolRequestData;
};

const MAX_REQUESTS = 20;

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

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const readToolRequests = (): ToolRequestEntry[] => {
  const parsed = safeParse<unknown>(safeGetItem(REQUESTS_STORAGE_KEY), []);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (entry): entry is ToolRequestEntry =>
        Boolean(entry) &&
        typeof entry === "object" &&
        "id" in entry &&
        "createdAt" in entry &&
        "data" in entry,
    )
    .slice(0, MAX_REQUESTS);
};

export const writeToolRequests = (entries: ToolRequestEntry[]) => {
  safeSetItem(REQUESTS_STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_REQUESTS)));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(REQUESTS_EVENT));
  }
};

export const addToolRequest = (data: ToolRequestData): ToolRequestEntry => {
  const entry: ToolRequestEntry = {
    id: `req_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    data,
  };
  const current = readToolRequests();
  writeToolRequests([entry, ...current]);
  return entry;
};
