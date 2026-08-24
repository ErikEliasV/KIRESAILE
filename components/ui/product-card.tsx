"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { useReveal } from "@/lib/use-reveal";
import { formatPrice, type Product } from "@/lib/catalog";
import { Icon } from "./icon";
import { MediaFrame } from "./media-frame";

type ProductCardProps = {
  product: Product;
  sizes?: string;
  priority?: boolean;
};

export function ProductCard({ product, sizes, priority }: ProductCardProps) {
  const { add } = useCart();
  const { ref, className: revealClassName } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`group flex flex-col border-2 border-blue-600 bg-cream-100 transition-transform duration-[220ms] ease-standard hover:-translate-y-0.5 ${revealClassName}`}
    >
      <div className="relative">
        <Link
          href={`/product/${product.slug}`}
          aria-label={product.name}
          data-cursor-text="View"
          className="block"
        >
          <MediaFrame
            src={product.image}
            alt={product.name}
            ratio="3 / 4"
            sizes={sizes}
            priority={priority}
          />
        </Link>
        {product.badge && (
          <span className="kire-label absolute top-3 left-3 bg-blue-600 px-2 py-1 text-cream-100">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3 p-3 pb-4">
        <div className="flex flex-col gap-0.5">
          <Link
            href={`/product/${product.slug}`}
            className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-900 hover:text-blue-600"
          >
            / {product.name}
          </Link>
          <span className="text-[12px] text-ink-500">{product.meta}</span>
          <span className="text-[14px] font-semibold text-ink-900">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          type="button"
          aria-label={`Add ${product.name} to bag`}
          data-cursor-text="Add"
          onClick={() => add(product)}
          className="inline-flex size-[42px] shrink-0 cursor-pointer items-center justify-center bg-blue-600 text-cream-100 transition-colors duration-[140ms] ease-standard hover:bg-blue-700 active:translate-y-px"
        >
          <Icon name="shopping-cart" size={18} />
        </button>
      </div>
    </div>
  );
}
