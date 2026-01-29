import type { ComponentType } from "react";

export type ToolInputProps<TInput> = {
  input: TInput;
  onChange: (next: TInput) => void;
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
};
