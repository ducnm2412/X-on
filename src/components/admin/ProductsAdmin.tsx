"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { money, PRODUCT_TYPES, SHAPES, SIZES, slugify, THEMES, typeName, type Product, type ProductType, type Shape, type Size, type Theme } from "@/lib/data";
import { removeProducts, resetProducts, saveProduct, toast, useProducts } from "@/lib/store";
import { ProductImage } from "../Photo";
import { clearHash, Confirm, Drawer, Empty, Field, PageTitle, PhotoPicker, Status, TableWrap, useHash } from "./ui";

type Draft = {
  id?: string;
  name: string;
  sku: string;
  image?: string;
  price: string;
  salePrice: string;
  sizes: Size[];
  type: ProductType;
  shape: Shape | "";
  themes: Theme[];
  stock: string;
  status: Product["status"];
  bestSeller: boolean;
  description: string;
  info: string;
};

const BLANK: Draft = { name: "", sku: "", image: undefined, price: "", salePrice: "", sizes: [...SIZES], type: "handmade-press-on-nails", shape: "Almond", themes: [], stock: "10", status: "Active", bestSeller: false, description: "", info: "" };

const toDraft = (p: Product): Draft => ({
  id: p.id, name: p.name, sku: p.sku, image: p.image, price: String(p.price), salePrice: p.salePrice ? String(p.salePrice) : "", sizes: p.sizes, type: p.type, shape: p.shape ?? "", themes: p.themes, stock: String(p.stock), status: p.status, bestSeller: !!p.bestSeller, description: p.description,
  info: p.info.map(([k, v]) => `${k}: ${v}`).join("\n"),
});

