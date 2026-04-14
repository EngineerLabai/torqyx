export interface ReportParameter {
  label: string;
  value: string | number;
  unit?: string;
}

export interface ReportFormula {
  label: string;
  latex: string;
  description?: string;
}

export interface ReportResult {
  label: string;
  value: string | number;
  unit?: string;
  status: "pass" | "fail" | "warning" | "info";
}

export interface ReportCalculationStep {
  id: string;
  name: string;
  formula: string;
  variables: ReportParameter[];
  result: string | number;
  unit: string;
  standard?: string;
  status: ReportResult["status"];
}

export interface ReportStandard {
  code: string;
  title: string;
  url?: string;
}

export interface ReportData {
  toolName: string;
  toolId: string;
  parameters: ReportParameter[];
  formulas: ReportFormula[];
  results: ReportResult[];
  standards: ReportStandard[];
  calculationSteps?: ReportCalculationStep[];
  calculationDate: string;
  unitSystem: 'SI' | 'Imperial' | 'Mixed'; // Unit system used for the report
  notes?: string;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}