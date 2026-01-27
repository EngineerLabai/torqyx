"use client";

import ToolPage from "@/components/tools/ToolPage";
import { boltCalculatorTool } from "@/tools/bolt-calculator";

export default function BoltCalculatorPage() {
  return <ToolPage tool={boltCalculatorTool} />;
}
