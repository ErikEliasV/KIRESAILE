"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { markSiteReady } from "@/lib/site-ready";

const WORD = "KIRESAILE";
const SHUTTERS = 6;

/** Below this the counter is a flash nobody can read. The wordmark alone
 *  takes 9 x 95ms of stagger plus a 1250ms rise to finish assembling. */
const MIN_MS = 3000;
/** Above this the site is being held hostage by a slow asset. Let it in. */
const MAX_MS = 6500;
/** Must cover the exit choreography in globals.css:
 *  inner fade 560ms, then shutters (420ms delay + 5 x 95ms stagger + 1150ms). */
const EXIT_MS = 2050;

/** Same key the blocking script in app/layout.tsx reads. */
const SEEN_KEY = "kire-preloaded";

type Phase = "loading" | "gone";

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* private mode — the curtain just plays again next reload */
  }
}

/**
 * How much of the page is actually ready, 0–1.
 *
 * Weighted rather than counted, because the three signals cost wildly
 * different amounts of time: webfonts settle early, eager images dominate
 * the middle, and `load` is the one that means the page is truly painted.
 */
function measure(fontsDone: boolean, loadDone: boolean) {
  const eager = Array.from(document.images).filter(
    (img) => img.loading !== "lazy",
  );
  const images = eager.length
    ? eager.filter((img) => img.complete).length / eager.length
    : 0;

  return 0.25 * (fontsDone ? 1 : 0) + 0.45 * images + 0.3 * (loadDone ? 1 : 0);
}

/**
 * The KIRESAILE curtain: a cream page that counts itself up to 100, then
 * lifts as six shutters while the hero animates in behind it.
 *
 * Shown once per tab. Returning visitors get `data-preloader="done"` stamped
 * on <html> before first paint by the script in the document head, so the
 * server-rendered markup below is hidden by CSS and never flashes — it still
 * has to be rendered on the client's first pass, or hydration would mismatch.
 */
export function Preloader() {
  const [phase, setPhase] = useState<Phase>("loading");
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;

    if (html.dataset.preloader === "done" || readSeen()) {
      html.dataset.preloader = "done";
      markSiteReady();
      // CSS has already hidden this markup via the `done` attribute, so the
      // unmount is pure cleanup and can wait a tick — dropping it inline here
      // would cascade a second render before the first paint.
      const skip = window.setTimeout(() => setPhase("gone"), 0);
      return () => clearTimeout(skip);
    }

    html.dataset.preloader = "loading";
    // A reload part-way down the page would otherwise lift the curtain onto
    // the middle of the site, with the hero intro playing off-screen.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let fontsDone = false;
    let loadDone = document.readyState === "complete";

    document.fonts?.ready.then(() => {
      fontsDone = true;
    });

    const onLoad = () => {
      loadDone = true;
    };
    if (!loadDone) window.addEventListener("load", onLoad, { once: true });

    const started = performance.now();
    let shown = 0;
    let frame = 0;
    let exitTimer = 0;
    let hardStop = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      clearTimeout(hardStop);
      writeSeen();
      window.scrollTo(0, 0);

      // Hand the page over as the curtain starts moving, not after — the
      // hero should already be arriving as the shutters clear it.
      html.dataset.preloader = "exiting";
      markSiteReady();

      exitTimer = window.setTimeout(() => {
        html.dataset.preloader = "done";
        setPhase("gone");
      }, EXIT_MS);
    };

    const tick = () => {
      const elapsed = performance.now() - started;

      // A floor that always creeps forward, so a stalled asset never leaves
      // the counter frozen on the same number.
      const floor = Math.min(0.92, (elapsed / MIN_MS) * 0.88);
      // Hold just short of 100 until the minimum has passed, so the number
      // never sits at 100 waiting for the clock.
      const ceiling = elapsed < MIN_MS ? 0.985 : 1;

      const target =
        elapsed >= MAX_MS
          ? 1
          : Math.min(ceiling, Math.max(measure(fontsDone, loadDone), floor));

      // A gentle chase, so the number glides instead of stepping. The last
      // stretch closes faster — an asymptote crawling from 98 to 100 reads
      // as a hang, not as smoothness.
      shown += (target - shown) * (target === 1 ? 0.075 : 0.045);
      if (target === 1 && shown > 0.997) shown = 1;

      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(shown * 100)).padStart(
          3,
          "0",
        );
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${shown.toFixed(4)})`;
      }

      if (shown === 1) {
        finish();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    // The progress loop is rAF-driven, and Chrome runs no animation frames in
    // a tab that is not being rendered — open the site in a background tab and
    // the counter, and therefore the whole curtain, freezes at zero. Timers do
    // still fire there, so this is the one deadline that cannot stall. It sits
    // below the release valve in lib/site-ready.ts, so the curtain always lifts
    // before the reveals are let go.
    hardStop = window.setTimeout(finish, MAX_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
      clearTimeout(hardStop);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className="kire-preloader" role="status" aria-label="Loading KIRESAILE">
      <div className="kire-preloader-shutters" aria-hidden="true">
        {Array.from({ length: SHUTTERS }, (_, i) => (
          <div
            key={i}
            className="kire-preloader-shutter"
            style={{ "--shutter-delay": `${420 + i * 95}ms` } as CSSProperties}
          />
        ))}
      </div>

      <div className="kire-preloader-inner">
        <div className="kire-label flex items-start justify-between border-b border-line-200 pb-3 text-ink-300">
          <span>/ Autumn 2025</span>
          <span className="hidden sm:inline">Cut in Vancouver</span>
          <span>Est. 2025</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 py-8">
          <h1
            aria-hidden="true"
            className="kire-hero m-0 text-center text-[clamp(46px,13vw,190px)] text-blue-600"
          >
            {WORD.split("").map((letter, i) => (
              <span key={i} className="kire-preloader-mask">
                <span
                  className="kire-preloader-letter"
                  style={{ "--letter-delay": `${i * 95}ms` } as CSSProperties}
                >
                  {letter}
                </span>
              </span>
            ))}
          </h1>
          <span className="kire-preloader-mask -mt-[0.28em]">
            <span
              className="kire-preloader-letter block font-script text-script leading-none text-ink-900"
              style={{ "--letter-delay": "1000ms" } as CSSProperties}
            >
              Vancouver
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="kire-preloader-rule">
            <div ref={barRef} className="kire-preloader-bar" />
          </div>
          <div className="kire-label flex items-end justify-between text-ink-300">
            <span>/ Loading the collection</span>
            <span className="font-display text-[clamp(28px,5vw,56px)] leading-none tracking-[-0.045em] text-ink-900">
              <span ref={counterRef}>000</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
