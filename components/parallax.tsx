"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type ParallaxProps = {
  children: ReactNode;
  /** Drift amount in px per viewport-height of scroll progress. */
  speed?: number;
  className?: string;
  /** A transform to compose the parallax offset onto (e.g. a centering
   *  "translate(-50%, -50%)") — the JS-driven scroll transform replaces
   *  the whole `transform` property each frame, so any centering has to
   *  be re-supplied here rather than as a Tailwind translate class. */
  origin?: string;
};

/**
 * Translates its children vertically as the element crosses the
 * viewport. Only runs the scroll loop while the element is in view, and
 * sits out entirely for prefers-reduced-motion.
 */
export function Parallax({
  children,
  speed = 40,
  className = "",
  origin = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let active = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
      el.style.transform =
        `${origin} translate3d(0, ${(-progress * speed).toFixed(2)}px, 0)`.trim();
      if (active) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) frame = requestAnimationFrame(update);
        else cancelAnimationFrame(frame);
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [speed, origin]);

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={origin ? { transform: origin } : undefined}
    >
      {children}
    </div>
  );
}
