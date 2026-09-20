export type HeroAssetKey =
  | "about"
  | "home"
  | "tools"
  | "blog"
  | "guides"
  | "glossary"
  | "community"
  | "support"
  | "faq"
  | "contact"
  | "privacy"
  | "toolDetail"
  | "projectHub"
  | "commissioning"
  | "projectTracking"
  | "rfq"
  | "partTracking"
  | "qualityTools"
  | "fixtureTools";

export type BlueprintAssetKey =
  | "converter"
  | "bolt"
  | "shaft"
  | "piping"
  | "hydraulic"
  | "weld"
  | "gear"
  | "bearing"
  | "threaded"
  | "gearTooth"
  | "weldJoint"
  | "fea"
  | "exploded";

export type StandardHeroAssetKey = "fluids" | "fits" | "materials" | "threads";

export const HERO_PLACEHOLDER = "/images/hero-background.webp";

export const HERO_ASSETS: Record<HeroAssetKey, string> = {
  about: "/images/general-machine-diagram.webp",
  home: "/images/home-hero.webp",
  tools: "/images/general-machine-diagram.webp",
  blog: "/images/blog-hero.webp",
  guides: "/images/tool-library.webp",
  glossary: "/images/general-machine-diagram.webp",
  community: "/images/community-hero.webp",
  support: "/images/support-hero.webp",
  faq: "/images/support-hero.webp",
  contact: "/images/support-hero.webp",
  privacy: "/images/office-atmosphere.webp",
  toolDetail: "/images/tool-detail.webp",
  projectHub: "/images/industrial-facility.webp",
  commissioning: "/images/project-page.webp",
  projectTracking: "/images/dashboard-planning-visualization.webp",
  rfq: "/images/rfq-specific.webp",
  partTracking: "/images/exploded-view.webp",
  qualityTools: "/images/quality-control.webp",
  fixtureTools: "/images/fixture-tools-hero.jpg",
};

export const BLUEPRINT_ASSETS: Record<BlueprintAssetKey, string> = {
  converter: "/images/general-machine-diagram.webp",
  bolt: "/images/bolt-assembly.webp",
  shaft: "/images/shaft.webp",
  piping: "/images/hydraulic-circuit.webp",
  hydraulic: "/images/hydraulic-circuit.webp",
  weld: "/images/weld-diagram.webp",
  gear: "/images/Gear.webp",
  bearing: "/images/bearing-section.webp",
  threaded: "/images/threaded-connection.webp",
  gearTooth: "/images/gear-tooth-profile.webp",
  weldJoint: "/images/weld-joint-diagram.webp",
  fea: "/images/fea.webp",
  exploded: "/images/exploded-view.webp",
};

export const STANDARD_HERO_ASSETS: Record<StandardHeroAssetKey, string> = {
  fluids: "/images/hydraulic-circuit.webp",
  fits: "/images/shaft.webp",
  materials: "/images/fea.webp",
  threads: "/images/threaded-connection.webp",
};

const TOOL_HERO_ASSETS: Record<string, string> = {
  "bolt-calculator": "/images/bolt-assembly.webp",
  "torque-power": "/images/electric-motor.webp",
  "bending-stress": "/images/beam-section.webp",
  "bearing-life": "/images/rulman-blueprint.webp",
  "shaft-torsion": "/images/shaft.webp",
  "fillet-weld": "/images/weld-joint-diagram.webp",
  "pipe-pressure-loss": "/images/pump-diagram.webp",
  "hydraulic-cylinder": "/images/pump-diagram.webp",
  "belt-length": "/images/belt-pulley.webp",
  "gear-design": "/images/gear-tooth-profile.webp",
  "gear-calculators": "/images/gear-tooth-profile.webp",
  "gear-backlash": "/images/gear-tooth-profile.webp",
  "gear-contact-ratio": "/images/gear-tooth-profile.webp",
  "gear-force-torque": "/images/gear-tooth-profile.webp",
  "gear-helix-axial": "/images/gear-tooth-profile.webp",
  "gear-module": "/images/gear-tooth-profile.webp",
  "gear-ratio": "/images/gear-tooth-profile.webp",
  "gear-viscosity": "/images/gear-tooth-profile.webp",
  "gear-weight": "/images/gear-tooth-profile.webp",
  "gear-simulations": "/images/gearbox-cutaway.webp",
  "unit-converter": "/images/tool-library.webp",
  "sanity-check": "/images/dashboard-planning-visualization.webp",
  "basic-engineering": "/images/general-machine-diagram.webp",
  "param-chart": "/images/pin-spring.webp",
  "simple-stress": "/images/shaft.webp",
  "bolt-database": "/images/threaded-connection.webp",
  "compressor-cc": "/images/piston-assembly.webp",
  "strength-statics": "/images/general-machine-diagram.webp",
  "machine-elements": "/images/general-machine-diagram.webp",
  "fluids-hvac": "/images/hydraulic-circuit.webp",
  "heat-energy": "/images/thermal-map.webp",
  "materials-manufacturing": "/images/general-machine-diagram.webp",
  "production-project": "/images/project-page.webp",
  "sealing-guide": "/images/general-machine-diagram.webp",
  "coating-guide": "/images/general-machine-diagram.webp",
  "material-cards": "/images/general-machine-diagram.webp",
  "reference": "/images/rulman-blueprint.webp",
  "heat-treatment": "/images/general-machine-diagram.webp",
};

