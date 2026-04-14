import type { ToolDefinition } from "@/tools/_shared/types";
import type { HowToSchemaInput, HowToStepSchema, SoftwareApplicationSchemaInput } from "@/types/structured-data";
import type { Locale } from "@/utils/locale";
import { resolveLocalizedValue } from "@/utils/locale-values";

export type ToolConfig = ToolDefinition<any, any> & {
  id: string;
  title: string;
  description: string;
  inputMeta?: Array<{
    key: string;
    label: string;
    unit?: string;
    type?: "number" | "select";
    min?: number;
    max?: number;
    options?: Array<string | number>;
  }>;
  formula?: any;
  assumptions?: any;
  references?: any;
};

/**
 * ToolConfig'den HowTo step'lerini otomatik çıkarır
 */
function extractHowToSteps(tool: ToolConfig, locale: Locale): HowToStepSchema[] {
  const steps: HowToStepSchema[] = [];

  // Step 1: Girdi parametrelerini belirle
  const requiredInputs = tool.inputMeta?.filter(input =>
    input.type !== "select" || input.options
  ) || [];

  if (requiredInputs.length > 0) {
    const inputLabels = requiredInputs.map(input => {
      const unit = input.unit ? ` (${input.unit})` : "";
      return `${input.label}${unit}`;
    }).join(", ");

    steps.push({
      "@type": "HowToStep",
      position: 1,
      name: locale === "tr" ? "Girdi parametrelerini girin" : "Enter input parameters",
      text: `${locale === "tr" ? "Gerekli parametreleri girin:" : "Enter the required parameters:"} ${inputLabels}`,
    });
  }

  // Step 2: Hesaplama adımı
  steps.push({
    "@type": "HowToStep",
    position: 2,
    name: locale === "tr" ? "Hesaplamayı çalıştırın" : "Run the calculation",
    text: locale === "tr"
      ? "Hesaplama butonuna tıklayarak sonucu elde edin."
      : "Click the calculate button to get the result.",
  });

  // Step 3: Sonuçları yorumla
  steps.push({
    "@type": "HowToStep",
    position: 3,
    name: locale === "tr" ? "Sonuçları inceleyin ve yorumlayın" : "Review and interpret results",
    text: locale === "tr"
      ? "Hesaplanan değerleri kontrol edin ve mühendislik gereksinimlerinize göre değerlendirin."
      : "Check the calculated values and evaluate according to your engineering requirements.",
  });

  // Step 4: Varsayımlar ve limitler (eğer varsa)
  if (tool.assumptions) {
    const assumptions = resolveLocalizedValue(tool.assumptions, locale);
    if (assumptions && assumptions.length > 0) {
      steps.push({
        "@type": "HowToStep",
        position: 4,
        name: locale === "tr" ? "Varsayımları ve limitleri kontrol edin" : "Check assumptions and limits",
        text: `${locale === "tr" ? "Hesaplamanın temel varsayımları:" : "Key assumptions for this calculation:"} ${assumptions.slice(0, 2).join(", ")}`,
      });
    }
  }

  return steps;
}

/**
 * Tool için gerekli araçları çıkarır
 */
function extractHowToTools(tool: ToolConfig, locale: Locale): Array<{ "@type": "HowToTool"; name: string }> {
  const tools: Array<{ "@type": "HowToTool"; name: string }> = [];

  // Referans standartları araç olarak ekle
  if (tool.references) {
    const references = resolveLocalizedValue(tool.references, locale);
    if (references && references.length > 0) {
      references.slice(0, 3).forEach(ref => {
        tools.push({
          "@type": "HowToTool",
          name: ref.title,
        });
      });
    }
  }

  // Eğer hiç referans yoksa genel mühendislik araçları ekle
  if (tools.length === 0) {
    const defaultTools = locale === "tr"
      ? ["ISO/DIN/VDI standartları", "Mühendislik hesap makinesi", "Teknik çizim araçları"]
      : ["ISO/DIN/VDI standards", "Engineering calculator", "Technical drawing tools"];

    defaultTools.forEach(toolName => {
      tools.push({
        "@type": "HowToTool",
        name: toolName,
      });
    });
  }

  return tools;
}

/**
 * Tool için SoftwareApplication schema oluşturur
 */
function buildSoftwareApplicationSchema(
  tool: ToolConfig,
  locale: Locale,
  baseUrl: string
): SoftwareApplicationSchemaInput {
  const toolUrl = `${baseUrl}/tools/${tool.id}`;

  return {
    name: tool.title,
    description: tool.description,
    url: toolUrl,
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Web Browser",
    inLanguage: locale,
    featureList: [
      "Deterministic engineering calculations",
      "Standards-based validation",
      "Real-time result visualization",
      "Export capabilities",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: "Engineering Software",
    },
  };
}

/**
 * HowTo JSON-LD schema üretir
 */
export function buildHowToSchema(
  tool: ToolConfig,
  locale: Locale,
  baseUrl: string = "https://aiengineerslab.com"
): HowToSchemaInput & { application: SoftwareApplicationSchemaInput } {
  const toolUrl = `${baseUrl}/tools/${tool.id}`;

  const steps = extractHowToSteps(tool, locale);
  const tools = extractHowToTools(tool, locale);
  const application = buildSoftwareApplicationSchema(tool, locale, baseUrl);

  return {
    name: tool.title,
    description: tool.description,
    url: toolUrl,
    inLanguage: locale,
    step: steps,
    tool: tools,
    application,
  };
}

/**
 * Dil bazlı HowTo schema'ları üretir
 */
export function buildLocalizedHowToSchemas(
  tool: ToolConfig,
  baseUrl: string = "https://aiengineerslab.com"
): Record<Locale, HowToSchemaInput & { application: SoftwareApplicationSchemaInput }> {
  return {
    tr: buildHowToSchema(tool, "tr", baseUrl),
    en: buildHowToSchema(tool, "en", baseUrl),
  };
}