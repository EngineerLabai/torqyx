import type { ComponentType } from "react";
import type { LocalizedValue } from "@/utils/locale-values";

export type ToolReference = {
  title: string;
  url?: string;
  note?: string;
};

export type ToolInputMeta = {
  key: string;
  label: string;
  unit?: string;
  type?: "number" | "select";
  min?: number;
  max?: number;
  options?: Array<string | number>;
};

export type ToolInputProps<TInput> = {
  input: TInput;
  onChange: (next: TInput) => void;
  errors?: Record<string, string>;
};

export type ToolResultProps<TResult> = {
  result: TResult;
};

export type ToolVisualizationProps<TInput, TResult> = {
  input: TInput;
  result: TResult;
};

export type ToolCompareScenario<TInput, TResult> = {
  id: "a" | "b" | "c";
  title: "A" | "B" | "C";
  label?: string;
  input: TInput;
  result: TResult;
  color?: string;
};

export type ToolCompareVisualizationProps<TInput, TResult> = {
  scenarios: ToolCompareScenario<TInput, TResult>[];
};

export type ToolCompareMetric<TInput, TResult> = {
  key: string;
  label: string;
  getValue: (result: TResult, input: TInput) => string | number | boolean | null | undefined;
};

export type ToolDefinition<TInput, TResult> = {
  id: string;
  title: string;
  description: string;
  initialInput: TInput;
  calculate: (input: TInput) => TResult;
  InputSection: ComponentType<ToolInputProps<TInput>>;
  ResultSection: ComponentType<ToolResultProps<TResult>>;
  VisualizationSection: ComponentType<ToolVisualizationProps<TInput, TResult>>;
  compareMetrics?: ToolCompareMetric<TInput, TResult>[];
  CompareVisualizationSection?: ComponentType<ToolCompareVisualizationProps<TInput, TResult>>;
  formula?: LocalizedValue<string>;
  assumptions?: LocalizedValue<string[]>;
  references?: LocalizedValue<ToolReference[]>;
  inputMeta?: ToolInputMeta[];
};
