"use client";

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, className = "", delay = 0 }: Props) {
  const { ref, isVisible } = useScrollReveal(0.1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  if (prefersReducedMotion) {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={className}
        style={{ opacity: 1, transform: "none" }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : "translateY(24px)",
        transition: `opacity 0.35s ease-out ${delay}ms, transform 0.35s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
