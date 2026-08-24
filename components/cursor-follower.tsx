"use client";

import { useEffect, useRef } from "react";

const HOVER_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label, [data-cursor-hover]';

/**
 * A square cursor that trails the pointer with a slight lag, then grows
 * and picks up a label when it crosses something interactive. Skipped on
 * touch/coarse pointers, where there's no cursor to replace. Runs
 * regardless of prefers-reduced-motion — it's a cursor replacement, not
 * ambient motion, so the native cursor is the only fallback needed.
 */
export function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    document.documentElement.classList.add("kire-has-cursor");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pointer };
    let frame = 0;
    let visible = false;

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!visible) {
        visible = true;
        ring.style.opacity = "1";
        dot.style.opacity = "1";
      }
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = "0";
      dot.style.opacity = "0";
      label.classList.remove("is-visible");
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest(
        HOVER_SELECTOR,
      );
      if (!target) return;
      ring.classList.add("is-hover");
      const text = target.getAttribute("data-cursor-text");
      if (text) {
        label.textContent = text;
        label.classList.add("is-visible");
      }
    };

    const onOut = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest(
        HOVER_SELECTOR,
      );
      if (!target) return;
      const next = (event.relatedTarget as Element | null)?.closest(
        HOVER_SELECTOR,
      );
      if (next) return;
      ring.classList.remove("is-hover");
      label.classList.remove("is-visible");
    };

    const tick = () => {
      ringPos.x += (pointer.x - ringPos.x) * 0.18;
      ringPos.y += (pointer.y - ringPos.y) * 0.18;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      label.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, calc(-50% + 34px))`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("kire-has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="kire-cursor-dot" style={{ opacity: 0 }} />
      <div ref={ringRef} className="kire-cursor-ring" style={{ opacity: 0 }} />
      <div ref={labelRef} className="kire-cursor-label" />
    </>
  );
}
