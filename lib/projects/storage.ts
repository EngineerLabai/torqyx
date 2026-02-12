export type ProjectItem = {
  id: string;
  toolSlug: string;
  createdAt: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  reportMeta?: Record<string, unknown>;
};

export type Project = {
  id: string;
  title: string;
  items: ProjectItem[];
};

const STORAGE_KEY = "aielab:projects";

const hasWindow = typeof window !== "undefined";

const buildId = () => {
  if (!hasWindow) return `srv-${Date.now()}`;
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `proj-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
};

export const readProjects = (): Project[] => {
  if (!hasWindow) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Project[];
  } catch {
    return [];
  }
};

export const writeProjects = (projects: Project[]) => {
  if (!hasWindow) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // ignore storage errors
  }
};

export const createProject = (title: string): Project => ({
  id: buildId(),
  title,
  items: [],
});

export const saveProjectItem = ({
  projectId,
  projectTitle,
  item,
}: {
  projectId?: string;
  projectTitle: string;
  item: ProjectItem;
}) => {
  const projects = readProjects();
  let target = projectId ? projects.find((project) => project.id === projectId) : undefined;

  if (!target) {
    target = createProject(projectTitle);
    projects.unshift(target);
  }

  target.items.unshift(item);
  writeProjects(projects);

  return { projects, project: target };
};

export const buildProjectItem = (data: Omit<ProjectItem, "id" | "createdAt">): ProjectItem => ({
  ...data,
  id: buildId(),
  createdAt: new Date().toISOString(),
});
