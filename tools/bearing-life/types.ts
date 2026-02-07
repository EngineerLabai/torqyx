export type BearingLifeInput = {
  C: string;
  P: string;
  bearingType: "ball" | "roller";
  rpm: string;
  a1: string;
};

export type BearingLifeResult = {
  L10: number | null;
  L10h: number | null;
  exponent: number | null;
  error?: string;
};
