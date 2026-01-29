export type MaterialCategory =
  | "steel"
  | "stainless"
  | "tool"
  | "aluminum"
  | "copper"
  | "titanium"
  | "nickel"
  | "plastics"
  | "elastomer";

export type MaterialInfo = {
  name: string;
  category: MaterialCategory;
  description: string;
  typicalUse: string;
  properties: string[];
  notes?: string;
};
