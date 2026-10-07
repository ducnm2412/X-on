"use client";

import Link from "next/link";
import { discount, money, type Product } from "@/lib/data";
import { addToCart, useProducts } from "@/lib/store";
import { ProductImage } from "./Photo";

export function Price({ p, className = "" }: { p: Product; className?: string }) {
  return (
    <span className={className}>
      {p.salePrice ? (
        <>
          <span className="sr-only">Sale price </span>
          <span className="font-semibold text-lacquer">{money(p.salePrice)}</span>{" "}
          <span className="sr-only">Original price </span>
          <s className="text-mauve">{money(p.price)}</s>
        </>
      ) : (
        <span className="font-semibold">{money(p.price)}</span>
      )}
    </span>
  );
}

// Size dots, as printed on the card each set is mounted on.
export function SizeDots({ sizes }: { sizes: string[] }) {
  if (!sizes.length) return null;
  return (
    <span className="flex gap-1" aria-label={`Sizes ${sizes.join(", ")}`}>
      {sizes.map((s) => (
        <span key={s} aria-hidden="true" className="grid place-items-center h-6 min-w-6 px-1 rounded-full border border-petal text-[0.7rem] font-semibold text-mauve">
          {s}
        </span>
      ))}
    </span>
  );
}

export function ProductCard({ p, priority }: { p: Product; priority?: boolean }) {
  const off = discount(p);
  const out = p.status === "Out of stock";
  const hasOptions = p.sizes.length > 0;
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/product/${p.slug}`} className="box block aspect-square" aria-label={p.name}>
        <ProductImage p={p} priority={priority} />
        {off > 0 && !out && (
          <span className="absolute left-3 top-3 rounded-sm bg-lacquer px-2.5 py-1 text-xs font-bold text-white">Save {off}%</span>
        )}
        {out && <span className="absolute left-3 top-3 rounded-sm bg-white px-2.5 py-1 text-xs font-bold">Sold out</span>}
      </Link>
      <div className="mt-3 flex flex-col gap-x-3 gap-y-0.5 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="font-semibold text-[1.05rem] leading-snug">
          <Link href={`/product/${p.slug}`} className="hover:text-lacquer">
            {p.name}
          </Link>
        </h3>
        <Price p={p} className="whitespace-nowrap text-[0.95rem] pt-0.5" />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 min-h-6">
        <SizeDots sizes={p.sizes} />
        {p.shape && <span className="hidden text-sm text-mauve sm:inline">{p.shape}</span>}
      </div>
      <div className="mt-auto pt-3">
        {out ? (
          <Link href={`/product/${p.slug}`} className="btn btn-line btn-sm w-full">
            View details
          </Link>
        ) : hasOptions ? (
          <Link href={`/product/${p.slug}`} className="btn btn-line btn-sm w-full">
            Select options
          </Link>
        ) : (
          <button className="btn btn-line btn-sm w-full" onClick={() => addToCart(p)}>
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
}

const PICK = {
  handmade: (p: Product) => p.type === "handmade-press-on-nails",
  essentials: (p: Product) => p.type === "nail-essentials",
  best: (p: Product) => !!p.bestSeller || (!!p.salePrice && p.type !== "bundle"),
  bundle: (p: Product) => p.type === "bundle",
};

// A product grid bound to the live catalogue, so admin edits show up here.
export function ProductRow({ pick, limit = 4, exclude, cols = 4 }: { pick: keyof typeof PICK; limit?: number; exclude?: string; cols?: 3 | 4 }) {
  const products = useProducts()
    .filter((p) => p.status !== "Draft" && p.slug !== exclude && PICK[pick](p))
    .slice(0, limit);
  if (!products.length) return <p className="text-mauve">Nothing here yet. New sets are added most Fridays.</p>;
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
