"use client";

import { useScrollY } from "@/lib/hooks/useScrollY";

export default function BackToTop() {
  const scrollY = useScrollY();
  const visible = scrollY > 500;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 w-10 h-10 rounded bg-foreground text-bg flex items-center justify-center transition-all duration-300 hover:bg-primary ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
