"use client";

export const COMMAND_PALETTE_OPEN_EVENT = "command-palette:open";

export const openCommandPalette = (query?: string) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(COMMAND_PALETTE_OPEN_EVENT, {
      detail: { query },
    }),
  );
};
