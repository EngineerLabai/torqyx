"use client";

import ToolPage from "@/components/tools/ToolPage";
import { shaftTorsionTool } from "@/tools/shaft-torsion";

export default function ShaftTorsionPage() {
  return <ToolPage tool={shaftTorsionTool} />;
}
