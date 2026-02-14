import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { Locale } from "@/utils/locale";

export type ToolDocRelatedItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readingTimeMinutes: number;
};

export type ToolDocExampleItem = {
  title: string;
  description?: string;
  inputs?: Record<string, string>;
  outputs?: Record<string, string>;
  notes?: string[];
};

export type ToolDocMetaInfo = {
  version?: string | null;
  lastUpdated?: string | null;
  lastTranslatedAt?: string | null;
};

export type ToolDocStandard = {
  version: string;
  lastUpdated: string;
  howTo: string[];
  formula: string;
  examples: ToolDocExampleItem[];
  references: Array<{ title: string; note?: string; href?: string }>;
  commonMistakes: string[];
  assumptions?: string[];
};

export type ToolDocsResponse = {
  tool: { id: string; title: string; tags: string[] } | null;
  hasDocs: boolean;
  requestedLocale?: Locale;
  docsLocale?: Locale | null;
  metaInfo?: ToolDocMetaInfo | null;
  standard?: ToolDocStandard | null;
  explanation: MDXRemoteSerializeResult | null;
  examples:
    | { kind: "mdx"; source: MDXRemoteSerializeResult }
    | { kind: "json"; items: ToolDocExampleItem[] }
    | null;
  related: { guides: ToolDocRelatedItem[]; glossary: ToolDocRelatedItem[] };
};
