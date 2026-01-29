"use client";

import { useEffect, useMemo, useState } from "react";
import { RECENTS_EVENT, RECENTS_STORAGE_KEY, readRecents, type RecentToolEntry } from "@/utils/tool-storage";

export default function useToolRecents() {
  const [recents, setRecents] = useState<RecentToolEntry[]>([]);

  useEffect(() => {
    setRecents(readRecents());
  }, []);

  useEffect(() => {
    const handleUpdate = () => setRecents(readRecents());
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === RECENTS_STORAGE_KEY) {
        handleUpdate();
      }
    };
    window.addEventListener(RECENTS_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(RECENTS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return {
    recents,
    recentIds: useMemo(() => recents.map((entry) => entry.toolId), [recents]),
  };
}
