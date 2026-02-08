"use client";

import ToolPage from "@/components/tools/ToolPage";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import { getToolPageTool } from "@/tools/tool-page-tools";

type ToolPageClientProps = {
  toolId: string;
  initialDocs?: ToolDocsResponse | null;
};

export default function ToolPageClient({ toolId, initialDocs }: ToolPageClientProps) {
  const tool = getToolPageTool(toolId);
  if (!tool) return null;
  return <ToolPage tool={tool} initialDocs={initialDocs} />;
}
