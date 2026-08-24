import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon, type IconName } from "./icon";

type Variant = "primary" | "secondary" | "outline" | "invert" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // Primary darkens to blue-700 on hover.
  primary:
    "bg-blue-600 text-cream-100 border-2 border-transparent hover:bg-blue-700",
  // Secondary and outline invert on hover — fill in, text flips.
  secondary:
    "bg-transparent text-ink-900 border border-ink-900 hover:bg-ink-900 hover:text-cream-100",
  outline:
    "bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-cream-100",
  invert:
    "bg-transparent text-cream-100 border border-cream-100 hover:bg-cream-100 hover:text-ink-900",
  // Ghost gains a 1px underline.
  ghost:
    "bg-transparent text-ink-900 border-2 border-transparent hover:shadow-[inset_0_-1px_0_currentColor]",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-4 text-[10px]",
  md: "h-[42px] px-6 text-[11px]",
  lg: "h-[52px] px-8 text-[12px]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-ui font-semibold uppercase tracking-[0.14em] cursor-pointer " +
  "transition-[background-color,color,transform,box-shadow] duration-[140ms] ease-standard active:translate-y-px " +
  "disabled:cursor-not-allowed disabled:bg-cream-300 disabled:text-ink-300 disabled:border-transparent disabled:hover:bg-cream-300 disabled:hover:text-ink-300";

type SharedProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  iconLeft?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  className?: string;
};

function content({ children, iconLeft, iconRight, size = "md" }: SharedProps) {
  const glyph = size === "sm" ? 14 : 16;
  return (
    <>
      {iconLeft && <Icon name={iconLeft} size={glyph} />}
      {children}
      {iconRight && <Icon name={iconRight} size={glyph} />}
    </>
  );
}

function classes(props: SharedProps) {
  const { variant = "primary", size = "md", fullWidth, className = "" } = props;
  return [
    BASE,
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? "flex w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = SharedProps &
  Omit<ComponentProps<"button">, "children" | "className">;

export function Button({
  children,
  variant,
  size,
  iconLeft,
  iconRight,
  fullWidth,
  className,
  ...rest
}: ButtonProps) {
  const shared = { children, variant, size, iconLeft, iconRight, fullWidth, className };
  return (
    <button type="button" className={classes(shared)} {...rest}>
      {content(shared)}
    </button>
  );
}

type ButtonLinkProps = SharedProps &
  Omit<ComponentProps<typeof Link>, "children" | "className">;

export function ButtonLink({
  children,
  variant,
  size,
  iconLeft,
  iconRight,
  fullWidth,
  className,
  ...rest
}: ButtonLinkProps) {
  const shared = { children, variant, size, iconLeft, iconRight, fullWidth, className };
  return (
    <Link className={classes(shared)} {...rest}>
      {content(shared)}
    </Link>
  );
}
