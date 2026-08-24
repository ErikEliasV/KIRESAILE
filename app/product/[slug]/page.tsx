import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { PRODUCTS } from "@/lib/catalog";
import { getVersionedProduct, getVersionedProducts } from "@/lib/versioned-catalog";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/product/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getVersionedProduct(slug);
  if (!product) return { title: "Not found — KIRESAILE" };
  return {
    title: `${product.name} — KIRESAILE`,
    description: `${product.composition} ${product.origin}`,
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = getVersionedProduct(slug);
  if (!product) notFound();

  const related = getVersionedProducts()
    .filter((item) => item.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="kire-label bg-cream-100 px-[var(--page-pad-x)] py-4 text-ink-300"
      >
        <div className="mx-auto flex max-w-[1440px] gap-2">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/collection" className="hover:text-blue-600">
            Collection
          </Link>
          <span>/</span>
          <span className="text-ink-900">{product.name}</span>
        </div>
      </nav>

      <ProductDetail product={product} />

      <section className="bg-cream-200 px-[var(--page-pad-x)] py-16">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading size="title" tone="accent" className="mb-8">
            Also cut this run
          </SectionHeading>
          <div className="grid grid-cols-2 gap-[var(--gutter)] md:grid-cols-3">
            {related.map((item) => (
              <ProductCard
                key={item.slug}
                product={item}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
