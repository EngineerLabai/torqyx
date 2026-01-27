import type { ReactNode } from "react";
import ToolLinkSection from "@/components/tools/ToolLinkSection";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <div className="site-container pb-10 pt-6">
        <ToolLinkSection />
      </div>
    </>
  );
}
