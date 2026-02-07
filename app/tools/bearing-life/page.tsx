"use client";

import ToolPage from "@/components/tools/ToolPage";
import { bearingLifeTool } from "@/tools/bearing-life";

export default function BearingLifePage() {
  return <ToolPage tool={bearingLifeTool} />;
}
