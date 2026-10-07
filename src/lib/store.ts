"use client";

import { useSyncExternalStore } from "react";
import { PRODUCTS, type Art, type Product, type Size } from "./data";

// A tiny browser-side store standing in for the backend. Admin edits to products, the cart and
// the last order are kept in localStorage, so every page shows them straight away.

type Toast = { id: number; text: string; kind: "success" | "error" };

export type CartItem = { key: string; slug: string; name: string; size?: Size; qty: number; price: number; image?: string; art?: Art };

export type PlacedOrder = {
  id: string;
  email: string;
  name: string;
  address: string;
  delivery: string;
  payment: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

type State = { products: Product[]; cart: CartItem[]; promo: string | null; lastOrder: PlacedOrder | null; admin: boolean; toasts: Toast[] };

const KEYS = { products: "xon-products-v2", cart: "xon-cart-v1", promo: "xon-promo-v1", lastOrder: "xon-order-v1", admin: "xon-admin-v1" } as const;
const seed: State = { products: PRODUCTS, cart: [], promo: null, lastOrder: null, admin: false, toasts: [] };
let state: State = seed;
let loaded = false;
const listeners = new Set<() => void>();

function set(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function snapshot() {
  if (!loaded) {
    loaded = true;
    try {
      const saved: Partial<State> = {};
      for (const k of Object.keys(KEYS) as (keyof typeof KEYS)[]) {
        const raw = localStorage.getItem(KEYS[k]);
        if (raw) (saved as Record<string, unknown>)[k] = JSON.parse(raw);
      }
      state = { ...state, ...saved };
    } catch {
      // Storage unavailable: keep the seed catalogue and an empty cart.
    }
  }
  return state;
}

function useStore<T>(pick: (s: State) => T) {
  return useSyncExternalStore(
    subscribe,
    () => pick(snapshot()),
    () => pick(seed),
  );
}

function persist(next: Partial<Pick<State, keyof typeof KEYS>>) {
  snapshot();
  set(next);
  try {
    for (const k of Object.keys(next) as (keyof typeof KEYS)[]) {
      const v = next[k];
      if (v === null || v === undefined || v === false) localStorage.removeItem(KEYS[k]);
      else localStorage.setItem(KEYS[k], JSON.stringify(v));
    }
  } catch {
    // Ignore: the change still applies for this visit.
  }
}

/* Admin account */

// The one admin account for this front-end build. There is no server yet, so the check
// happens in the browser: it keeps casual visitors out of /admin but is not real security.
// A production build replaces this with server-side authentication.
export const ADMIN_ACCOUNT = { username: "admin", email: "admin@x-on.shop", password: "Xon@2026" };

export const useAdmin = () => useStore((s) => s.admin);

const noop = () => () => {};
/** False while the page is still being hydrated, so stored state is not judged too early. */
export const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

export function loginAdmin(user: string, password: string) {
  const u = user.trim().toLowerCase();
  const ok = (u === ADMIN_ACCOUNT.username || u === ADMIN_ACCOUNT.email) && password === ADMIN_ACCOUNT.password;
  if (ok) persist({ admin: true });
  return ok;
}

export function logoutAdmin() {
  persist({ admin: false });
}

/* Products */

export const useProducts = () => useStore((s) => s.products);

export function saveProduct(p: Product) {
  const list = snapshot().products;
  persist({ products: list.some((x) => x.id === p.id) ? list.map((x) => (x.id === p.id ? p : x)) : [p, ...list] });
}

export function removeProducts(ids: string[]) {
  persist({ products: snapshot().products.filter((p) => !ids.includes(p.id)) });
}

export function resetProducts() {
  persist({ products: PRODUCTS });
}

/* Toasts */

export const useToasts = () => useStore((s) => s.toasts);

let toastId = 0;
export function toast(text: string, kind: Toast["kind"] = "success") {
  const id = ++toastId;
  set({ toasts: [...state.toasts, { id, text, kind }] });
  setTimeout(() => dismissToast(id), 4000);
}

export function dismissToast(id: number) {
  set({ toasts: state.toasts.filter((t) => t.id !== id) });
}

/* Cart */

export const FREE_SHIPPING_FROM = 75;
export const PROMOS: Record<string, number> = { XON10: 0.1 };

export const useCartItems = () => useStore((s) => s.cart);
export const useCart = () => useStore((s) => s.cart.reduce((n, i) => n + i.qty, 0));
export const usePromo = () => useStore((s) => s.promo);
export const useLastOrder = () => useStore((s) => s.lastOrder);

export function cartTotals(items: CartItem[], promo: string | null, delivery = 0) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const discount = promo && PROMOS[promo] ? Math.round(subtotal * PROMOS[promo] * 100) / 100 : 0;
  const shipping = delivery;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

export function addToCart(p: Product, size?: Size, qty = 1) {
  const cart = snapshot().cart;
  const key = `${p.slug}:${size ?? ""}`;
  const found = cart.find((i) => i.key === key);
  persist({
    cart: found
      ? cart.map((i) => (i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i))
      : [...cart, { key, slug: p.slug, name: p.name, size, qty, price: p.salePrice ?? p.price, image: p.image, art: p.art }],
  });
  toast(`Added to cart: ${p.name}${size ? `, size ${size}` : ""}${qty > 1 ? ` × ${qty}` : ""}`);
}

export function setCartQty(key: string, qty: number) {
  persist({ cart: snapshot().cart.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)) });
}

export function removeFromCart(key: string) {
  const item = snapshot().cart.find((i) => i.key === key);
  persist({ cart: snapshot().cart.filter((i) => i.key !== key) });
  if (item) toast(`Removed from cart: ${item.name}`);
}

export function applyPromo(code: string | null) {
  persist({ promo: code });
}

export function placeOrder(order: PlacedOrder) {
  persist({ lastOrder: order, cart: [], promo: null });
}
