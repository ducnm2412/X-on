"use client";

import { useState } from "react";
import { GALLERY, POSTS, PRODUCTS, SIZES, slugify, UPCOMING, type Block, type GalleryItem, type Post, type Size, type Upcoming } from "@/lib/data";
import { toast } from "@/lib/store";
import { Photo } from "../Photo";
import { clearHash, Confirm, Drawer, Field, PageTitle, PhotoPicker, Status, TableWrap, Tabs, Toggle, useHash } from "./ui";

type Tab = "blog" | "gallery" | "soon";
type PostDraft = Post & { isNew?: boolean; slugTouched?: boolean; orig?: string };
type GalleryDraft = GalleryItem & { isNew?: boolean };
type SoonDraft = Upcoming & { isNew?: boolean };

const NEW_POST: PostDraft = { slug: "", title: "", date: "Oct 7, 2026", cover: "/IMG_7103.JPG", excerpt: "", minutes: 3, status: "Draft", blocks: [{ kind: "p", text: "" }], isNew: true };
const NEW_ITEM: GalleryDraft = { id: "", title: "", image: "/IMG_7103.JPG", product: "", sizes: ["S", "M", "L"], status: "Published", isNew: true };
const NEW_SOON: SoonDraft = { id: "", name: "", when: "", note: "", images: ["/IMG_7103.JPG"], enabled: true, isNew: true };
const BLOCK_NAMES = { h: "Heading", p: "Paragraph", list: "List", img: "Image" } as const;

function swap<T>(list: T[], i: number, by: number) {
  const next = [...list];
  [next[i], next[i + by]] = [next[i + by], next[i]];
  return next;
}

function Arrows({ i, last, name, onMove }: { i: number; last: number; name: string; onMove: (by: number) => void }) {
  const cls = "grid place-items-center size-9 rounded-md hover:bg-blush disabled:text-petal disabled:hover:bg-transparent";
  return (
    <span className="inline-flex">
      <button type="button" className={cls} aria-label={`Move ${name} up`} disabled={i === 0} onClick={() => onMove(-1)}>
        ↑
      </button>
      <button type="button" className={cls} aria-label={`Move ${name} down`} disabled={i === last} onClick={() => onMove(1)}>
        ↓
      </button>
    </span>
  );
}

