"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { Icon } from "@/components/ui/icon";

const LEFT = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Shop", href: "/collection" },
];

const RIGHT = [{ label: "Contact", href: "/#contact" }];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const link = ({ label, href }: { label: string; href: string }) => {
    const active = href === pathname;
    return (
      <Link
        key={label}
        href={href}
        onClick={() => setMenuOpen(false)}
        className={`kire-label transition-colors duration-[140ms] ease-standard hover:text-blue-600 ${
          active ? "text-blue-600" : "text-ink-900"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="bg-cream-100">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-[var(--page-pad-x)]">
        <nav className="hidden flex-1 gap-12 md:flex">{LEFT.map(link)}</nav>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex cursor-pointer md:hidden"
        >
          <Icon name={menuOpen ? "x" : "menu"} size={20} />
        </button>

        <Link
          href="/"
          className="font-display text-[15px] uppercase tracking-[0.22em] whitespace-nowrap"
        >
          Kiresaile
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-12">
          <span className="hidden md:contents">{RIGHT.map(link)}</span>
          <button
            type="button"
            onClick={open}
            aria-label={`Bag, ${count} item${count === 1 ? "" : "s"}`}
            className="relative inline-flex cursor-pointer transition-colors duration-[140ms] ease-standard hover:text-blue-600"
          >
            <Icon name="shopping-cart" size={18} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 inline-flex h-[15px] min-w-[15px] items-center justify-center bg-blue-600 px-[3px] font-ui text-[9px] font-bold text-cream-100">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-4 border-t border-line-200 px-[var(--page-pad-x)] py-5 md:hidden">
          {[...LEFT, ...RIGHT].map(link)}
        </nav>
      )}
    </header>
  );
}
