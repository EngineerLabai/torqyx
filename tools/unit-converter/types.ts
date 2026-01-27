export type UnitCategory = "length" | "force" | "pressure" | "energy";

export type UnitInput = {
  category: UnitCategory;
  value: string;
  fromUnit: string;
  toUnit: string;
};

export type UnitResult = {
  output: number | null;
  baseValue: number | null;
  steps: string[];
  formula: string;
  baseUnitLabel: string;
  fromLabel: string;
  toLabel: string;
  error?: string;
};
