import type { ReportCalculationStep, ReportData } from "@/lib/pdf/types";

/**
 * Hesaplama sonuçlarını PDF rapor formatına dönüştüren interface
 */
export interface ToReportDataConverter<TInput, TResult> {
  (input: TInput, result: TResult, toolId: string, toolName: string, unitSystem: 'SI' | 'Imperial' | 'Mixed'): ReportData;
}

type ResultWithAuditTrail = {
  auditTrail?: ReportCalculationStep[] | (() => ReportCalculationStep[]);
};

const getCalculationSteps = (result: unknown) => {
  const auditTrail = (result as ResultWithAuditTrail | null)?.auditTrail;
  return typeof auditTrail === "function" ? auditTrail() : auditTrail;
};

/**
 * Yaygın kullanılan yardımcı fonksiyonlar
 */
export const ReportHelpers = {
  /**
   * Parametreleri ReportParameter formatına dönüştür
   */
  createParameter: (
    label: string,
    value: string | number,
    unit?: string
  ): ReportData["parameters"][0] => ({
    label,
    value,
    unit,
  }),

  /**
   * Formülleri ReportFormula formatına dönüştür
   */
  createFormula: (
    label: string,
    latex: string,
    description?: string
  ): ReportData["formulas"][0] => ({
    label,
    latex,
    description,
  }),

  /**
   * Sonuçları ReportResult formatına dönüştür
   */
  createResult: (
    label: string,
    value: string | number,
    unit?: string,
    status: ReportData["results"][number]["status"] = "info"
  ): ReportData["results"][number] => ({
    label,
    value,
    unit,
    status,
  }),

  /**
   * Standartları ReportStandard formatına dönüştür
   */
  createStandard: (
    code: string,
    title: string,
    url?: string
  ): ReportData["standards"][0] => ({
    code,
    title,
    url,
  }),

  createCalculationStep: (
    id: string,
    name: string,
    formula: string,
    variables: ReportData["parameters"],
    result: string | number,
    unit: string,
    standard?: string,
    status: ReportData["results"][number]["status"] = "info"
  ): ReportCalculationStep => ({
    id,
    name,
    formula,
    variables,
    result,
    unit,
    standard,
    status,
  }),

  /**
   * Güvenlik faktörlerini kontrol et ve durum belirle
   */
  getSafetyStatus: (value: number, minRequired: number): ReportData["results"][0]["status"] => {
    if (value >= minRequired) return "pass";
    if (value >= minRequired * 0.9) return "warning";
    return "fail";
  },

  /**
   * Gerilim/stress değerlerini kontrol et
   */
  getStressStatus: (
    actual: number,
    allowable: number
  ): ReportData["results"][0]["status"] => {
    const ratio = actual / allowable;
    if (ratio <= 0.8) return "pass";
    if (ratio <= 1.0) return "warning";
    return "fail";
  },
};

/**
 * Bolt Calculator PDF converter
 */
export const createBoltCalculatorReport: ToReportDataConverter<
  { d: number; P: number; grade: string; friction: string; preloadPercent: number },
  { stressArea: number; yieldStrength: number; ultimateStrength: number; preloadForce: number; torque: number; safetyFactor: number }
> = (input, result, toolId, toolName, unitSystem) => {
  return {
    toolId,
    toolName,
    calculationDate: new Date().toISOString(),
    unitSystem,
    parameters: [
      ReportHelpers.createParameter("Nominal Çap", input.d, "mm"),
      ReportHelpers.createParameter("Diş Adımı", input.P, "mm"),
      ReportHelpers.createParameter("Kalite Sınıfı", input.grade),
      ReportHelpers.createParameter("Sürtünme Durumu", input.friction),
      ReportHelpers.createParameter("Ön Yük Seviyesi", input.preloadPercent, "%"),
    ],
    formulas: [
      ReportHelpers.createFormula(
        "Kesit Alanı",
        "A_s = \\frac{\\pi}{4} \\times (d - 0.9382 \\times P)^2",
        "ISO 898-1 standardına göre etkin kesit alanı"
      ),
      ReportHelpers.createFormula(
        "Ön Yük Kuvveti",
        "F_v = 0.7 \\times A_s \\times R_e \\times \\frac{percent}{100}",
        "Akma dayanımının %70'i alınarak ön yük hesaplanır"
      ),
      ReportHelpers.createFormula(
        "Tork Hesabı",
        "T = K \\times F_v \\times \\frac{d}{2}",
        "Sürtünme katsayısı ile tork hesaplaması"
      ),
    ],
    results: [
      ReportHelpers.createResult("Kesit Alanı", result.stressArea, "mm²"),
      ReportHelpers.createResult("Akma Dayanımı", result.yieldStrength, "MPa"),
      ReportHelpers.createResult("Kırılma Dayanımı", result.ultimateStrength, "MPa"),
      ReportHelpers.createResult("Ön Yük Kuvveti", result.preloadForce, "N"),
      ReportHelpers.createResult("Tork", result.torque, "Nm"),
      ReportHelpers.createResult(
        "Güvenlik Faktörü",
        result.safetyFactor,
        "",
        ReportHelpers.getSafetyStatus(result.safetyFactor, 1.2)
      ),
    ],
    calculationSteps: getCalculationSteps(result),
    standards: [
      ReportHelpers.createStandard(
        "ISO 898-1",
        "Mechanical properties of fasteners made of carbon steel and alloy steel",
        "https://www.iso.org/standard/40453.html"
      ),
      ReportHelpers.createStandard(
        "ISO 68-1",
        "ISO general purpose screw threads — Basic profile — Part 1: Metric screw threads"
      ),
      ReportHelpers.createStandard(
        "VDI 2230",
        "Systematic calculation of high duty bolted joints"
      ),
    ],
  };
};

/**
 * Tool-specific PDF converters
 */
type AnyReportConverter = ToReportDataConverter<unknown, unknown>;

export const toolPdfConverters: Record<string, AnyReportConverter> = {
  "bolt-calculator": createBoltCalculatorReport as AnyReportConverter,
};

/**
 * Generic PDF converter - tool-specific converter yoksa kullanılır
 */
export const createGenericReport: ToReportDataConverter<Record<string, unknown>, Record<string, unknown>> = (
  input,
  result,
  toolId,
  toolName,
  unitSystem
) => {
  return {
    toolId,
    toolName,
    calculationDate: new Date().toISOString(),
    unitSystem,
    parameters: Object.entries(input).map(([key, value]) => ({
      label: key,
      value: String(value),
    })),
    formulas: [],
    results: Object.entries(result).map(([key, value]) => ({
      label: key,
      value: String(value),
      status: "info" as const,
    })),
    calculationSteps: getCalculationSteps(result),
    standards: [],
  };
};

/**
 * Tool ID'ye göre uygun converter'ı döndürür
 */
export function getToolPdfConverter<TInput, TResult>(toolId: string): ToReportDataConverter<TInput, TResult> {
  return (toolPdfConverters[toolId] || createGenericReport) as ToReportDataConverter<TInput, TResult>;
}
