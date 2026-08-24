import type { CSSProperties } from "react";

type MarqueeProps = {
  text: string;
  tone?: "cream" | "accent" | "ink";
  speed?: number;
  repeat?: number;
};

const TONES = {
  cream: "bg-cream-100 text-blue-600 border-y-2 border-blue-600",
  accent: "bg-blue-600 text-cream-100",
  ink: "bg-ink-900 text-cream-100",
} as const;

export function Marquee({
  text,
  tone = "cream",
  speed = 26,
  repeat = 12,
}: MarqueeProps) {
  const run = Array.from({ length: repeat }, () => `${text} /`).join(" ");
  return (
    <div
      className={`flex h-[38px] items-center overflow-hidden ${TONES[tone]}`}
      role="presentation"
    >
      <div
        className="kire-marquee-track flex whitespace-nowrap will-change-transform kire-label !text-[14px] !tracking-[0.14em]"
        style={{
          "--marquee-dur": `${speed}s`,
          animation: `kire-marquee var(--marquee-dur) linear infinite`,
        } as CSSProperties}
      >
        <span className="pr-[1ch]">{run}</span>
        <span className="pr-[1ch]" aria-hidden="true">
          {run}
        </span>
      </div>
    </div>
  );
}
