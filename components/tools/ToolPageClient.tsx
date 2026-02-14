"use client";

import ToolPage from "@/components/tools/ToolPage";
import type { ToolDocsResponse } from "@/lib/toolDocs/types";
import type { ToolDefinition } from "@/tools/_shared/types";
import { getToolPageTool } from "@/tools/tool-page-tools";

type ToolPageClientProps = {
  toolId: string;
  initialDocs?: ToolDocsResponse | null;
};

export default function ToolPageClient({ toolId, initialDocs }: ToolPageClientProps) {
  const tool = getToolPageTool(toolId);
  if (!tool) return null;
  const typedTool = tool as unknown as ToolDefinition<Record<string, unknown>, Record<string, unknown>>;
  return <ToolPage tool={typedTool} initialDocs={initialDocs} />;
}
