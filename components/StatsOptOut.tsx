"use client";

import { useEffect } from "react";

// The tracker's global, used by the components that send custom events.
declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

const UMAMI_HOST = "https://umami.hrolgar.com";

// Exclude a browser from the statistics once per device: hrolgar.com/?stats=off sets
// the flag Umami's tracker honours (umami.disabled), ?stats=on clears it. The tracker
// reads the flag on every send, so it takes effect at once and survives reloads.
//
// Session replay and heatmaps come from Umami's recorder, a second script that does NOT
// read that flag, so it is only loaded here once the flag has been checked. It asks Umami
// whether recording is on and at what sample rate, so turning it off is a setting in
// Umami, not a deploy. Inputs are masked there (maskLevel strict). Never on /studio.
export default function StatsOptOut({ websiteId }: { websiteId: string }) {
  useEffect(() => {
    try {
      const want = new URLSearchParams(window.location.search).get("stats");
      if (want === "off") localStorage.setItem("umami.disabled", "1");
      if (want === "on") localStorage.removeItem("umami.disabled");
      if (localStorage.getItem("umami.disabled")) return;
    } catch {
      /* storage blocked */
    }
    if (window.location.pathname.startsWith("/studio")) return;
    if (document.querySelector("script[data-umami-recorder]")) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = `${UMAMI_HOST}/recorder.js`;
    s.setAttribute("data-website-id", websiteId);
    s.setAttribute("data-host-url", UMAMI_HOST);
    s.setAttribute("data-umami-recorder", "");
    document.head.appendChild(s);
  }, [websiteId]);
  return null;
}
