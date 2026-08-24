import type { Metadata } from "next";
import { CollectionGrid } from "@/components/collection-grid";
import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import { getVersionedProducts } from "@/lib/versioned-catalog";

export const metadata: Metadata = {
  title: "Collection — KIRESAILE",
  description:
    "Autumn 2025. Six pieces, cut in Vancouver in runs small enough that we know how many exist.",
};

export default function CollectionPage() {
  return (
    <>
      <section className="bg-cream-100 px-[var(--page-pad-x)] py-14">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-6">
          <SectionHeading as="h1" tone="accent" script="Autumn 2025">
            Collection
          </SectionHeading>
          <p className="max-w-[280px] text-ink-500">
            Six pieces this season. Restocked only when the fabric allows, and
            never in a larger run.
          </p>
        </div>
      </section>

      <Marquee text="Collection" tone="accent" />

      <CollectionGrid products={getVersionedProducts()} />
    </>
  );
}
