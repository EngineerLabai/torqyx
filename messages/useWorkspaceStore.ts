import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WorkspaceVariable = {
  id: string; // örn. 'torque', 'force', 'power'
  name: string; // örn. 'Hesaplanan Tork'
  value: number;
  unit: string;
  sourceToolId: string; // örn. 'torque-power'
};

export type WorkspaceMaterial = {
  id: string;
  standard: string;
  name: string;
  yieldStrength?: number;
  elasticModulus?: number;
  density?: number;
};

interface WorkspaceStoreState {
  variables: Record<string, WorkspaceVariable>;
  activeMaterial: WorkspaceMaterial | null;

  setVariable: (variable: WorkspaceVariable) => void;
  removeVariable: (id: string) => void;
  getVariable: (id: string) => WorkspaceVariable | undefined;
  clearVariables: () => void;

  setActiveMaterial: (material: WorkspaceMaterial) => void;
  clearActiveMaterial: () => void;
}

export const useWorkspaceStore = create<WorkspaceStoreState>()(
  persist(
    (set, get) => ({
      variables: {},
      activeMaterial: null,

      setVariable: (variable) =>
        set((state) => ({ variables: { ...state.variables, [variable.id]: variable } })),
      removeVariable: (id) =>
        set((state) => {
          const newVars = { ...state.variables };
          delete newVars[id];
          return { variables: newVars };
        }),
      getVariable: (id) => get().variables[id],
      clearVariables: () => set({ variables: {} }),

      setActiveMaterial: (material) => set({ activeMaterial: material }),
      clearActiveMaterial: () => set({ activeMaterial: null }),
    }),
    {
      name: 'torqyx-workspace-storage', // Tarayıcı hafızasındaki anahtar ismi
    }
  )
);