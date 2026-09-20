"use client";

import { useState } from "react";
import { Share2, Link, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  toolId: string;
  currentInput: Record<string, unknown>;
  currentResult?: Record<string, unknown>;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ShareButton({
  toolId,
  currentInput,
  currentResult,
  variant = "outline",
  size = "sm",
  className,
}: ShareButtonProps) {
  const { shareViaUrl, isSharing } = useShareableUrl({
    toolId,
    currentInput,
    currentResult,
  });
  const { toast } = useToast();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleUrlShare = async () => {
    const result = await shareViaUrl();
    if (result.success) {
      setCopiedUrl(result.url ?? null);
      toast({
        title: "Baglanti kopyalandi",
        description: "Hesaplama baglantisi panoya kopyalandi",
      });
      setTimeout(() => setCopiedUrl(null), 2000);
    } else {
      toast({
        title: "Hata",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isSharing}
        >
          {isSharing ? (
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
          ) : copiedUrl ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          <span className="ml-2">Paylas</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleUrlShare} className="cursor-pointer">
          <Link className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>URL ile paylas</span>
            <span className="text-xs text-muted-foreground">Anonim baglanti</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
