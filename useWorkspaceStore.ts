import { create } from "zustand";

export interface WorkspaceMaterial {
  id?: string;
  name?: string;
  [key: string]: any;
}

interface WorkspaceStore {
  activeMaterial: WorkspaceMaterial | null;
  setActiveMaterial: (material: WorkspaceMaterial) => void;
  clearActiveMaterial: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  activeMaterial: null,
  setActiveMaterial: (material) => set({ activeMaterial: material }),
  clearActiveMaterial: () => set({ activeMaterial: null }),
}));