"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/catalog";

export type CartLine = {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

type CartValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  toast: string | null;
  open: () => void;
  close: () => void;
  add: (product: Product, size?: string) => void;
  remove: (slug: string, size: string) => void;
  dismissToast: () => void;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const add = useCallback((product: Product, size?: string) => {
    const chosen = size ?? product.sizes[0];
    setLines((current) => {
      const match = current.find(
        (line) => line.slug === product.slug && line.size === chosen,
      );
      if (match) {
        return current.map((line) =>
          line === match ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [
        ...current,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          size: chosen,
          qty: 1,
        },
      ];
    });
    setToast(`${product.name} — size ${chosen} added to your bag.`);
  }, []);

  const remove = useCallback((slug: string, size: string) => {
    setLines((current) =>
      current.filter((line) => !(line.slug === slug && line.size === size)),
    );
  }, []);

  const value = useMemo<CartValue>(() => {
    const count = lines.reduce((total, line) => total + line.qty, 0);
    const subtotal = lines.reduce(
      (total, line) => total + line.price * line.qty,
      0,
    );
    return {
      lines,
      count,
      subtotal,
      isOpen,
      toast,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      remove,
      dismissToast: () => setToast(null),
    };
  }, [lines, isOpen, toast, add, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
