"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades an element in the first time it crosses the viewport. Returns a
 * ref to attach and a className to merge — no wrapper element, so it's
 * safe to spread onto grid/flex children without changing layout.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `kire-reveal${visible ? " is-visible" : ""}` };
}
