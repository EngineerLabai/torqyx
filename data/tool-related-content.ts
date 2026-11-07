export type ToolRelatedMapping = {
  guideSlugs?: string[];
  glossarySlugs?: string[];
};

/**
 * Explicit mapping between tools and related guides / glossary terms.
 * If a tool has no mapping or empty arrays, related blocks will NOT be rendered.
 */
export const TOOL_RELATED_CONTENT: Record<string, ToolRelatedMapping> = {
  "bolt-calculator": {
    guideSlugs: ["civata-basi-sekilleri-ve-turleri", "makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["torque", "tensile-strength", "yield-strength", "stress"],
  },
  "unit-converter": {
    guideSlugs: ["standart-birim-sistemi-rehberi"],
    glossarySlugs: ["density", "viscosity", "stress", "torque"],
  },
  "sanity-check": {
    guideSlugs: ["standart-birim-sistemi-rehberi", "tolerans-zinciri-analizi-kotu-durum-ve-rss"],
    glossarySlugs: ["factor-of-safety", "tolerance", "stress", "density"],
  },
  "basic-engineering": {
    guideSlugs: ["isi-yalitimi-termal-genlesme-rehberi"],
    glossarySlugs: ["thermal-conductivity", "resistance", "density"],
  },
  "tolerance-lab": {
    guideSlugs: [
      "tolerans-zinciri-analizi-kotu-durum-ve-rss",
      "tolerans-zinciri-ve-gdt-rehberi",
      "press-fit-baglantilari-tolerans-secimi",
    ],
    glossarySlugs: ["tolerance", "clearance", "interference", "gdt"],
  },
  "param-chart": {
    guideSlugs: ["helisel-yay-tasarimi-ve-kuvvet-grafigi-en-13906"],
    glossarySlugs: ["stress", "strain", "youngs-modulus", "fatigue"],
  },
  "simple-stress": {
    guideSlugs: ["makine-ogesi-omru-yorulma-rehberi", "kiris-egilme-ve-sehim-hesabi-euler-bernoulli"],
    glossarySlugs: ["stress", "tensile-strength", "yield-strength", "strain"],
  },
  "bending-stress": {
    guideSlugs: ["kiris-egilme-ve-sehim-hesabi-euler-bernoulli", "makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["bending-moment", "stress", "buckling", "youngs-modulus"],
  },
  "bolt-database": {
    guideSlugs: ["civata-basi-sekilleri-ve-turleri", "makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["torque", "tensile-strength", "iso", "din"],
  },
  "compressor-cc": {
    guideSlugs: ["akiskan-dinamigi-temelleri-boru-kanal-akisi", "pompa-turleri-secim-rehberi"],
    glossarySlugs: ["turbulent-flow", "torque", "density", "cavitation"],
  },
  "belt-length": {
    guideSlugs: ["makine-ogesi-omru-yorulma-rehberi", "doner-ekipman-dengeleme-titresim-kontrolu"],
    glossarySlugs: ["coefficient-of-friction", "torque", "concentricity", "runout"],
  },
  "torque-power": {
    guideSlugs: ["doner-ekipman-dengeleme-titresim-kontrolu", "makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["torque", "power-factor", "resonance", "stress"],
  },
  "bearing-life": {
    guideSlugs: ["rulman-secimi-icin-hizli-rehber", "makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["fatigue", "rolling", "clearance", "hardness"],
  },
  "shaft-torsion": {
    guideSlugs: ["kama-tasarimi-101", "makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["torque", "shear-stress", "stress", "fatigue"],
  },
  "fillet-weld": {
    guideSlugs: ["kaynakli-tasarim-guvenlik-maliyet"],
    glossarySlugs: ["welding", "shear-stress", "stress", "factor-of-safety"],
  },
  "pipe-pressure-loss": {
    guideSlugs: ["akiskan-dinamigi-temelleri-boru-kanal-akisi", "pompa-turleri-secim-rehberi"],
    glossarySlugs: ["head-loss", "reynolds-number", "hydraulic-diameter", "turbulent-flow"],
  },
  "hydraulic-cylinder": {
    guideSlugs: ["akiskan-dinamigi-temelleri-boru-kanal-akisi", "pompa-turleri-secim-rehberi"],
    glossarySlugs: ["head-loss", "stress", "clearance", "cavitation"],
  },
  "strength-statics": {
    guideSlugs: ["kiris-egilme-ve-sehim-hesabi-euler-bernoulli", "makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["stress", "strain", "buckling", "shear-stress"],
  },
  "machine-elements": {
    guideSlugs: [
      "kama-tasarimi-101",
      "rulman-secimi-icin-hizli-rehber",
      "makine-ogesi-omru-yorulma-rehberi",
    ],
    glossarySlugs: ["torque", "fatigue", "clearance", "factor-of-safety"],
  },
  "fluids-hvac": {
    guideSlugs: ["akiskan-dinamigi-temelleri-boru-kanal-akisi", "pompa-turleri-secim-rehberi"],
    glossarySlugs: ["reynolds-number", "head-loss", "laminar-flow", "turbulent-flow"],
  },
  "heat-energy": {
    guideSlugs: ["isi-yalitimi-termal-genlesme-rehberi"],
    glossarySlugs: ["thermal-conductivity", "resistance", "density"],
  },
  "materials-manufacturing": {
    guideSlugs: [
      "malzeme-secimi-rehberi",
      "cnc-makineleme-malzeme-secimi",
      "yuzey-isleme-yontemleri-rehberi",
    ],
    glossarySlugs: ["machining", "cnc", "hardness", "tensile-strength"],
  },
  "production-project": {
    guideSlugs: ["cnc-makineleme-malzeme-secimi"],
    glossarySlugs: ["machining", "cnc", "tolerance"],
  },
  "gear-design": {
    guideSlugs: ["makine-ogesi-omru-yorulma-rehberi", "viskozite-siniflandirmasi-rehberi"],
    glossarySlugs: ["backlash", "torque", "fatigue", "clearance"],
  },
  "gear-calculators": {
    guideSlugs: ["makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["backlash", "torque", "clearance"],
  },
  "gear-backlash": {
    guideSlugs: ["press-fit-baglantilari-tolerans-secimi", "tolerans-zinciri-ve-gdt-rehberi"],
    glossarySlugs: ["backlash", "clearance", "tolerance", "interference"],
  },
  "gear-contact-ratio": {
    guideSlugs: ["makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["backlash", "stress", "fatigue"],
  },
  "gear-force-torque": {
    guideSlugs: ["makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["torque", "bending-moment", "stress", "shear-stress"],
  },
  "gear-helix-axial": {
    guideSlugs: ["makine-ogesi-omru-yorulma-rehberi", "rulman-secimi-icin-hizli-rehber"],
    glossarySlugs: ["torque", "stress", "rolling"],
  },
  "gear-module": {
    guideSlugs: ["makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["backlash", "clearance", "tolerance"],
  },
  "gear-ratio": {
    guideSlugs: ["makine-ogesi-omru-yorulma-rehberi", "doner-ekipman-dengeleme-titresim-kontrolu"],
    glossarySlugs: ["torque", "resonance"],
  },
  "gear-viscosity": {
    guideSlugs: ["viskozite-siniflandirmasi-rehberi"],
    glossarySlugs: ["viscosity", "coefficient-of-friction", "turbulent-flow"],
  },
  "gear-weight": {
    guideSlugs: ["malzeme-secimi-rehberi"],
    glossarySlugs: ["density", "stress", "yield-strength"],
  },
  "gear-simulations": {
    guideSlugs: ["makine-ogesi-omru-yorulma-rehberi"],
    glossarySlugs: ["backlash", "resonance", "stress"],
  },
  "sealing-guide": {
    guideSlugs: ["press-fit-baglantilari-tolerans-secimi"],
    glossarySlugs: ["clearance", "interference", "tolerance", "viscosity"],
  },
  "coating-guide": {
    guideSlugs: ["korozyon-direnci-paslanmaz-celik-secimi", "yuzey-isleme-yontemleri-rehberi"],
    glossarySlugs: ["corrosion-resistance", "surface-finishing", "hardness"],
  },
  "material-cards": {
    guideSlugs: [
      "malzeme-secimi-rehberi",
      "titanyum-alasimlari-rehberi",
      "korozyon-direnci-paslanmaz-celik-secimi",
    ],
    glossarySlugs: ["yield-strength", "tensile-strength", "hardness", "ductility"],
  },
  "reference": {
    guideSlugs: ["standart-birim-sistemi-rehberi", "malzeme-secimi-rehberi"],
    glossarySlugs: ["tolerance", "density", "coefficient-of-friction", "din"],
  },
  "heat-treatment": {
    guideSlugs: ["malzeme-secimi-rehberi", "yuzey-isleme-yontemleri-rehberi"],
    glossarySlugs: ["hardness", "ductility", "yield-strength", "tensile-strength"],
  },
};
