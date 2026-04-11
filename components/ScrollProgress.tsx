"use client";

import { useEffect, useRef } from "react";
import { useScrollY } from "@/lib/hooks/useScrollY";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const scrollY = useScrollY();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, [scrollY]);

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-0.5">
      <div
        ref={barRef}
        className="h-full bg-primary transition-[width] duration-75 ease-out"
        style={{ width: "0%" }}
      />
    </div>
  );
}
