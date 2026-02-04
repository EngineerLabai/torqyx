import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { LabSessionSchema, type LabSession } from "@/lib/sanityCheck/types";

export const encodeSession = (session: LabSession) => {
  try {
    const json = JSON.stringify(session);
    return compressToEncodedURIComponent(json);
  } catch {
    return "";
  }
};

export const decodeSession = (value: string): LabSession | null => {
  if (!value) return null;
  try {
    const json = decompressFromEncodedURIComponent(value);
    if (!json) return null;
    const parsed = JSON.parse(json);
    const result = LabSessionSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};
