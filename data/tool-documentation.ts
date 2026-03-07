import type { Locale } from "@/utils/locale";
import type { LocalizedValue } from "@/utils/locale-values";
import { resolveLocalizedValue } from "@/utils/locale-values";

export type ToolDocumentationValidationRow = {
  input: string;
  expectedOutput: string;
};

export type ToolDocumentationExample = {
  title: string;
  rows: ToolDocumentationValidationRow[];
  note?: string;
};

export type ToolDocumentationEntry = {
  scope: LocalizedValue<string>;
  assumptionsAndUnits: LocalizedValue<string[]>;
  limits: LocalizedValue<string[]>;
  referenceStandards: LocalizedValue<string[]>;
  validationExamples: LocalizedValue<ToolDocumentationExample[]>;
  version: string;
  lastUpdated: string;
};

export type ResolvedToolDocumentation = {
  scope: string;
  assumptionsAndUnits: string[];
  limits: string[];
  referenceStandards: string[];
  validationExamples: ToolDocumentationExample[];
  version: string;
  lastUpdated: string;
};

export const TOOL_DOCUMENTATION_TEMPLATE: ToolDocumentationEntry = {
  scope: {
    tr: "Bu arac belirli bir muhendislik problemi icin girdileri alir ve standart tabanli hesap sonucu uretir.",
    en: "This tool accepts engineering inputs for a defined problem and returns a standards-based calculation result.",
  },
  assumptionsAndUnits: {
    tr: [
      "SI birimleri esas alinir; girisler arasi birim uyumu kullanici tarafinda dogrulanmalidir.",
      "Hesap adimlari deterministik formul akisi ile calisir (ayni girdi = ayni cikti).",
      "Malzeme ve cevre kosullari icin varsayilan degerler kullaniliyorsa proje degerleri ile guncellenmelidir.",
    ],
    en: [
      "SI units are the baseline; input unit consistency must be verified by the user.",
      "The calculation path is deterministic (same inputs = same outputs).",
      "If default material/environment values are used, replace them with project-specific values.",
    ],
  },
  limits: {
    tr: [
      "Arac on boyutlandirma ve teknik kontrol amaclidir; final tasarim onayi yerine gecmez.",
      "Deger araligi disina cikan girdilerde sonuc yorumundan once girdi kalitesi kontrol edilmelidir.",
    ],
    en: [
      "This tool is intended for preliminary sizing and technical checks, not final design approval.",
      "When inputs are outside expected ranges, validate input quality before interpreting outputs.",
    ],
  },
  referenceStandards: {
    tr: ["ISO / DIN / VDI kaynaklari ve yaygin muhendislik el kitaplari"],
    en: ["ISO / DIN / VDI references and common engineering handbooks"],
  },
  validationExamples: {
    tr: [
      {
        title: "Ornek dogrulama",
        rows: [
          {
            input: "Girdi seti: Proje verileri ile birim uyumlu degerler",
            expectedOutput: "Beklenen cikti: Arac sonucu standart tablolar ile ayni mertebede",
          },
        ],
        note: "Gercek projede en az bir manuel kontrol veya referans tablo karsilastirmasi yapin.",
      },
    ],
    en: [
      {
        title: "Validation example",
        rows: [
          {
            input: "Input set: Unit-consistent project values",
            expectedOutput: "Expected output: Tool result is in the same order as standard references",
          },
        ],
        note: "In real projects, run at least one manual check or reference-table comparison.",
      },
    ],
  },
  version: "v0.1.0",
  lastUpdated: "2026-03-04",
};

