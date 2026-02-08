import { boltCalculatorTool } from "@/tools/bolt-calculator";
import { bearingLifeTool } from "@/tools/bearing-life";
import { shaftTorsionTool } from "@/tools/shaft-torsion";
import { filletWeldTool } from "@/tools/fillet-weld";
import { pipePressureLossTool } from "@/tools/pipe-pressure-loss";
import { hydraulicCylinderTool } from "@/tools/hydraulic-cylinder";
import { basicEngineeringTool } from "@/tools/basic-engineering";
import { paramChartTool } from "@/tools/param-chart";
import { unitConverterTool } from "@/tools/unit-converter";

export const toolPageRegistry = [
  boltCalculatorTool,
  bearingLifeTool,
  shaftTorsionTool,
  filletWeldTool,
  pipePressureLossTool,
  hydraulicCylinderTool,
  basicEngineeringTool,
  paramChartTool,
  unitConverterTool,
] as const;

export const getToolPageTool = (id: string) => toolPageRegistry.find((tool) => tool.id === id) ?? null;
