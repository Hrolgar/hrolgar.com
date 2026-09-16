"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

// Web Vitals fire five events on every single pageview. Unsampled they were 679 of
// 684 custom events in 90 days, which buried the handful of events that describe
// whether anyone tried to get in touch. A quarter of sessions is plenty to see a
// trend on a site this size, and the decision is made once per session so a sampled
// visitor reports all five metrics rather than a random subset of them.
const SAMPLE_RATE = 0.25;
const SAMPLE_KEY = "vitals-sampled";

function isSampledSession(): boolean {
  try {
    const stored = sessionStorage.getItem(SAMPLE_KEY);
    if (stored !== null) return stored === "1";
    const sampled = Math.random() < SAMPLE_RATE;
    sessionStorage.setItem(SAMPLE_KEY, sampled ? "1" : "0");
    return sampled;
  } catch {
    // Private mode or blocked storage: fall back to a per-load decision.
    return Math.random() < SAMPLE_RATE;
  }
}

export default function WebVitals() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isSampledSession()) return;

    function send({ name, value }: { name: string; value: number }) {
      // CLS is a ratio, the rest are milliseconds. Rounding CLS to an integer made
      // every sample report 0, so it is kept to three decimals.
      const rounded = name === "CLS" ? Math.round(value * 1000) / 1000 : Math.round(value);
      // Without the path you know the site is slow but not which page, which is the
      // only thing you can act on.
      window.umami?.track(`vitals-${name.toLowerCase()}`, { value: rounded, path: pathname });
    }

    onCLS(send);
    onINP(send);
    onLCP(send);
    onFCP(send);
    onTTFB(send);
  }, [pathname]);

  return null;
}
