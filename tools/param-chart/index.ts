import type { ToolCompareMetric, ToolDefinition } from "@/tools/_shared/types";
import type { ChartInput, ChartResult } from "./types";
import { calculateChart, DEFAULT_INPUT } from "./logic";
import InputSection from "./InputSection";
import ResultSection from "./ResultSection";
import VisualizationSection from "./VisualizationSection";
import CompareVisualizationSection from "./CompareVisualizationSection";

export const paramChartTool: ToolDefinition<ChartInput, ChartResult> = {
  id: "param-chart",
  title: "Yay Kuvvet Grafigi",
  description: "Girilen yay sabiti ve yer degistirme ile F-x grafigi uretir.",
  initialInput: DEFAULT_INPUT,
  calculate: calculateChart,
  InputSection,
  ResultSection,
  VisualizationSection,
  CompareVisualizationSection,
  compareMetrics: [
    {
      key: "error",
      label: "Hata",
      getValue: (result) => result.error,
    },
    {
      key: "maxForce",
      label: "Maksimum kuvvet (N)",
      getValue: (result) => (result.maxForce === null ? null : Number(result.maxForce.toFixed(2))),
    },
    {
      key: "stepSize",
      label: "Adim boyu (mm)",
      getValue: (result) => (result.stepSize === null ? null : Number(result.stepSize.toFixed(3))),
    },
    {
      key: "points",
      label: "Nokta sayisi",
      getValue: (result) => result.points.length,
    },
  ] satisfies ToolCompareMetric<ChartInput, ChartResult>[],
};
