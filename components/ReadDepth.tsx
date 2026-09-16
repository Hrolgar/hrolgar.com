"use client";

import { useEffect, useRef } from "react";

/**
 * Fires once per pageview when the reader reaches the end of an article.
 *
 * Pageviews alone cannot tell a case study that gets read from one that gets
 * bounced off, which is the only question a portfolio page needs to answer. One
 * event per view keeps this cheap: Web Vitals already showed how quickly
 * per-pageview events drown the ones that mean something.
 */
export default function ReadDepth({ kind, slug }: { kind: "project" | "post"; slug: string }) {
  const fired = useRef(false);

  useEffect(() => {
    fired.current = false;
    const sentinel = document.getElementById("read-depth-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || fired.current) return;
        fired.current = true;
        window.umami?.track("content-read", { kind, slug });
        observer.disconnect();
      },
      // Slightly before the true end, so finishing the last paragraph counts even if
      // the reader never scrolls the footer into view.
      { rootMargin: "0px 0px -20% 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [kind, slug]);

  return null;
}
