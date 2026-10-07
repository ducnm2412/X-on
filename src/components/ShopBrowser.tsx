"use client";

import { useEffect, useMemo, useState } from "react";
import { SHAPES, type Collection, type Product, type Shape } from "@/lib/data";
import { useProducts } from "@/lib/store";
import { Pagination } from "./Bits";
import { NailIcon } from "./Nail";
import { ProductCard } from "./ProductCard";

const PER_PAGE = 9;
const SORTS = ["Featured", "Price, low to high", "Price, high to low", "Name, A to Z"] as const;
const TYPE_FILTERS = [
  { key: "best", name: "Best Sellers" },
  { key: "handmade-press-on-nails", name: "Handmade Press-On Nails" },
  { key: "nail-essentials", name: "Nail Essentials" },
];
const cost = (p: Product) => p.salePrice ?? p.price;

export function ShopBrowser({ context }: { context?: Collection["filter"] }) {
  const all = useProducts();
  const [query, setQuery] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [shapes, setShapes] = useState<Shape[]>(context?.shape ? [context.shape] : []);
  const [types, setTypes] = useState<string[]>(context?.best ? ["best"] : context?.type ? [context.type] : []);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const lo = Number(min) || 0;
    const hi = Number(max) || Infinity;
    const list = all.filter((p) => {
      if (p.status === "Draft") return false;
      if (context?.theme && !p.themes.includes(context.theme)) return false;
      if (q && !`${p.name} ${p.sku} ${p.shape ?? ""}`.toLowerCase().includes(q)) return false;
      if (cost(p) < lo || cost(p) > hi) return false;
      if (shapes.length && !(p.shape && shapes.includes(p.shape))) return false;
      if (types.length && !types.some((t) => (t === "best" ? p.bestSeller : p.type === t))) return false;
      return true;
    });
    if (sort === "Price, low to high") list.sort((a, b) => cost(a) - cost(b));
    if (sort === "Price, high to low") list.sort((a, b) => cost(b) - cost(a));
    if (sort === "Name, A to Z") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [all, query, min, max, shapes, types, sort, context]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const active = shapes.length + types.length + (min ? 1 : 0) + (max ? 1 : 0) + (query ? 1 : 0);

  // Any filter change returns to page 1; the filters themselves are kept while paging.
  const filter = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setPage(1);
  };
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const clear = () => {
    setQuery("");
    setMin("");
    setMax("");
    setShapes([]);
    setTypes([]);
    setPage(1);
  };
  const goto = (p: number) => {
    setPage(p);
    document.getElementById("results")?.scrollIntoView({ block: "start" });
  };

  const filters = (
    <div className="space-y-8">
      <div>
        <label htmlFor="shop-q" className="label">
          Search products
        </label>
        <input id="shop-q" type="search" className="input" placeholder="Name, shape or SKU" value={query} onChange={(e) => filter(setQuery)(e.target.value)} />
      </div>

      <fieldset>
        <legend className="label">Price</legend>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="shop-min">
            Minimum price in dollars
          </label>
          <input id="shop-min" inputMode="numeric" className="input" placeholder="$ min" value={min} onChange={(e) => filter(setMin)(e.target.value.replace(/\D/g, ""))} />
          <span className="text-mauve">to</span>
          <label className="sr-only" htmlFor="shop-max">
            Maximum price in dollars
          </label>
          <input id="shop-max" inputMode="numeric" className="input" placeholder="$ max" value={max} onChange={(e) => filter(setMax)(e.target.value.replace(/\D/g, ""))} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Shape</legend>
        <div className="grid grid-cols-3 gap-2">
          {SHAPES.map((s) => {
            const on = shapes.includes(s);
            return (
              <label key={s} className={`flex flex-col items-center gap-1.5 rounded-lg border-[1.5px] py-3 text-sm font-medium cursor-pointer transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-lacquer ${on ? "border-wine bg-blush" : "border-petal hover:border-rose"}`}>
                <input type="checkbox" className="sr-only" checked={on} onChange={() => filter(setShapes)(toggle(shapes, s))} />
                <NailIcon shape={s} filled={on} className={`h-11 ${on ? "text-lacquer" : "text-rose"}`} />
                {s}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Product type</legend>
        <div className="space-y-2.5">
          {TYPE_FILTERS.map((t) => (
            <label key={t.key} className="flex gap-3 cursor-pointer">
              <input type="checkbox" className="check" checked={types.includes(t.key)} onChange={() => filter(setTypes)(toggle(types, t.key))} />
              {t.name}
            </label>
          ))}
        </div>
      </fieldset>

      {active > 0 && (
        <button className="link" onClick={clear}>
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="wrap py-10 md:py-14 grid gap-10 lg:grid-cols-[17rem_1fr] lg:gap-14">
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pb-4 pr-3 [scrollbar-gutter:stable] [scrollbar-width:thin]">{filters}</div>
      </aside>

      <div id="results" className="scroll-mt-32">
        <div className="mb-6 flex items-center gap-2 sm:gap-3">
          <button className="btn btn-line btn-sm shrink-0 lg:hidden" onClick={() => setDrawer(true)}>
            Filters{active > 0 ? ` (${active})` : ""}
          </button>
          <p className="min-w-0 text-sm text-mauve sm:text-base" role="status">
            {results.length === 0 ? (
              "No products"
            ) : (
              <>
                <span className="sm:hidden">
                  {(current - 1) * PER_PAGE + 1} to {(current - 1) * PER_PAGE + shown.length} of {results.length}
                </span>
                <span className="hidden sm:inline">{`Showing ${(current - 1) * PER_PAGE + 1} to ${(current - 1) * PER_PAGE + shown.length} of ${results.length} products`}</span>
              </>
            )}
          </p>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <label htmlFor="shop-sort" className="text-sm font-semibold hidden sm:block">
              Sort by
            </label>
            <select id="shop-sort" aria-label="Sort products" className="input !min-h-10 !w-auto !py-1.5 !pl-3 text-sm sm:!pl-4" value={sort} onChange={(e) => filter(setSort)(e.target.value as typeof sort)}>
              {SORTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {shown.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:grid-cols-3">
            {shown.map((p, i) => (
              <ProductCard key={p.id} p={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-blush px-6 py-14 text-center">
            <p className="d3">No products match these filters</p>
            <p className="mt-2 text-mauve">Widen the price range, pick another shape, or clear the filters to see everything.</p>
            <button className="btn mt-6" onClick={clear}>
              Clear all filters
            </button>
          </div>
        )}

        <Pagination page={current} pages={pages} onPage={goto} label="Product pages" />
      </div>

      {drawer && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button className="absolute inset-0 bg-wine/40" aria-label="Close filters" onClick={() => setDrawer(false)} />
          <div role="dialog" aria-modal="true" aria-label="Filters" className="absolute right-0 inset-y-0 w-[min(24rem,92vw)] bg-white animate-slide flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-line">
              <span className="font-display text-2xl">Filters</span>
              <button autoFocus className="grid place-items-center size-11 rounded-full hover:bg-blush" aria-label="Close filters" onClick={() => setDrawer(false)}>
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filters}</div>
            <div className="p-5 border-t border-line">
              <button className="btn w-full" onClick={() => setDrawer(false)}>
                Show {results.length} {results.length === 1 ? "product" : "products"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

