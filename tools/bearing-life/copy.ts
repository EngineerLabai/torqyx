import type { Locale } from "@/utils/locale";

const BEARING_LIFE_BASE = {
  input: {
    title: "Inputs",
    description: "Enter bearing ratings and speed.",
    dynamicLoadLabel: "Dynamic load rating C",
    dynamicLoadPlaceholder: "e.g. 25",
    equivalentLoadLabel: "Equivalent load P",
    equivalentLoadPlaceholder: "e.g. 10",
    bearingTypeLabel: "Bearing type",
    bearingTypeOptions: [
      { value: "ball", label: "Ball bearing" },
      { value: "roller", label: "Roller bearing" },
    ],
    rpmLabel: "Speed (rpm)",
    rpmPlaceholder: "e.g. 1500",
    reliabilityLabel: "Reliability factor a1",
    reliabilityPlaceholder: "e.g. 1.0",
  },
  result: {
    title: "Results",
    description: "Basic rating life from the standard equation.",
    l10Label: "L10 (million rev)",
    l10hLabel: "L10h (hours)",
    lnaLabel: "Lna, adjusted life (million rev)",
    lnahLabel: "Lnah, adjusted life (hours)",
    exponentLabel: "Exponent p",
    explanationTitle: "How it is calculated",
    variables: [
      { symbol: "C", description: "Dynamic load rating." },
      { symbol: "P", description: "Equivalent load." },
      { symbol: "p", description: "Exponent (3 for ball, 10/3 for roller)." },
      { symbol: "a1", description: "Reliability adjustment factor." },
      { symbol: "n", description: "Speed (rpm)." },
      { symbol: "L10", description: "Basic rating life (million rev)." },
      { symbol: "L10h", description: "Basic rating life in hours." },
      { symbol: "Lna", description: "Life adjusted by a1; it is not labelled L10 when a1 differs from 1." },
    ],
    notes: ["Assumes constant load and speed.", "Based on standard rating life equation."],
  },
  visualization: {
    title: "Load ratio",
    description: "Ratio of dynamic rating to equivalent load.",
    ratioLabel: "C / P",
  },
};

const BEARING_LIFE_COPY = {
  tr: {
    input: {
      title: "Girdiler",
      description: "Rulman yük değerlerini, tipini, devrini ve güvenilirlik katsayısını girin.",
      dynamicLoadLabel: "Dinamik yük sayısı C",
      dynamicLoadPlaceholder: "Örn. 25",
      equivalentLoadLabel: "Eşdeğer dinamik yük P",
      equivalentLoadPlaceholder: "Örn. 10",
      bearingTypeLabel: "Rulman tipi",
      bearingTypeOptions: [
        { value: "ball", label: "Bilyalı rulman" },
        { value: "roller", label: "Makaralı rulman" },
      ],
      rpmLabel: "Devir (rpm)",
      rpmPlaceholder: "Örn. 1500",
      reliabilityLabel: "Güvenilirlik katsayısı a1",
      reliabilityPlaceholder: "Örn. 1,0",
    },
    result: {
      title: "Sonuçlar",
      description: "Temel L10 ömrü ile a1 katsayısıyla ayarlanmış Lna ömrü ayrı gösterilir.",
      l10Label: "Temel L10 (milyon devir)",
      l10hLabel: "Temel L10h (saat)",
      lnaLabel: "Ayarlanmış Lna (milyon devir)",
      lnahLabel: "Ayarlanmış Lnah (saat)",
      exponentLabel: "Üs p",
      explanationTitle: "Nasıl hesaplanır?",
      variables: [
        { symbol: "C", description: "Dinamik yük sayısı." },
        { symbol: "P", description: "Eşdeğer dinamik yük." },
        { symbol: "p", description: "Bilyalı için 3, makaralı için 10/3." },
        { symbol: "a1", description: "Güvenilirlik ayar katsayısı." },
        { symbol: "n", description: "Devir (rpm)." },
        { symbol: "L10", description: "%90 güvenilirlikte temel ömür (milyon devir)." },
        { symbol: "L10h", description: "Temel ömrün saat karşılığı." },
        { symbol: "Lna", description: "a1 ile ayarlanmış ömür; a1 farklıysa L10 olarak adlandırılmaz." },
      ],
      notes: ["Sabit yük ve devir varsayılır.", "L10, %90 güvenilirlikte temel ömür tanımıdır."],
    },
    visualization: {
      title: "Yük oranı",
      description: "Dinamik yük sayısının eşdeğer yüke oranı.",
      ratioLabel: "C / P",
    },
  },
  en: BEARING_LIFE_BASE,
};

export const getBearingLifeCopy = (locale: Locale) => BEARING_LIFE_COPY[locale] ?? BEARING_LIFE_COPY.tr;
