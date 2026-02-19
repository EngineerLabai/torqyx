import { useCallback, useEffect, useRef } from "react";
import { getJSON, removeKey, setJSON } from "@/lib/storage";

type UseAutosaveDraftOptions<T> = {
  storageKey: string;
  value: T;
  onRestore: (draft: T) => void;
  delayMs?: number;
};

export function useAutosaveDraft<T>({
  storageKey,
  value,
  onRestore,
  delayMs = 500,
}: UseAutosaveDraftOptions<T>) {
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;

    const draft = getJSON<T | null>(storageKey, null);
    if (draft !== null) {
      onRestore(draft);
    }

    restoredRef.current = true;
  }, [storageKey, onRestore]);

  useEffect(() => {
    if (!restoredRef.current) return;

    const timeoutId = window.setTimeout(() => {
      setJSON(storageKey, value);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [delayMs, storageKey, value]);

  const clearDraft = useCallback(() => {
    removeKey(storageKey);
  }, [storageKey]);

  return { clearDraft };
}
