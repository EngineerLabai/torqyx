"use client";

import ToolPage from "@/components/tools/ToolPage";
import { filletWeldTool } from "@/tools/fillet-weld";

export default function FilletWeldPage() {
  return <ToolPage tool={filletWeldTool} />;
}
