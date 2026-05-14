import { ImageResponse } from "next/og";
import { getBrandCopy } from "@/config/brand";
import type { Locale } from "@/utils/locale";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";
export const revalidate = 86400;

const isLocale = (value: string | null): value is Locale => value === "tr" || value === "en";

const cleanText = (value: string | null, fallback: string, maxLength: number) => {
  const normalized = (value ?? "").replace(/\s+/g, " ").trim() || fallback;
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1).trimEnd()}...` : normalized;
};

const cleanPath = (value: string | null) => {
  const normalized = (value ?? "").replace(/\s+/g, "").trim();
  if (!normalized || normalized.includes("://")) return "";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const localeParam = searchParams.get("locale");
  const locale: Locale = isLocale(localeParam) ? localeParam : "tr";
  const brandContent = getBrandCopy(locale);
  const siteLabel = new URL(req.url).host;
  const title = cleanText(searchParams.get("title"), brandContent.tagline, 96);
  const subtitle = cleanText(searchParams.get("subtitle"), brandContent.siteName, 132);
  const pathLabel = cleanPath(searchParams.get("path"));

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.18), transparent 45%), radial-gradient(circle at 80% 0%, rgba(14, 116, 144, 0.22), transparent 40%)",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>
          {brandContent.siteName}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 24, opacity: 0.8, lineHeight: 1.35 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 32, fontSize: 18, opacity: 0.65 }}>
          <span>{siteLabel}</span>
          {pathLabel ? <span>{pathLabel}</span> : null}
        </div>
      </div>
    ),
    size,
  );

  try {
    image.headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
  } catch (err) {
    console.warn("Could not set Cache-Control header on ImageResponse:", err);
  }

  return image;
}
