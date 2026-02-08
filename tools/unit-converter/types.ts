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
  inputValue: number | null;
  fromFactor: number | null;
  toFactor: number | null;
  formula: string;
  baseUnitLabel: string;
  fromLabel: string;
  toLabel: string;
  errorKey?: "missingUnits" | "invalidNumber";
};
