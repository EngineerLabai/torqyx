"use client";

import ToolPage from "@/components/tools/ToolPage";
import { pipePressureLossTool } from "@/tools/pipe-pressure-loss";

export default function PipePressureLossPage() {
  return <ToolPage tool={pipePressureLossTool} />;
}
