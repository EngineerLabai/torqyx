const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const stableSerialize = (value: unknown): string => {
  if (value === null) return "null";

  const valueType = typeof value;
  if (valueType === "number" || valueType === "boolean") {
    return JSON.stringify(value);
  }

  if (valueType === "string") {
    return JSON.stringify(value);
  }

  if (valueType === "undefined") {
    return "\"__undefined__\"";
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
  }

  if (isPlainObject(value)) {
    const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
    const entries = keys.map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`);
    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(String(value));
};

export const stableHash = (value: unknown): string => {
  const serialized = stableSerialize(value);
  let hash = 5381;

  for (let index = 0; index < serialized.length; index += 1) {
    hash = ((hash << 5) + hash) ^ serialized.charCodeAt(index);
  }

  const unsignedHash = hash >>> 0;
  return unsignedHash.toString(16).padStart(8, "0");
};
