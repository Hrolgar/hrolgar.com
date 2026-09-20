"use client";

import { useEffect } from "react";

// The tracker's global, used by the components that send custom events.
declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

// Exclude a browser from the statistics once per device: hrolgar.com/?stats=off sets
// the flag Umami's tracker honours (umami.disabled), ?stats=on clears it. The tracker
// reads the flag on every send, so it takes effect at once and survives reloads.
export default function StatsOptOut() {
  useEffect(() => {
    try {
      const want = new URLSearchParams(window.location.search).get("stats");
      if (want === "off") localStorage.setItem("umami.disabled", "1");
      if (want === "on") localStorage.removeItem("umami.disabled");
    } catch {
      /* storage blocked */
    }
  }, []);
  return null;
}
