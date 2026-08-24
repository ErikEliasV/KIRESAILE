"use client";

/**
 * A one-shot "the curtain is up" signal, shared by every client component.
 *
 * Scroll reveals must not fire while the preloader covers the page — an
 * IntersectionObserver happily reports the whole first screen as visible
 * behind an opaque overlay, so by the time the curtain lifts everything
 * above the fold has already finished animating and the page looks like it
 * simply appeared. Subscribers here start observing only once the preloader
 * begins its exit.
 */

let ready = false;
const waiting = new Set<() => void>();

/** Called by <Preloader> the moment the curtain starts lifting. */
export function markSiteReady() {
  if (ready) return;
  ready = true;
  for (const notify of waiting) notify();
  waiting.clear();
}

/** Runs `notify` now if the curtain is already up, otherwise when it is.
 *  Returns an unsubscribe for components that unmount while waiting. */
export function onSiteReady(notify: () => void): () => void {
  if (ready) {
    notify();
    return () => {};
  }
  waiting.add(notify);
  return () => {
    waiting.delete(notify);
  };
}

/* Failsafe: if the preloader never mounts or throws before it can signal,
   release everyone anyway rather than leaving the page permanently blank. */
if (typeof window !== "undefined") {
  window.setTimeout(markSiteReady, 8000);
}
