import manifest from "./manifest.json";
import threadsMetric from "./threads-metric.json";
import boltGrades from "./bolt-grades.json";
import steelEquivalents from "./steel-equivalents.json";
import stainlessEquivalents from "./stainless-equivalents.json";
import fitSummary from "./fit-summary.json";
import basisCheatSheet from "./basis-cheat-sheet.json";
import pipeRoughness from "./pipe-roughness.json";
import minorLosses from "./minor-losses.json";

export type LocalizedText = { tr: string; en: string };

export type StandardsTable = {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  columns: Array<{ key: string; label: LocalizedText }>;
  rows: Array<Record<string, unknown>>;
  note?: LocalizedText;
};

export type StandardsCategory = {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  tables: string[];
  sources: {
    tr: { text: string; links: Array<{ label: string; href: string }> };
    en: { text: string; links: Array<{ label: string; href: string }> };
  };
};

export type StandardsManifest = {
  categories: StandardsCategory[];
};

export const standardsManifest = manifest as StandardsManifest;

export const standardsTables: Record<string, StandardsTable> = {
  "threads-metric.json": threadsMetric as StandardsTable,
  "bolt-grades.json": boltGrades as StandardsTable,
  "steel-equivalents.json": steelEquivalents as StandardsTable,
  "stainless-equivalents.json": stainlessEquivalents as StandardsTable,
  "fit-summary.json": fitSummary as StandardsTable,
  "basis-cheat-sheet.json": basisCheatSheet as StandardsTable,
  "pipe-roughness.json": pipeRoughness as StandardsTable,
  "minor-losses.json": minorLosses as StandardsTable,
};

export const getStandardsCategory = (slug: string) =>
  standardsManifest.categories.find((category) => category.slug === slug) ?? null;

export const getTablesForCategory = (category: StandardsCategory) =>
  category.tables.map((tableId) => standardsTables[tableId]).filter(Boolean);
