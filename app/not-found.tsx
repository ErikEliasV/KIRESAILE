import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col justify-center gap-6 bg-cream-100 px-[var(--page-pad-x)] py-20">
      <div className="mx-auto w-full max-w-[1440px]">
        <SectionHeading as="h1" tone="accent" script="Nothing here">
          404
        </SectionHeading>
        <p className="mt-6 max-w-[280px] text-ink-500">
          That piece is not in this run. The collection is short on purpose.
        </p>
        <ButtonLink
          href="/collection"
          variant="outline"
          size="lg"
          iconRight="arrow-right"
          className="mt-8"
        >
          See the collection
        </ButtonLink>
      </div>
    </section>
  );
}