const toolDocumentationById: Partial<Record<string, ToolDocumentationEntry>> = {
  "bolt-calculator": {
    scope: {
      tr: "Civata gerilme alani, on yuk (preload) ve sikma torku tahmini hesaplar.",
      en: "Calculates bolt stress area, preload estimate, and tightening torque estimate.",
    },
    assumptionsAndUnits: {
      tr: [
        "SI birimleri kullanilir (N, mm, MPa, Nm).",
        "Dis geometrisi ve surtunme katsayisi icin tipik degerler kullanilir; uygulamaya gore guncellenmelidir.",
        "Malzeme sinifi mekanik ozellikleri ISO 898-1 referansina gore yorumlanir.",
      ],
      en: [
        "SI units are used (N, mm, MPa, Nm).",
        "Thread geometry and friction values use typical defaults and must be adjusted per application.",
        "Material grade mechanical properties are interpreted against ISO 898-1 references.",
      ],
    },
    limits: {
      tr: [
        "Tork-preload iliskisi surtunmeye yuksek hassastir; gercek montajda kalibrasyon gerekir.",
        "Dinamik yorulma, gevseme ve servis sicakligi etkileri bu hizli modelde sinirlidir.",
      ],
      en: [
        "Torque-preload relation is highly friction-sensitive; real assembly requires calibration.",
        "Dynamic fatigue, relaxation, and service temperature effects are limited in this quick model.",
      ],
    },
    referenceStandards: {
      tr: ["ISO 898-1", "VDI 2230", "ISO 68-1 / ISO 261 (metrik dis temel referanslari)"],
      en: ["ISO 898-1", "VDI 2230", "ISO 68-1 / ISO 261 (metric thread baseline references)"],
    },
    validationExamples: {
      tr: [
        {
          title: "M10 - 8.8 sinifi civata kontrolu",
          rows: [
            {
              input: "d=10 mm, p=1.5 mm, hedef preload=25 kN, surtunme=0.14",
              expectedOutput: "As yaklasik 58 mm^2, tahmini tork yaklasik 45-55 Nm araliginda",
            },
          ],
          note: "Kesin tork degeri icin saha surtunme katsayisi ve anahtar kalibrasyonu ile dogrulayin.",
        },
      ],
      en: [
        {
          title: "M10 - class 8.8 check",
          rows: [
            {
              input: "d=10 mm, p=1.5 mm, target preload=25 kN, friction=0.14",
              expectedOutput: "As around 58 mm^2, estimated torque around 45-55 Nm",
            },
          ],
          note: "For final torque, verify with field friction data and wrench calibration.",
        },
      ],
    },
    version: "v1.0.0",
    lastUpdated: "2026-03-04",
  },
  "unit-converter": {
    scope: {
      tr: "Uzunluk, kuvvet, basinc, enerji ve benzeri birim donusumlerini sabit katsayilarla hesaplar.",
      en: "Converts units such as length, force, pressure, and energy using fixed conversion factors.",
    },
    assumptionsAndUnits: {
      tr: [
        "Donusumler SI tabanli referans birim uzerinden yapilir.",
        "Girdiler sayisal kabul edilir; birim sembol tutarliligi kullanici tarafindan saglanir.",
        "Yuvarlama yalnizca gosterim icindir; hesaplama icerde tam hassasiyete yakin yapilir.",
      ],
      en: [
        "Conversions run through SI-base reference units.",
        "Inputs are numeric; unit-symbol consistency is provided by the user.",
        "Rounding is display-only; internal conversion keeps practical numeric precision.",
      ],
    },
    limits: {
      tr: [
        "Sicaklik gibi ofsetli donusumlerde secilen formata gore sonuc degisimi kontrol edilmelidir.",
        "Standart disi birimler veya proje icin ozel katsayilar bu arac kapsaminda degildir.",
      ],
      en: [
        "Offset-based conversions (such as temperature) must be checked against the selected formula.",
        "Non-standard or project-specific conversion factors are out of scope for this tool.",
      ],
    },
    referenceStandards: {
      tr: ["SI Brochure (BIPM)", "ISO 80000"],
      en: ["SI Brochure (BIPM)", "ISO 80000"],
    },
    validationExamples: {
      tr: [
        {
          title: "Birim donusum kontrolu",
          rows: [
            { input: "1000 mm", expectedOutput: "1 m" },
            { input: "1 bar", expectedOutput: "100000 Pa" },
          ],
        },
      ],
      en: [
        {
          title: "Unit conversion check",
          rows: [
            { input: "1000 mm", expectedOutput: "1 m" },
            { input: "1 bar", expectedOutput: "100000 Pa" },
          ],
        },
      ],
    },
    version: "v1.0.0",
    lastUpdated: "2026-03-04",
  },
  "pipe-pressure-loss": {
    scope: {
      tr: "Boru icindeki akis icin Reynolds sayisi, surtunme katsayisi ve basinc kaybini hesaplar.",
      en: "Calculates Reynolds number, friction factor, and pressure loss for internal pipe flow.",
    },
    assumptionsAndUnits: {
      tr: [
        "Model Darcy-Weisbach yaklasimina dayanir; SI birimleri kullanilir (m, kg/s, Pa).",
        "Akiskan ozellikleri secilen sicaklikta sabit kabul edilir (hizli hesap varsayimi).",
        "Pruzululuk, cap ve uzunluk girdileri duz boru segmenti mantigiyla yorumlanir.",
      ],
      en: [
        "The model is based on Darcy-Weisbach; SI units are used (m, kg/s, Pa).",
        "Fluid properties are treated as constant at selected conditions (quick-check assumption).",
        "Roughness, diameter, and length inputs follow straight-pipe segment logic.",
      ],
    },
    limits: {
      tr: [
        "Cok fazli akis, ani genisleme/daralma ve lokal kayiplar bu temel modelde sinirlidir.",
        "Yuksek sicaklikta viskozite degisimi ve kompresibilite etkileri ayri dogrulama gerektirir.",
      ],
      en: [
        "Multiphase flow, abrupt expansion/contraction, and local losses are limited in this baseline model.",
        "High-temperature viscosity shifts and compressibility effects require additional verification.",
      ],
    },
    referenceStandards: {
      tr: ["Darcy-Weisbach yaklasimi", "EN ISO 5167 (olcum/akis referansi)", "VDI 2048 (uygulama notlari)"],
      en: ["Darcy-Weisbach approach", "EN ISO 5167 (flow/measurement reference)", "VDI 2048 (application notes)"],
    },
    validationExamples: {
      tr: [
        {
          title: "Su hatti hizli kontrolu",
          rows: [
            {
              input: "Q=2.0 L/s, D=50 mm, L=20 m, puruzluluk=0.045 mm",
              expectedOutput: "Re > 4000, basinc kaybi yaklasik 8-15 kPa araligi",
            },
          ],
          note: "Gercek sistemde lokal kayip katsayilari (dirsek, vana) eklenmelidir.",
        },
      ],
      en: [
        {
          title: "Water line quick check",
          rows: [
            {
              input: "Q=2.0 L/s, D=50 mm, L=20 m, roughness=0.045 mm",
              expectedOutput: "Re > 4000, pressure drop around 8-15 kPa",
            },
          ],
          note: "For real systems, include local loss coefficients (elbows, valves).",
        },
      ],
    },
    version: "v1.0.0",
    lastUpdated: "2026-03-04",
  },
};

