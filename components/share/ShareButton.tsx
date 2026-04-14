"use client";

import { useState } from "react";
import { Share2, Link, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  const { shareViaUrl, shareViaShortLink, isSharing, isPremium } = useShareableUrl({
    toolId,
    currentInput,
    currentResult,
  });
  const { toast } = useToast();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleUrlShare = async () => {
    const result = await shareViaUrl();
    if (result.success) {
      setCopiedUrl(result.url);
      toast({
        title: "Bağlantı kopyalandı",
        description: "Hesaplama bağlantısı panoya kopyalandı",
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

  const handleShortLinkShare = async (isPublic: boolean = false) => {
    const result = await shareViaShortLink(isPublic);
    if (result.success) {
      setCopiedUrl(result.url);
      toast({
        title: "Kısa bağlantı oluşturuldu",
        description: isPremium
          ? "Premium paylaşım bağlantısı panoya kopyalandı"
          : "Paylaşım bağlantısı panoya kopyalandı (7 gün geçerli)",
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
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          ) : copiedUrl ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          <span className="ml-2">Paylaş</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleUrlShare} className="cursor-pointer">
          <Link className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>URL ile paylaş</span>
            <span className="text-xs text-muted-foreground">Anonim, sınırsız</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleShortLinkShare(false)}
          className="cursor-pointer"
          disabled={!isPremium}
        >
          <Copy className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Kısa bağlantı</span>
            <span className="text-xs text-muted-foreground">
              {isPremium ? "Premium, sınırsız" : "Premium gerekli"}
            </span>
          </div>
        </DropdownMenuItem>

        {isPremium && (
          <DropdownMenuItem
            onClick={() => handleShortLinkShare(true)}
            className="cursor-pointer"
          >
            <Share2 className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span>Herkese açık paylaş</span>
              <span className="text-xs text-muted-foreground">Premium, sınırsız</span>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}