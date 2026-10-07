"use client";

import Link from "next/link";
import { useState } from "react";
import { money } from "@/lib/data";
import { applyPromo, cartTotals, FREE_SHIPPING_FROM, PROMOS, removeFromCart, setCartQty, useCartItems, usePromo, type CartItem } from "@/lib/store";
import { ProductImage } from "./Photo";

export const standardShipping = (afterDiscount: number) => (afterDiscount >= FREE_SHIPPING_FROM ? 0 : 6);

export function Thumb({ item, className = "size-20" }: { item: CartItem; className?: string }) {
  return (
    <div className={`box shrink-0 !rounded-lg ${className}`}>
      <ProductImage p={item} sizes="96px" />
    </div>
  );
}

export function Totals({ subtotal, discount, shipping, total, promo, shippingLabel = "Shipping" }: { subtotal: number; discount: number; shipping: number; total: number; promo?: string | null; shippingLabel?: string }) {
  return (
    <dl className="grid grid-cols-[1fr_auto] gap-y-2">
      <dt className="text-mauve">Subtotal</dt>
      <dd className="text-right">{money(subtotal)}</dd>
      {discount > 0 && (
        <>
          <dt className="text-mauve">Promo code {promo}</dt>
          <dd className="text-right text-lacquer">−{money(discount)}</dd>
        </>
      )}
      <dt className="text-mauve">{shippingLabel}</dt>
      <dd className="text-right">{shipping ? money(shipping) : "Free"}</dd>
      <dt className="mt-2 border-t border-petal pt-3 text-lg font-semibold">Total</dt>
      <dd className="mt-2 border-t border-petal pt-3 text-right text-lg font-semibold">{money(total)}</dd>
    </dl>
  );
}

export function CartView() {
  const items = useCartItems();
  const promo = usePromo();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const base = cartTotals(items, promo);
  const totals = cartTotals(items, promo, standardShipping(base.subtotal - base.discount));
  const toFree = FREE_SHIPPING_FROM - (base.subtotal - base.discount);

  function redeem(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c) return setCodeError("Enter a promo code.");
    if (!PROMOS[c]) return setCodeError(`"${c}" is not a valid code. Check the spelling and try again.`);
    applyPromo(c);
    setCode("");
    setCodeError("");
  }

  return (
    <>
      <section className="deco deco-leaf bg-blush">
        <div className="wrap py-10 md:py-14">
          <h1 className="d1 !text-[clamp(2.6rem,6.4vw,5rem)]">Your cart</h1>
          {items.length > 0 && (
            <p className="lede mt-4 text-wine/80" role="status">
              {toFree > 0 ? `Add ${money(toFree)} more for free US shipping.` : "Your order ships free within the US."}
            </p>
          )}
        </div>
      </section>

      {items.length === 0 ? (
        <section className="wrap py-20 text-center">
          <h2 className="d2">Your cart is empty</h2>
          <p className="lede mx-auto mt-4">Pick a set, choose your size and it will wait for you here.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/collections/handmade-press-on-nails" className="btn">
              Shop press-ons
            </Link>
            <Link href="/sizing-chart" className="btn btn-line">
              Find your size
            </Link>
          </div>
        </section>
      ) : (
        <section className="wrap py-10 md:py-14 grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14 items-start">
          <ul className="divide-y divide-line border-y border-line">
            {items.map((i) => (
              <li key={i.key} className="grid grid-cols-[auto_1fr] gap-4 py-5 sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:gap-6">
                <Link href={`/product/${i.slug}`} aria-label={i.name} className="row-span-2 sm:row-span-1">
                  <Thumb item={i} className="size-24" />
                </Link>
                <div>
                  <Link href={`/product/${i.slug}`} className="font-semibold hover:text-lacquer">
                    {i.name}
                  </Link>
                  <p className="text-sm text-mauve">
                    {i.size ? `Size ${i.size}, ` : ""}
                    {money(i.price)} each
                  </p>
                  <button className="link mt-1 text-sm" aria-label={`Remove ${i.name} from cart`} onClick={() => removeFromCart(i.key)}>
                    Remove
                  </button>
                </div>
                <div className="flex w-fit items-center rounded-full border-[1.5px] border-petal" role="group" aria-label={`Quantity of ${i.name}`}>
                  <button className="grid place-items-center size-10 rounded-full text-lg hover:bg-blush disabled:text-petal" aria-label="Decrease quantity" disabled={i.qty <= 1} onClick={() => setCartQty(i.key, i.qty - 1)}>
                    −
                  </button>
                  <output className="w-7 text-center font-semibold" aria-live="polite">
                    {i.qty}
                  </output>
                  <button className="grid place-items-center size-10 rounded-full text-lg hover:bg-blush disabled:text-petal" aria-label="Increase quantity" disabled={i.qty >= 10} onClick={() => setCartQty(i.key, i.qty + 1)}>
                    +
                  </button>
                </div>
                <p className="hidden sm:block w-20 text-right font-semibold">{money(i.qty * i.price)}</p>
              </li>
            ))}
          </ul>

          <aside aria-label="Order summary" className="rounded-xl bg-blush p-6 lg:sticky lg:top-32">
            <h2 className="font-display text-2xl mb-4">Order summary</h2>
            <Totals {...totals} promo={promo} shippingLabel="Standard shipping" />

            {promo ? (
              <p className="mt-5 flex items-center justify-between gap-3 text-sm">
                <span>
                  Code <strong>{promo}</strong> applied.
                </span>
                <button className="link" onClick={() => applyPromo(null)}>
                  Remove code
                </button>
              </p>
            ) : (
              <form onSubmit={redeem} noValidate className="mt-5">
                <label htmlFor="promo" className="label">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input id="promo" className="input" placeholder="XON10" value={code} aria-invalid={!!codeError} aria-describedby={codeError ? "promo-err" : undefined} onChange={(e) => { setCode(e.target.value); setCodeError(""); }} />
                  <button className="btn btn-line">Apply</button>
                </div>
                {codeError && (
                  <p id="promo-err" role="alert" className="mt-1.5 text-sm font-semibold text-lacquer">
                    {codeError}
                  </p>
                )}
              </form>
            )}

            <Link href="/checkout" className="btn mt-6 w-full">
              Go to checkout
            </Link>
            <Link href="/shop" className="link mt-4 block text-center text-sm">
              Continue shopping
            </Link>
          </aside>
        </section>
      )}
    </>
  );
}
