"use client";

export const AUTH_MODAL_OPEN_EVENT = "auth-modal:open";

export const openAuthModal = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_MODAL_OPEN_EVENT));
};
