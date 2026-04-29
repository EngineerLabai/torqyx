"use client";

import { useSyncExternalStore } from "react";

export interface WorkspaceMaterial {
  id: string;
  name?: string;
  standard?: string;
  category?: string;
  density?: number;
  yield?: number;
  modulus?: number;
  [key: string]: unknown;
}

export interface WorkspaceState {
  activeMaterial: WorkspaceMaterial | null;
  setActiveMaterial: (material: WorkspaceMaterial | null) => void;
  clearMaterial: () => void;
}

type Listener = () => void;

const STORAGE_KEY = "torqyx-active-material";

let activeMaterial: WorkspaceMaterial | null = null;
let didHydrateFromStorage = false;

const listeners = new Set<Listener>();

const persistActiveMaterial = () => {
  if (typeof window === "undefined") return;

  try {
    if (activeMaterial) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activeMaterial));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage may be unavailable in private contexts; keep UI usable.
  }
};

const hydrateActiveMaterial = () => {
  if (didHydrateFromStorage || typeof window === "undefined") return;

  didHydrateFromStorage = true;

  try {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);
    activeMaterial = savedValue ? (JSON.parse(savedValue) as WorkspaceMaterial) : null;
  } catch {
    activeMaterial = null;
  }
};

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const setActiveMaterial = (material: WorkspaceMaterial | null) => {
  activeMaterial = material;
  persistActiveMaterial();
  emitChange();
};

const clearMaterial = () => {
  setActiveMaterial(null);
};

const getState = (): WorkspaceState => {
  hydrateActiveMaterial();

  return {
    activeMaterial,
    setActiveMaterial,
    clearMaterial,
  };
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const useWorkspaceStore = <T,>(selector: (state: WorkspaceState) => T): T =>
  useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(getState()),
  );
