"use client";

import Link from "next/link";
import { discount, money } from "@/lib/data";
import { addToCart, useProducts } from "@/lib/store";
import { ProductImage } from "./Photo";

// Bundles are ordinary products flagged as type "bundle" in the admin.
export function BundleList() {
  const bundles = useProducts().filter((p) => p.type === "bundle" && p.status !== "Draft");
  if (!bundles.length) return <p className="text-mauve">No bundles are running right now. Check back on Friday.</p>;
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {bundles.map((p) => {
        const off = discount(p);
        const includes = p.info.find(([k]) => k === "Includes")?.[1];
        return (
          <li key={p.id} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] overflow-hidden rounded-xl border-[1.5px] border-petal">
            <Link href={`/product/${p.slug}`} className="relative block min-h-56 overflow-hidden bg-blush" aria-label={p.name}>
              <ProductImage p={p} sizes="(min-width: 768px) 20vw, 40vw" />
            </Link>
            <div className="flex flex-col p-5 md:p-7">
              {off > 0 && (
                <p className="font-display text-[clamp(2.2rem,4vw,3.25rem)] leading-none text-lacquer">
                  {off}% <span className="text-[0.5em]">off</span>
                </p>
              )}
              <h2 className="mt-3 text-lg font-semibold leading-snug">
                <Link href={`/product/${p.slug}`} className="hover:text-lacquer">
                  {p.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-mauve">{includes ?? p.description}</p>
              <p className="mt-3">
                <span className="sr-only">Bundle price </span>
                <span className="text-xl font-semibold">{money(p.salePrice ?? p.price)}</span>{" "}
                {p.salePrice && (
                  <>
                    <span className="sr-only">Original price </span>
                    <s className="text-mauve">{money(p.price)}</s>
                  </>
                )}
              </p>
              <div className="mt-auto pt-5">
                {p.sizes.length ? (
                  <Link href={`/product/${p.slug}`} className="btn btn-sm w-full">
                    Select options
                  </Link>
                ) : (
                  <button className="btn btn-sm w-full" onClick={() => addToCart(p)}>
                    Add to cart
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
