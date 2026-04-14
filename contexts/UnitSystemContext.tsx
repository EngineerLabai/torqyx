"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UnitSystem } from "@/utils/units";

interface UnitSystemContextType {
  system: UnitSystem;
  setSystem: (system: UnitSystem) => void;
  isLoading: boolean;
}

const UnitSystemContext = createContext<UnitSystemContextType | null>(null);

const STORAGE_KEY = "aiengineerslab-unit-system";

interface UnitSystemProviderProps {
  children: ReactNode;
  defaultSystem?: UnitSystem;
}

export function UnitSystemProvider({
  children,
  defaultSystem = "SI"
}: UnitSystemProviderProps) {
  const [system, setSystemState] = useState<UnitSystem>(defaultSystem);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ["SI", "Imperial", "Mixed"].includes(stored)) {
        setSystemState(stored as UnitSystem);
      }
    } catch (error) {
      console.warn("Failed to load unit system from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage when system changes
  const setSystem = (newSystem: UnitSystem) => {
    setSystemState(newSystem);
    try {
      localStorage.setItem(STORAGE_KEY, newSystem);
    } catch (error) {
      console.warn("Failed to save unit system to localStorage:", error);
    }
  };

  const value: UnitSystemContextType = {
    system,
    setSystem,
    isLoading,
  };

  return (
    <UnitSystemContext.Provider value={value}>
      {children}
    </UnitSystemContext.Provider>
  );
}

export function useUnitSystem(): UnitSystemContextType {
  const context = useContext(UnitSystemContext);
  if (!context) {
    throw new Error("useUnitSystem must be used within a UnitSystemProvider");
  }
  return context;
}

// Hook for getting current system (convenience)
export function useCurrentUnitSystem(): UnitSystem {
  const { system } = useUnitSystem();
  return system;
}