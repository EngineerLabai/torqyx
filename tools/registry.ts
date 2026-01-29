export type ToolInputType = "number" | "select" | "slider";

export type ToolInputOption = {
  label: string;
  value: string | number;
};

export type ToolInputDefinition = {
  key: string;
  label: string;
  unit?: string;
  type: ToolInputType;
  min?: number;
  max?: number;
  step?: number;
  default: string | number;
  help?: string;
  options?: ToolInputOption[];
};

export type ToolChartDataset = {
  label: string;
  data: Array<number | null>;
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
};

export type ToolChartConfig = {
  type?: "line" | "bar";
  labels: string[];
  datasets: ToolChartDataset[];
  xLabel?: string;
  yLabel?: string;
};

export type ToolDefinition<TInputs extends Record<string, unknown>, TResult> = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  lastUpdated: string;
  inputs: ToolInputDefinition[];
  calculate: (inputs: TInputs) => TResult;
  chartConfig?: (results: TResult, inputs: TInputs) => ToolChartConfig | null;
  formulaDisplay?: string;
};

type TorquePowerInputs = {
  powerKw: number;
  rpm: number;
  mechEff: number;
};

type TorquePowerResults = {
  torqueNm: number;
  torqueNmEff: number;
  powerHp: number;
};

export const torquePowerTool: ToolDefinition<TorquePowerInputs, TorquePowerResults> = {
  id: "torque-power",
  title: "Guc - Tork - Devir",
  description: "P(kW/hp) - T(Nm) - n(rpm) iliskisini hesapla ve verim etkisini gor.",
  categories: ["Mechanical"],
  tags: ["torque"],
  lastUpdated: "2026-01-29",
  inputs: [
    {
      key: "powerKw",
      label: "Guc",
      unit: "kW",
      type: "number",
      min: 0.1,
      step: 0.1,
      default: 5.5,
      help: "Elektrik motoru gucu (kW).",
    },
    {
      key: "rpm",
      label: "Devir",
      unit: "rpm",
      type: "number",
      min: 1,
      step: 1,
      default: 1500,
      help: "Mil devri.",
    },
    {
      key: "mechEff",
      label: "Mekanik verim",
      unit: "%",
      type: "slider",
      min: 0,
      max: 100,
      step: 1,
      default: 95,
      help: "Shaft cikis verimi. Tipik 90-98%.",
    },
  ],
  calculate: (inputs) => {
    const torqueNm = (9550 * inputs.powerKw) / inputs.rpm;
    const torqueNmEff = torqueNm * (inputs.mechEff / 100);
    const powerHp = inputs.powerKw * 1.34102;
    return { torqueNm, torqueNmEff, powerHp };
  },
  chartConfig: (results) => ({
    type: "bar",
    labels: ["Tork (ideal)", "Tork (verim)", "Guc (hp)"],
    datasets: [
      {
        label: "Deger",
        data: [results.torqueNm, results.torqueNmEff, results.powerHp],
        backgroundColor: "rgba(16, 185, 129, 0.25)",
        borderColor: "#10b981",
      },
    ],
    yLabel: "Deger",
  }),
  formulaDisplay:
    "P(kW) = T(Nm) * n(rpm) / 9550 | T = 9550 * P / n | hp = kW * 1.34102 | T_eff = T * eta",
};

export const toolRegistry = [torquePowerTool] as const;

export const getToolById = (id: string) => toolRegistry.find((tool) => tool.id === id) ?? null;
