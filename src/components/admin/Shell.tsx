"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "../Header";

const NAV = [
  ["/admin", "Dashboard"],
  ["/admin/products", "Products"],
  ["/admin/orders", "Orders"],
  ["/admin/content", "Website Content"],
  ["/admin/blog-gallery", "Blog & Gallery"],
  ["/admin/users", "Users, Wholesale, Inquiries"],
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {NAV.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)} className={`rounded-full px-4 py-2.5 font-medium ${active ? "bg-lacquer text-white" : "hover:bg-petal"}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex-1 lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:flex flex-col gap-6 bg-blush p-5 sticky top-0 h-screen overflow-y-auto">
        <div>
          <Logo className="h-14 w-fit" />
          <p className="mt-1 px-1 text-sm font-semibold text-mauve">Admin</p>
        </div>
        {nav}
        <div className="mt-auto space-y-3 px-1 text-sm">
          <Link href="/" className="link">
            View storefront
          </Link>
          <p className="text-mauve">Signed in as Admin. Demo data only, nothing is sent to a server.</p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white px-4 h-16">
          <Logo className="h-10 w-fit" />
          <span className="font-semibold text-mauve">Admin</span>
          <button className="ml-auto btn btn-line btn-sm" aria-expanded={open} aria-controls="admin-menu" onClick={() => setOpen(!open)}>
            {open ? "Close menu" : "Menu"}
          </button>
        </header>
        {open && (
          <div id="admin-menu" className="lg:hidden border-b border-line bg-blush p-4 animate-rise">
            {nav}
            <Link href="/" className="link mt-4 inline-block px-4">
              View storefront
            </Link>
          </div>
        )}
        <main id="main" className="p-4 sm:p-6 lg:p-10 max-w-[90rem]">
          {children}
        </main>
      </div>
    </div>
  );
}
