"use client";

import ToolPage from "@/components/tools/ToolPage";
import { hydraulicCylinderTool } from "@/tools/hydraulic-cylinder";

export default function HydraulicCylinderPage() {
  return <ToolPage tool={hydraulicCylinderTool} />;
}
