"use client";

import { dismissToast, useToasts } from "@/lib/store";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-6 sm:bottom-6 z-[70] flex flex-col gap-2 sm:w-88" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className={`animate-rise flex items-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white ${t.kind === "error" ? "bg-lacquer" : "bg-wine"}`}
        >
          <span className="flex-1">{t.text}</span>
          <button onClick={() => dismissToast(t.id)} aria-label="Dismiss message" className="opacity-80 hover:opacity-100">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
