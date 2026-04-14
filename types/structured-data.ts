export type JsonLdContext = "https://schema.org";

export type StructuredDataType = "SoftwareApplication" | "WebApplication" | "FAQPage" | "HowTo";

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
  applicationCategory: string;
  operatingSystem: string;
  inLanguage?: string;
  featureList?: string[];
  offers?: OfferSchema | OfferSchema[];
};

export type WebApplicationSchemaInput = SoftwareApplicationSchemaInput & {
  browserRequirements?: string;
};

export type FaqQuestionSchema = {
  "@type"?: "Question";
  name: string;
  acceptedAnswer: {
    "@type"?: "Answer";
    text: string;
  };
};

export type FAQPageSchemaInput = {
  inLanguage?: string;
  mainEntity: FaqQuestionSchema[];
};

export type HowToStepSchema = {
  "@type"?: "HowToStep";
  position?: number;
  name: string;
  text?: string;
  url?: string;
};

export type HowToToolSchema = {
  "@type"?: "HowToTool";
  name: string;
};

export type HowToSchemaInput = {
  name: string;
  description?: string;
  url?: string;
  inLanguage?: string;
  step: HowToStepSchema[];
  tool?: HowToToolSchema[];
};

export type StructuredDataByType = {
  SoftwareApplication: SoftwareApplicationSchemaInput;
  WebApplication: WebApplicationSchemaInput;
  FAQPage: FAQPageSchemaInput;
  HowTo: HowToSchemaInput;
};

