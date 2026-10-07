"use client";

import Link from "next/link";
import { addToCart, useProducts } from "@/lib/store";
import { ProductImage } from "./Photo";
import { Price } from "./ProductCard";

// Two essentials as picture tiles with the name and price laid over the bottom edge.
// Bound to the live catalogue, so admin edits show here.
export function EssentialTiles() {
  const items = useProducts()
    .filter((p) => p.type === "nail-essentials" && p.status === "Active")
    .slice(0, 2);
  return (
    <ul className="grid gap-4 sm:grid-cols-2 md:gap-6">
      {items.map((p) => (
        <li key={p.id} className="flex overflow-hidden rounded-xl bg-white sm:flex-col sm:rounded-xl">
          <Link href={`/product/${p.slug}`} aria-label={p.name} className="relative block w-[38%] shrink-0 overflow-hidden sm:aspect-[4/3] sm:w-auto">
            <ProductImage p={p} sizes="(min-width: 640px) 30vw, 90vw" />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <div>
              <h3 className="font-semibold leading-snug">
                <Link href={`/product/${p.slug}`} className="hover:text-lacquer">
                  {p.name}
                </Link>
              </h3>
              <Price p={p} className="text-[0.95rem]" />
            </div>
            <button className="btn btn-sm shrink-0" aria-label={`Add ${p.name} to cart`} onClick={() => addToCart(p)}>
              Add to cart
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
