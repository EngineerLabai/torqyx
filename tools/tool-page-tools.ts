import { boltCalculatorTool } from "@/tools/bolt-calculator";
import { bearingLifeTool } from "@/tools/bearing-life";
import { shaftTorsionTool } from "@/tools/shaft-torsion";
import { filletWeldTool } from "@/tools/fillet-weld";
import { pipePressureLossTool } from "@/tools/pipe-pressure-loss";
import { hydraulicCylinderTool } from "@/tools/hydraulic-cylinder";

export const toolPageRegistry = [
  boltCalculatorTool,
  bearingLifeTool,
  shaftTorsionTool,
  filletWeldTool,
  pipePressureLossTool,
  hydraulicCylinderTool,
] as const;

export const getToolPageTool = (id: string) => toolPageRegistry.find((tool) => tool.id === id) ?? null;