const ADDITIONAL_PUBLIC_IMAGE_PATHS = [
  "/images/empty-state.webp",
  "/images/pin-spring.webp",
  "/images/screw-thread.webp",
  "/images/workspace-flat-lay.webp",
  "/images/broken-gear (404).webp",
  "/og-image.png",
];

const BLOG_IMAGE_ASSETS = [
  "/images/blog/bilyali-rulman-mi-makarali-rulman-mi.webp",
  "/images/blog/boru-capi-seciminde-hiz-ve-basinc-dengesi.webp",
  "/images/blog/civata-gevsemesinin-5-ana-nedeni.webp",
  "/images/blog/civata-mukavemet-siniflari-8-8-10-9-12-9.webp",
  "/images/blog/civata-on-yuk-kuvveti-nedir.webp",
  "/images/blog/darcy-weisbach-denklemi-boru-basinc-kaybi.webp",
  "/images/blog/din-931-ve-din-933-farki.webp",
  "/images/blog/dinamik-ve-statik-yuk-kapasitesi-c-ve-c0.webp",
  "/images/blog/disli-modulu-nedir-nasil-secilir.webp",
  "/images/blog/disli-omrunu-kisaltan-tasarim-hatalari.webp",
  "/images/blog/disli-orani-hesabi.webp",
  "/images/blog/duz-disli-mi-helisel-disli-mi.webp",
  "/images/blog/evolvent-dis-profili-nedir.webp",
  "/images/blog/excel-ile-muhendislik-hesabi-yapmanin-7-riski.webp",
  "/images/blog/hidrolik-silindir-kuvveti-nasil-hesaplanir.webp",
  "/images/blog/iso-din-vdi-standartlari-arasindaki-fark.webp",
  "/images/blog/l10-rulman-omru-nedir-nasil-hesaplanir.webp",
  "/images/blog/metrik-ve-inc-vida-adimi-farklari.webp",
  "/images/blog/mil-gobek-baglantisi-kamali-flansli-gecme-cakma.webp",
  "/images/blog/motor-seciminde-tork-egrisi-nasil-okunur.webp",
  "/images/blog/muhendislik-hesaplarinda-guvenlik-katsayisi.webp",
  "/images/blog/paslanmaz-celik-civata-mi-galvanizli-mi.webp",
  "/images/blog/reduktor-seciminde-5-kriter.webp",
  "/images/blog/reynolds-sayisi-laminar-turbulansli-akis.webp",
  "/images/blog/rulman-toleranslari-iso-286-sistemi.webp",
  "/images/blog/saft-boyutlandirma-tork-burulma-gerilmesi.webp",
  "/images/blog/tork-anahtari-nasil-dogru-kullanilir.webp",
  "/images/blog/tork-katsayisi-k-faktoru-nedir.webp",
  "/images/blog/tork-ve-guc-arasindaki-fark.webp",
  "/images/blog/zincir-kasnak-sistemi-mi-disli-kutusu-mu.webp",
];

export function getToolHeroImage(toolId?: string | null): string {
  if (!toolId) return HERO_ASSETS.toolDetail ?? HERO_PLACEHOLDER;

  return TOOL_HERO_ASSETS[toolId] ?? HERO_ASSETS.toolDetail ?? HERO_PLACEHOLDER;
}

export function getHeroImageSrc(key: HeroAssetKey): string {
  return HERO_ASSETS[key] ?? HERO_PLACEHOLDER;
}

export function listHeroImagePaths(): string[] {
  return Array.from(new Set([...Object.values(HERO_ASSETS), HERO_PLACEHOLDER]));
}

export function getBlueprintImageSrc(key: BlueprintAssetKey): string {
  return BLUEPRINT_ASSETS[key] ?? HERO_PLACEHOLDER;
}

export function getStandardHeroImageSrc(key: StandardHeroAssetKey): string {
  return STANDARD_HERO_ASSETS[key] ?? HERO_PLACEHOLDER;
}

export function listBlueprintImagePaths(): string[] {
  return Array.from(new Set(Object.values(BLUEPRINT_ASSETS)));
}

export function listPublicImagePaths(): string[] {
  return Array.from(
    new Set([
      ...listHeroImagePaths(),
      ...listBlueprintImagePaths(),
      ...Object.values(STANDARD_HERO_ASSETS),
      ...Object.values(TOOL_HERO_ASSETS),
      ...BLOG_IMAGE_ASSETS,
      ...ADDITIONAL_PUBLIC_IMAGE_PATHS,
      "/images/logo.png",
    ]),
  ).sort();
}
