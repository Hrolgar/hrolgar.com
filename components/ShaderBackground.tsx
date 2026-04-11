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
  const [isVisible, setIsVisible] = useState(false);
  const iframeLoaded = useRef(false);

  // Bidirectional visibility: load iframe on first enter, pause/resume rAF on each change
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMounted(true);
          setIsVisible(true);
          // Only send resume if iframe has loaded — shaders auto-start on load
          if (iframeLoaded.current) {
            iframeRef.current?.contentWindow?.postMessage({ type: "resume" }, "*");
          }
        } else {
          setIsVisible(false);
          // Only send pause if iframe has loaded — no point pausing an empty iframe
          if (iframeLoaded.current) {
            iframeRef.current?.contentWindow?.postMessage({ type: "pause" }, "*");
          }
        }
      },
      { rootMargin: "200px" }
    );
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Throttle mousemove to one postMessage per animation frame — only when visible (Fix H)
  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible]);

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    >
      {/* loading="lazy" is Fix G */}
      <iframe
        ref={iframeRef}
        src={isMounted ? src : undefined}
        aria-hidden="true"
        tabIndex={-1}
        loading="lazy"
        onLoad={() => {
          iframeLoaded.current = true;
          // If we scrolled away before iframe finished loading, pause immediately
          if (!isVisible) {
            iframeRef.current?.contentWindow?.postMessage({ type: "pause" }, "*");
          }
        }}
        className="absolute inset-0 w-full h-full border-none"
      />
    </div>
  );
}
