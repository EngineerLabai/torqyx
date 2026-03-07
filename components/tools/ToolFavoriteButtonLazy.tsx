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
  loading: () => <span className="inline-block h-8 w-8 animate-pulse rounded-full border border-slate-200 bg-slate-100" />,
});

export default function ToolFavoriteButtonLazy(props: ToolFavoriteButtonProps) {
  return <ToolFavoriteButton {...props} />;
}
