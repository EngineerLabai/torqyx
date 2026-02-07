export type FilletWeldInput = {
  load: string;
  length: string;
  allowable: string;
  fillet: string;
};

export type FilletWeldResult = {
  requiredA: number | null;
  throat: number | null;
  stress: number | null;
  isSafe: boolean | null;
  error?: string;
};
