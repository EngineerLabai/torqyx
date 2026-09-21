import SoftwareApplicationJsonLd from "@/components/seo/SoftwareApplicationJsonLd";
import { getBrandCopy } from "@/config/brand";
import type { OfferSchema } from "@/types/structured-data";
import { SITE_URL } from "@/utils/seo";

const brandCopy = getBrandCopy("en");
const toolsUrl = new URL("/tools", SITE_URL).toString();

const offers: OfferSchema[] = [
  {
    "@type": "Offer",
    name: "Free engineering calculators",
    description: "Open access to engineering calculators.",
    url: toolsUrl,
    price: "0",
    priceCurrency: "USD",
    category: "Free",
  },
];

export default function Head() {
  return (
    <>
      <SoftwareApplicationJsonLd
        id="platform-software-application-jsonld"
        data={{
          name: brandCopy.siteName,
          description: brandCopy.tagline,
          url: SITE_URL,
          applicationCategory: "UtilitiesApplication",
          applicationSubCategory: "Engineering calculation utility",
          operatingSystem: "Web",
          offers,
        }}
      />
    </>
  );
}
