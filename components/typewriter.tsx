"use client";

import { useEffect, useState } from "react";
import { onSiteReady } from "@/lib/site-ready";

type TypewriterProps = {
  text: string;
  /** ms after the curtain starts lifting before the first character lands. */
  startDelay?: number;
  /** ms per character while writing. Jittered ±25% so it reads as a hand. */
  speed?: number;
  /**
   * Characters to rub out and write again once the word is complete — the
   * correction beat. 0 writes straight through.
   */
  erase?: number;
  className?: string;
};

type Step = { value: string; wait: number };

/** Writing, the pause before the correction, rubbing out, and writing back. */
function script(text: string, speed: number, erase: number): Step[] {
  const jitter = () => Math.round(speed * (0.75 + Math.random() * 0.5));
  const steps: Step[] = [];

  for (let i = 1; i <= text.length; i++) {
    steps.push({ value: text.slice(0, i), wait: jitter() });
  }

  if (erase > 0 && erase < text.length) {
    const keep = text.length - erase;
    // Sit on the finished word long enough to read it before it changes.
    steps.push({ value: text, wait: 520 });
    for (let i = text.length - 1; i >= keep; i--) {
      // Rubbing out is always quicker than writing.
      steps.push({ value: text.slice(0, i), wait: Math.round(speed * 0.45) });
    }
    steps.push({ value: text.slice(0, keep), wait: 300 });
    for (let i = keep + 1; i <= text.length; i++) {
      steps.push({ value: text.slice(0, i), wait: jitter() });
    }
  }

  return steps;
}

/**
 * Writes a word on, character by character, once the preloader lifts.
 *
 * The full string sits in the box as a hidden sizer (see globals.css), so
 * neither the heading nor anything below it reflows while the characters
 * land — only the painted overlay changes.
 */
export function Typewriter({
  text,
  startDelay = 0,
  speed = 78,
  erase = 0,
  className = "",
}: TypewriterProps) {
  const [shown, setShown] = useState("");
  const [writing, setWriting] = useState(false);

  useEffect(() => {
    const timers: number[] = [];

    const run = () => {
      setWriting(true);
      let at = 0;
      for (const step of script(text, speed, erase)) {
        at += step.wait;
        timers.push(window.setTimeout(() => setShown(step.value), at));
      }
      // The caret lingers a beat after the last character, then leaves.
      timers.push(window.setTimeout(() => setWriting(false), at + 900));
    };

    // Never call run() inline: onSiteReady fires synchronously when the
    // curtain is already up, and setState in an effect body cascades a
    // render. A timer also gives us the start delay for free.
    const start = () => timers.push(window.setTimeout(run, startDelay));

    const unsubscribe = onSiteReady(start);
    return () => {
      unsubscribe();
      for (const t of timers) clearTimeout(t);
    };
  }, [text, startDelay, speed, erase]);

  return (
    <span className={`kire-type ${className}`}>
      <span aria-hidden="true" className="kire-type__sizer">
        {text}
      </span>
      <span aria-hidden="true" className="kire-type__out">
        {shown}
        {writing && <i className="kire-caret" />}
      </span>
      {/* The only copy exposed to assistive tech: the sizer is
          visibility:hidden and the overlay is aria-hidden. */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
