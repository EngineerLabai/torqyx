import { toolCatalog, type ToolCatalogItem } from "@/tools/_shared/catalog";

export type RelatedLink = {
  slug: string;
  title: string;
  description: string;
  anchorText: string;
  relevance: "high" | "medium" | "low";
  category: string;
};

export type ToolCategoryGroup = {
  category: string;
  tools: ToolCatalogItem[];
  relatedCategories: string[];
};

// Araçları kategorilere göre gruplandır
export const toolCategories: ToolCategoryGroup[] = [
  {
    category: "Mechanical",
    tools: toolCatalog.filter(tool => tool.category === "Mechanical"),
    relatedCategories: ["General Engineering", "Automotive"],
  },
  {
    category: "General Engineering",
    tools: toolCatalog.filter(tool => tool.category === "General Engineering"),
    relatedCategories: ["Mechanical"],
  },
  {
    category: "Automotive",
    tools: toolCatalog.filter(tool => tool.category === "Automotive"),
    relatedCategories: ["Mechanical"],
  },
];

// Araçlar arası mantıksal bağlantılar
const toolRelationships: Record<string, string[]> = {
  // Dişli tasarımı zinciri
  "gear-design": ["gear-calculators", "gear-ratio", "gear-module", "gear-force-torque", "gear-contact-ratio", "gear-backlash", "gear-helix-axial", "gear-viscosity", "gear-weight", "gear-simulations"],
  "gear-calculators": ["gear-ratio", "gear-module", "gear-force-torque"],
  "gear-ratio": ["torque-power", "shaft-torsion"],
  "gear-force-torque": ["shaft-torsion", "bearing-life"],
  "gear-contact-ratio": ["gear-backlash", "gear-helix-axial"],
  "gear-simulations": ["gear-weight", "gear-force-torque"],

  // Cıvata tasarımı zinciri
  "bolt-calculator": ["bolt-database", "shaft-torsion", "fillet-weld"],
  "bolt-database": ["bolt-calculator"],

  // Mil tasarımı zinciri
  "shaft-torsion": ["bearing-life", "gear-force-torque", "torque-power"],
  "bearing-life": ["shaft-torsion", "rulman-secimi-icin-hizli-rehber"],

  // Kaynak tasarımı zinciri
  "fillet-weld": ["bolt-calculator", "simple-stress", "bending-stress"],

  // Akışkanlar zinciri
  "pipe-pressure-loss": ["hydraulic-cylinder", "compressor-cc"],
  "hydraulic-cylinder": ["pipe-pressure-loss", "torque-power"],

  // Temel mukavemet zinciri
  "simple-stress": ["bending-stress", "strength-statics"],
  "bending-stress": ["simple-stress", "strength-statics"],

  // Güç aktarımı zinciri
  "torque-power": ["shaft-torsion", "gear-ratio", "belt-length"],
  "belt-length": ["torque-power", "shaft-torsion"],

  // Genel mühendislik araçları
  "unit-converter": ["sanity-check", "basic-engineering"],
  "sanity-check": ["unit-converter", "basic-engineering", "param-chart"],
  "basic-engineering": ["sanity-check", "heat-energy"],

  // Otomotiv zinciri
  "compressor-cc": ["torque-power", "pipe-pressure-loss"],

  // Malzeme ve imalat
  "material-cards": ["heat-treatment", "coating-guide", "sealing-guide"],
  "heat-treatment": ["material-cards", "coating-guide"],
  "coating-guide": ["material-cards", "sealing-guide"],
  "sealing-guide": ["coating-guide", "material-cards"],

  // Referans araçları
  "reference": ["unit-converter", "material-cards", "bolt-database"],
};

// Blog/guide bağlantıları
const contentRelationships: Record<string, string[]> = {
  "rulman-secimi-icin-hizli-rehber": ["bearing-life", "shaft-torsion"],
  "muhendislik-hesaplama-surecleri": ["sanity-check", "unit-converter", "basic-engineering"],
  "teknik-icerik-basliklari": ["gear-design", "bolt-calculator", "shaft-torsion"],
};

