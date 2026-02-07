import { describe, it, expect } from "vitest";
import { ACTIVE_TOOL_DOCS } from "@/lib/tool-docs/registry";
import { toolDocStandardSchema } from "@/lib/tool-docs/schema";
import { torquePowerTool } from "@/tools/registry";
import { calculateBolt } from "@/tools/bolt-calculator/logic";
import { calculateUnit } from "@/tools/unit-converter/logic";
import { calculateBearingLife } from "@/tools/bearing-life/logic";
import { calculateShaftTorsion } from "@/tools/shaft-torsion/logic";
import { calculateFilletWeld } from "@/tools/fillet-weld/logic";
import { calculatePipePressureLoss } from "@/tools/pipe-pressure-loss/logic";
import { calculateHydraulicCylinder } from "@/tools/hydraulic-cylinder/logic";
import fs from "node:fs/promises";
import path from "node:path";

const calculators: Record<string, (input: Record<string, unknown>) => Record<string, unknown> | null> = {
  "torque-power": (input) => torquePowerTool.calculate(input as never) as Record<string, unknown>,
  "bolt-calculator": (input) => calculateBolt(input as never) as Record<string, unknown>,
  "unit-converter": (input) => calculateUnit(input as never) as Record<string, unknown>,
  "bearing-life": (input) => calculateBearingLife(input as never) as Record<string, unknown>,
  "shaft-torsion": (input) => calculateShaftTorsion(input as never) as Record<string, unknown>,
  "fillet-weld": (input) => calculateFilletWeld(input as never) as Record<string, unknown>,
  "pipe-pressure-loss": (input) => calculatePipePressureLoss(input as never) as Record<string, unknown>,
  "hydraulic-cylinder": (input) => calculateHydraulicCylinder(input as never) as Record<string, unknown>,
};

describe("tool doc standard examples", () => {
  ACTIVE_TOOL_DOCS.forEach((toolId) => {
    it(`${toolId} example outputs match`, async () => {
      const doc = await readToolDoc(toolId, "tr");
      expect(doc).toBeTruthy();
      if (!doc) return;

      const calc = calculators[toolId];
      expect(calc, `${toolId} calculator is missing`).toBeDefined();
      if (!calc) return;

      doc.examples.forEach((example) => {
        const result = calc(example.inputValues as Record<string, unknown>);
        expect(result, `${toolId} result should exist`).toBeTruthy();
        if (!result) return;

        Object.entries(example.expected).forEach(([key, expected]) => {
          const value = result[key] as number | null | undefined;
          expect(value, `${toolId} missing result ${key}`).not.toBeNull();
          if (typeof value === "number") {
            expect(value).toBeCloseTo(expected, 2);
          }
        });
      });
    });
  });
});

const readToolDoc = async (toolId: string, locale: "tr" | "en") => {
  const filePath = path.join(process.cwd(), "content", "tools", `${toolId}.${locale}.json`);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = toolDocStandardSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) {
    throw new Error(`[tool-docs] Invalid standard doc for ${toolId}.${locale}.json`);
  }
  return parsed.data;
};
