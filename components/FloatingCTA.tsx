"use client";

import { useState, useEffect, useRef } from "react";
import { useScrollY } from "@/lib/hooks/useScrollY";

interface Props {
  floatingCtaText?: string | null;
}

export default function FloatingCTA({ floatingCtaText }: Props) {
  const [visible, setVisible] = useState(false);
  const contactRef = useRef<HTMLElement | null>(null);
  const scrollY = useScrollY();

  useEffect(() => {
    contactRef.current = document.getElementById("contact");
  }, []);

  useEffect(() => {
    const pastHero = scrollY > window.innerHeight * 0.6;

    let nearContact = false;
    if (contactRef.current) {
      const rect = contactRef.current.getBoundingClientRect();
      nearContact = rect.top < window.innerHeight;
    }

    setVisible(pastHero && !nearContact);
  }, [scrollY]);

  return (
    <a
      href="/contact"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-bg shadow-lg transition-all duration-300 hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)] ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-bg/30" />
      {floatingCtaText || 'Available for hire'}
    </a>
  );
}
