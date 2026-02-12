"use client";

import { openAuthModal } from "@/components/auth/authModalEvents";

type AuthModalTriggerProps = {
  label: string;
  className?: string;
};

export default function AuthModalTrigger({ label, className }: AuthModalTriggerProps) {
  return (
    <button
      type="button"
      onClick={openAuthModal}
      className={className}
    >
      {label}
    </button>
  );
}
