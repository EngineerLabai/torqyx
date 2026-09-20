import type { LocalizedValue } from "@/utils/locale-values";

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

export type ToolReference = {
  title: string;
  url?: string;
  note?: string;
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
  formula?: LocalizedValue<string>;
  assumptions?: LocalizedValue<string[]>;
  references?: LocalizedValue<ToolReference[]>;
};

type TorquePowerInputs = {
  powerKw: number;
  rpm: number;
  mechEff: number;
};

type TorquePowerResults = {
  torqueNm: number | null;
  torqueNmEff: number | null;
  powerHp: number | null;
  inputPowerKw: number | null;
  outputPowerKw: number | null;
  efficiency: number | null;
  error?: string;
};

export const torqueFromPowerAndSpeed = (powerKw: number, rpm: number): number | null =>
  Number.isFinite(powerKw) && Number.isFinite(rpm) && powerKw > 0 && rpm > 0
    ? (9550 * powerKw) / rpm
    : null;

export const powerFromTorqueAndSpeed = (torqueNm: number, rpm: number): number | null =>
  Number.isFinite(torqueNm) && Number.isFinite(rpm) && torqueNm > 0 && rpm > 0
    ? (torqueNm * rpm) / 9550
    : null;

export const speedFromPowerAndTorque = (powerKw: number, torqueNm: number): number | null =>
  Number.isFinite(powerKw) && Number.isFinite(torqueNm) && powerKw > 0 && torqueNm > 0
    ? (9550 * powerKw) / torqueNm
    : null;

export const torquePowerTool: ToolDefinition<TorquePowerInputs, TorquePowerResults> = {
  id: "torque-power",
  title: "Güç - Tork - Devir",
  description: "kW, hp ve rpm ilişkisine göre tork veya güç hesabını yap.",
  categories: ["Mechanical"],
  tags: ["torque"],
  lastUpdated: "2026-01-29",
  inputs: [
    {
      key: "powerKw",
      label: "Güç",
      unit: "kW",
      type: "number",
      min: 0.1,
      step: 0.1,
      default: 5.5,
      help: "Kayıplardan önceki mekanik giriş gücü (kW).",
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
      help: "Giriş gücünden çıkış gücüne mekanik verim. Tipik %90–98.",
    },
  ],
  calculate: (inputs) => {
    const efficiency = inputs.mechEff / 100;
    const torqueNm = torqueFromPowerAndSpeed(inputs.powerKw, inputs.rpm);
    if (torqueNm === null || !Number.isFinite(efficiency) || efficiency < 0 || efficiency > 1) {
      return {
        torqueNm: null,
        torqueNmEff: null,
        powerHp: null,
        inputPowerKw: null,
        outputPowerKw: null,
        efficiency: null,
        error: "Güç ve devir pozitif; verim %0-%100 aralığında olmalıdır.",
      };
    }
    const outputPowerKw = inputs.powerKw * efficiency;
    const torqueNmEff = torqueNm * efficiency;
    const powerHp = inputs.powerKw * 1.34102;
    return {
      torqueNm,
      torqueNmEff,
      powerHp,
      inputPowerKw: inputs.powerKw,
      outputPowerKw,
      efficiency,
    };
  },
  chartConfig: (results) => ({
    type: "bar",
    labels: ["Giriş torku (ideal)", "Çıkış torku (verimli)", "Giriş gücü (hp)"],
    datasets: [
      {
        label: "Değer",
        data: [results.torqueNm, results.torqueNmEff, results.powerHp],
        backgroundColor: "rgba(16, 185, 129, 0.25)",
        borderColor: "#10b981",
      },
    ],
    yLabel: "Değer",
  }),
  formulaDisplay:
    "T_in = 9550 * P_in / n | P_out = η * P_in | T_out = η * T_in | P = T * n / 9550 | n = 9550 * P / T",
  formula: {
    tr: "T_giriş = 9550 * P_giriş / n | P_çıkış = η * P_giriş | T_çıkış = η * T_giriş | P = T * n / 9550 | n = 9550 * P / T",
    en: "T_input = 9550 * P_input / n | P_output = η * P_input | T_output = η * T_input | P = T * n / 9550 | n = 9550 * P / T",
  },
  assumptions: {
    tr: ["Sürekli rejim, kayıplar mekanik verim ile temsil edilir.", "RPM sabit ve moment dalgalanması ihmal edilir."],
    en: ["Steady-state operation; losses are represented by mechanical efficiency.", "RPM is constant and torque ripple is ignored."],
  },
  references: {
    tr: [
      { title: "DIN 70020 (Motor gücü tanımları)", note: "kW-hp dönüşümü için temel referans." },
      { title: "ISO 3046 (İçten yanmalı motor performansı)" },
    ],
    en: [
      { title: "DIN 70020 (Engine power definitions)", note: "Reference for kW-hp conversion." },
      { title: "ISO 3046 (Reciprocating engine performance)" },
    ],
  },
};

export const toolRegistry = [torquePowerTool] as const;

export const getToolById = (id: string) => toolRegistry.find((tool) => tool.id === id) ?? null;
