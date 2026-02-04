"use client";

import dynamic from "next/dynamic";

type ToolFavoriteButtonProps = {
  toolId: string;
  toolTitle?: string;
  size?: "sm" | "md";
  className?: string;
};

const ToolFavoriteButton = dynamic(() => import("@/components/tools/ToolFavoriteButton"), {
  ssr: false,
  loading: () => null,
});

export default function ToolFavoriteButtonLazy(props: ToolFavoriteButtonProps) {
  return <ToolFavoriteButton {...props} />;
}
