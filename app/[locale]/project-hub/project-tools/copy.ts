import type { Locale } from "@/utils/locale";

export type ProjectStatus = "open" | "in-progress" | "blocked" | "done";
export type ProjectPriority = "low" | "medium" | "high";
export type SortOption = "newest" | "due-date" | "priority" | "status";

export const STATUS_OPTIONS: Array<{ value: ProjectStatus; label: Record<Locale, string> }> = [
  { value: "open", label: { tr: "Acik", en: "Open" } },
  { value: "in-progress", label: { tr: "Devam ediyor", en: "In progress" } },
  { value: "blocked", label: { tr: "Blokaj", en: "Blocked" } },
  { value: "done", label: { tr: "Tamamlandi", en: "Done" } },
];

export const PRIORITY_OPTIONS: Array<{ value: ProjectPriority; label: Record<Locale, string> }> = [
  { value: "high", label: { tr: "Yuksek", en: "High" } },
  { value: "medium", label: { tr: "Orta", en: "Medium" } },
  { value: "low", label: { tr: "Dusuk", en: "Low" } },
];

export const SORT_OPTIONS: Array<{ value: SortOption; label: Record<Locale, string> }> = [
  { value: "newest", label: { tr: "En yeni", en: "Newest" } },
  { value: "due-date", label: { tr: "Tarihe gore", en: "Due date" } },
  { value: "priority", label: { tr: "Oncelik", en: "Priority" } },
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
      title: "Proje ve Iyilestirme Takip | Proje Merkezi",
      description: "Proje ve iyilestirme kayitlari icin lokal takip paneli.",
    },
    hero: {
      title: "Proje ve Iyilestirme Takip",
      description:
        "Proje ve Kaizen calismalarini sahip, tarih, oncelik ve durum bazli takip edin. Kayitlar cihazinizda tutulur.",
      eyebrow: "Project Hub",
      imageAlt: "Project tracker",
    },
    formTitle: "Yeni kayit olustur",
    formSubtitle: "Musteri projeleri, hat iyilestirme ve Kaizen calismalari icin tek satir.",
    formCta: "Kaydi ekle",
    filtersTitle: "Filtreler ve siralama",
    tableTitle: "Kayit listesi",
    exportLabel: "Tabloyu disari aktar",
    exportSoon: "Cok yakinda",
    searchPlaceholder: "Baslik, sahip, alan veya not icinde ara",
    fields: {
      title: "Baslik",
      owner: "Sahip",
      area: "Hat / Alan",
      status: "Durum",
      priority: "Oncelik",
      dueDate: "Hedef tarih",
      link: "Baglanti",
      notes: "Notlar",
    },
    emptyState: "Henuz kayit yok. Ustteki formdan yeni kayit ekleyebilirsiniz.",
    actions: { delete: "Sil", status: "Durum degistir" },
    storageNote: "Veriler cihazinizda saklanir (localStorage).",
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
