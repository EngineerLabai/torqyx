import { boltCalculatorTool } from "@/tools/bolt-calculator";

export const toolPageRegistry = [boltCalculatorTool] as const;

export const getToolPageTool = (id: string) => toolPageRegistry.find((tool) => tool.id === id) ?? null;
