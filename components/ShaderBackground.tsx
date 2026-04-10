"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  className?: string;
}

export default function ShaderBackground({ src, className = "" }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only load iframe when section is within 200px of the viewport (Fix I)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { rootMargin: "200px" }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Throttle mousemove to one postMessage per animation frame (Fix H)
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let rafPending = false;
    let pendingX = 0,
      pendingY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          iframeRef.current?.contentWindow?.postMessage(
            { type: "mousemove", x: pendingX, y: pendingY },
            "*"
          );
          rafPending = false;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    >
      {/* loading="lazy" is Fix G */}
      <iframe
        ref={iframeRef}
        src={isVisible ? src : undefined}
        aria-hidden="true"
        tabIndex={-1}
        loading="lazy"
        className="absolute inset-0 w-full h-full border-none"
      />
    </div>
  );
}
