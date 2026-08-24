export type Product = {
  slug: string;
  name: string;
  price: number;
  meta: string;
  category: "Outerwear" | "Tailoring" | "Knitwear" | "Trousers";
  badge?: string;
  image: string;
  sizes: string[];
  composition: string;
  care: string;
  origin: string;
  story: string;
};

/** Placeholder catalogue — plausible fillers, not real inventory (see DS caveats). */
export const PRODUCTS: Product[] = [
  {
    slug: "kire-coat",
    name: "Kire Coat",
    price: 148,
    meta: "Ecru / 4 sizes",
    category: "Outerwear",
    image: "/media/product-01.jpg",
    sizes: ["XS", "S", "M", "L"],
    composition: "68% wool, 32% recycled polyamide.",
    care: "Dry clean.",
    origin: "Cut in Vancouver in a run of 120.",
    story:
      "The coat the label started with. Loose through the shoulder, closed at the wrist, long enough to sit over a suit.",
  },
  {
    slug: "saile-blazer",
    name: "Saile Blazer",
    price: 96,
    meta: "Navy / 2 left",
    category: "Tailoring",
    badge: "New",
    image: "/media/product-02.jpg",
    sizes: ["XS", "S", "M"],
    composition: "94% virgin wool, 6% elastane.",
    care: "Dry clean.",
    origin: "Cut in Vancouver in a run of 80.",
    story:
      "A soft-shouldered blazer with a half lining. Pressed seams, no padding, one interior pocket.",
  },
  {
    slug: "atelier-jacket",
    name: "Atelier Jacket",
    price: 210,
    meta: "Charcoal / 5 sizes",
    category: "Outerwear",
    image: "/media/product-03.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    composition: "100% dry-finished cotton canvas.",
    care: "Machine wash cold. Line dry.",
    origin: "Cut in Vancouver in a run of 60.",
    story:
      "Wide sleeve, dropped armhole, cut to be worn open. The canvas softens after the third wash and holds its shape after that.",
  },
  {
    slug: "signature-suit",
    name: "Signature Suit",
    price: 320,
    meta: "Bone / 3 sizes",
    category: "Tailoring",
    image: "/media/product-04.jpg",
    sizes: ["S", "M", "L"],
    composition: "72% wool, 28% linen.",
    care: "Dry clean.",
    origin: "Cut in Vancouver in a run of 40.",
    story:
      "Sold as two pieces. The jacket runs long, the trouser sits at the natural waist and breaks once.",
  },
  {
    slug: "column-dress",
    name: "Column Dress",
    price: 186,
    meta: "Pearl / 4 sizes",
    category: "Knitwear",
    badge: "Restocked",
    image: "/media/product-05.jpg",
    sizes: ["XS", "S", "M", "L"],
    composition: "88% viscose, 12% silk.",
    care: "Hand wash cold. Dry flat.",
    origin: "Cut in Vancouver in a run of 90.",
    story:
      "One seam down the back, a bias cut everywhere else. It hangs from the shoulder and moves from there.",
  },
  {
    slug: "field-trouser",
    name: "Field Trouser",
    price: 124,
    meta: "Slate / 5 sizes",
    category: "Trousers",
    image: "/media/product-06.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    composition: "100% organic cotton twill.",
    care: "Machine wash cold.",
    origin: "Cut in Vancouver in a run of 150.",
    story:
      "A wide leg with a flat front and two deep pockets. Hemmed long on purpose — take it up or leave it.",
  },
];

export const CATEGORIES = [
  "All",
  "Outerwear",
  "Tailoring",
  "Knitwear",
  "Trousers",
] as const;

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(value: number): string {
  return `$${value}`;
}
