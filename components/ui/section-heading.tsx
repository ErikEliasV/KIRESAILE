import type { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  /** Sacramento accent, rationed to one use per screen. Takes a node so the
   *  hero can hand it a <Typewriter> instead of a plain string. */
  script?: ReactNode;
  align?: "left" | "center" | "right";
  size?: "hero" | "display" | "title";
  tone?: "ink" | "accent" | "invert";
  className?: string;
  as?: "h1" | "h2" | "h3";
};

const TONES = {
  ink: "text-ink-900",
  accent: "text-blue-600",
  invert: "text-cream-100",
} as const;

const SIZES = {
  hero: "text-hero leading-[0.82]",
  display: "text-display leading-[1.05]",
  title: "text-title leading-[1.05]",
} as const;

const ALIGN = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

export function SectionHeading({
  children,
  script,
  align = "left",
  size = "display",
  tone = "ink",
  className = "",
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={`relative flex flex-col ${ALIGN[align]} ${className}`}>
      <Tag
        className={`m-0 font-display uppercase tracking-[-0.045em] ${SIZES[size]} ${TONES[tone]}`}
      >
        {children}
      </Tag>
      {script && (
        <span
          className={`-mt-[0.35em] font-script text-script leading-none normal-case tracking-normal ${
            tone === "invert" ? "text-cream-100" : "text-ink-900"
          }`}
        >
          {script}
        </span>
      )}
    </div>
  );
}
