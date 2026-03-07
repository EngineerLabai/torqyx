import type { Locale } from "@/utils/locale";

export type QualityToolStatus = "free" | "beta" | "planned" | "premium";
export type QualityToolLevel = "basic" | "advanced";

export type QualityToolRegistryItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  useCases: string[];
  status: QualityToolStatus;
  level: QualityToolLevel;
  href?: string;
};

const QUALITY_TOOLS_BY_LOCALE: Record<Locale, QualityToolRegistryItem[]> = {
  tr: [
    {
      id: "5n1k",
      label: "5N1K",
      title: "5N1K Problem Tanımı",
      description:
        "Problemi netleştirmek için Ne, Nerede, Ne zaman, Nasıl, Neden ve Kim sorularını sistematik şekilde doldurmayı sağlar.",
      useCases: [
        "Kalite problemi ilk tanımlama",
        "Müşteri şikayeti analizi öncesi",
        "8D ve kök neden analizine giriş",
      ],
      status: "free",
      level: "basic",
      href: "/quality-tools/5n1k",
    },
    {
      id: "5why",
      label: "5 Why",
      title: "5 Why (5 Neden) Analizi",
      description:
        'Bir problemin kök nedenine ulaşmak için ardışık "Neden?" sorularının yapılandırılmış şekilde sorulmasını sağlar.',
      useCases: [
        "Tekrarlayan arıza analizi",
        "Müşteri şikayetinde kök neden arayışı",
        "İç kalite uygunsuzlukları",
      ],
      status: "planned",
      level: "basic",
      href: "/quality-tools/5why",
    },
    {
      id: "8d",
      label: "8D",
      title: "8D Rapor İskeleti",
      description:
        "8D metodolojisine göre ekip, problem tanımı, kök neden ve kalıcı aksiyonları içeren rapor iskeleti sunar.",
      useCases: [
        "Otomotiv müşteri şikayetleri",
        "Ciddi iç uygunsuzluklar",
        "Kalıcı aksiyon gerektiren problemler",
      ],
      status: "beta",
      level: "advanced",
      href: "/quality-tools/8d",
    },
    {
      id: "kaizen",
      label: "Kaizen",
      title: "Kaizen / Sürekli İyileştirme Kartı",
      description:
        "Küçük ama sürekli iyileştirmeleri takip etmek için problem-hedef-aksiyon-sonuç yapısında kayıt tutmayı sağlar.",
      useCases: [
        "Atölye/hat iyileştirmeleri",
        "Verimlilik ve ergonomi iyileştirmeleri",
        "Kayıp azaltma çalışmaları",
      ],
      status: "beta",
      level: "basic",
      href: "/quality-tools/kaizen",
    },
    {
      id: "poka-yoke",
      label: "Poka-Yoke",
      title: "Poka-Yoke Fikir Kartı",
      description:
        "Hata önleyici (poka-yoke) fikirleri tanımlayıp uygulanabilirlik ve etki derecesini değerlendirir.",
      useCases: [
        "Montaj hatalarında hata önleme",
        "Yanlış parça montajının engellenmesi",
        "Operatör hatalarını sistemle önleme",
      ],
      status: "beta",
      level: "advanced",
      href: "/quality-tools/poka-yoke",
    },
  ],
  en: [
    {
      id: "5n1k",
      label: "5W1H",
      title: "5W1H Problem Definition",
      description:
        "Structure the problem by filling What, Where, When, How, Why, and Who questions systematically.",
      useCases: [
        "Initial quality issue definition",
        "Before customer complaint analysis",
        "Entry to 8D and root cause work",
      ],
      status: "free",
      level: "basic",
      href: "/quality-tools/5n1k",
    },
    {
      id: "5why",
      label: "5 Why",
      title: "5 Why Analysis",
      description:
        "Reach root cause by asking structured 'Why?' questions in sequence.",
      useCases: [
        "Recurring failure analysis",
        "Root cause in customer complaints",
        "Internal quality nonconformities",
      ],
      status: "planned",
      level: "basic",
      href: "/quality-tools/5why",
    },
    {
      id: "8d",
      label: "8D",
      title: "8D Report Template",
      description:
        "Provides a report skeleton for team, problem definition, root cause, and permanent actions.",
      useCases: [
        "Automotive customer complaints",
        "Critical internal nonconformities",
        "Issues requiring permanent action",
      ],
      status: "beta",
      level: "advanced",
      href: "/quality-tools/8d",
    },
    {
      id: "kaizen",
      label: "Kaizen",
      title: "Kaizen / Continuous Improvement Card",
      description:
        "Track small, continuous improvements in a problem-goal-action-result format.",
      useCases: [
        "Shopfloor improvements",
        "Productivity and ergonomics gains",
        "Loss reduction initiatives",
      ],
      status: "beta",
      level: "basic",
      href: "/quality-tools/kaizen",
    },
    {
      id: "poka-yoke",
      label: "Poka-Yoke",
      title: "Poka-Yoke Idea Card",
      description:
        "Define error-proofing ideas and evaluate feasibility and impact.",
      useCases: [
        "Preventing assembly errors",
        "Avoiding wrong part installation",
        "Reducing operator mistakes",
      ],
      status: "beta",
      level: "advanced",
      href: "/quality-tools/poka-yoke",
    },
  ],
};

const QUALITY_TOOL_STATUS_LABELS: Record<Locale, Record<QualityToolStatus, string>> = {
  tr: {
    free: "Ücretsiz",
    beta: "Beta",
    planned: "Yakında",
    premium: "Premium",
  },
  en: {
    free: "Free",
    beta: "Beta",
    planned: "Coming Soon",
    premium: "Premium",
  },
};

export const getQualityToolsRegistry = (locale: Locale) => QUALITY_TOOLS_BY_LOCALE[locale];

export const getQualityToolById = (id: string, locale: Locale) =>
  QUALITY_TOOLS_BY_LOCALE[locale].find((tool) => tool.id === id);

export const getQualityToolStatusLabel = (locale: Locale, status: QualityToolStatus) =>
  QUALITY_TOOL_STATUS_LABELS[locale][status];

export const isQualityToolStatusActive = (status: QualityToolStatus) =>
  status === "free" || status === "beta";
