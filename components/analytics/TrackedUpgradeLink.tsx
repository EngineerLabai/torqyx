"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";

type TrackedUpgradeLinkProps = {
  href: string;
  className?: string;
  plan: string;
  source: string;
  children: ReactNode;
};

export default function TrackedUpgradeLink({
  href,
  className,
  plan,
  source,
  children,
}: TrackedUpgradeLinkProps) {
  const { track } = useAnalytics();

  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        track("upgrade_click", {
          plan,
          source,
        })
      }
    >
      {children}
    </Link>
  );
}
