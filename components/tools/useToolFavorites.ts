"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FAVORITES_EVENT, FAVORITES_STORAGE_KEY, readFavorites, toggleFavorite } from "@/utils/tool-storage";

export default function useToolFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    Promise.resolve().then(() => setFavorites(readFavorites()));
  }, []);

  useEffect(() => {
    const handleUpdate = () => setFavorites(readFavorites());
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === FAVORITES_STORAGE_KEY) {
        handleUpdate();
      }
    };
    window.addEventListener(FAVORITES_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggle = useCallback((toolId: string) => {
    const next = toggleFavorite(toolId);
    setFavorites(next);
  }, []);

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  return {
    favorites,
    favoritesSet,
    isFavorite: (toolId: string) => favoritesSet.has(toolId),
    toggleFavorite: toggle,
  };
}
