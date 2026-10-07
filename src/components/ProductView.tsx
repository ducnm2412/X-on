"use client";

import Link from "next/link";
import { useState } from "react";
import { discount, REVIEWS, THEMES, typeName, type Size } from "@/lib/data";
import { addToCart, useProducts } from "@/lib/store";
import { Crumbs } from "./Bits";
import { DemoForm } from "./Form";
import { Stars } from "./Nail";
import { Photo, ProductImage } from "./Photo";
import { Price, ProductRow } from "./ProductCard";

// Bound to the Product entity the admin manages: edit a product there and this page follows.
export function ProductView({ slug }: { slug: string }) {
  const product = useProducts().find((p) => p.slug === slug);
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [tab, setTab] = useState<"info" | "reviews">("info");
  const [needSize, setNeedSize] = useState(false);

  if (!product)
    return (
      <div className="wrap py-24 text-center">
        <h1 className="d2">This product is no longer listed</h1>
        <p className="lede mx-auto mt-4">It may have sold out or been renamed. The shop has everything in stock today.</p>
        <Link href="/shop" className="btn mt-8">
          Go to the shop
        </Link>
      </div>
    );

  const p = product;
  const out = p.status === "Out of stock";
  const off = discount(p);
  const reviews = REVIEWS.filter((_, i) => (p.name.length + i) % 2 === 0 || REVIEWS[i].product === p.name);
  // Second and third views are tighter crops of the same photo until more photography is uploaded.
  const shots = p.image
    ? [
        { zoom: undefined, origin: undefined, label: "Full set" },
        { zoom: 2.1, origin: "30% 45%", label: "Close-up, left hand" },
        { zoom: 2.1, origin: "70% 60%", label: "Close-up, right hand" },
      ]
    : [];

  function add() {
    if (p.sizes.length && !size) {
      setNeedSize(true);
      document.getElementById("size-group")?.focus();
      return;
    }
    addToCart(p, size ?? undefined, qty);
  }

  return (
    <>
      <div className="wrap pt-6 md:pt-8">
        <Crumbs items={[["Shop", "/shop"], [typeName(p.type), `/collections/${p.type === "bundle" ? "best-sellers" : p.type}`], [p.name]]} />
      </div>

      <section className="wrap grid gap-8 py-6 md:py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <div className="box aspect-square">
            {p.image ? <Photo src={p.image} sizes="(min-width: 1024px) 50vw, 100vw" zoom={shots[shot].zoom} origin={shots[shot].origin} priority /> : <ProductImage p={p} />}
            {off > 0 && !out && <span className="absolute left-4 top-4 rounded-full bg-lacquer px-3 py-1.5 text-sm font-bold text-white">Save {off}%</span>}
          </div>
          {shots.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-3" role="group" aria-label="Product photos">
              {shots.map((s, i) => (
                <button key={s.label} aria-label={s.label} aria-pressed={shot === i} onClick={() => setShot(i)} className={`box aspect-square !rounded-lg border-2 ${shot === i ? "border-wine" : "border-transparent hover:border-rose"}`}>
                  <Photo src={p.image!} alt="" sizes="160px" zoom={s.zoom} origin={s.origin} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:pt-2">
          <h1 className="d2">{p.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Price p={p} className="text-2xl" />
            <a href="#reviews" onClick={() => setTab("reviews")} className="flex items-center gap-2 text-sm text-mauve hover:text-lacquer">
              <Stars value={5} /> {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </a>
          </div>
          <p className="mt-5 text-lg leading-relaxed max-w-xl">{p.description}</p>

          {p.sizes.length > 0 && (
            <fieldset className="mt-8">
              <legend className="flex w-full items-baseline justify-between">
                <span className="label !mb-0">Size{size ? `: ${size}` : ""}</span>
                <Link href="/sizing-chart" className="link text-sm">
                  Sizing chart
                </Link>
              </legend>
              <div id="size-group" tabIndex={-1} className="mt-3 flex flex-wrap gap-2.5" aria-describedby={needSize && !size ? "size-err" : undefined}>
                {p.sizes.map((s) => (
                  <label key={s} className={`grid place-items-center h-12 min-w-14 px-4 rounded-full border-[1.5px] font-semibold cursor-pointer transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lacquer ${size === s ? "border-lacquer bg-lacquer text-white" : "border-petal hover:border-rose"} ${out ? "opacity-50 pointer-events-none" : ""}`}>
                    <input type="radio" name="size" value={s} className="sr-only" checked={size === s} disabled={out} onChange={() => setSize(s)} />
                    {s}
                  </label>
                ))}
              </div>
              {needSize && !size && (
                <p id="size-err" role="alert" className="mt-2 text-sm font-semibold text-lacquer">
                  Choose a size before adding this set to your cart.
                </p>
              )}
            </fieldset>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <div className="flex items-center rounded-full border-[1.5px] border-petal" role="group" aria-label="Quantity">
              <button className="grid place-items-center size-12 rounded-full text-xl hover:bg-blush disabled:text-petal" aria-label="Decrease quantity" disabled={qty <= 1 || out} onClick={() => setQty(qty - 1)}>
                −
              </button>
              <output className="w-8 text-center font-semibold" aria-live="polite">
                {qty}
              </output>
              <button className="grid place-items-center size-12 rounded-full text-xl hover:bg-blush disabled:text-petal" aria-label="Increase quantity" disabled={qty >= 10 || out} onClick={() => setQty(qty + 1)}>
                +
              </button>
            </div>
            <button className="btn flex-1 min-w-48" disabled={out} onClick={add}>
              {out ? "Sold out" : "Add to cart"}
            </button>
          </div>
          {out ? (
            <p className="mt-3 text-sm text-mauve">The next batch is being made now. Sign up for X-ON updates below to hear when it is back.</p>
          ) : (
            p.stock <= 8 && <p className="mt-3 text-sm font-semibold text-lacquer">Only {p.stock} left from this batch.</p>
          )}

          <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-line pt-6 text-[0.95rem]">
            <dt className="text-mauve">SKU</dt>
            <dd>{p.sku}</dd>
            <dt className="text-mauve">Categories</dt>
            <dd className="flex flex-wrap gap-x-3 gap-y-1">
              <Link href={`/collections/${p.type === "bundle" ? "best-sellers" : p.type}`} className="link">
                {typeName(p.type)}
              </Link>
              {p.shape && (
                <Link href={`/collections/${p.shape.toLowerCase()}`} className="link">
                  {p.shape}
                </Link>
              )}
              {p.themes.map((t) => (
                <Link key={t} href={`/collections/${t}`} className="link">
                  {THEMES.find((x) => x.slug === t)?.name}
                </Link>
              ))}
            </dd>
          </dl>
        </div>
      </section>

      <section id="reviews" className="wrap py-10 md:py-14 scroll-mt-32">
        <div role="tablist" aria-label="Product details" className="flex gap-2 border-b border-line">
          {(
            [
              ["info", "Additional information"],
              ["reviews", `Reviews (${reviews.length})`],
            ] as const
          ).map(([key, label]) => (
            <button key={key} role="tab" id={`tab-${key}`} aria-selected={tab === key} aria-controls={`panel-${key}`} onClick={() => setTab(key)} className={`-mb-px px-4 py-3 font-semibold border-b-2 ${tab === key ? "border-wine" : "border-transparent text-mauve hover:text-wine"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "info" ? (
          <div role="tabpanel" id="panel-info" aria-labelledby="tab-info" className="pt-8 max-w-3xl">
            <dl className="divide-y divide-line">
              {[...p.info, ...(p.sizes.length ? ([["Sizes", p.sizes.join(", ")]] as [string, string][]) : [])].map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[12rem_1fr]">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="text-mauve">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" className="pt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <ul className="divide-y divide-line">
              {reviews.map((r) => (
                <li key={r.name} className="py-5 first:pt-0">
                  <Stars value={r.rating} />
                  <p className="mt-2">{r.text}</p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-mauve">, {r.place}</span>
                  </p>
                </li>
              ))}
            </ul>
            <div>
              <h2 className="d3 mb-1">Write a review</h2>
              <p className="text-mauve mb-6">Your email is not published.</p>
              <DemoForm
                id="review"
                submitLabel="Post review"
                loadingLabel="Posting review…"
                successTitle="Review posted"
                successBody="Thank you. It will appear here once our team has read it, usually within a day."
                again="Write another review"
                fields={[
                  { name: "rating", label: "Your rating", type: "rating", required: true },
                  { name: "review", label: "Review", type: "textarea", required: true, placeholder: "How did the set fit and wear?" },
                  { name: "name", label: "Name", required: true, half: true, autoComplete: "name" },
                  { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
                ]}
              />
            </div>
          </div>
        )}
      </section>

      <section aria-labelledby="related" className="wrap pb-20 md:pb-28">
        <h2 id="related" className="d2 mb-8">
          You may also like
        </h2>
        <ProductRow pick={p.type === "nail-essentials" ? "essentials" : "handmade"} limit={4} exclude={p.slug} />
      </section>
    </>
  );
}

