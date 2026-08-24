import Image from "next/image";
import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { MediaFrame } from "@/components/ui/media-frame";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { FabricSection } from "@/components/fabric-section";
import { NewsletterForm } from "@/components/newsletter-form";
import { Parallax } from "@/components/parallax";
import { Reveal } from "@/components/reveal";
import { Typewriter } from "@/components/typewriter";
import { versioned } from "@/lib/asset-version";
import { getVersionedProducts } from "@/lib/versioned-catalog";

/** Hero intro cue. `.kire-intro` holds the element at the `from` state until
 *  the preloader stamps <html>, then plays it in — see app/globals.css. */
const intro = (delay: number, x = 0, y = 30): CSSProperties =>
  ({
    "--in-delay": `${delay}ms`,
    "--in-x": `${x}px`,
    "--in-y": `${y}px`,
  }) as CSSProperties;

/**
 * How the three product tiles enter the wall: the middle one rises out of
 * the floor first, then the flanks slide in from their own side of the
 * screen, each landing in the slot the one before it left open.
 */
const WALL_ENTRY = [
  { reveal: "left" as const, delay: 170 },
  { reveal: "bottom" as const, delay: 0 },
  { reveal: "right" as const, delay: 340 },
];

export default function HomePage() {
  const wall = getVersionedProducts().slice(0, 3);

  return (
    <>
      {/* Hero — the model is cropped at the knee, so she sits flush on the
          section's bottom edge with no padding under her. */}
      <section className="relative overflow-hidden bg-cream-100 px-[var(--page-pad-x)]">
        <div className="relative mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)] items-end gap-6 pt-6 md:grid-cols-[minmax(0,1fr)_minmax(480px,900px)_minmax(0,1fr)]">
          {/* left column — the wordmark writes itself on, so it carries no
              .kire-intro fade of its own; the typing is the entrance. */}
          <div className="flex flex-col gap-6 pb-0 md:gap-8 md:pb-10">
            {/* On mobile the parallax "Saile" below has nowhere to sit, so
                the wordmark stacks here instead — same size, no gap, so the
                two halves read as one block at line-height 0.82. */}
            <div className="flex flex-col">
              <SectionHeading as="h1" size="hero" tone="accent" className="mt-4 md:mt-10">
                <Typewriter text="Kire" startDelay={700} erase={2} />
              </SectionHeading>
              <span
                aria-hidden="true"
                className="kire-hero text-hero text-blue-600 select-none md:hidden"
              >
                <Typewriter text="Saile" startDelay={2000} />
              </span>
            </div>
            <div
              className="kire-intro flex flex-col gap-6 md:gap-8"
              style={intro(2500, -44, 0)}
            >
              <ButtonLink
                href="/collection"
                variant="secondary"
                size="lg"
                className="self-start bg-paper"
              >
                Shop now
              </ButtonLink>
              <div className="kire-label flex items-end gap-4">
                <span className="h-[64px] border-l border-ink-900 pl-1.5 md:h-[90px] [writing-mode:vertical-rl] [transform:rotate(180deg)]">
                  2025
                </span>
                <span className="text-ink-500">Est.</span>
              </div>
            </div>
          </div>

          {/* centre — the model, greyscaled to the paper, glued to the bottom */}
          <div className="relative order-last self-end md:order-none">
            <div className="relative mx-auto aspect-[864/1014] w-full max-w-[440px] md:h-[clamp(460px,86vh,1040px)] md:w-auto md:max-w-none">
              {/* Ghost wordmark, pinned to the photo's own coordinates (not
                  the viewport) so it always sits behind her head. Drifts
                  slightly slower than the page scroll for depth. */}
              <Parallax
                speed={30}
                origin="translate(-50%, -50%)"
                className="pointer-events-none absolute top-[23%] left-1/2 w-[220vw]"
              >
                <span
                  aria-hidden="true"
                  className="kire-intro kire-hero block text-center text-[clamp(56px,13vw,190px)] text-cream-300 select-none"
                  style={intro(250, 0, -150)}
                >
                  Kiresaile
                </span>
              </Parallax>
              {/* Own wrapper so the wipe clips the model alone — clipping the
                  container would cut the 220vw ghost wordmark with her. */}
              <div className="kire-intro-media absolute inset-0">
                <Image
                  src={versioned("/media/girl-model-mono-edit.png")}
                  alt="KIRESAILE Autumn 2025 — oversized jacket, cropped tank and wide trouser"
                  fill
                  priority
                  sizes="(max-width: 768px) 96vw, 900px"
                  className="object-contain object-bottom"
                />
              </div>
            </div>
            {/* md+ only — below that the wordmark stacks in the left column. */}
            <Parallax
              speed={-24}
              className="pointer-events-none absolute bottom-8 -left-[20vw] hidden md:block"
            >
              <span
                aria-hidden="true"
                className="kire-hero text-[clamp(64px,10vw,148px)] text-blue-600 select-none"
              >
                <Typewriter text="Saile" startDelay={2000} />
              </span>
            </Parallax>
          </div>

          {/* right column — Vancouver writes while Saile writes opposite it,
              then the signature is drawn underneath in Sacramento. */}
          {/* Holds the right edge at every width, mirroring the desktop
              composition: the wordmark and button own the left, this column
              answers from the right. Safe on a phone now that the grid track
              is pinned to minmax(0,1fr) — it used to inherit the model's
              640px width and push all of this off the screen. */}
          <div className="flex flex-col items-end gap-5 text-right md:gap-6 md:pb-10">
            <p
              className="kire-intro max-w-[280px] text-ink-500 md:max-w-[210px]"
              style={intro(900, 44, 0)}
            >
              Autumn 2025. Tailoring cut for daily wear, made in small runs and
              restocked only when the fabric allows.
            </p>
            <SectionHeading
              align="right"
              tone="accent"
              className="md:mt-8"
              script={
                <Typewriter text="Signature" startDelay={2000} speed={105} />
              }
            >
              <Typewriter text="Vancouver" startDelay={1200} />
            </SectionHeading>
          </div>
        </div>
      </section>

      <Marquee text="Collection" tone="cream" />

      {/* Collection wall — one cell is always an inverted panel, never four
          identical tiles. The cells slot in one at a time, centre first and
          then the flanks, so the wall builds itself instead of fading up as
          one slab. */}
      <section className="kire-reveal-band bg-blue-600 px-[var(--page-pad-x)] py-12">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-[var(--gutter)] md:grid-cols-4">
          {wall.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              sizes="(max-width: 768px) 50vw, 25vw"
              priority={index === 0}
              reveal={WALL_ENTRY[index].reveal}
              delay={WALL_ENTRY[index].delay}
            />
          ))}

          <Reveal
            variant="bottom"
            delay={510}
            className="flex items-center justify-center gap-3 border-2 border-cream-100 py-10 text-cream-100"
          >
            <span className="font-display text-[34px] uppercase tracking-[-0.02em] [writing-mode:vertical-rl]">
              Vancouver
            </span>
            <span className="font-script text-[42px] leading-none [writing-mode:vertical-rl]">
              Signature
            </span>
          </Reveal>

          <Reveal
            variant="left"
            delay={170}
            className="group flex flex-col border-2 border-blue-600 bg-cream-100"
          >
            <span className="kire-label px-4 pt-3 pb-2">/ Quality</span>
            <div className="p-3 pt-0">
              <MediaFrame
                src={versioned("/media/detail-yarn.jpg")}
                alt="Detail — spun yarn before the knit"
                ratio="4 / 3"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </Reveal>

          <Reveal
            variant="bottom"
            className="group flex flex-col border border-line-200 bg-paper md:col-span-2"
          >
            <span className="kire-label px-4 pt-3 pb-2">/ Lookbook</span>
            <div className="p-3 pt-0">
              <MediaFrame
                src={versioned("/media/lookbook-rack.jpg")}
                alt="Lookbook 01 — the whole collection on the rail"
                ratio="21 / 9"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>

          <Reveal
            variant="right"
            delay={340}
            className="col-span-2 flex items-end border-2 border-cream-100 p-4 md:col-span-1"
          >
            <ButtonLink
              href="/collection"
              variant="invert"
              size="md"
              iconRight="arrow-right"
            >
              All products
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* Fabric — video rendered through the fragment shader */}
      <FabricSection />

      <Marquee text="About us" tone="cream" />

      {/* Brand story */}
      <section
        id="about"
        className="relative scroll-mt-16 overflow-hidden bg-photo-grey px-[var(--page-pad-x)] py-20"
      >
        <Parallax speed={44} origin="scale(1.18)" className="absolute inset-0">
          <Image
            src={versioned("/media/story-coat.jpg")}
            alt=""
            fill
            sizes="100vw"
            className="kire-photo object-cover"
          />
        </Parallax>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0)_0%,rgba(11,11,11,0.55)_100%)]" />

        <div className="relative mx-auto max-w-[1440px]">
          <div className="grid gap-16 md:grid-cols-2">
            <Reveal variant="left" className="max-w-[320px] bg-cream-100 p-6">
              <h3 className="mb-3 text-heading leading-snug font-bold tracking-[-0.02em] uppercase">
                Brand story
              </h3>
              <p className="text-ink-500">
                KIRESAILE began with one coat and a short list of mills. We keep
                the list short. Every piece is cut in Vancouver, in runs small
                enough that we know how many exist.
              </p>
            </Reveal>

            <Reveal
              variant="right"
              delay={140}
              className="max-w-[320px] justify-self-end bg-cream-100 p-6 text-right md:mt-24"
            >
              <h3 className="mb-3 text-heading leading-snug font-bold tracking-[-0.02em] uppercase">
                Vancouver signature
              </h3>
              <p className="text-ink-500">
                Wool for the rain, cotton for the rest of the year. The fit is
                loose through the shoulder and closed at the wrist.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 flex justify-center">
            <ButtonLink href="/collection" variant="invert" size="lg">
              Shop now
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Featured looks */}
      <section className="kire-reveal-band bg-cream-200 px-[var(--page-pad-x)] py-16">
        <Reveal className="mx-auto max-w-[1440px] bg-cream-100 p-6 md:p-12">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_240px_1fr]">
            <SectionHeading tone="accent" script="Product name">
              Featured
            </SectionHeading>
            <div className="group mx-auto w-[180px] md:w-[240px]">
              <MediaFrame
                src={versioned("/media/featured-portrait.jpg")}
                alt="Look 04 — close crop"
                ratio="3 / 4"
                sizes="240px"
              />
            </div>
            <SectionHeading tone="accent" align="right">
              Looks
            </SectionHeading>
          </div>
        </Reveal>
      </section>

      {/* Newsletter */}
      <section className="bg-ink-900 px-[var(--page-pad-x)] py-16 text-cream-100">
        {/* grid-cols-[minmax(0,1fr)]: a lone implicit column sizes to
            max-content, so "Restocks only" on one line set the track width
            and pushed the page into a horizontal scroll on a 320px screen. */}
        <Reveal className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-2 md:items-end">
          <SectionHeading size="title" tone="invert">
            Restocks only
          </SectionHeading>
          <div className="flex flex-col gap-4">
            <p className="max-w-[320px] text-ink-300">
              Email me about restocks. One message per run, nothing else.
            </p>
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
