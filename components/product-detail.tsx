"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { MediaFrame } from "@/components/ui/media-frame";
import { formatPrice, type Product } from "@/lib/catalog";

const TABS = ["Details", "Fabric", "Shipping"] as const;
type Tab = (typeof TABS)[number];

export function ProductDetail({ product }: { product: Product }) {
  const { add, open } = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [tab, setTab] = useState<Tab>("Details");

  const panels: Record<Tab, string> = {
    Details: product.story,
    Fabric: `${product.composition} ${product.care} ${product.origin}`,
    Shipping:
      "Free shipping over $150 in Canada and the US. Express — 2 days. Returns accepted within 30 days, unworn, tags on.",
  };

  return (
    <section className="bg-cream-100 px-[var(--page-pad-x)] pt-6 pb-16">
      <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div className="border-2 border-blue-600 p-3">
          <MediaFrame
            src={product.image}
            alt={product.name}
            ratio="3 / 4"
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
          />
        </div>

        <div className="flex flex-col gap-6 md:pt-6">
          <div className="flex flex-col gap-3">
            <span className="kire-label text-blue-600">
              / {product.category}
            </span>
            <h1 className="kire-display m-0 text-title text-ink-900">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <span className="font-display text-[28px] tracking-[-0.02em]">
                {formatPrice(product.price)}
              </span>
              <span className="text-ink-500">{product.meta}</span>
            </div>
          </div>

          <p className="max-w-[420px] text-ink-500">{product.story}</p>

          <fieldset className="flex flex-col gap-3">
            <legend className="kire-label mb-2 text-ink-300">Size</legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((option) => {
                const selected = option === size;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    aria-pressed={selected}
                    className={`kire-label size-11 cursor-pointer transition-colors duration-[140ms] ease-standard ${
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
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="lg"
              iconLeft="shopping-cart"
              onClick={() => add(product, size)}
            >
              Add to bag
            </Button>
            <Button
              variant="secondary"
              size="lg"
              iconRight="arrow-right"
              onClick={open}
            >
              View bag
            </Button>
          </div>

          <p className="flex items-center gap-2 text-ink-500">
            <Icon name="truck" size={16} />
            Free shipping over $150 in Canada and the US.
          </p>

          <div className="mt-2 border-t border-line-200 pt-5">
            <div role="tablist" className="flex gap-6">
              {TABS.map((option) => (
                <button
                  key={option}
                  role="tab"
                  type="button"
                  aria-selected={tab === option}
                  onClick={() => setTab(option)}
                  className={`kire-label cursor-pointer pb-2 transition-colors duration-[140ms] ease-standard ${
                    tab === option
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "border-b-2 border-transparent text-ink-500 hover:text-ink-900"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-4 max-w-[420px] text-ink-500">{panels[tab]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
