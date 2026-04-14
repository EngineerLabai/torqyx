export type ShareableValue = string | number;
export type ShareableState = Record<string, ShareableValue>;

// Kısa parametre isimleri mapping (MOD 1 için)
const SHORT_PARAM_NAMES: Record<string, Record<string, string>> = {
  "bolt-calculator": {
    presetId: "p",
    d: "d",
    P: "p",
    grade: "g",
    friction: "f",
    preloadPercent: "l",
  },
  "shaft-torsion": {
    diameter: "d",
    length: "l",
    material: "m",
    torque: "t",
    safetyFactor: "s",
  },
  "pipe-pressure-loss": {
    flowRate: "q",
    pipeDiameter: "d",
    pipeLength: "l",
    pipeMaterial: "m",
    fluidType: "f",
    temperature: "t",
  },
  // Diğer araçlar için mapping eklenebilir
};

const REVERSE_SHORT_NAMES: Record<string, Record<string, string>> = {};
Object.entries(SHORT_PARAM_NAMES).forEach(([toolId, mapping]) => {
  REVERSE_SHORT_NAMES[toolId] = {};
  Object.entries(mapping).forEach(([long, short]) => {
    REVERSE_SHORT_NAMES[toolId][short] = long;
  });
});

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

// Kısa parametre isimlerini kullanarak encode (MOD 1)
export const encodeToolStateShort = (toolId: string, input: Record<string, unknown>) => {
  const payload = sanitizeToolState(input);
  if (Object.keys(payload).length === 0) return "";

  const mapping = SHORT_PARAM_NAMES[toolId] || {};
  const shortPayload: ShareableState = {};

  Object.entries(payload).forEach(([key, value]) => {
    const shortKey = mapping[key] || key;
    shortPayload[shortKey] = value;
  });

  try {
    return encodeBase64Url(JSON.stringify(shortPayload));
  } catch {
    return "";
  }
};

// Kısa parametre isimlerinden decode (MOD 1)
export const decodeToolStateShort = <T extends Record<string, unknown>>(
  toolId: string,
  value: string | null
): T | null => {
  if (!value) return null;

  try {
    const decoded = decodeBase64Url(value);
    const shortPayload = JSON.parse(decoded) as ShareableState;

    const reverseMapping = REVERSE_SHORT_NAMES[toolId] || {};
    const fullPayload: ShareableState = {};

    Object.entries(shortPayload).forEach(([shortKey, value]) => {
      const fullKey = reverseMapping[shortKey] || shortKey;
      fullPayload[fullKey] = value;
    });

    return fullPayload as T;
  } catch {
    return null;
  }
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

// MOD 1: Kısa URL ile paylaşım
export const buildShareUrlShort = (toolId: string, pathname: string, state: Record<string, unknown>) => {
  const encoded = encodeToolStateShort(toolId, state);
  if (!encoded) return pathname;
  const separator = pathname.includes("?") ? "&" : "?";
  return `${pathname}${separator}s=${encoded}`;
};

// Eski format için geriye uyumluluk
export const buildShareUrl = (pathname: string, state: Record<string, unknown>) => {
  const encoded = encodeToolState(state);
  if (!encoded) return pathname;
  const separator = pathname.includes("?") ? "&" : "?";
  return `${pathname}${separator}input=${encoded}`;
};