// Anchor text önerileri
const anchorTextSuggestions: Record<string, string[]> = {
  "bolt-calculator": [
    "cıvata hesabı yapın",
    "ön yük hesaplayın",
    "tork değerini bulun",
    "gerilme alanı hesaplayın"
  ],
  "shaft-torsion": [
    "mil burulma hesabı",
    "torsiyon gerilmesi hesaplayın",
    "mil tasarımı için",
    "burulma açısı bulun"
  ],
  "bearing-life": [
    "rulman ömrü hesaplayın",
    "L10 ömrü bulun",
    "rulman seçimi için",
    "rulman kapasitesi kontrolü"
  ],
  "torque-power": [
    "güç-tork-dönüş hesabı",
    "motor gücü hesaplayın",
    "tork değerini bulun",
    "kW'dan Nm'ye dönüşüm"
  ],
  "pipe-pressure-loss": [
    "basınç kaybı hesaplayın",
    "boru direnci bulun",
    "Reynolds sayısı hesaplayın",
    "Darcy-Weisbach formülü"
  ],
  "unit-converter": [
    "birim dönüşümü yapın",
    "SI birimlerine çevirin",
    "imperial to metric",
    "birim dönüştürücü"
  ],
  "sanity-check": [
    "hesaplamanızı doğrulayın",
    "mühendislik kontrolü",
    "formül doğrulama",
    "hesaplama kontrolü"
  ],
  "gear-design": [
    "dişli tasarımı rehberi",
    "dişli hesaplama araçları",
    "dişli tasarımı için",
    "gear design guide"
  ],
};

/**
 * Belirli bir araç için ilgili bağlantıları önerir
 */
export function getLinkSuggestions(currentToolSlug: string): RelatedLink[] {
  const suggestions: RelatedLink[] = [];
  const currentTool = toolCatalog.find(tool => tool.id === currentToolSlug);

  if (!currentTool) return suggestions;

  // Doğrudan ilişkili araçlar
  const relatedToolIds = toolRelationships[currentToolSlug] || [];
  relatedToolIds.forEach(toolId => {
    const relatedTool = toolCatalog.find(t => t.id === toolId);
    if (relatedTool) {
      const anchorTexts = anchorTextSuggestions[toolId] || [];
      const anchorText = anchorTexts[0] || relatedTool.title.toLowerCase();

      suggestions.push({
        slug: toolId,
        title: relatedTool.title,
        description: relatedTool.description,
        anchorText,
        relevance: "high",
        category: relatedTool.category || "General",
      });
    }
  });

  // Aynı kategorideki diğer araçlar (eğer yeterli bağlantı yoksa)
  if (suggestions.length < 3) {
    const sameCategoryTools = toolCatalog.filter(tool =>
      tool.category === currentTool.category && tool.id !== currentToolSlug
    );

    sameCategoryTools.slice(0, 3 - suggestions.length).forEach(tool => {
      const anchorTexts = anchorTextSuggestions[tool.id] || [];
      const anchorText = anchorTexts[0] || tool.title.toLowerCase();

      suggestions.push({
        slug: tool.id,
        title: tool.title,
        description: tool.description,
        anchorText,
        relevance: "medium",
        category: tool.category || "General",
      });
    });
  }

  // Blog/guide bağlantıları
  Object.entries(contentRelationships).forEach(([contentSlug, toolIds]) => {
    if (toolIds.includes(currentToolSlug)) {
      suggestions.push({
        slug: contentSlug,
        title: contentSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `İlgili teknik rehber ve blog içeriği`,
        anchorText: "detaylı rehber",
        relevance: "low",
        category: "Content",
      });
    }
  });

  return suggestions.slice(0, 6); // Maksimum 6 öneri
}

/**
 * Tüm araçların bağlantı haritasını oluşturur
 */
export function buildInternalLinkingMap(): Record<string, RelatedLink[]> {
  const linkingMap: Record<string, RelatedLink[]> = {};

  toolCatalog.forEach(tool => {
    linkingMap[tool.id] = getLinkSuggestions(tool.id);
  });

  return linkingMap;
}

/**
 * Araçları kategoriye göre gruplayarak bağlantı önerileri
 */
export function getCategoryBasedSuggestions(category: string): RelatedLink[] {
  const categoryGroup = toolCategories.find(group => group.category === category);
  if (!categoryGroup) return [];

  return categoryGroup.tools.map(tool => ({
    slug: tool.id,
    title: tool.title,
    description: tool.description,
    anchorText: tool.title.toLowerCase(),
    relevance: "medium" as const,
    category: tool.category || "General",
  }));
}