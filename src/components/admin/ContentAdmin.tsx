"use client";

import Link from "next/link";
import { useState } from "react";
import { CONTENT, type ContentSection } from "@/lib/data";
import { toast } from "@/lib/store";
import { Field, PageTitle, Toggle } from "./ui";

export function ContentAdmin() {
  const [pages, setPages] = useState(CONTENT);
  const [key, setKey] = useState(CONTENT[0].key);
  const [dirty, setDirty] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "saving" | "failed">("idle");
  const page = pages.find((p) => p.key === key)!;
  const isDirty = dirty.includes(key);

  const patch = (sections: ContentSection[]) => {
    setPages(pages.map((p) => (p.key === key ? { ...p, sections } : p)));
    if (!isDirty) setDirty([...dirty, key]);
    setState("idle");
  };
  const edit = (i: number, change: Partial<ContentSection>) => patch(page.sections.map((s, n) => (n === i ? { ...s, ...change } : s)));
  const move = (i: number, by: number) => {
    const list = [...page.sections];
    [list[i], list[i + by]] = [list[i + by], list[i]];
    patch(list);
  };

  function publish() {
    // A section left visible with no heading cannot go live.
    const bad = page.sections.find((s) => s.visible && !s.heading.trim());
    if (bad) {
      setState("failed");
      toast(`Not published: "${bad.label}" needs a heading`, "error");
      return;
    }
    setState("saving");
    setTimeout(() => {
      setPages((all) => all.map((p) => (p.key === key ? { ...p, updated: "Oct 7, 2026" } : p)));
      setDirty((d) => d.filter((k) => k !== key));
      setState("idle");
      toast(`Published: ${page.name}`);
    }, 800);
  }

  return (
    <>
      <PageTitle title="Website content" text="Edit the headings, text and buttons on each managed page. No code changes needed." />

      <div className="grid gap-8 lg:grid-cols-[15rem_1fr] [&>*]:min-w-0">
        <nav aria-label="Managed pages">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {pages.map((p) => (
              <li key={p.key}>
                <button aria-current={p.key === key ? "page" : undefined} onClick={() => { setKey(p.key); setState("idle"); }} className={`w-full whitespace-nowrap rounded-lg px-4 py-3 text-left ${p.key === key ? "bg-blush" : "hover:bg-blush"}`}>
                  <span className="font-semibold">{p.name}</span>
                  {dirty.includes(p.key) && <span className="ml-2 chip chip-warn">Unpublished</span>}
                  <span className="hidden lg:block text-sm text-mauve">Updated {p.updated}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl leading-tight">{page.name}</h2>
              <Link href={page.path} className="link text-sm">
                View page
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {state === "failed" && (
                <p role="alert" className="text-sm font-semibold text-lacquer">
                  Not published. Fix the section marked below.
                </p>
              )}
              <button className="btn btn-sm" disabled={!isDirty || state === "saving"} onClick={publish}>
                {state === "saving" ? "Publishing…" : isDirty ? "Publish changes" : "Published"}
              </button>
            </div>
          </div>

          <ol className="space-y-4">
            {page.sections.map((s, i) => {
              const missing = state === "failed" && s.visible && !s.heading.trim();
              return (
                <li key={s.key} className={`rounded-xl border-[1.5px] p-5 ${missing ? "border-lacquer" : "border-line"} ${s.visible ? "" : "bg-blush/60"}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold">{s.label}</h3>
                    {!s.visible && <span className="chip chip-mute">Hidden on site</span>}
                    <div className="ml-auto flex items-center gap-1">
                      <button className="grid place-items-center size-9 rounded-md hover:bg-blush disabled:text-petal disabled:hover:bg-transparent" aria-label={`Move ${s.label} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                        ↑
                      </button>
                      <button className="grid place-items-center size-9 rounded-md hover:bg-blush disabled:text-petal disabled:hover:bg-transparent" aria-label={`Move ${s.label} down`} disabled={i === page.sections.length - 1} onClick={() => move(i, 1)}>
                        ↓
                      </button>
                      <span className="ml-2 text-sm text-mauve">Visible</span>
                      <Toggle checked={s.visible} onChange={(v) => edit(i, { visible: v })} label={`Show ${s.label} on the site`} />
                    </div>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Field label="Heading" error={missing ? "Enter a heading, or hide this section." : undefined}>
                      <input className="input" value={s.heading} aria-invalid={missing} onChange={(e) => edit(i, { heading: e.target.value })} />
                    </Field>
                    <Field label="Button text" hint="Leave empty for no button.">
                      <input className="input" value={s.cta} onChange={(e) => edit(i, { cta: e.target.value })} />
                    </Field>
                    <Field label="Body text" className="md:col-span-2">
                      <textarea className="input" rows={2} value={s.body} onChange={(e) => edit(i, { body: e.target.value })} />
                    </Field>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
