export type JsonLdContext = "https://schema.org";

export type StructuredDataType = "SoftwareApplication" | "WebApplication";

export type OfferSchema = {
  "@type"?: "Offer";
  name?: string;
  description?: string;
  url?: string;
  price?: string;
  priceCurrency?: string;
  category?: string;
  availability?: string;
};

export type SoftwareApplicationSchemaInput = {
  name: string;
  description?: string;
  url: string;
  applicationCategory?: string;
  applicationSubCategory?: string;
  operatingSystem: string;
  inLanguage?: string;
  featureList?: string[];
  offers?: OfferSchema | OfferSchema[];
};

export type WebApplicationSchemaInput = SoftwareApplicationSchemaInput & {
  browserRequirements?: string;
};

export type StructuredDataByType = {
  SoftwareApplication: SoftwareApplicationSchemaInput;
  WebApplication: WebApplicationSchemaInput;
};
