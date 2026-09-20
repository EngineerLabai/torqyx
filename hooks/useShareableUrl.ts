"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { buildShareUrlShort } from "@/utils/tool-share";

interface UseShareableUrlOptions {
  toolId: string;
  currentInput: Record<string, unknown>;
  currentResult?: Record<string, unknown>;
}

interface ShareResult {
  url: string;
  code?: string;
  expiresAt?: string;
}

type ShareResponse = {
  success: true;
  url: string;
  code?: string;
  expiresAt?: string;
} | {
  success: false;
  error: string;
};

export function useShareableUrl({ toolId, currentInput }: UseShareableUrlOptions) {
  const pathname = usePathname();
  const isSharing = false;
  const [lastShare, setLastShare] = useState<ShareResult | null>(null);

  // MOD 1: URL paylaşımı (anonim, basit)
  const shareViaUrl = useCallback(async (): Promise<ShareResponse> => {
    try {
      const url = buildShareUrlShort(toolId, pathname, currentInput);

      // Clipboard'a kopyala
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setLastShare({ url });
      return { success: true, url };
    } catch (error) {
      console.error("URL share error:", error);
      return { success: false, error: "URL kopyalanamadı" };
    }
  }, [toolId, pathname, currentInput]);

  // Paylaşılan hesaplama verilerini yükle (MOD 2 için)
  const loadSharedCalculation = useCallback(async (code: string) => {
    try {
      const response = await fetch(`/api/calculations/${code}`);
      if (!response.ok) {
        throw new Error("Paylaşım yüklenemedi");
      }
      return await response.json();
    } catch (error) {
      console.error("Load shared calculation error:", error);
      throw error;
    }
  }, []);

  return {
    shareViaUrl,
    loadSharedCalculation,
    isSharing,
    lastShare,
  };
}
