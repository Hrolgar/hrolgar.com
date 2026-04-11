"use client";

import { useSyncExternalStore } from "react";

// Module-level shared state — one listener for all consumers
let scrollY = typeof window !== "undefined" ? window.scrollY : 0;
let rafPending = false;
const listeners = new Set<() => void>();

function onScroll() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    const next = window.scrollY;
    if (next !== scrollY) {
      scrollY = next;
      listeners.forEach((l) => l());
    }
  });
}

function subscribe(callback: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", onScroll);
    }
  };
}

function getSnapshot() {
  return scrollY;
}

function getServerSnapshot() {
  return 0;
}

export function useScrollY(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
