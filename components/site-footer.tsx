import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";

const STORES = [
  "1042 Mainland Street, Vancouver",
  "88 Ossington Avenue, Toronto",
  "By appointment — Montréal",
];

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const SOCIALS: { label: string; icon: IconName; href: string }[] = [
  { label: "Instagram", icon: "instagram", href: "https://instagram.com" },
  { label: "hello@kiresaile.com", icon: "mail", href: "mailto:hello@kiresaile.com" },
  { label: "+1 604 555 0148", icon: "phone", href: "tel:+16045550148" },
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-line-200 bg-cream-100"
    >
      <div className="mx-auto grid max-w-[1440px] gap-10 px-[var(--page-pad-x)] py-16 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <span className="font-display text-[20px] uppercase tracking-[0.22em]">
            Kiresaile
          </span>
          <p className="max-w-[240px] text-ink-500">
            Cut in Vancouver, in runs small enough that we know how many exist.
          </p>
          <span className="kire-label text-ink-300">Est. 2025</span>
        </div>

        <div className="flex flex-col gap-3">
          <span className="kire-label text-blue-600">Stores</span>
          {STORES.map((store) => (
            <span key={store} className="text-ink-500">
              {store}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="kire-label text-blue-600">Kiresaile</span>
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="w-fit text-ink-500 transition-colors duration-[140ms] ease-standard hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="kire-label text-blue-600">Socials</span>
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="flex w-fit items-center gap-2 text-ink-500 transition-colors duration-[140ms] ease-standard hover:text-blue-600"
            >
              <Icon name={social.icon} size={14} />
              {social.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-line-200 px-[var(--page-pad-x)] py-6 md:flex-row md:items-center md:justify-between">
        <span className="kire-label text-ink-300">
          © 2025 Kiresaile — All rights reserved
        </span>
        <span className="kire-label text-ink-300">
          Portfolio project — Erik Elias, 2026
        </span>
        <span className="kire-label text-ink-300">
          Free shipping over $150 in Canada and the US
        </span>
      </div>
    </footer>
  );
}
