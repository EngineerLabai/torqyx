import type { ToolDefinition } from "@/tools/_shared/types";
import type { ChartInput, ChartResult } from "./types";
import { calculateChart, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";

export const paramChartTool: ToolDefinition<ChartInput, ChartResult> = {
  id: "param-chart",
  title: "Yay Kuvvet Grafigi",
  description: "Girilen yay sabiti ve yer degistirme ile F-x grafigi uretir.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateChart,
  InputSection,
  ResultSection,
  VisualizationSection,
};