const buildFallbackDocumentation = (toolTitle: string): ToolDocumentationEntry => ({
  ...TOOL_DOCUMENTATION_TEMPLATE,
  scope: {
    tr: `${toolTitle} araci bu arac tipine ait temel muhendislik hesabini yapar ve sonucu izlenebilir formatta sunar.`,
    en: `${toolTitle} performs the core engineering calculation for this tool type and presents results in a traceable format.`,
  },
});

export const getToolDocumentation = ({
  toolId,
  locale,
  toolTitle,
}: {
  toolId: string;
  locale: Locale;
  toolTitle: string;
}): ResolvedToolDocumentation => {
  const entry = toolDocumentationById[toolId] ?? buildFallbackDocumentation(toolTitle);
  return {
    scope: resolveLocalizedValue(entry.scope, locale) ?? "",
    assumptionsAndUnits: resolveLocalizedValue(entry.assumptionsAndUnits, locale) ?? [],
    limits: resolveLocalizedValue(entry.limits, locale) ?? [],
    referenceStandards: resolveLocalizedValue(entry.referenceStandards, locale) ?? [],
    validationExamples: resolveLocalizedValue(entry.validationExamples, locale) ?? [],
    version: entry.version,
    lastUpdated: entry.lastUpdated,
  };
};
