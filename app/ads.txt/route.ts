import { ADSENSE_PUBLISHER_ID } from "@/config/adsense";

export const dynamic = "force-static";

export function GET() {
  return new Response(`google.com, ${ADSENSE_PUBLISHER_ID.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