export function ProductsAdmin() {
  const products = useProducts();
  const hash = useHash();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [status, setStatus] = useState("All statuses");
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [doomed, setDoomed] = useState<Product[] | null>(null);
  const [resetting, setResetting] = useState(false);

  // Opened from the dashboard's "Add product" quick action.
  const editing = draft ?? (hash === "#add" ? BLANK : null);

  // Search and filters live in this screen's state, so they are still applied after a save or delete.
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => (!q || `${p.name} ${p.sku}`.toLowerCase().includes(q)) && (type === "All types" || typeName(p.type) === type) && (status === "All statuses" || p.status === status));
  }, [products, query, type, status]);

  const allChecked = rows.length > 0 && rows.every((p) => selected.includes(p.id));
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setDraft({ ...(editing ?? BLANK), [k]: v });
    if (errors[k]) setErrors({ ...errors, [k]: "" });
  };
  const close = () => {
    setDraft(null);
    setErrors({});
    clearHash();
  };

  function save(e: React.FormEvent) {
    e.preventDefault();
    const d = editing!;
    const price = Number(d.price);
    const sale = Number(d.salePrice);
    const found: Record<string, string> = {};
    if (!d.name.trim()) found.name = "Enter a product name.";
    if (!d.sku.trim()) found.sku = "Enter a SKU.";
    else if (products.some((p) => p.sku.toLowerCase() === d.sku.trim().toLowerCase() && p.id !== d.id)) found.sku = "Another product already uses this SKU.";
    if (!(price > 0)) found.price = "Enter a price above $0.";
    if (d.salePrice && !(sale > 0 && sale < price)) found.salePrice = "The sale price must be lower than the regular price.";
    if (!/^\d+$/.test(d.stock)) found.stock = "Enter stock as a whole number.";
    setErrors(found);
    if (Object.keys(found).length) return;

    const existing = products.find((p) => p.id === d.id);
    let slug = existing?.slug ?? slugify(d.name);
    if (!existing && products.some((p) => p.slug === slug)) slug = `${slug}-${slugify(d.sku)}`;
    saveProduct({
      id: d.id ?? `p${Date.now()}`,
      slug,
      name: d.name.trim(),
      sku: d.sku.trim().toUpperCase(),
      image: d.image,
      art: d.image ? undefined : (existing?.art ?? "glue"),
      price,
      salePrice: d.salePrice ? sale : undefined,
      sizes: d.sizes,
      type: d.type,
      shape: d.shape || undefined,
      themes: d.themes,
      stock: Number(d.stock),
      status: d.status,
      bestSeller: d.bestSeller,
      updated: "Oct 7, 2026",
      description: d.description.trim() || "Description coming soon.",
      info: d.info
        .split("\n")
        .map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()] as [string, string])
        .filter(([k, v]) => k && v),
    });
    toast(existing ? `Changes saved: ${d.name.trim()}` : `Product added: ${d.name.trim()}`);
    close();
  }

  function bulk(next: Product["status"]) {
    products.filter((p) => selected.includes(p.id)).forEach((p) => saveProduct({ ...p, status: next, updated: "Oct 7, 2026" }));
    toast(`${selected.length} ${selected.length === 1 ? "product" : "products"} set to ${next.toLowerCase()}`);
    setSelected([]);
  }

  return (
    <>
      <PageTitle title="Products" text="Changes here show on Home, Shop, Product Detail, Bundle & Save and the gallery straight away.">
        <button className="btn btn-line btn-sm" onClick={() => setResetting(true)}>
          Reset demo data
        </button>
        <button className="btn btn-sm" onClick={() => setDraft(BLANK)}>
          Add product
        </button>
      </PageTitle>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div>
          <label htmlFor="p-q" className="sr-only">
            Search products
          </label>
          <input id="p-q" type="search" className="input" placeholder="Search by name or SKU" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div>
          <label htmlFor="p-type" className="sr-only">
            Filter by product type
          </label>
          <select id="p-type" className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option>All types</option>
            {PRODUCT_TYPES.map((t) => (
              <option key={t.slug}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="p-status" className="sr-only">
            Filter by status
          </label>
          <select id="p-status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            {["All statuses", "Active", "Draft", "Out of stock"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3 flex min-h-10 flex-wrap items-center gap-2 text-sm" role="status">
        {selected.length ? (
          <>
            <span className="font-semibold">{selected.length} selected</span>
            <button className="btn btn-line btn-sm" onClick={() => bulk("Active")}>
              Set active
            </button>
            <button className="btn btn-line btn-sm" onClick={() => bulk("Draft")}>
              Set draft
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setDoomed(products.filter((p) => selected.includes(p.id)))}>
              Delete
            </button>
          </>
        ) : (
          <span className="text-mauve">
            {rows.length} of {products.length} products
          </span>
        )}
      </div>

      {rows.length ? (
        <TableWrap>
          <table className="table-x min-w-[40rem] lg:min-w-0 [&_td]:px-3 [&_th]:px-3 xl:[&_td]:px-4 xl:[&_th]:px-4">
            <thead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" className="check !mt-0 align-middle" aria-label="Select all products in this list" checked={allChecked} onChange={() => setSelected(allChecked ? [] : rows.map((p) => p.id))} />
                </th>
                <th>Product</th>
                <th>Price</th>
                <th>Type</th>
                <th className="hidden xl:table-cell">Stock</th>
                <th>Status</th>
                <th className="hidden 2xl:table-cell">Updated</th>
                <th className="!text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input type="checkbox" className="check !mt-0 align-middle" aria-label={`Select ${p.name}`} checked={selected.includes(p.id)} onChange={() => setSelected(selected.includes(p.id) ? selected.filter((x) => x !== p.id) : [...selected, p.id])} />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="box size-12 shrink-0 !rounded-lg">
                        <ProductImage p={p} sizes="48px" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-mauve">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    {p.salePrice ? (
                      <>
                        <span className="font-semibold text-lacquer">{money(p.salePrice)}</span> <s className="text-mauve">{money(p.price)}</s>
                      </>
                    ) : (
                      <span className="font-semibold">{money(p.price)}</span>
                    )}
                  </td>
                  <td>
                    {typeName(p.type)}
                    {p.shape && <span className="block text-sm text-mauve">{p.shape}</span>}
                  </td>
                  <td className="hidden xl:table-cell">{p.stock}</td>
                  <td>
                    <Status value={p.status} />
                    <span className="mt-1 block text-sm text-mauve xl:hidden">{p.stock} in stock</span>
                  </td>
                  <td className="hidden whitespace-nowrap text-mauve 2xl:table-cell">{p.updated}</td>
                  <td>
                    <div className="flex justify-end gap-2.5 whitespace-nowrap">
                      <Link href={`/product/${p.slug}`} className="link" aria-label={`View ${p.name} in the shop`}>
                        View
                      </Link>
                      <button className="link" aria-label={`Edit ${p.name}`} onClick={() => setDraft(toDraft(p))}>
                        Edit
                      </button>
                      <button className="link" aria-label={`Delete ${p.name}`} onClick={() => setDoomed([p])}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      ) : (
        <Empty title="No products match" text="Change the search or filters, or add a new product.">
          <button className="btn btn-sm" onClick={() => setDraft(BLANK)}>
            Add product
          </button>
        </Empty>
      )}

      {editing && (
        <Drawer
          title={editing.id ? "Edit product" : "Add product"}
          onClose={close}
          onSubmit={save}
          footer={
            <>
              <button type="button" className="btn btn-line btn-sm" onClick={close}>
                Cancel
              </button>
              <button className="btn btn-sm">{editing.id ? "Save changes" : "Save product"}</button>
            </>
          }
        >
          <Field label="Name" error={errors.name}>
            <input className="input" value={editing.name} aria-invalid={!!errors.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="SKU" error={errors.sku}>
              <input className="input" value={editing.sku} aria-invalid={!!errors.sku} placeholder="XO-AL-0001" onChange={(e) => set("sku", e.target.value)} />
            </Field>
            <Field label="Stock" error={errors.stock}>
              <input className="input" inputMode="numeric" value={editing.stock} aria-invalid={!!errors.stock} onChange={(e) => set("stock", e.target.value)} />
            </Field>
            <Field label="Regular price ($)" error={errors.price}>
              <input className="input" inputMode="decimal" value={editing.price} aria-invalid={!!errors.price} onChange={(e) => set("price", e.target.value)} />
            </Field>
            <Field label="Sale price ($)" error={errors.salePrice} hint="Leave empty for no sale.">
              <input className="input" inputMode="decimal" value={editing.salePrice} aria-invalid={!!errors.salePrice} onChange={(e) => set("salePrice", e.target.value)} />
            </Field>
          </div>

          <PhotoPicker value={editing.image} onChange={(v) => set("image", v)} allowNone />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Product type">
              <select className="input" value={editing.type} onChange={(e) => set("type", e.target.value as ProductType)}>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Shape">
              <select className="input" value={editing.shape} onChange={(e) => set("shape", e.target.value as Shape | "")}>
                <option value="">No shape</option>
                {SHAPES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <fieldset>
            <legend className="label">Sizes</legend>
            <div className="flex flex-wrap gap-4">
              {SIZES.map((s) => (
                <label key={s} className="flex gap-2">
                  <input type="checkbox" className="check" checked={editing.sizes.includes(s)} onChange={() => set("sizes", editing.sizes.includes(s) ? editing.sizes.filter((x) => x !== s) : SIZES.filter((x) => x === s || editing.sizes.includes(x)))} />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label">Design themes</legend>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {THEMES.map((t) => (
                <label key={t.slug} className="flex gap-2">
                  <input type="checkbox" className="check" checked={editing.themes.includes(t.slug)} onChange={() => set("themes", editing.themes.includes(t.slug) ? editing.themes.filter((x) => x !== t.slug) : [...editing.themes, t.slug])} />
                  {t.name}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-4 items-end">
            <Field label="Status">
              <select className="input" value={editing.status} onChange={(e) => set("status", e.target.value as Product["status"])}>
                {["Active", "Draft", "Out of stock"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <label className="flex gap-2 pb-3">
              <input type="checkbox" className="check" checked={editing.bestSeller} onChange={(e) => set("bestSeller", e.target.checked)} />
              Show in Best Sellers
            </label>
          </div>

          <Field label="Description">
            <textarea className="input" rows={3} value={editing.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <Field label="Additional information" hint="One row per line, written as Label: value.">
            <textarea className="input" rows={4} value={editing.info} placeholder={"Shape: Almond\nLength: Medium, 22 mm"} onChange={(e) => set("info", e.target.value)} />
          </Field>
        </Drawer>
      )}

      {doomed && (
        <Confirm
          what={doomed.length === 1 ? "product" : `${doomed.length} products`}
          name={doomed.map((p) => p.name).join(", ")}
          onCancel={() => setDoomed(null)}
          onConfirm={() => {
            removeProducts(doomed.map((p) => p.id));
            toast(doomed.length === 1 ? `Product deleted: ${doomed[0].name}` : `${doomed.length} products deleted`);
            setSelected([]);
            setDoomed(null);
          }}
        />
      )}

      {resetting && (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <button className="absolute inset-0 bg-wine/40" aria-label="Cancel" onClick={() => setResetting(false)} />
          <div role="alertdialog" aria-modal="true" aria-labelledby="reset-title" className="relative w-full max-w-md rounded-xl bg-white p-7 animate-rise">
            <h2 id="reset-title" className="font-display text-2xl leading-tight">
              Reset demo data?
            </h2>
            <p className="mt-3 text-mauve">The catalogue returns to the original 21 products. Products you added or edited in this browser are discarded.</p>
            <div className="mt-7 flex justify-end gap-3">
              <button autoFocus className="btn btn-line btn-sm" onClick={() => setResetting(false)}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  resetProducts();
                  setSelected([]);
                  setResetting(false);
                  toast("Demo data reset");
                }}
              >
                Reset demo data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
