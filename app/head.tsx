import SoftwareApplicationJsonLd from "@/components/seo/SoftwareApplicationJsonLd";
import { getBrandCopy } from "@/config/brand";
import type { OfferSchema } from "@/types/structured-data";
import { SITE_URL } from "@/utils/seo";

const brandCopy = getBrandCopy("en");
const pricingUrl = new URL("/pricing", SITE_URL).toString();
const HOME_LCP_IMAGE = "/images/hero-banner.webp";

const offers: OfferSchema[] = [
  {
    "@type": "Offer",
    name: "Free Plan",
    description: "Starter access for engineering calculators.",
    url: pricingUrl,
    price: "0",
    priceCurrency: "USD",
    category: "Free",
  },
  {
    "@type": "Offer",
    name: "Premium Plan",
    description: "Expanded limits, exports, and premium workflows.",
    url: pricingUrl,
    category: "Paid",
  },
];

export default function Head() {
  return (
    <>
      <link rel="preload" as="image" href={HOME_LCP_IMAGE} fetchPriority="high" />
      <SoftwareApplicationJsonLd
        id="platform-software-application-jsonld"
        data={{
          name: brandCopy.siteName,
          description: brandCopy.tagline,
          url: SITE_URL,
          applicationCategory: "EngineeringApplication",
          operatingSystem: "Web",
          offers,
        }}
      />
    </>
  );
}
