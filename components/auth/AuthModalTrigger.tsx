"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { openAuthModal } from "@/components/auth/authModalEvents";

type AuthModalTriggerProps = {
  label: string;
  className?: string;
};

export default function AuthModalTrigger({ label, className }: AuthModalTriggerProps) {
  const { track } = useAnalytics();

  const handleClick = () => {
    track("signup_start", { source: "cta" });
    openAuthModal();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {label}
    </button>
  );
}
