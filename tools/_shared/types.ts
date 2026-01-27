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

export type ToolDefinition<TInput, TResult> = {
  id: string;
  title: string;
  description: string;
  initialInput: TInput;
  calculate: (input: TInput) => TResult;
  InputSection: ComponentType<ToolInputProps<TInput>>;
  ResultSection: ComponentType<ToolResultProps<TResult>>;
  VisualizationSection: ComponentType<ToolVisualizationProps<TInput, TResult>>;
};
