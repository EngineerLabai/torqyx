import { customAlphabet } from "nanoid";

// Kısa kod üretme (MOD 2 için)
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 6);

export const generateShareCode = () => {
  return nanoid();
};

// TTL hesaplaması
export const calculateExpiration = (isPremium: boolean) => {
  const now = new Date();
  if (isPremium) {
    // Premium: sınırsız (null döner)
    return null;
  } else {
    // Ücretsiz: 7 gün
    const expiration = new Date(now);
    expiration.setDate(now.getDate() + 7);
    return expiration;
  }
};

// Kısa link URL oluşturma
export const buildShortShareUrl = (code: string, baseUrl?: string) => {
  const resolvedBaseUrl =
    baseUrl ??
    (typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://torqyx.com");
  return `${resolvedBaseUrl.replace(/\/$/, "")}/s/${code}`;
};
