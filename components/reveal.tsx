"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/lib/use-reveal";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Wraps a block in the scroll-reveal fade. Use for whole sections/cards;
 *  reach for `useReveal` directly when a wrapper element isn't wanted. */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const { ref, className: revealClassName } = useReveal();

  return (
    <div
      ref={ref}
      className={`${revealClassName} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
