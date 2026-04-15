"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { useFeatureGate } from "@/hooks/useFeatureGate";
import { buildShareUrlShort } from "@/utils/tool-share";
import { buildShortShareUrl } from "@/utils/share-code";

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

export function useShareableUrl({ toolId, currentInput, currentResult }: UseShareableUrlOptions) {
  const pathname = usePathname();
  const { hasAccess: isPremium } = useFeatureGate("tool_access", {
    toolId,
  });
  const [isSharing, setIsSharing] = useState(false);
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

  // MOD 2: Kısa link paylaşımı (premium, veritabanı)
  const shareViaShortLink = useCallback(async (isPublic: boolean = false): Promise<ShareResponse> => {
    if (!isPremium) {
      return { success: false, error: "Bu özellik premium üyelere özeldir" };
    }

    setIsSharing(true);
    try {
      const response = await fetch("/api/calculations/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolSlug: toolId,
          inputs: currentInput,
          outputs: currentResult,
          isPublic,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Paylaşım oluşturulamadı");
      }

      const data = await response.json();
      const url = buildShortShareUrl(data.code);

      // Clipboard'a kopyala
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }

      const result: ShareResult = {
        url,
        code: data.code,
        expiresAt: data.expiresAt,
      };

      setLastShare(result);
      return { success: true, ...result };
    } catch (error) {
      console.error("Short link share error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Paylaşım oluşturulamadı"
      };
    } finally {
      setIsSharing(false);
    }
  }, [toolId, currentInput, currentResult, isPremium]);

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
    // MOD 1
    shareViaUrl,
    // MOD 2
    shareViaShortLink,
    loadSharedCalculation,
    // State
    isSharing,
    lastShare,
    isPremium,
  };
}