export type MaterialCategory =
  | "steel"
  | "stainless"
  | "tool"
  | "cast-iron"
  | "aluminum"
  | "copper"
  | "nickel"
  | "titanium"
  | "magnesium"
  | "plastics"
  | "elastomer"
  | "composites";

export type MaterialEntry = {
  id: string;
  name: string;
  standard: string;
  category: MaterialCategory;
  density: number;
  E: number;
  G: number;
  yield: number | null;
  UTS: number | null;
  alpha: number;
  notes?: string;
  sources?: string[];
};
