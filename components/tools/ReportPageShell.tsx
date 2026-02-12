"use client";

import { useEffect, type ReactNode } from "react";

export default function ReportPageShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("report-mode");
    return () => {
      document.body.classList.remove("report-mode");
    };
  }, []);

  return <>{children}</>;
}
