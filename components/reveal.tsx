"use client";

import type { ReactNode } from "react";
import { useReveal, type RevealVariant } from "@/lib/use-reveal";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Which edge it arrives from. Defaults to a rise from below. */
  variant?: RevealVariant;
  /** Stagger in ms, for siblings that cross the fold together. */
  delay?: number;
};

/** Wraps a block in the scroll reveal. Use for whole sections/cards; reach
 *  for `useReveal` directly when a wrapper element is not wanted. */
export function Reveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: RevealProps) {
  const { ref, props } = useReveal({ variant, delay, className });

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
