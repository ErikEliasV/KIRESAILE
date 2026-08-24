"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { CATEGORIES, type Product } from "@/lib/catalog";

type Sort = "featured" | "low" | "high";

const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "low", label: "Price — low to high" },
  { id: "high", label: "Price — high to low" },
];

export function CollectionGrid({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<Sort>("featured");

  const shown = useMemo(() => {
    const filtered =
      category === "All"
        ? products
        : products.filter((product) => product.category === category);

    if (sort === "low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sort === "high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [products, category, sort]);

  return (
    <section className="bg-cream-200 px-[var(--page-pad-x)] py-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-line-200 pb-5">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((option) => {
              const selected = option === category;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  aria-pressed={selected}
                  className={`kire-label cursor-pointer px-4 py-2 transition-colors duration-[140ms] ease-standard ${
                    selected
                      ? "border-2 border-blue-600 bg-blue-100 text-blue-600"
                      : "border border-line-200 text-ink-500 hover:border-ink-900 hover:text-ink-900"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-3">
            <span className="kire-label text-ink-300">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              className="kire-label h-[42px] cursor-pointer border-0 border-b border-ink-900 bg-transparent pr-6 focus:border-b-2 focus:border-blue-600 focus:outline-none"
            >
              {SORTS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {shown.length === 0 ? (
          <p className="text-ink-500">Nothing in this category right now.</p>
        ) : (
          <div className="grid grid-cols-2 gap-[var(--gutter)] md:grid-cols-3">
            {shown.map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={index < 3}
              />
            ))}
          </div>
        )}

        <p className="kire-label mt-8 text-ink-300">
          {shown.length} {shown.length === 1 ? "piece" : "pieces"}
        </p>
      </div>
    </section>
  );
}
