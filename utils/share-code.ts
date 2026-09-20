import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 6);

export const generateShareCode = () => {
  return nanoid();
};

export const calculateExpiration = (hasExtendedRetention: boolean) => {
  const now = new Date();
  if (hasExtendedRetention) {
    return null;
  }

  const expiration = new Date(now);
  expiration.setDate(now.getDate() + 7);
  return expiration;
};

export const buildShortShareUrl = (code: string, baseUrl?: string) => {
  const resolvedBaseUrl =
    baseUrl ??
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://torqyx.com");
  return `${resolvedBaseUrl.replace(/\/$/, "")}/s/${code}`;
};
