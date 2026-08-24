"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatPrice } from "@/lib/catalog";

const SHIPPING = [
  { id: "standard", label: "Standard — 5 days", cost: 0 },
  { id: "express", label: "Express — 2 days", cost: 18 },
];

export function CartDrawer() {
  const { lines, isOpen, close, remove, subtotal, toast, dismissToast } =
    useCart();
  const [shipping, setShipping] = useState(SHIPPING[0].id);
  const [giftWrap, setGiftWrap] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, 3200);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const shippingCost = SHIPPING.find((s) => s.id === shipping)?.cost ?? 0;
  const total = subtotal + shippingCost + (giftWrap ? 6 : 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close bag"
            onClick={close}
            className="absolute inset-0 cursor-default bg-[rgba(11,11,11,0.42)] backdrop-blur-[10px]"
            style={{ animation: "kire-fade-in 220ms var(--ease-standard)" }}
          />

          <aside
            role="dialog"
            aria-label="Your bag"
            className="relative flex h-full w-full max-w-[420px] flex-col bg-cream-100 shadow-[0_24px_64px_rgba(11,11,11,0.24)]"
            style={{ animation: "kire-drawer-in 220ms var(--ease-standard)" }}
          >
            <header className="flex items-center justify-between border-b border-line-200 px-6 py-5">
              <span className="kire-label">Your bag</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close bag"
                className="cursor-pointer hover:text-blue-600"
              >
                <Icon name="x" size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <p className="text-ink-500">Your bag is empty.</p>
              ) : (
                <ul className="flex flex-col gap-5">
                  {lines.map((line) => (
                    <li
                      key={`${line.slug}-${line.size}`}
                      className="flex gap-4 border-b border-line-200 pb-5"
                    >
                      <div className="relative h-[96px] w-[72px] shrink-0 bg-photo-grey">
                        <Image
                          src={line.image}
                          alt={line.name}
                          fill
                          sizes="72px"
                          className="kire-photo object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.08em]">
                          / {line.name}
                        </span>
                        <span className="text-[12px] text-ink-500">
                          Size {line.size} — Qty {line.qty}
                        </span>
                        <span className="text-[14px] font-semibold">
                          {formatPrice(line.price * line.qty)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.slug, line.size)}
                        aria-label={`Remove ${line.name}`}
                        className="h-fit cursor-pointer text-ink-500 hover:text-danger"
                      >
                        <Icon name="trash-2" size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {lines.length > 0 && (
                <div className="mt-6 flex flex-col gap-4">
                  <span className="kire-label text-blue-600">Shipping</span>
                  {SHIPPING.map((option) => (
                    <label
                      key={option.id}
                      className="flex cursor-pointer items-center gap-3 text-ink-500"
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={shipping === option.id}
                        onChange={() => setShipping(option.id)}
                        className="size-4 accent-blue-600"
                      />
                      {option.label}
                      <span className="ml-auto text-ink-900">
                        {option.cost === 0 ? "Free" : formatPrice(option.cost)}
                      </span>
                    </label>
                  ))}

                  <label className="flex cursor-pointer items-center gap-3 text-ink-500">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="size-4 accent-blue-600"
                    />
                    Gift wrap
                    <span className="ml-auto text-ink-900">$6</span>
                  </label>
                </div>
              )}
            </div>

            <footer className="border-t border-line-200 px-6 py-5">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="kire-label">Total</span>
                <span className="font-display text-[24px] tracking-[-0.02em]">
                  {formatPrice(total)}
                </span>
              </div>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={lines.length === 0}
                iconRight="arrow-right"
              >
                Checkout
              </Button>
            </footer>
          </aside>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed right-6 bottom-6 z-60 flex max-w-[320px] items-start gap-3 border-2 border-blue-600 bg-cream-100 px-4 py-3"
          style={{ animation: "kire-toast-in 220ms var(--ease-standard)" }}
        >
          <Icon name="check" size={16} className="mt-0.5 text-blue-600" />
          <span className="text-[12px] text-ink-900">{toast}</span>
        </div>
      )}
    </>
  );
}
