"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BRAND, SHAPES, THEMES } from "@/lib/data";
import { useCart } from "@/lib/store";
import { NailIcon } from "./Nail";
import { Photo } from "./Photo";

const SHOP_TYPES = [
  { href: "/shop", label: "Shop all" },
  { href: "/collections/best-sellers", label: "Best Sellers" },
  {
    href: "/collections/handmade-press-on-nails",
    label: "Handmade Press-On Nails",
  },
  { href: "/collections/nail-essentials", label: "Nail Essentials" },
];
const GALLERY = [
  {
    href: "/gallery-product",
    label: "Now selling",
    note: "Sets in stock today",
    image: "/IMG_7101.JPG",
  },
  {
    href: "/gallery-coming-soon",
    label: "Coming soon",
    note: "Next collections",
    image: "/IMG_7098.JPG",
  },
];
const LINKS = [
  { href: "/about", label: "About" },
  { href: "/wholesale-signup", label: "Wholesale" },
  { href: "/bundle-and-save", label: "Bundle & Save" },
  { href: "/sizing-chart", label: "Sizing Chart" },
];
const AFTER = [
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact" },
];

// A link to the home page goes there as usual. When the visitor is already on the home
// page there is nowhere to go, so it scrolls back to the top instead.
function homeOrTop() {
  if (window.location.pathname === "/")
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="X-ON home"
      className={`block ${className}`}
      onClick={homeOrTop}
    >
      <Image
        src="/logo.png"
        alt="X-ON"
        width={640}
        height={340}
        preload
        className="h-full w-auto object-contain"
      />
    </Link>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 8"
      className={`w-2.5 transition-transform group-open:rotate-180 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M1 1.5l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Header() {
  const [menu, setMenu] = useState<null | "shop" | "gallery">(null);
  const [drawer, setDrawer] = useState(false);
  const cart = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setDrawer(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const close = () => {
    setMenu(null);
    setDrawer(false);
  };
  const navLink =
    "px-2.5 py-2 rounded-md text-[0.95rem] font-medium hover:text-lacquer";

  return (
    <>
      <p className="bg-petal text-center text-sm font-medium px-4 py-1.5">
        Free US shipping on orders over $75. Every set is made by hand in
        Kissimmee, Florida.
      </p>
      <header className="sticky top-0 z-40 px-5 py-3 md:px-10 pointer-events-none">
        {/* A floating pill, so the home hero video can run underneath it. */}
        <div
          className="relative mx-auto max-w-[77rem] pointer-events-auto"
          onMouseLeave={() => setMenu(null)}
        >
          <div className="animate-unroll flex items-center gap-4 h-[4.25rem] rounded-md border border-line bg-white shadow-[0_10px_34px_-12px_rgb(58_15_31/0.35)] pl-5 pr-2.5 md:pl-7">
            <Logo className="h-11 shrink-0" />

            <nav
              aria-label="Main"
              className="hidden xl:flex items-center gap-0.5 mx-auto"
            >
              <Link
                href="/"
                className={navLink}
                onClick={() => {
                  close();
                  homeOrTop();
                }}
              >
                Home
              </Link>
              <button
                className={`${navLink} inline-flex items-center gap-1.5`}
                aria-expanded={menu === "shop"}
                aria-controls="mega-shop"
                onClick={() => setMenu(menu === "shop" ? null : "shop")}
                onMouseEnter={() => setMenu("shop")}
              >
                Shop <Caret open={menu === "shop"} />
              </button>
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={navLink}
                  onMouseEnter={() => setMenu(null)}
                  onClick={close}
                >
                  {l.label}
                </Link>
              ))}
              <div className="relative">
                <button
                  className={`${navLink} inline-flex items-center gap-1.5`}
                  aria-expanded={menu === "gallery"}
                  aria-controls="mega-gallery"
                  onClick={() => setMenu(menu === "gallery" ? null : "gallery")}
                  onMouseEnter={() => setMenu("gallery")}
                >
                  Gallery <Caret open={menu === "gallery"} />
                </button>
                {menu === "gallery" && (
                  <div
                    id="mega-gallery"
                    className="absolute left-1/2 top-full z-10 w-[27rem] -translate-x-1/2 pt-5"
                  >
                    <div className="animate-rise grid grid-cols-2 gap-3 rounded-xl border border-line bg-white p-3 shadow-[0_18px_40px_-18px_rgb(58_15_31/0.4)]">
                      {GALLERY.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="group rounded-lg p-1.5 hover:bg-blush"
                          onClick={close}
                        >
                          <span className="box block aspect-[4/3] !rounded-lg">
                            <Photo src={l.image} alt="" sizes="200px" />
                          </span>
                          <span className="mt-2 block px-1 font-semibold group-hover:text-lacquer">
                            {l.label}
                          </span>
                          <span className="block px-1 pb-1 text-sm text-mauve">
                            {l.note}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {AFTER.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={navLink}
                  onMouseEnter={() => setMenu(null)}
                  onClick={close}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto xl:ml-0 flex items-center gap-1">
              <Link
                href="/my-account"
                className={`${navLink} hidden sm:block`}
                onClick={close}
              >
                Log in
              </Link>
              <Link
                href="/cart"
                className="relative grid place-items-center size-11 rounded-full hover:bg-blush"
                aria-label={`Cart, ${cart} ${cart === 1 ? "item" : "items"}`}
                onClick={close}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
                  <path d="M9 8V7a3 3 0 0 1 6 0v1" />
                </svg>
                {cart > 0 && (
                  <span className="absolute right-0.5 top-0.5 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-lacquer text-white text-[0.7rem] font-bold">
                    {cart}
                  </span>
                )}
              </Link>
              <Link
                href="/shop"
                className="btn btn-sm hidden md:inline-flex ml-1"
                onClick={close}
              >
                Shop now
              </Link>
              <button
                className="xl:hidden grid place-items-center size-11 rounded-full hover:bg-blush"
                aria-label="Open menu"
                aria-expanded={drawer}
                onClick={() => setDrawer(true)}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </div>

          {menu === "shop" && (
            <div
              id="mega-shop"
              className="hidden xl:block absolute inset-x-0 top-full pt-2 animate-rise"
            >
              <div className="grid grid-cols-[1fr_1.6fr_1fr] gap-12 rounded-xl border border-line bg-white px-10 py-9">
                <div>
                  <h2 className="font-display text-xl mb-3">Product type</h2>
                  <ul className="space-y-2">
                    {SHOP_TYPES.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="hover:text-lacquer"
                          onClick={close}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-display text-xl mb-3">Shape</h2>
                  <ul className="flex gap-2">
                    {SHAPES.map((s) => (
                      <li key={s} className="flex-1">
                        <Link
                          href={`/collections/${s.toLowerCase()}`}
                          className="group flex flex-col items-center gap-2 rounded-lg py-3 hover:bg-blush"
                          onClick={close}
                        >
                          <NailIcon
                            shape={s}
                            className="h-14 text-rose group-hover:text-lacquer"
                          />
                          <span className="text-sm font-medium">{s}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-display text-xl mb-3">Design theme</h2>
                  <ul className="space-y-2">
                    {THEMES.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/collections/${t.slug}`}
                          className="hover:text-lacquer"
                          onClick={close}
                        >
                          {t.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {drawer && (
          <div className="xl:hidden fixed inset-0 z-50 pointer-events-auto">
            <button
              className="absolute inset-0 bg-wine/40"
              aria-label="Close menu"
              onClick={close}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute right-0 inset-y-0 w-[min(24rem,90vw)] bg-white animate-slide overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-line">
                <span className="font-display text-2xl">Menu</span>
                <button
                  autoFocus
                  className="grid place-items-center size-11 rounded-full hover:bg-blush"
                  aria-label="Close menu"
                  onClick={close}
                >
                  ✕
                </button>
              </div>
              <nav aria-label="Mobile" className="px-5 py-4 text-lg">
                <Link
                  href="/"
                  className="block py-2.5 font-medium"
                  onClick={() => {
                    close();
                    homeOrTop();
                  }}
                >
                  Home
                </Link>
                <details className="group border-y border-line my-1" open>
                  <summary className="flex items-center justify-between py-2.5 font-medium list-none">
                    Shop <Caret open={false} />
                  </summary>
                  <div className="pb-4 text-base">
                    <ul className="space-y-2 mb-4">
                      {SHOP_TYPES.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} onClick={close}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold text-mauve mb-2">
                      Shape
                    </p>
                    <ul className="grid grid-cols-6 gap-1 mb-4">
                      {SHAPES.map((s) => (
                        <li key={s}>
                          <Link
                            href={`/collections/${s.toLowerCase()}`}
                            className="flex flex-col items-center gap-1 text-[0.7rem]"
                            onClick={close}
                          >
                            <NailIcon shape={s} className="h-10 text-rose" />
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold text-mauve mb-2">
                      Design theme
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {THEMES.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/collections/${t.slug}`}
                            className="chip"
                            onClick={close}
                          >
                            {t.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block py-2.5 font-medium"
                    onClick={close}
                  >
                    {l.label}
                  </Link>
                ))}
                <details className="group border-y border-line my-1">
                  <summary className="flex items-center justify-between py-2.5 font-medium list-none">
                    Gallery <Caret open={false} />
                  </summary>
                  <ul className="space-y-2 pb-4 text-base">
                    {GALLERY.map((g) => (
                      <li key={g.href}>
                        <Link href={g.href} onClick={close}>
                          {g.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
                {[...AFTER, { href: "/my-account", label: "Log in" }].map(
                  (l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block py-2.5 font-medium"
                      onClick={close}
                    >
                      {l.label}
                    </Link>
                  ),
                )}
                <a href={BRAND.phoneHref} className="btn w-full mt-5">
                  Call {BRAND.phone}
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
