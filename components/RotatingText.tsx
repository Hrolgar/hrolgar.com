"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  texts: string[];
  className?: string;
}

export default function RotatingText({ texts, className }: Props) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (texts.length === 0) return;
    if (!isVisible) return;

    const current = texts[index];

    if (!isDeleting && displayed === current) {
      const pause = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(pause);
    }

    if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const speed = isDeleting ? 30 : 60;
    const timeout = setTimeout(() => {
      setDisplayed(
        isDeleting
          ? current.slice(0, displayed.length - 1)
          : current.slice(0, displayed.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, index, texts, isVisible]);

  return (
    <span ref={wrapperRef} className={className}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}
