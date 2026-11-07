import type { Metadata } from "next";
import { NOINDEX_FOLLOW_ROBOTS } from "@/utils/metadata";

export const metadata: Metadata = {
  robots: NOINDEX_FOLLOW_ROBOTS,
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
