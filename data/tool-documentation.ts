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
    tr: "Bu araç belirli bir mühendislik problemi için girdileri alır ve standart tabanlı hesap sonucu üretir.",
    en: "This tool accepts engineering inputs for a defined problem and returns a standards-based calculation result.",
  },
  assumptionsAndUnits: {
    tr: [
      "SI birimleri esas alınır; girişler arası birim uyumu kullanıcı tarafında doğrulanmalıdır.",
      "Hesap adımları deterministik formül akışı ile çalışır (aynı girdi = aynı çıktı).",
      "Malzeme ve çevre koşulları için varsayılan değerler kullanılıyorsa proje değerleri ile güncellenmelidir.",
    ],
    en: [
      "SI units are the baseline; input unit consistency must be verified by the user.",
      "The calculation path is deterministic (same inputs = same outputs).",
      "If default material/environment values are used, replace them with project-specific values.",
    ],
  },
  limits: {
    tr: [
      "Araç ön boyutlandırma ve teknik kontrol amaçlıdır; final tasarım onayı yerine geçmez.",
      "Değer aralığı dışına çıkan girdilerde sonuç yorumundan önce girdi kalitesi kontrol edilmelidir.",
    ],
    en: [
      "This tool is intended for preliminary sizing and technical checks, not final design approval.",
      "When inputs are outside expected ranges, validate input quality before interpreting outputs.",
    ],
  },
  referenceStandards: {
    tr: ["ISO / DIN / VDI kaynakları ve yaygın mühendislik el kitapları"],
    en: ["ISO / DIN / VDI references and common engineering handbooks"],
  },
  validationExamples: {
    tr: [
      {
        title: "Örnek doğrulama",
        rows: [
          {
            input: "Girdi seti: Proje verileri ile birim uyumlu değerler",
            expectedOutput: "Beklenen çıktı: Araç sonucu standart tablolar ile aynı mertebede",
          },
        ],
        note: "Gerçek projede en az bir manuel kontrol veya referans tablo karşılaştırması yapın.",
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
      tr: "Cıvata gerilme alanı, ön yük (preload) ve sıkma torku tahmini hesaplar.",
      en: "Calculates bolt stress area, preload estimate, and tightening torque estimate.",
    },
    assumptionsAndUnits: {
      tr: [
        "SI birimleri kullanılır (N, mm, MPa, Nm).",
        "Diş geometrisi ve sürtünme katsayısı için tipik değerler kullanılır; uygulamaya göre güncellenmelidir.",
        "Malzeme sınıfı mekanik özellikleri ISO 898-1 referansına göre yorumlanır.",
      ],
      en: [
        "SI units are used (N, mm, MPa, Nm).",
        "Thread geometry and friction values use typical defaults and must be adjusted per application.",
        "Material grade mechanical properties are interpreted against ISO 898-1 references.",
      ],
    },
    limits: {
      tr: [
        "Tork-preload ilişkisi sürtünmeye yüksek hassastır; gerçek montajda kalibrasyon gerekir.",
        "Dinamik yorulma, gevşeme ve servis sıcaklığı etkileri bu hızlı modelde sınırlıdır.",
      ],
      en: [
        "Torque-preload relation is highly friction-sensitive; real assembly requires calibration.",
        "Dynamic fatigue, relaxation, and service temperature effects are limited in this quick model.",
      ],
    },
    referenceStandards: {
      tr: ["ISO 898-1", "VDI 2230", "ISO 68-1 / ISO 261 (metrik diş temel referansları)"],
      en: ["ISO 898-1", "VDI 2230", "ISO 68-1 / ISO 261 (metric thread baseline references)"],
    },
    validationExamples: {
      tr: [
        {
          title: "M10 - 8.8 sınıfı cıvata kontrolü",
          rows: [
            {
              input: "d=10 mm, p=1.5 mm, hedef preload=25 kN, sürtünme=0.14",
              expectedOutput: "As yaklaşık 58 mm^2, tahmini tork yaklaşık 45-55 Nm aralığında",
            },
          ],
          note: "Kesin tork değeri için saha sürtünme katsayısı ve anahtar kalibrasyonu ile doğrulayın.",
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
      tr: "Uzunluk, kuvvet, basınç, enerji ve benzeri birim dönüşümlerini sabit katsayılarla hesaplar.",
      en: "Converts units such as length, force, pressure, and energy using fixed conversion factors.",
    },
    assumptionsAndUnits: {
      tr: [
        "Dönüşümler SI tabanlı referans birim üzerinden yapılır.",
        "Girdiler sayısal kabul edilir; birim sembol tutarlılığı kullanıcı tarafından sağlanır.",
        "Yuvarlama yalnızca gösterim içindir; hesaplama içeride tam hassasiyete yakın yapılır.",
      ],
      en: [
        "Conversions run through SI-base reference units.",
        "Inputs are numeric; unit-symbol consistency is provided by the user.",
        "Rounding is display-only; internal conversion keeps practical numeric precision.",
      ],
    },
    limits: {
      tr: [
        "Sıcaklık gibi ofsetli dönüşümlerde seçilen formata göre sonuç değişimi kontrol edilmelidir.",
        "Standart dışı birimler veya proje için özel katsayılar bu araç kapsamında değildir.",
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
          title: "Birim dönüşüm kontrolü",
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
      tr: "Boru içindeki akış için Reynolds sayısı, sürtünme katsayısı ve basınç kaybını hesaplar.",
      en: "Calculates Reynolds number, friction factor, and pressure loss for internal pipe flow.",
    },
    assumptionsAndUnits: {
      tr: [
        "Model Darcy-Weisbach yaklaşımına dayanır; SI birimleri kullanılır (m, kg/s, Pa).",
        "Akışkan özellikleri seçilen sıcaklıkta sabit kabul edilir (hızlı hesap varsayımı).",
        "Pürüzlülük, çap ve uzunluk girdileri düz boru segmenti mantığıyla yorumlanır.",
      ],
      en: [
        "The model is based on Darcy-Weisbach; SI units are used (m, kg/s, Pa).",
        "Fluid properties are treated as constant at selected conditions (quick-check assumption).",
        "Roughness, diameter, and length inputs follow straight-pipe segment logic.",
      ],
    },
    limits: {
      tr: [
        "Çok fazlı akış, ani genişleme/daralma ve lokal kayıplar bu temel modelde sınırlıdır.",
        "Yüksek sıcaklıkta viskozite değişimi ve kompresibilite etkileri ayrı doğrulama gerektirir.",
      ],
      en: [
        "Multiphase flow, abrupt expansion/contraction, and local losses are limited in this baseline model.",
        "High-temperature viscosity shifts and compressibility effects require additional verification.",
      ],
    },
    referenceStandards: {
      tr: ["Darcy-Weisbach yaklaşımı", "EN ISO 5167 (ölçüm/akış referansı)", "VDI 2048 (uygulama notları)"],
      en: ["Darcy-Weisbach approach", "EN ISO 5167 (flow/measurement reference)", "VDI 2048 (application notes)"],
    },
    validationExamples: {
      tr: [
        {
          title: "Su hattı hızlı kontrolü",
          rows: [
            {
              input: "Q=2.0 L/s, D=50 mm, L=20 m, pürüzlülük=0.045 mm",
              expectedOutput: "Re > 4000, basınç kaybı yaklaşık 8-15 kPa aralığı",
            },
          ],
          note: "Gerçek sistemde lokal kayıp katsayıları (dirsek, vana) eklenmelidir.",
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
    tr: `${toolTitle} aracı bu araç tipine ait temel mühendislik hesabını yapar ve sonucu izlenebilir formatta sunar.`,
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
