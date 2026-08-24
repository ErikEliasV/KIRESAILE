import { versioned } from "./asset-version";
import { PRODUCTS, type Product } from "./catalog";

/**
 * Server-only. Returns the catalogue with each `image` path cache-busted
 * against its file's current mtime — see asset-version.ts for why.
 */
export function getVersionedProducts(): Product[] {
  return PRODUCTS.map((product) => ({
    ...product,
    image: versioned(product.image),
  }));
}

export function getVersionedProduct(slug: string): Product | undefined {
  const product = PRODUCTS.find((p) => p.slug === slug);
  return product ? { ...product, image: versioned(product.image) } : undefined;
}
