import type { Locale } from "@/utils/locale";

type ShaftTorsionCopy = {
  input: {
    title: string;
    description: string;
    torqueLabel: string;
    diameterLabel: string;
    lengthLabel: string;
    shearModulusLabel: string;
    allowableShearLabel: string;
  };
  result: {
    title: string;
    description: string;
    errorMessage: string;
    shearStressLabel: string;
    polarMomentLabel: string;
    twistAngleRadLabel: string;
    twistAngleDegLabel: string;
    safetyLabel: string;
    explanationTitle: string;
    variables: Array<{ symbol: string; description: string }>;
    notes: string[];
  };
  visualization: {
    title: string;
    description: string;
    polarMomentLabel: string;
  };
};

const SHAFT_TORSION_COPY = {
  tr: {
    input: {
      title: "Girdiler",
      description: "Torku, mil geometrisini ve malzeme özelliğini girin.",
      torqueLabel: "Tork T (N·m)",
      diameterLabel: "Mil çapı d (mm)",
      lengthLabel: "Mil uzunluğu L (mm)",
      shearModulusLabel: "Kayma modülü G (GPa)",
      allowableShearLabel: "İzin verilen kayma gerilmesi (MPa, isteğe bağlı)",
    },
    result: {
      title: "Sonuçlar",
      description: "Katı dairesel mil için gerilme, kutupsal atalet momenti ve elastik dönme açısı.",
      errorMessage: "Hesaplama için geçerli, pozitif ve sonlu girdiler kullanın.",
      shearStressLabel: "Maksimum kayma gerilmesi τ",
      polarMomentLabel: "Kutupsal atalet momenti J",
      twistAngleRadLabel: "Dönme açısı θ (radyan)",
      twistAngleDegLabel: "Dönme açısı θ (derece)",
      safetyLabel: "Kayma gerilmesine göre emniyet katsayısı",
      explanationTitle: "Nasıl hesaplanır?",
      variables: [
        { symbol: "T", description: "Uygulanan tork (N·mm)." },
        { symbol: "d", description: "Katı dairesel mil çapı (mm)." },
        { symbol: "L", description: "Mil uzunluğu (mm)." },
        { symbol: "G", description: "Kayma modülü (MPa)." },
        { symbol: "J", description: "Kutupsal atalet momenti (mm⁴)." },
        { symbol: "τ", description: "Maksimum kayma gerilmesi (MPa)." },
        { symbol: "θ", description: "Elastik dönme açısı (radyan)." },
      ],
      notes: [
        "Kesit, boyunca sabit çaplı katı dairesel mil kabul edilir.",
        "Malzemenin lineer elastik davrandığı ve dönme açısının küçük olduğu varsayılır.",
        "Emniyet katsayısı yalnızca izin verilen kayma gerilmesi sıfırdan büyükse gösterilir.",
      ],
    },
    visualization: {
      title: "Mil rijitliği özeti",
      description: "J kutupsal atalet momenti, burulma rijitliğinin geometrik bileşenidir.",
      polarMomentLabel: "J (mm⁴)",
    },
  },
  en: {
    input: {
      title: "Inputs",
      description: "Enter torque, shaft geometry, and the material property.",
      torqueLabel: "Torque T (N·m)",
      diameterLabel: "Shaft diameter d (mm)",
      lengthLabel: "Shaft length L (mm)",
      shearModulusLabel: "Shear modulus G (GPa)",
      allowableShearLabel: "Allowable shear stress (MPa, optional)",
    },
    result: {
      title: "Results",
      description: "Stress, polar moment, and elastic twist for a solid circular shaft.",
      errorMessage: "Use valid, positive, finite inputs for the calculation.",
      shearStressLabel: "Maximum shear stress τ",
      polarMomentLabel: "Polar moment of area J",
      twistAngleRadLabel: "Twist angle θ (radians)",
      twistAngleDegLabel: "Twist angle θ (degrees)",
      safetyLabel: "Safety factor based on shear stress",
      explanationTitle: "How it is calculated",
      variables: [
        { symbol: "T", description: "Applied torque (N·mm)." },
        { symbol: "d", description: "Solid circular shaft diameter (mm)." },
        { symbol: "L", description: "Shaft length (mm)." },
        { symbol: "G", description: "Shear modulus (MPa)." },
        { symbol: "J", description: "Polar moment of area (mm⁴)." },
        { symbol: "τ", description: "Maximum shear stress (MPa)." },
        { symbol: "θ", description: "Elastic twist angle (radians)." },
      ],
      notes: [
        "The section is treated as a uniform solid circular shaft.",
        "Linear-elastic material behavior and a small twist angle are assumed.",
        "The safety factor is shown only when allowable shear stress is greater than zero.",
      ],
    },
    visualization: {
      title: "Shaft stiffness summary",
      description: "The polar moment J is the geometric component of torsional stiffness.",
      polarMomentLabel: "J (mm⁴)",
    },
  },
} satisfies Record<Locale, ShaftTorsionCopy>;

export const getShaftTorsionCopy = (locale: Locale) => SHAFT_TORSION_COPY[locale] ?? SHAFT_TORSION_COPY.tr;
