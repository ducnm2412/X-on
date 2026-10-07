"use client";

import { useEffect, useSyncExternalStore } from "react";
import { PHOTO_LIST } from "@/lib/data";
import { Photo } from "../Photo";

function useOverlay(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
}

// Right-side drawer for Add, Edit and View detail. Closes on Esc, backdrop click or the close button.
export function Drawer({ title, onClose, children, footer, onSubmit }: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; onSubmit?: (e: React.FormEvent) => void }) {
  useOverlay(onClose);
  const Body = onSubmit ? "form" : "div";
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-wine/40" aria-label="Close panel" onClick={onClose} />
      <Body role="dialog" aria-modal="true" aria-label={title} onSubmit={onSubmit} noValidate={onSubmit ? true : undefined} className="absolute right-0 inset-y-0 flex w-[min(34rem,100vw)] flex-col bg-white animate-slide">
        <div className="flex items-center justify-between gap-4 px-6 h-[4.5rem] border-b border-line shrink-0">
          <h2 className="font-display text-2xl leading-tight">{title}</h2>
          <button type="button" autoFocus className="grid place-items-center size-11 rounded-full hover:bg-blush" aria-label="Close panel" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 px-6 py-4 border-t border-line shrink-0">{footer}</div>}
      </Body>
    </div>
  );
}

// Delete never happens on one click: the record is named and the admin confirms.
export function Confirm({ name, what, onCancel, onConfirm }: { name: string; what: string; onCancel: () => void; onConfirm: () => void }) {
  useOverlay(onCancel);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <button className="absolute inset-0 bg-wine/40" aria-label="Cancel" onClick={onCancel} />
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-body" className="relative w-full max-w-md rounded-xl bg-white p-7 animate-rise">
        <h2 id="confirm-title" className="font-display text-2xl leading-tight">
          Delete {what}?
        </h2>
        <p id="confirm-body" className="mt-3 text-mauve">
          <strong className="text-wine">{name}</strong> will be removed from the admin and from the storefront. This cannot be undone.
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button autoFocus className="btn btn-line btn-sm" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}>
            Delete {what}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PageTitle({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-[clamp(1.6rem,2.4vw,2rem)] leading-none font-semibold">{title}</h1>
        {text && <p className="mt-1.5 text-mauve">{text}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: readonly (readonly [T, string, number?])[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map(([key, name, count]) => (
        <button key={key} role="tab" aria-selected={value === key} onClick={() => onChange(key)} className={`-mb-px whitespace-nowrap px-4 py-3 font-semibold border-b-2 ${value === key ? "border-wine" : "border-transparent text-mauve hover:text-wine"}`}>
          {name}
          {count !== undefined && <span className="ml-2 chip">{count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, error, hint, children, className = "" }: { label: string; error?: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-sm font-semibold text-lacquer">{error}</span> : hint ? <span className="mt-1.5 block text-sm text-mauve">{hint}</span> : null}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-lacquer" : "bg-petal"}`}>
      <span className={`absolute top-1 left-1 size-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  );
}

export function PhotoPicker({ value, onChange, allowNone }: { value?: string; onChange: (v: string | undefined) => void; allowNone?: boolean }) {
  return (
    <fieldset>
      <legend className="label">Image</legend>
      <div className="grid grid-cols-6 gap-2">
        {PHOTO_LIST.map((src) => (
          <button type="button" key={src} aria-label={`Use photo ${src.slice(1)}`} aria-pressed={value === src} onClick={() => onChange(src)} className={`box aspect-square !rounded-lg border-2 ${value === src ? "border-wine" : "border-transparent hover:border-rose"}`}>
            <Photo src={src} alt="" sizes="80px" />
          </button>
        ))}
        {allowNone && (
          <button type="button" aria-pressed={!value} onClick={() => onChange(undefined)} className={`aspect-square rounded-lg border-2 text-xs font-semibold ${!value ? "border-wine bg-blush" : "border-petal hover:border-rose"}`}>
            None
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-mauve">Pick from the media library. Uploads are checked for type and size in the live version.</p>
    </fieldset>
  );
}

const TONES: Record<string, string> = {
  Active: "chip-good", Published: "chip-good", Paid: "chip-good", Delivered: "chip-good", Approved: "chip-good", Replied: "chip-good",
  Pending: "chip-warn", New: "chip-warn", Open: "chip-warn", Shipped: "chip-warn",
  "Out of stock": "chip-bad", Refunded: "chip-bad", Declined: "chip-bad", Suspended: "chip-bad",
  Draft: "chip-mute", Hidden: "chip-mute", Closed: "chip-mute",
};
export function Status({ value }: { value: string }) {
  return <span className={`chip ${TONES[value] ?? ""}`}>{value}</span>;
}

export function Empty({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-blush px-6 py-12 text-center">
      <p className="font-display text-2xl">{title}</p>
      <p className="mt-2 text-mauve">{text}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function TableWrap({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-xl border-[1.5px] border-line bg-white">{children}</div>;
}

const onHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
// Dashboard quick actions deep-link with a hash, e.g. /admin/products#add.
export function useHash() {
  return useSyncExternalStore(onHash, () => window.location.hash, () => "");
}
export function clearHash() {
  if (window.location.hash) history.replaceState(null, "", window.location.pathname);
}
