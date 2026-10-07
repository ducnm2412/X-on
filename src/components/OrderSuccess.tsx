"use client";

import Link from "next/link";
import { BRAND, money } from "@/lib/data";
import { useLastOrder } from "@/lib/store";
import { Thumb, Totals } from "./CartView";
import { nailMask, Sparkle } from "./Nail";

const NEXT = [
  ["Today", "A confirmation email is on its way to you."],
  ["Within 2 business days", "We box your set with glue, tabs and a prep kit, then send tracking."],
  ["When it arrives", "Prep, press on and wear. The guide in the box takes ten minutes."],
];

export function OrderSuccess() {
  const order = useLastOrder();

  if (!order)
    return (
      <section className="wrap py-24 text-center">
        <h1 className="d2">No recent order on this device</h1>
        <p className="lede mx-auto mt-4">If you placed an order, the confirmation is in your email. Otherwise the shop is this way.</p>
        <Link href="/shop" className="btn mt-8">
          Go to the shop
        </Link>
      </section>
    );

  return (
    <>
      <section className="deco deco-leaf bg-blush">
        <div className="wrap py-12 md:py-20 grid gap-8 md:grid-cols-[1fr_auto] items-center">
          <div>
            <Sparkle className="size-8 text-lacquer mb-5 animate-press" />
            <h1 className="d1 !text-[clamp(2.6rem,6.4vw,5rem)]">Order placed.</h1>
            <p className="lede mt-5 text-wine/80">
              Thank you, {order.name.split(" ")[0]}. Order <strong className="text-wine">{order.id}</strong> is confirmed and a receipt is going to {order.email}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn">
                Continue shopping
              </Link>
              <Link href="/sizing-chart" className="btn btn-line">
                How to apply your set
              </Link>
            </div>
          </div>
          {/* The five nails of the set, pressing on one by one. */}
          <div className="hidden md:flex items-end gap-2.5 pr-6" aria-hidden="true">
            {[16, 12, 13, 12, 9].map((w, i) => (
              <div key={i} className="animate-press bg-rose" style={{ width: `${w * 3.4}px`, aspectRatio: "10 / 21", animationDelay: `${200 + i * 130}ms`, opacity: 1 - i * 0.14, ...nailMask("Almond") }} />
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-12 md:py-16 grid gap-12 lg:grid-cols-[1fr_26rem] lg:gap-14 items-start">
        <div>
          <h2 className="d2">What happens next</h2>
          <ol className="mt-7 divide-y divide-line border-y border-line">
            {NEXT.map(([when, what]) => (
              <li key={when} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr]">
                <span className="font-semibold">{when}</span>
                <span className="text-mauve">{what}</span>
              </li>
            ))}
          </ol>

          <dl className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <dt className="label">Deliver to</dt>
              <dd className="text-mauve">
                {order.name}
                <br />
                {order.address}
              </dd>
            </div>
            <div>
              <dt className="label">Delivery</dt>
              <dd className="text-mauve">{order.delivery}</dd>
            </div>
            <div>
              <dt className="label">Payment</dt>
              <dd className="text-mauve">{order.payment}</dd>
            </div>
          </dl>
          <p className="mt-10 text-mauve">
            Need to change something? Call{" "}
            <a href={BRAND.phoneHref} className="link">
              {BRAND.phone}
            </a>{" "}
            or{" "}
            <Link href="/contact-us" className="link">
              send us a message
            </Link>{" "}
            with your order number.
          </p>
        </div>

        <aside aria-label="Order summary" className="rounded-xl bg-blush p-6">
          <h2 className="font-display text-2xl mb-4">Order {order.id}</h2>
          <ul className="mb-5 space-y-4">
            {order.items.map((i) => (
              <li key={i.key} className="flex items-center gap-3">
                <Thumb item={i} className="size-16 !bg-white" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug">{i.name}</p>
                  <p className="text-sm text-mauve">
                    {i.size ? `Size ${i.size}, ` : ""}quantity {i.qty}
                  </p>
                </div>
                <p className="font-semibold">{money(i.qty * i.price)}</p>
              </li>
            ))}
          </ul>
          <Totals subtotal={order.subtotal} discount={order.discount} shipping={order.shipping} total={order.total} promo="applied" />
        </aside>
      </section>
    </>
  );
}
