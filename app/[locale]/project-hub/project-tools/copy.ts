import type { Locale } from "@/utils/locale";

export type ProjectStatus = "open" | "in-progress" | "blocked" | "done";
export type ProjectPriority = "low" | "medium" | "high";
export type SortOption = "newest" | "due-date" | "priority" | "status";

export const STATUS_OPTIONS: Array<{ value: ProjectStatus; label: Record<Locale, string> }> = [
  { value: "open", label: { tr: "Açık", en: "Open" } },
  { value: "in-progress", label: { tr: "Devam ediyor", en: "In progress" } },
  { value: "blocked", label: { tr: "Blokaj", en: "Blocked" } },
  { value: "done", label: { tr: "Tamamlandı", en: "Done" } },
];

export const PRIORITY_OPTIONS: Array<{ value: ProjectPriority; label: Record<Locale, string> }> = [
  { value: "high", label: { tr: "Yüksek", en: "High" } },
  { value: "medium", label: { tr: "Orta", en: "Medium" } },
  { value: "low", label: { tr: "Düşük", en: "Low" } },
];

export const SORT_OPTIONS: Array<{ value: SortOption; label: Record<Locale, string> }> = [
  { value: "newest", label: { tr: "En yeni", en: "Newest" } },
  { value: "due-date", label: { tr: "Tarihe göre", en: "Due date" } },
  { value: "priority", label: { tr: "Öncelik", en: "Priority" } },
  { value: "status", label: { tr: "Durum", en: "Status" } },
];

export const PROJECT_COPY: Record<Locale, {
  seo: { title: string; description: string };
  hero: { title: string; description: string; eyebrow: string; imageAlt: string };
  formTitle: string;
  formSubtitle: string;
  formCta: string;
  filtersTitle: string;
  tableTitle: string;
  exportLabel: string;
  exportSoon: string;
  searchPlaceholder: string;
  fields: {
    title: string;
    owner: string;
    area: string;
    status: string;
    priority: string;
    dueDate: string;
    link: string;
    notes: string;
  };
  emptyState: string;
  actions: { delete: string; status: string };
  storageNote: string;
}> = {
  tr: {
    seo: {
      title: "Proje ve İyileştirme Takip | Proje Merkezi",
      description: "Proje ve iyileştirme kayıtları için lokal takip paneli.",
    },
    hero: {
      title: "Proje ve İyileştirme Takip",
      description:
        "Proje ve Kaizen çalışmalarını sahip, tarih, öncelik ve durum bazlı takip edin. Kayıtlar cihazınızda tutulur.",
      eyebrow: "Project Hub",
      imageAlt: "Project tracker",
    },
    formTitle: "Yeni kayıt oluştur",
    formSubtitle: "Müşteri projeleri, hat iyileştirme ve Kaizen çalışmaları için tek satır.",
    formCta: "Kaydı ekle",
    filtersTitle: "Filtreler ve sıralama",
    tableTitle: "Kayıt listesi",
    exportLabel: "Tabloyu dışarı aktar",
    exportSoon: "Çok yakında",
    searchPlaceholder: "Başlık, sahip, alan veya not içinde ara",
    fields: {
      title: "Başlık",
      owner: "Sahip",
      area: "Hat / Alan",
      status: "Durum",
      priority: "Öncelik",
      dueDate: "Hedef tarih",
      link: "Bağlantı",
      notes: "Notlar",
    },
    emptyState: "Henüz kayıt yok. Üstteki formdan yeni kayıt ekleyebilirsiniz.",
    actions: { delete: "Sil", status: "Durum değiştir" },
    storageNote: "Veriler cihazınızda saklanır (localStorage).",
  },
  en: {
    seo: {
      title: "Project & Improvement Tracker | Project Hub",
      description: "Local-first tracker for projects and continuous improvements.",
    },
    hero: {
      title: "Project & Improvement Tracker",
      description:
        "Track projects and Kaizen work with owners, due dates, priorities, and status. Data stays on this device.",
      eyebrow: "Project Hub",
      imageAlt: "Project tracker",
    },
    formTitle: "Create a new entry",
    formSubtitle: "Capture a project or improvement item in a single row.",
    formCta: "Add entry",
    filtersTitle: "Filters and sorting",
    tableTitle: "Entry list",
    exportLabel: "Export table",
    exportSoon: "Coming soon",
    searchPlaceholder: "Search title, owner, area, or notes",
    fields: {
      title: "Title",
      owner: "Owner",
      area: "Line / Area",
      status: "Status",
      priority: "Priority",
      dueDate: "Due date",
      link: "Link",
      notes: "Notes",
    },
    emptyState: "No entries yet. Add one using the form above.",
    actions: { delete: "Delete", status: "Change status" },
    storageNote: "Data is stored on this device (localStorage).",
  },
};
