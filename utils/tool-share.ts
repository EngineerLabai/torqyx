export type ShareableValue = string | number;
export type ShareableState = Record<string, ShareableValue>;

const hasWindow = typeof window !== "undefined";

const encodeBase64Url = (value: string) => {
  if (!hasWindow && typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }

  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const decodeBase64Url = (value: string) => {
  if (!value) return "";
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  if (!hasWindow && typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
};

export const sanitizeToolState = (input: Record<string, unknown>): ShareableState => {
  const output: ShareableState = {};
  Object.entries(input).forEach(([key, value]) => {
    if (typeof value === "string" || typeof value === "number") {
      output[key] = value;
    }
  });
  return output;
};

export const encodeToolState = (input: Record<string, unknown>) => {
  const payload = sanitizeToolState(input);
  if (Object.keys(payload).length === 0) return "";
  try {
    return encodeBase64Url(JSON.stringify(payload));
  } catch {
    return "";
  }
};

export const decodeToolState = <T extends Record<string, unknown>>(value: string | null): T | null => {
  if (!value) return null;
  try {
    const decoded = decodeBase64Url(value);
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
};

export const buildShareUrl = (pathname: string, state: Record<string, unknown>) => {
  const encoded = encodeToolState(state);
  if (!encoded) return pathname;
  const separator = pathname.includes("?") ? "&" : "?";
  return `${pathname}${separator}input=${encoded}`;
};
