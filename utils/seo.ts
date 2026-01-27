export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiengineerslab.com";

export const buildCanonical = (path: string) => {
  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return undefined;
  }
};
