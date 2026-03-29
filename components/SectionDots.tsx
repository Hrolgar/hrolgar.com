"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Technologies" },
  { id: "projects", label: "Projects" },
  { id: "homelab", label: "Homelab" },
  { id: "certifications", label: "Certifications" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export default function SectionDots() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      let current = "";

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) current = section.id;
        }
      }

      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (nearBottom) current = "contact";

      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
