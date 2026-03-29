"use client";

import { useState, useEffect } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const pastHero = scrollY > window.innerHeight * 0.6;

      const contactEl = document.getElementById("contact");
      let nearContact = false;
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        nearContact = rect.top < window.innerHeight;
      }

      setVisible(pastHero && !nearContact);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="/contact"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-bg shadow-lg transition-all duration-300 hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)] ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-bg/30" />
      Available for hire
    </a>
  );
}
