"use client";

import ToolPage from "@/components/tools/ToolPage";
import { unitConverterTool } from "@/tools/unit-converter";

export default function UnitConverterPage() {
  return <ToolPage tool={unitConverterTool} />;
}
