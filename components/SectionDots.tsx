"use client";

import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

export default function SectionDots() {
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState("");

  // Discover sections from the DOM — any <section> with an id gets a dot
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("main section[id]");
    const found: Section[] = [];
    els.forEach((el) => {
      if (el.id) {
        found.push({
          id: el.id,
          label: el.dataset.label || el.id.charAt(0).toUpperCase() + el.id.slice(1),
        });
      }
    });
    setSections(found);
  }, []);

  useEffect(() => {
    if (sections.length === 0) return;

    const onScroll = () => {
      const viewportMiddle = window.innerHeight * 0.35;
      let closest = "";
      let closestDist = Infinity;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top - viewportMiddle);
        if (rect.top <= viewportMiddle + rect.height * 0.5 && dist < closestDist) {
          closestDist = dist;
          closest = section.id;
        }
      }

      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (nearBottom && sections.length > 0) closest = sections[sections.length - 1].id;

      setActive(closest);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:flex flex-col items-end gap-4"
    >
      {sections.map((section) => (
        <a
          key={section.id}
          href={`/#${section.id}`}
          className="group flex items-center gap-3"
          aria-label={section.label}
        >
          <span
            className={`text-xs font-medium transition-all duration-200 ${
              active === section.id
                ? "translate-x-0 text-primary opacity-100"
                : "translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
            }`}
          >
            {section.label}
          </span>
          <span
            className={`block rounded-full transition-all duration-200 ${
              active === section.id
                ? "h-3 w-3 bg-primary shadow-[0_0_0_4px_rgba(94,171,168,0.15)]"
                : "h-2 w-2 bg-border group-hover:bg-muted"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