export function BlogGalleryAdmin() {
  const hash = useHash();
  const [picked, setPicked] = useState<Tab | null>(null);
  const tab: Tab = picked ?? (hash === "#add-gallery" ? "gallery" : "blog");
  const [posts, setPosts] = useState(POSTS);
  const [gallery, setGallery] = useState(GALLERY.slice(0, 12));
  const [soon, setSoon] = useState(UPCOMING);
  const [postDraft, setPostDraft] = useState<PostDraft | null>(null);
  const [itemDraft, setItemDraft] = useState<GalleryDraft | null>(null);
  const [soonDraft, setSoonDraft] = useState<SoonDraft | null>(null);
  const [error, setError] = useState("");
  const [doomed, setDoomed] = useState<{ kind: Tab; id: string; name: string } | null>(null);

  // Opened from the dashboard quick actions.
  const post = postDraft ?? (hash === "#add-post" ? NEW_POST : null);
  const item = itemDraft ?? (hash === "#add-gallery" ? NEW_ITEM : null);

  const close = () => {
    setPostDraft(null);
    setItemDraft(null);
    setSoonDraft(null);
    setError("");
    clearHash();
  };

  function savePost(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;
    if (!post.title.trim()) return setError("Enter a title.");
    const slug = slugify(post.slug || post.title);
    const { isNew, slugTouched, orig, ...rest } = post;
    void slugTouched;
    const clean: Post = { ...rest, slug, title: post.title.trim(), excerpt: post.excerpt || (post.blocks.find((b) => b.kind === "p") as { text: string } | undefined)?.text.slice(0, 120) || "" };
    setPosts(isNew ? [clean, ...posts] : posts.map((p) => (p.slug === orig ? clean : p)));
    toast(isNew ? `Post added: ${clean.title}` : `Changes saved: ${clean.title}`);
    close();
  }

  function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!item) return;
    if (!item.title.trim()) return setError("Enter a title.");
    const { isNew, ...rest } = item;
    setGallery(isNew ? [{ ...rest, id: `g${Date.now()}` }, ...gallery] : gallery.map((g) => (g.id === rest.id ? rest : g)));
    toast(isNew ? `Gallery item added: ${rest.title}` : `Changes saved: ${rest.title}`);
    close();
  }

  function saveSoon(e: React.FormEvent) {
    e.preventDefault();
    if (!soonDraft) return;
    if (!soonDraft.name.trim()) return setError("Enter a collection name.");
    const { isNew, ...rest } = soonDraft;
    setSoon(isNew ? [...soon, { ...rest, id: `c${Date.now()}` }] : soon.map((c) => (c.id === rest.id ? rest : c)));
    toast(isNew ? `Collection added: ${rest.name}` : `Changes saved: ${rest.name}`);
    close();
  }

  const setBlock = (i: number, b: Block) => setPostDraft({ ...post!, blocks: post!.blocks.map((x, n) => (n === i ? b : x)) });
  const newBlock = (kind: Block["kind"]): Block => (kind === "list" ? { kind, items: [""] } : kind === "img" ? { kind, src: "/IMG_7103.JPG", caption: "" } : { kind, text: "" });

  const footer = (label: string) => (
    <>
      {error && (
        <p role="alert" className="mr-auto self-center text-sm font-semibold text-lacquer">
          {error}
        </p>
      )}
      <button type="button" className="btn btn-line btn-sm" onClick={close}>
        Cancel
      </button>
      <button className="btn btn-sm">{label}</button>
    </>
  );

  return (
    <>
      <PageTitle title="Blog and gallery" text="Write posts, manage the product gallery and line up the collections that are coming soon.">
        {tab === "blog" && (
          <button className="btn btn-sm" onClick={() => setPostDraft(NEW_POST)}>
            Add blog post
          </button>
        )}
        {tab === "gallery" && (
          <button className="btn btn-sm" onClick={() => setItemDraft(NEW_ITEM)}>
            Add gallery item
          </button>
        )}
        {tab === "soon" && (
          <button className="btn btn-sm" onClick={() => setSoonDraft(NEW_SOON)}>
            Add collection
          </button>
        )}
      </PageTitle>

      <Tabs
        label="Content type"
        value={tab}
        onChange={(t) => {
          setPicked(t);
          clearHash();
        }}
        tabs={[
          ["blog", "Blog", posts.length],
          ["gallery", "Product Gallery", gallery.length],
          ["soon", "Coming Soon Collections", soon.length],
        ]}
      />

      {tab === "blog" && (
        <TableWrap>
          <table className="table-x min-w-[46rem]">
            <thead>
              <tr>
                <th>Post</th>
                <th>Slug</th>
                <th>Publish date</th>
                <th>Status</th>
                <th className="!text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.slug}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="box h-12 w-16 shrink-0 !rounded-lg">
                        <Photo src={p.cover} alt="" sizes="64px" zoom={1.6} />
                      </div>
                      <span className="font-semibold">{p.title}</span>
                    </div>
                  </td>
                  <td className="text-sm text-mauve">/blog/{p.slug}</td>
                  <td className="whitespace-nowrap text-mauve">{p.date}</td>
                  <td>
                    <Status value={p.status} />
                  </td>
                  <td>
                    <div className="flex justify-end gap-3">
                      <button className="link" aria-label={`Edit ${p.title}`} onClick={() => setPostDraft({ ...p, slugTouched: true, orig: p.slug })}>
                        Edit
                      </button>
                      <button className="link" aria-label={`Delete ${p.title}`} onClick={() => setDoomed({ kind: "blog", id: p.slug, name: p.title })}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}

      {tab === "gallery" && (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {gallery.map((g, i) => (
            <li key={g.id} className="rounded-xl border-[1.5px] border-line p-3">
              <div className="box aspect-[4/3] !rounded-lg">
                <Photo src={g.image} alt="" sizes="(min-width: 1280px) 20vw, 50vw" />
              </div>
              <div className="mt-3 flex items-start justify-between gap-2">
                <p className="font-semibold leading-snug">{g.title}</p>
                <Status value={g.status} />
              </div>
              <p className="mt-1 text-sm text-mauve">
                Sizes {g.sizes.join(", ") || "none"}
                {g.product ? `, links to ${PRODUCTS.find((p) => p.slug === g.product)?.name ?? g.product}` : ", no linked product"}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <Arrows i={i} last={gallery.length - 1} name={g.title} onMove={(by) => setGallery(swap(gallery, i, by))} />
                <span className="flex gap-3">
                  <button className="link" aria-label={`Edit ${g.title}`} onClick={() => setItemDraft(g)}>
                    Edit
                  </button>
                  <button className="link" aria-label={`Delete ${g.title}`} onClick={() => setDoomed({ kind: "gallery", id: g.id, name: g.title })}>
                    Delete
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {tab === "soon" && (
        <ol className="space-y-3">
          {soon.map((c, i) => (
            <li key={c.id} className={`flex flex-wrap items-center gap-4 rounded-xl border-[1.5px] border-line p-4 ${c.enabled ? "" : "bg-blush/60"}`}>
              <div className="flex gap-1.5">
                {c.images.slice(0, 3).map((src) => (
                  <div key={src} className="box size-14 !rounded-lg">
                    <Photo src={src} alt="" sizes="56px" zoom={1.6} />
                  </div>
                ))}
              </div>
              <div className="min-w-40 flex-1">
                <p className="font-semibold">
                  {c.name} {c.featured && <span className="chip chip-bad ml-1">Featured</span>}
                </p>
                <p className="text-sm text-mauve">{c.when}</p>
              </div>
              <Arrows i={i} last={soon.length - 1} name={c.name} onMove={(by) => setSoon(swap(soon, i, by))} />
              <span className="flex items-center gap-2 text-sm text-mauve">
                {c.enabled ? "Shown" : "Hidden"}
                <Toggle
                  checked={c.enabled}
                  label={`Show ${c.name} on the Coming Soon page`}
                  onChange={(v) => {
                    setSoon(soon.map((x) => (x.id === c.id ? { ...x, enabled: v } : x)));
                    toast(`${c.name} is now ${v ? "shown" : "hidden"} on the site`);
                  }}
                />
              </span>
              <span className="flex gap-3">
                <button className="link" aria-label={`Edit ${c.name}`} onClick={() => setSoonDraft(c)}>
                  Edit
                </button>
                <button className="link" aria-label={`Delete ${c.name}`} onClick={() => setDoomed({ kind: "soon", id: c.id, name: c.name })}>
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ol>
      )}

      {post && (
        <Drawer title={post.isNew ? "Add blog post" : "Edit blog post"} onClose={close} onSubmit={savePost} footer={footer(post.isNew ? "Save post" : "Save changes")}>
          <Field label="Title">
            <input className="input" value={post.title} onChange={(e) => { setError(""); setPostDraft({ ...post, title: e.target.value, slug: post.slugTouched ? post.slug : slugify(e.target.value) }); }} />
          </Field>
          <Field label="Slug" hint="Filled in from the title. Edit it to set your own.">
            <input className="input" value={post.slug} onChange={(e) => setPostDraft({ ...post, slug: e.target.value, slugTouched: true })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Publish date">
              <input className="input" value={post.date} onChange={(e) => setPostDraft({ ...post, date: e.target.value })} />
            </Field>
            <Field label="Status">
              <select className="input" value={post.status} onChange={(e) => setPostDraft({ ...post, status: e.target.value as Post["status"] })}>
                <option>Draft</option>
                <option>Published</option>
              </select>
            </Field>
          </div>
          <PhotoPicker value={post.cover} onChange={(v) => setPostDraft({ ...post, cover: v ?? post.cover })} />

          <fieldset>
            <legend className="label">Content blocks</legend>
            <ol className="space-y-3">
              {post.blocks.map((b, i) => (
                <li key={i} className="rounded-lg border-[1.5px] border-line p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="chip">{BLOCK_NAMES[b.kind]}</span>
                    <span className="flex items-center">
                      <Arrows i={i} last={post.blocks.length - 1} name={`block ${i + 1}`} onMove={(by) => setPostDraft({ ...post, blocks: swap(post.blocks, i, by) })} />
                      <button type="button" className="link ml-2 text-sm" aria-label={`Remove block ${i + 1}`} onClick={() => setPostDraft({ ...post, blocks: post.blocks.filter((_, n) => n !== i) })}>
                        Remove
                      </button>
                    </span>
                  </div>
                  {b.kind === "h" && <input className="input" aria-label="Heading text" value={b.text} onChange={(e) => setBlock(i, { ...b, text: e.target.value })} />}
                  {b.kind === "p" && <textarea className="input" rows={3} aria-label="Paragraph text" value={b.text} onChange={(e) => setBlock(i, { ...b, text: e.target.value })} />}
                  {b.kind === "list" && <textarea className="input" rows={3} aria-label="List items, one per line" placeholder="One item per line" value={b.items.join("\n")} onChange={(e) => setBlock(i, { ...b, items: e.target.value.split("\n") })} />}
                  {b.kind === "img" && (
                    <div className="grid grid-cols-[5rem_1fr] gap-3">
                      <div className="box aspect-square !rounded-lg">
                        <Photo src={b.src} alt="" sizes="80px" />
                      </div>
                      <input className="input self-center" aria-label="Image caption" placeholder="Caption" value={b.caption} onChange={(e) => setBlock(i, { ...b, caption: e.target.value })} />
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(BLOCK_NAMES) as Block["kind"][]).map((k) => (
                <button type="button" key={k} className="btn btn-line btn-sm" onClick={() => setPostDraft({ ...post, blocks: [...post.blocks, newBlock(k)] })}>
                  Add {BLOCK_NAMES[k].toLowerCase()}
                </button>
              ))}
            </div>
          </fieldset>
        </Drawer>
      )}

      {item && (
        <Drawer title={item.isNew ? "Add gallery item" : "Edit gallery item"} onClose={close} onSubmit={saveItem} footer={footer(item.isNew ? "Save item" : "Save changes")}>
          <Field label="Title">
            <input className="input" value={item.title} onChange={(e) => { setError(""); setItemDraft({ ...item, title: e.target.value }); }} />
          </Field>
          <PhotoPicker value={item.image} onChange={(v) => setItemDraft({ ...item, image: v ?? item.image })} />
          <Field label="Linked product" hint="The photo's Shop now link goes to this product.">
            <select className="input" value={item.product} onChange={(e) => setItemDraft({ ...item, product: e.target.value })}>
              <option value="">No linked product</option>
              {PRODUCTS.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <fieldset>
            <legend className="label">Size labels</legend>
            <div className="flex gap-4">
              {SIZES.map((s) => (
                <label key={s} className="flex gap-2">
                  <input type="checkbox" className="check" checked={item.sizes.includes(s)} onChange={() => setItemDraft({ ...item, sizes: item.sizes.includes(s) ? item.sizes.filter((x) => x !== s) : (SIZES.filter((x) => x === s || item.sizes.includes(x)) as Size[]) })} />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="Status">
            <select className="input" value={item.status} onChange={(e) => setItemDraft({ ...item, status: e.target.value as GalleryItem["status"] })}>
              <option>Published</option>
              <option>Hidden</option>
            </select>
          </Field>
        </Drawer>
      )}

      {soonDraft && (
        <Drawer title={soonDraft.isNew ? "Add collection" : "Edit collection"} onClose={close} onSubmit={saveSoon} footer={footer(soonDraft.isNew ? "Save collection" : "Save changes")}>
          <Field label="Collection name">
            <input className="input" value={soonDraft.name} onChange={(e) => { setError(""); setSoonDraft({ ...soonDraft, name: e.target.value }); }} />
          </Field>
          <Field label="Arrival" hint="Shown under the name, for example November or Arrives Oct 24.">
            <input className="input" value={soonDraft.when} onChange={(e) => setSoonDraft({ ...soonDraft, when: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea className="input" rows={3} value={soonDraft.note} onChange={(e) => setSoonDraft({ ...soonDraft, note: e.target.value })} />
          </Field>
          <PhotoPicker value={soonDraft.images[0]} onChange={(v) => setSoonDraft({ ...soonDraft, images: v ? [v, ...soonDraft.images.filter((x) => x !== v)].slice(0, 3) : soonDraft.images })} />
          <label className="flex gap-2">
            <input type="checkbox" className="check" checked={!!soonDraft.featured} onChange={(e) => setSoonDraft({ ...soonDraft, featured: e.target.checked })} />
            Feature as the new collection
          </label>
          <label className="flex gap-2">
            <input type="checkbox" className="check" checked={soonDraft.enabled} onChange={(e) => setSoonDraft({ ...soonDraft, enabled: e.target.checked })} />
            Show on the Coming Soon page
          </label>
        </Drawer>
      )}

      {doomed && (
        <Confirm
          what={doomed.kind === "blog" ? "post" : doomed.kind === "gallery" ? "gallery item" : "collection"}
          name={doomed.name}
          onCancel={() => setDoomed(null)}
          onConfirm={() => {
            if (doomed.kind === "blog") setPosts(posts.filter((p) => p.slug !== doomed.id));
            if (doomed.kind === "gallery") setGallery(gallery.filter((g) => g.id !== doomed.id));
            if (doomed.kind === "soon") setSoon(soon.filter((c) => c.id !== doomed.id));
            toast(`Deleted: ${doomed.name}`);
            setDoomed(null);
          }}
        />
      )}
    </>
  );
}
