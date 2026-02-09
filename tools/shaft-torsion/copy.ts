import type { Locale } from "@/utils/locale";

const SHAFT_TORSION_BASE = {
  input: {
    title: "Inputs",
    description: "Enter torque, geometry, and material.",
    torqueLabel: "Torque T",
    diameterLabel: "Diameter d",
    lengthLabel: "Length L",
    shearModulusLabel: "Shear modulus G",
    allowableShearLabel: "Allowable shear stress",
  },
  result: {
    title: "Results",
    description: "Shear stress, twist angle, and safety factor.",
    shearStressLabel: "Shear stress tau",
    twistAngleLabel: "Twist angle theta",
    safetyLabel: "Safety factor",
    explanationTitle: "How it is calculated",
    variables: [
      { symbol: "T", description: "Applied torque." },
      { symbol: "d", description: "Shaft diameter." },
      { symbol: "L", description: "Shaft length." },
      { symbol: "G", description: "Shear modulus." },
      { symbol: "J", description: "Polar moment of inertia." },
      { symbol: "tau", description: "Shear stress." },
      { symbol: "theta", description: "Twist angle." },
    ],
    notes: ["Assumes a solid circular shaft.", "Elastic behavior and small angles are assumed."],
  },
};

const SHAFT_TORSION_COPY: Record<Locale, typeof SHAFT_TORSION_BASE> = {
  tr: SHAFT_TORSION_BASE,
  en: SHAFT_TORSION_BASE,
};

export const getShaftTorsionCopy = (locale: Locale) => SHAFT_TORSION_COPY[locale] ?? SHAFT_TORSION_COPY.tr;
