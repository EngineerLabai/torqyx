"use client";

export const COMMAND_PALETTE_OPEN_EVENT = "command-palette:open";

export const openCommandPalette = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COMMAND_PALETTE_OPEN_EVENT));
};
