"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  className?: string;
}

export default function ShaderBackground({ src, className = "" }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  // Refs for synchronous reads in callbacks (state closures go stale)
  const isVisibleRef = useRef(false);
  const iframeLoadedRef = useRef(false);
  const [visibleForEffect, setVisibleForEffect] = useState(false);

  // Bidirectional visibility: load iframe on first enter, pause/resume on visibility change
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        isVisibleRef.current = visible;

        if (visible) {
          setIsMounted(true);
          setVisibleForEffect(true);
          if (iframeLoadedRef.current) {
            iframeRef.current?.contentWindow?.postMessage({ type: "resume" }, "*");
          }
        } else {
          setVisibleForEffect(false);
          if (iframeLoadedRef.current) {
            iframeRef.current?.contentWindow?.postMessage({ type: "pause" }, "*");
          }
        }
      },
      { rootMargin: "100%" }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Throttle mousemove to one postMessage per animation frame — only when visible
  useEffect(() => {
    if (!visibleForEffect) return;

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
  }, [visibleForEffect]);

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    >
      <iframe
        ref={iframeRef}
        src={isMounted ? src : undefined}
        aria-hidden="true"
        tabIndex={-1}
        onLoad={() => {
          iframeLoadedRef.current = true;
          // Shader auto-starts on load. If section already scrolled away, pause it.
          if (!isVisibleRef.current) {
            iframeRef.current?.contentWindow?.postMessage({ type: "pause" }, "*");
          }
        }}
        className="absolute inset-0 w-full h-full border-none"
      />
    </div>
  );
}
