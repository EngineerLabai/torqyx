import { ImageResponse } from "next/og";
import { getBrandCopy } from "@/config/brand";
import type { Locale } from "@/utils/locale";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = (searchParams.get("locale") as Locale | null) || "tr";
  const brandContent = getBrandCopy(locale);

  return new ImageResponse(
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
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>{brandContent.tagline}</div>
          <div style={{ fontSize: 24, opacity: 0.8 }}>{brandContent.siteName}</div>
        </div>
        <div style={{ fontSize: 18, opacity: 0.6 }}>aiengineerslab.com</div>
      </div>
    ),
    size,
  );
}
