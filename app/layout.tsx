import type { Metadata } from "next";
import { Archivo, Archivo_Black, Sacramento } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { CursorFollower } from "@/components/cursor-follower";
import { Preloader } from "@/components/preloader";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "KIRESAILE — Tailoring cut in Vancouver",
  description:
    "Autumn 2025. Tailoring cut for daily wear, made in small runs and restocked only when the fabric allows.",
};

/**
 * Runs before the first paint, ahead of hydration.
 *
 * The curtain is a once-per-tab event, and React can only decide that in an
 * effect — by which point a returning visitor has already seen a frame of it.
 * Stamping the decision onto <html> here lets CSS hide the server-rendered
 * markup instantly. The timeout is pure insurance: if the bundle never
 * hydrates, the page must not stay locked behind an overlay forever.
 */
const PRELOADER_BOOT = `
try {
  var seen = sessionStorage.getItem('kire-preloaded') === '1';
  document.documentElement.dataset.preloader = seen ? 'done' : 'loading';
} catch (e) {
  document.documentElement.dataset.preloader = 'loading';
}
setTimeout(function () {
  if (document.documentElement.dataset.preloader === 'loading') {
    document.documentElement.dataset.preloader = 'done';
  }
}, 9000);
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: PRELOADER_BOOT stamps `data-preloader` onto
    // this element before React hydrates, which is by definition an attribute
    // the server never rendered. It is the point of the script — the decision
    // has to exist before the first paint — so the warning is noise.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${archivoBlack.variable} ${sacramento.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_BOOT }} />
        {/* Without JS nothing can lift the curtain or trip an observer, so
            every gated element is simply present from the start. */}
        <noscript>
          <style>{`
            .kire-preloader { display: none !important; }
            .kire-reveal, .kire-intro, .kire-intro-media {
              opacity: 1 !important;
              transform: none !important;
              clip-path: none !important;
              animation: none !important;
            }
          `}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col bg-cream-200">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <CursorFollower />
          <Preloader />
        </CartProvider>
      </body>
    </html>
  );
}
