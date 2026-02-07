import { z } from "zod";

export const toolDocReferenceSchema = z.object({
  title: z.string().min(1),
  note: z.string().optional(),
  href: z.string().optional(),
});

export const toolDocExampleSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  inputs: z.record(z.string(), z.string()),
  outputs: z.record(z.string(), z.string()),
  inputValues: z.record(z.string(), z.any()),
  expected: z.record(z.string(), z.number()),
  notes: z.array(z.string()).optional(),
});

export const toolDocStandardSchema = z.object({
  version: z.string().min(1),
  lastUpdated: z.string().min(1),
  howTo: z.array(z.string()).min(3),
  formula: z.string().min(1),
  examples: z.array(toolDocExampleSchema).min(2),
  references: z.array(toolDocReferenceSchema).min(1),
  commonMistakes: z.array(z.string()).min(3),
  assumptions: z.array(z.string()).optional(),
});

export type ToolDocReference = z.infer<typeof toolDocReferenceSchema>;
export type ToolDocExample = z.infer<typeof toolDocExampleSchema>;
export type ToolDocStandard = z.infer<typeof toolDocStandardSchema>;
