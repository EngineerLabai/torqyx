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
  isSpecific: boolean;
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
    en: "This tool accepts engineering inputs for a defined problem and returns a documented calculation result.",
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
    tr: [],
    en: [],
  },
  validationExamples: {
    tr: [],
    en: [],
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
  "bearing-life": {
    scope: {
      tr: "Dinamik yük kapasitesi C, eşdeğer yük P, rulman tipi ve devirden temel L10/L10h ömrünü; a1 katsayısından ayarlanmış Lna tahminini üretir.",
      en: "Calculates basic L10/L10h life from dynamic capacity C, equivalent load P, bearing type, and speed, then applies the a1 factor for an adjusted Lna estimate.",
    },
    assumptionsAndUnits: {
      tr: [
        "C ve P değerleri aynı yük biriminde girilir; sonuç L10 için milyon devir, L10h için saat olarak gösterilir.",
        "Sabit yük ve sabit devir varsayılır; bilyalı rulman için p=3, makaralı rulman için p=10/3 kullanılır.",
        "a1 katsayısı, temel L10 değerine uygulanan kullanıcı girdisidir; gerçek güvenilirlik ve çalışma koşulları ayrıca doğrulanmalıdır.",
      ],
      en: [
        "Enter C and P in the same load unit; L10 is reported in million revolutions and L10h in hours.",
        "The model assumes constant load and speed; p=3 is used for ball bearings and p=10/3 for roller bearings.",
        "a1 is a user-supplied multiplier for the basic L10 value; actual reliability and operating conditions need separate verification.",
      ],
    },
    limits: {
      tr: [
        "Yağlama, kirlenme, hizasızlık, sıcaklık, montaj ve değişken yük etkileri bu hızlı modelde ayrıntılı olarak çözülmez.",
        "L10 sonucu rulman seçimi veya servis ömrü garantisi değildir; üretici kataloğu ve proje yük spektrumu ile kontrol edilmelidir.",
      ],
      en: [
        "Lubrication, contamination, misalignment, temperature, mounting, and variable-load effects are not resolved in this quick model.",
        "The L10 result is not a bearing-selection or service-life guarantee; verify it with the manufacturer catalogue and project load spectrum.",
      ],
    },
    referenceStandards: {
      tr: ["ISO 281 (rulman ömrü hesapları)", "Rulman üreticisinin katalog verileri ve proje şartnamesiyle doğrulama"],
      en: ["ISO 281 (rolling bearing life calculations)", "Verification against manufacturer catalogue data and the project specification"],
    },
    validationExamples: {
      tr: [
        {
          title: "Temel L10 kontrolü",
          rows: [
            { input: "C=25 kN, P=10 kN, bilyalı, n=1500 rpm, a1=1", expectedOutput: "L10=15,625 milyon devir; L10h≈173,6 saat" },
          ],
          note: "Sonucu gerçek yük spektrumu, üretici verileri ve uygulanabilir proje koşullarıyla ayrıca kontrol edin.",
        },
      ],
      en: [
        {
          title: "Basic L10 check",
          rows: [
            { input: "C=25 kN, P=10 kN, ball bearing, n=1500 rpm, a1=1", expectedOutput: "L10=15.625 million revolutions; L10h≈173.6 hours" },
          ],
          note: "Cross-check the result against the actual load spectrum, manufacturer data, and project conditions.",
        },
      ],
    },
    version: "v1.0.0",
    lastUpdated: "2026-02-07",
  },
  "hydraulic-cylinder": {
    scope: {
      tr: "Basınç, piston/mil çapı ve debiden ileri-geri kuvveti, hızı ve ideal hidrolik gücü hesaplar.",
      en: "Calculates extend/retract force, speed, and ideal hydraulic power from pressure, bore/rod diameters, and flow.",
    },
    assumptionsAndUnits: {
      tr: [
        "Basınç bar, çaplar mm ve debi L/dk girilir; kuvvet kN, hız mm/s ve güç kW olarak gösterilir.",
        "İleri kuvvet piston alanı, geri kuvvet halka alanı ile; hızlar debinin ilgili alana bölünmesiyle hesaplanır.",
        "İdeal modelde basınç sabit ve akışkan sıkıştırılamaz kabul edilir; silindir verimi hesaba katılmadıysa gerçek kayıplar ayrıca eklenmelidir.",
      ],
      en: [
        "Enter pressure in bar, diameters in mm, and flow in L/min; results are shown in kN, mm/s, and kW.",
        "Extend force uses the bore area, retract force uses the annulus area, and speed is flow divided by the relevant area.",
        "The ideal model assumes constant pressure and incompressible flow; account for real efficiency losses separately when required.",
      ],
    },
    limits: {
      tr: [
        "Valf, hat, kaçak, sürtünme, sıkışabilirlik ve dinamik basınç değişimleri temel hesapta modellenmez.",
        "Mil çapı piston çapından küçük olmalı; nihai komponent seçimi üretici datası, devre şeması ve güvenlik gerekleriyle doğrulanmalıdır.",
      ],
      en: [
        "Valve, line, leakage, friction, compressibility, and transient pressure effects are outside this baseline calculation.",
        "The rod diameter must be smaller than the bore; verify final component selection against supplier data, the circuit, and safety requirements.",
      ],
    },
    referenceStandards: {
      tr: ["ISO 6020 (hidrolik silindir boyutlandırma referansı)", "Üretici katalog verileri ve devre tasarım şartlarıyla doğrulama"],
      en: ["ISO 6020 (hydraulic cylinder sizing reference)", "Verification against manufacturer data and circuit design requirements"],
    },
    validationExamples: {
      tr: [
        {
          title: "İleri-geri alan kontrolü",
          rows: [
            { input: "p=160 bar, D=80 mm, d=45 mm, Q=25 L/dk", expectedOutput: "İleri kuvvet≈80,4 kN; geri kuvvet≈55,0 kN" },
          ],
          note: "Gerçek kuvvet için verim, sürtünme ve devre basınç kayıplarını ayrıca değerlendirin.",
        },
      ],
      en: [
        {
          title: "Extend/retract area check",
          rows: [
            { input: "p=160 bar, D=80 mm, d=45 mm, Q=25 L/min", expectedOutput: "Extend force≈80.4 kN; retract force≈55.0 kN" },
          ],
          note: "For real force, account separately for efficiency, friction, and circuit pressure losses.",
        },
      ],
    },
    version: "v1.0.0",
    lastUpdated: "2026-02-07",
  },
  "shaft-torsion": {
    scope: {
      tr: "Dairesel ve homojen bir mil için tork, çap, uzunluk ve kayma modülünden burulma gerilmesi, kutupsal atalet ve dönme açısını hesaplar.",
      en: "Calculates torsional shear stress, polar moment, and twist angle for a circular homogeneous shaft from torque, diameter, length, and shear modulus.",
    },
    assumptionsAndUnits: {
      tr: [
        "Tork N·m, çap ve uzunluk mm, kayma modülü GPa ve isteğe bağlı izin verilen gerilme MPa girilir.",
        "Katı dairesel kesit ve elastik davranış varsayılır; τ=16T/(πd³), θ=TL/(JG) kullanılır.",
        "Dönme açısı dereceye çevrilir; izin verilen gerilme verilirse basit bir gerilme oranı gösterilir.",
      ],
      en: [
        "Enter torque in N·m, diameter and length in mm, shear modulus in GPa, and optional allowable shear stress in MPa.",
        "The model assumes a solid circular section and elastic behavior; it uses τ=16T/(πd³) and θ=TL/(JG).",
        "Twist is converted to degrees; when an allowable stress is supplied, a simple stress ratio is shown.",
      ],
    },
    limits: {
      tr: [
        "Çentik, kama kanalı, eğilme, birleşik yük, plastik davranış ve yorulma etkileri bu temel burulma modelinde yoktur.",
        "Mil çapı ve malzeme seçimi, gerçek yük spektrumu, bağlantı detayları ve proje güvenlik kriterleriyle doğrulanmalıdır.",
      ],
      en: [
        "Notches, keyways, bending, combined loading, plastic behavior, and fatigue are outside this baseline torsion model.",
        "Verify shaft sizing against the real load spectrum, connection details, material data, and project safety criteria.",
      ],
    },
    referenceStandards: {
      tr: ["Shigley, Mechanical Engineering Design (burulma ve mil tasarımı için mühendislik referansı)", "Proje malzeme verileri ve ilgili tasarım şartlarıyla doğrulama"],
      en: ["Shigley, Mechanical Engineering Design (engineering reference for torsion and shaft design)", "Verification against project material data and applicable design requirements"],
    },
    validationExamples: {
      tr: [
        {
          title: "Katı dairesel mil kontrolü",
          rows: [
            { input: "T=250 N·m, d=30 mm, L=800 mm, G=80 GPa", expectedOutput: "τ≈47,16 MPa; θ≈1,801°" },
          ],
          note: "Şaftın gerçek geometrisi, bağlantı zayıflıkları ve birleşik yükleri ayrıca değerlendirin.",
        },
      ],
      en: [
        {
          title: "Solid circular shaft check",
          rows: [
            { input: "T=250 N·m, d=30 mm, L=800 mm, G=80 GPa", expectedOutput: "τ≈47.16 MPa; θ≈1.801°" },
          ],
          note: "Evaluate the actual geometry, connection discontinuities, and combined loads separately.",
        },
      ],
    },
    version: "v1.0.0",
    lastUpdated: "2026-02-07",
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
    isSpecific: Boolean(toolDocumentationById[toolId]),
    scope: resolveLocalizedValue(entry.scope, locale) ?? "",
    assumptionsAndUnits: resolveLocalizedValue(entry.assumptionsAndUnits, locale) ?? [],
    limits: resolveLocalizedValue(entry.limits, locale) ?? [],
    referenceStandards: resolveLocalizedValue(entry.referenceStandards, locale) ?? [],
    validationExamples: resolveLocalizedValue(entry.validationExamples, locale) ?? [],
    version: entry.version,
    lastUpdated: entry.lastUpdated,
  };
};
