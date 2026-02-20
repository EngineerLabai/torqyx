import type { ReactNode } from "react";
import WebPageJsonLd from "@/components/seo/WebPageJsonLd";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`w-full min-w-0 space-y-6 md:space-y-8 ${className}`.trim()}>
      <WebPageJsonLd />
      {children}
    </div>
  );
}
