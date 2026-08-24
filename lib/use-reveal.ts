"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { onSiteReady } from "@/lib/site-ready";

/** Which edge the element arrives from. Styling lives in globals.css under
 *  `.kire-reveal[data-reveal="…"]`. */
export type RevealVariant = "up" | "bottom" | "left" | "right" | "zoom";

type RevealOptions = {
  variant?: RevealVariant;
  /** Stagger, in ms. Applied as a transition-delay, so siblings that cross
   *  the fold together still land one after another. */
  delay?: number;
  /** Merged into the returned className — saves callers hand-joining it. */
  className?: string;
};

type RevealProps = {
  className: string;
  "data-reveal": RevealVariant;
  style?: CSSProperties;
};

/**
 * Reveals an element the first time it crosses the viewport, waiting for the
 * preloader to lift before it starts watching.
 *
 * Returns a ref plus a props bag to spread — no wrapper element, so it is
 * safe on grid/flex children without changing layout.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
) {
  const { variant = "up", delay = 0, className = "" } = options;
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    let observer: IntersectionObserver | undefined;

    const watch = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setVisible(true);
          observer?.disconnect();
        },
        // threshold 0 rather than a ratio: an element taller than the root
        // can never reach a fractional ratio, and would stay hidden forever.
        // The negative bottom margin is what holds the reveal back — at -12%
        // a tile fired on its first pixel of contact and, at real scrolling
        // speed, had finished arriving before it was properly on screen.
        // -24% costs nothing and buys a quarter of a viewport of runway.
        { threshold: 0, rootMargin: "0px 0px -24% 0px" },
      );
      observer.observe(el);
    };

    const unsubscribe = onSiteReady(watch);
    return () => {
      unsubscribe();
      observer?.disconnect();
    };
  }, [visible]);

  const props: RevealProps = {
    className: `kire-reveal${visible ? " is-visible" : ""}${
      className ? ` ${className}` : ""
    }`,
    "data-reveal": variant,
    style: delay ? ({ "--rv-delay": `${delay}ms` } as CSSProperties) : undefined,
  };

  return { ref, props };
}
