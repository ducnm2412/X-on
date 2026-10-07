"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRAND, money } from "@/lib/data";
import { cartTotals, placeOrder, toast, useCartItems, usePromo } from "@/lib/store";
import { standardShipping, Thumb, Totals } from "./CartView";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATES = ["FL", "GA", "TX", "NY", "NJ", "CA", "WA", "IL", "NC", "Other"];

type Values = Record<"email" | "phone" | "name" | "address" | "city" | "state" | "zip" | "card" | "expiry" | "cvc" | "cardName", string>;
const EMPTY: Values = { email: "", phone: "", name: "", address: "", city: "", state: "FL", zip: "", card: "", expiry: "", cvc: "", cardName: "" };

export function CheckoutView() {
  const router = useRouter();
  const items = useCartItems();
  const promo = usePromo();
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Values>>({});
  const [delivery, setDelivery] = useState<"standard" | "express" | "pickup">("standard");
  const [status, setStatus] = useState<"idle" | "placing" | "failed">("idle");

  const base = cartTotals(items, promo);
  const standard = standardShipping(base.subtotal - base.discount);
  const DELIVERY = {
    standard: { name: "Standard", note: "3 to 5 business days", cost: standard },
    express: { name: "Express", note: "2 business days", cost: 14 },
    pickup: { name: "Studio pick-up", note: `${BRAND.street}, ready in 2 days`, cost: 0 },
  };
  const totals = cartTotals(items, promo, DELIVERY[delivery].cost);
  const pickup = delivery === "pickup";

  const set = (k: keyof Values, value: string) => {
    setV({ ...v, [k]: value });
    if (errors[k]) setErrors({ ...errors, [k]: "" });
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found: Partial<Values> = {};
    if (!EMAIL.test(v.email.trim())) found.email = "Enter an email address like name@example.com.";
    if (v.phone && v.phone.replace(/\D/g, "").length < 10) found.phone = "Enter a 10-digit phone number.";
    if (!v.name.trim()) found.name = "Enter your full name.";
    if (!pickup) {
      if (!v.address.trim()) found.address = "Enter your street address.";
      if (!v.city.trim()) found.city = "Enter your city.";
      if (!/^\d{5}$/.test(v.zip.trim())) found.zip = "Enter a 5-digit ZIP code.";
    }
    const digits = v.card.replace(/\D/g, "");
    if (digits.length < 15) found.card = "Enter the 15 or 16 digits on your card.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(v.expiry.trim())) found.expiry = "Enter the expiry date as MM/YY.";
    if (!/^\d{3,4}$/.test(v.cvc.trim())) found.cvc = "Enter the 3 or 4 digit security code.";
    if (!v.cardName.trim()) found.cardName = "Enter the name on the card.";
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`co-${first}`)?.focus();
      return;
    }

    setStatus("placing");
    setTimeout(() => {
      // Demo only: a card number ending in 0000 previews a declined payment.
      if (digits.endsWith("0000")) {
        setStatus("failed");
        return;
      }
      placeOrder({
        id: `XO-${10483 + (Date.now() % 500)}`,
        email: v.email.trim(),
        name: v.name.trim(),
        address: pickup ? `Studio pick-up at ${BRAND.address}` : `${v.address.trim()}, ${v.city.trim()}, ${v.state} ${v.zip.trim()}`,
        delivery: `${DELIVERY[delivery].name}, ${DELIVERY[delivery].note}`,
        payment: `Card ending ${digits.slice(-4)}`,
        items,
        ...totals,
      });
      toast("Order placed");
      router.push("/order-success");
    }, 1200);
  }

  if (!items.length && status === "idle")
    return (
      <section className="wrap py-24 text-center">
        <h1 className="d2">Nothing to check out yet</h1>
        <p className="lede mx-auto mt-4">Your cart is empty. Add a set and come back to place your order.</p>
        <Link href="/shop" className="btn mt-8">
          Go to the shop
        </Link>
      </section>
    );

  const field = (k: keyof Values, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, className = "") => (
    <div className={className}>
      <label htmlFor={`co-${k}`} className="label">
        {label}
      </label>
      <input id={`co-${k}`} className="input" value={v[k]} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `co-${k}-err` : undefined} onChange={(e) => set(k, e.target.value)} {...props} />
      {errors[k] && (
        <p id={`co-${k}-err`} className="mt-1.5 text-sm font-semibold text-lacquer">
          {errors[k]}
        </p>
      )}
    </div>
  );

  // The order of these steps is the order the shopper fills them in, so they are numbered.
  const step = (n: number, title: string) => (
    <h2 className="mb-5 flex items-center gap-3 font-display text-2xl">
      <span className="grid place-items-center size-9 rounded-full bg-petal text-lg">{n}</span>
      {title}
    </h2>
  );

  return (
    <>
      <section className="deco deco-leaf bg-blush">
        <div className="wrap py-10 md:py-14">
          <nav aria-label="Checkout steps" className="text-sm text-mauve">
            <ol className="flex flex-wrap gap-x-2">
              <li>
                <Link href="/cart" className="underline underline-offset-4 hover:text-lacquer">
                  Cart
                </Link>{" "}
                /
              </li>
              <li aria-current="step" className="text-wine font-semibold">
                Checkout /
              </li>
              <li>Order placed</li>
            </ol>
          </nav>
          <h1 className="d1 !text-[clamp(2.6rem,6.4vw,5rem)] mt-4">Checkout</h1>
        </div>
      </section>

      <form onSubmit={submit} noValidate className="wrap py-10 md:py-14 grid gap-10 lg:grid-cols-[1fr_26rem] lg:gap-14 items-start">
        <div className="space-y-12">
          {status === "failed" && (
            <div role="alert" className="rounded-lg border-[1.5px] border-lacquer bg-blush px-5 py-4">
              <p className="font-semibold">Payment declined. Your card was not charged.</p>
              <p className="text-sm text-mauve">Check the card number, expiry date and security code, or use another card, then place the order again.</p>
            </div>
          )}

          <section>
            {step(1, "Contact")}
            <div className="grid gap-5 sm:grid-cols-2">
              {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "name@example.com" })}
              {field("phone", "Phone (optional)", { type: "tel", autoComplete: "tel", placeholder: "689-555-0100" })}
            </div>
          </section>

          <section>
            {step(2, "Delivery")}
            <fieldset>
              <legend className="sr-only">Delivery method</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {(Object.keys(DELIVERY) as (keyof typeof DELIVERY)[]).map((k) => (
                  <label key={k} className={`flex cursor-pointer flex-col rounded-lg border-[1.5px] p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lacquer ${delivery === k ? "border-wine bg-blush" : "border-petal hover:border-rose"}`}>
                    <input type="radio" name="delivery" className="sr-only" checked={delivery === k} onChange={() => setDelivery(k)} />
                    <span className="flex items-baseline justify-between gap-2 font-semibold">
                      {DELIVERY[k].name}
                      <span>{DELIVERY[k].cost ? money(DELIVERY[k].cost) : "Free"}</span>
                    </span>
                    <span className="mt-1 text-sm text-mauve">{DELIVERY[k].note}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 grid gap-5 sm:grid-cols-6">
              {field("name", "Full name", { autoComplete: "name" }, "sm:col-span-6")}
              {!pickup && (
                <>
                  {field("address", "Street address", { autoComplete: "street-address" }, "sm:col-span-6")}
                  {field("city", "City", { autoComplete: "address-level2" }, "sm:col-span-3")}
                  <div className="sm:col-span-1">
                    <label htmlFor="co-state" className="label">
                      State
                    </label>
                    <select id="co-state" className="input !px-3" autoComplete="address-level1" value={v.state} onChange={(e) => set("state", e.target.value)}>
                      {STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {field("zip", "ZIP code", { inputMode: "numeric", autoComplete: "postal-code", maxLength: 5 }, "sm:col-span-2")}
                </>
              )}
            </div>
          </section>

          <section>
            {step(3, "Payment")}
            <p className="mb-5 rounded-lg bg-blush px-4 py-3 text-sm">This is a demo checkout. No card is charged and nothing you type is sent anywhere. Any 16 digits will do.</p>
            <div className="grid gap-5 sm:grid-cols-4">
              {field("card", "Card number", { inputMode: "numeric", autoComplete: "cc-number", placeholder: "4242 4242 4242 4242", maxLength: 19 }, "sm:col-span-4")}
              {field("expiry", "Expiry date", { autoComplete: "cc-exp", placeholder: "MM/YY", maxLength: 5 }, "sm:col-span-2")}
              {field("cvc", "Security code", { inputMode: "numeric", autoComplete: "cc-csc", placeholder: "123", maxLength: 4 }, "sm:col-span-2")}
              {field("cardName", "Name on card", { autoComplete: "cc-name" }, "sm:col-span-4")}
            </div>
          </section>
        </div>

        <aside aria-label="Order summary" className="rounded-xl bg-blush p-6 lg:sticky lg:top-32">
          <h2 className="font-display text-2xl mb-4">Your order</h2>
          <ul className="mb-5 space-y-4">
            {items.map((i) => (
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
          <Totals {...totals} promo={promo} shippingLabel={DELIVERY[delivery].name} />
          <button className="btn mt-6 w-full" disabled={status === "placing"}>
            {status === "placing" ? "Placing order…" : `Place order, ${money(totals.total)}`}
          </button>
          <p className="mt-4 text-sm text-mauve">
            By placing your order you agree to our{" "}
            <Link href="/legal/terms" className="link">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="link">
              Privacy Policy
            </Link>
            .
          </p>
          <Link href="/cart" className="link mt-3 block text-sm">
            Edit cart
          </Link>
        </aside>
      </form>
    </>
  );
}
