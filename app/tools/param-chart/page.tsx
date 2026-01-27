"use client";

import ToolPage from "@/components/tools/ToolPage";
import { paramChartTool } from "@/tools/param-chart";

export default function ParamChartPage() {
  return <ToolPage tool={paramChartTool} />;
}
