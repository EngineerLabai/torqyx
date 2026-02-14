"use client";

// app/project-hub/project-tools/page.tsximport Link from "next/link";
import {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import type { ReactNode } from "react";
import PageShell from "@/components/layout/PageShell";

type ProjectStatus = "open" | "in-progress" | "blocked" | "done";
type ProjectPriority = "low" | "medium" | "high";

type Project = {
  id: string;
  title: string;
  customer: string;
  lineOrArea: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  dueDate: string;
  notes: string;
};

type Filter = {
  status: "all" | ProjectStatus;
  priority: "all" | ProjectPriority;
};

const STORAGE_KEY = "aiengineerslab-projects-v1";

export default function ProjectToolsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<Filter>({
    status: "all",
    priority: "all",
  });

  const [form, setForm] = useState<Omit<Project, "id">>({
    title: "",
    customer: "",
    lineOrArea: "",
    status: "open",
    priority: "medium",
    dueDate: "",
    notes: "",
  });

  // LocalStorage'dan oku
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Project[];
      Promise.resolve().then(() => setProjects(parsed));
    } catch {
      // ignore
    }
  }, []);

  // LocalStorage'a yaz
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  function handleFormChange(
    key: keyof Omit<Project, "id">,
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    const newProject: Project = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...form,
    };

    setProjects((prev) => [newProject, ...prev]);
    setForm({
      title: "",
      customer: "",
      lineOrArea: "",
      status: "open",
      priority: "medium",
      dueDate: "",
      notes: "",
    });
  }

  function handleFilterChange<K extends keyof Filter>(key: K, value: Filter[K]) {
    setFilter((prev) => ({ ...prev, [key]: value }));
  }

  function toggleStatus(id: string) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status:
                p.status === "done"
                  ? "open"
                  : p.status === "open"
                  ? "in-progress"
                  : p.status === "in-progress"
                  ? "blocked"
                  : "done",
            }
          : p
      )
    );
  }

  function deleteProject(id: string) {
    if (!confirm("Bu proje kaydını silmek istediğine emin misin?")) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  const filteredProjects = projects.filter((p) => {
    if (filter.status !== "all" && p.status !== filter.status) return false;
    if (filter.priority !== "all" && p.priority !== filter.priority) return false;
    return true;
  });

  return (
    <PageShell>
      {/* Başlık */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Proje Mühendisleri Alanı
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-600">
            Proje / değişiklik takibi · Hat &amp; proses iyileştirmeleri
          </span>
        </div>

        <h1 className="text-lg font-semibold text-slate-900">
          Proje &amp; İyileştirme Takip Paneli
        </h1>
        <p className="mt-2 text-xs text-slate-600">
          Müşteri projeleri, proses iyileştirmeleri ve Kaizen çalışmalarını tek yerden takip etmek için hafif bir proje
          listesi. Kayıtlar şu an sadece bu tarayıcıda (localStorage) tutuluyor. PDF/Excel çıktı ve çoklu cihaz erişimi
          premium paketinin özel beta kapsamındadır. Erken erişim için{" "}
          <Link href="/pricing" className="font-semibold text-amber-700 hover:underline">
            ücretlendirmeye göz at
          </Link>.
        </p>
      </section>

      {/* Form + Filtreler */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Yeni Proje / İyileştirme Kaydı
            </h2>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800"
            >
              Kaydı Ekle
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700">
                Proje / Çalışma Başlığı
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleFormChange("title", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Ön süspansiyon civata tork dokümanının revizyonu, Hat 2 verimlilik iyileştirmesi..."
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Müşteri / İç Birim
              </label>
              <input
                type="text"
                value={form.customer}
                onChange={(e) => handleFormChange("customer", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. OEM A, İç Kalite, Üretim Hat 2..."
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Hat / Proses Alanı
              </label>
              <input
                type="text"
                value={form.lineOrArea}
                onChange={(e) => handleFormChange("lineOrArea", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Montaj Hattı 2 - İstasyon 4, CNC işleme..."
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Durum
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  handleFormChange(
                    "status",
                    e as unknown as ChangeEvent<HTMLSelectElement>
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                <option value="open">Açık</option>
                <option value="in-progress">Devam ediyor</option>
                <option value="blocked">Blokaj var</option>
                <option value="done">Tamamlandı</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Öncelik
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  handleFormChange(
                    "priority",
                    e as unknown as ChangeEvent<HTMLSelectElement>
                  )
                }
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Hedef Tamamlanma Tarihi
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => handleFormChange("dueDate", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700">
                Teknik Notlar / Kapsam
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => handleFormChange("notes", e)}
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/40"
                placeholder="Örn. Kapsam, kritik parçalar, ilgili doküman kodları, tahmini iş yükü..."
              />
            </div>
          </div>
        </form>

        {/* Filtreler + not */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm space-y-4">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              Filtreler
            </h2>
            <div className="space-y-2">
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-slate-700">
                  Duruma göre filtrele
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { value: "all", label: "Tümü" },
                    { value: "open", label: "Açık" },
                    { value: "in-progress", label: "Devam" },
                    { value: "blocked", label: "Blokaj" },
                    { value: "done", label: "Tamam" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        handleFilterChange(
                          "status",
                          item.value as Filter["status"]
                        )
                      }
                      className={`rounded-full px-3 py-1 text-[11px] border ${
                        filter.status === item.value
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-medium text-slate-700">
                  Önceliğe göre filtrele
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { value: "all", label: "Tümü" },
                    { value: "high", label: "Yüksek" },
                    { value: "medium", label: "Orta" },
                    { value: "low", label: "Düşük" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        handleFilterChange(
                          "priority",
                          item.value as Filter["priority"]
                        )
                      }
                      className={`rounded-full px-3 py-1 text-[11px] border ${
                        filter.priority === item.value
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">
            <p className="font-semibold text-slate-900 mb-1">
              Mühendis gözüyle kullanım notu
            </p>
            <p>
              Bu alanı, hem üretim hattı küçük iyileştirmeleri (Kaizen) hem de müşteri projelerinin kritik maddelerini
              takip etmek için kullanabilirsin. İleride her kayıt; 8D, FMEA ve kalite araçlarıyla ilişkilendirilebilir ve
              PDF/Excel çıktı premium paketinin özel beta kapsamındadır. Erken erişim için{" "}
              <Link href="/pricing" className="font-semibold text-amber-700 hover:underline">
                ücretlendirmeye göz at
              </Link>.
            </p>
          </div>
        </aside>
      </section>

      {/* Proje listesi */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Kayıtlı Projeler / Çalışmalar
          </h2>
          <span className="text-[11px] text-slate-500">
            Toplam: {projects.length} kayıt · Filtrelenen: {filteredProjects.length}
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <p className="text-[11px] text-slate-500">
            Henüz filtreye uyan bir kayıt yok. Üstteki formdan yeni bir proje
            ekleyebilirsin.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full border-collapse text-[11px]">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Başlık</Th>
                  <Th>Müşteri / Birim</Th>
                  <Th>Hat / Alan</Th>
                  <Th>Durum</Th>
                  <Th>Öncelik</Th>
                  <Th>Hedef Tarih</Th>
                  <Th>Aksiyon</Th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >
                    <Td className="max-w-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-900">
                          {p.title}
                        </span>
                        {p.notes && (
                          <span className="line-clamp-2 text-[10px] text-slate-600">
                            {p.notes}
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td>{p.customer || "-"}</Td>
                    <Td>{p.lineOrArea || "-"}</Td>
                    <Td>
                      <StatusBadge status={p.status} />
                    </Td>
                    <Td>
                      <PriorityBadge priority={p.priority} />
                    </Td>
                    <Td>{p.dueDate || "-"}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleStatus(p.id)}
                          className="rounded-full border border-slate-300 px-2 py-0.5 text-[10px] text-slate-700 hover:bg-slate-100"
                        >
                          Durum Değiştir
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProject(p.id)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] text-rose-700 hover:bg-rose-100"
                        >
                          Sil
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageShell>
  );
}

/* Küçük yardımcı bileşenler */

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-3 py-2 align-top text-slate-700 ${className}`}>
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const map: Record<ProjectStatus, { label: string; className: string }> = {
    open: {
      label: "Açık",
      className: "bg-slate-100 text-slate-800 border border-slate-200",
    },
    "in-progress": {
      label: "Devam ediyor",
      className: "bg-sky-50 text-sky-800 border border-sky-200",
    },
    blocked: {
      label: "Blokaj var",
      className: "bg-amber-50 text-amber-800 border border-amber-200",
    },
    done: {
      label: "Tamamlandı",
      className: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    },
  };

  const item = map[status];

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  const map: Record<ProjectPriority, { label: string; className: string }> = {
    low: {
      label: "Düşük",
      className: "bg-slate-50 text-slate-700 border border-slate-200",
    },
    medium: {
      label: "Orta",
      className: "bg-indigo-50 text-indigo-800 border border-indigo-200",
    },
    high: {
      label: "Yüksek",
      className: "bg-rose-50 text-rose-800 border border-rose-200",
    },
  };

  const item = map[priority];

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}
