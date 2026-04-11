"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
  }
}

export default function WebVitals() {
  useEffect(() => {
    function send({ name, value }: { name: string; value: number }) {
      window.umami?.track(name, { value: Math.round(value) });
    }

    onCLS(send);
    onINP(send);
    onLCP(send);
    onFCP(send);
    onTTFB(send);
  }, []);

  return null;
}
