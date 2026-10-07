"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAdmin, useAdmin, useHydrated } from "@/lib/store";
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
  const router = useRouter();
  const admin = useAdmin();
  const hydrated = useHydrated();

  // Anyone who is not signed in is sent to the log in page.
  useEffect(() => {
    if (hydrated && !admin) router.replace("/my-account");
  }, [hydrated, admin, router]);

  if (!hydrated || !admin)
    return (
      <div className="grid flex-1 place-items-center p-10 text-center">
        <p className="text-mauve" role="status">
          {hydrated ? "Log in to open the admin. Taking you to the log in page…" : "Checking your log in…"}
        </p>
      </div>
    );

  const logout = () => {
    logoutAdmin();
    router.replace("/my-account");
  };

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {NAV.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-2 text-[0.95rem] font-semibold ${active ? "bg-white text-lacquer" : "text-white hover:bg-white/15"}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="admin flex-1 bg-[#fff7fa] lg:grid lg:grid-cols-[14.5rem_1fr]">
      <aside className="hidden lg:flex flex-col gap-5 bg-lacquer p-4 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white px-2.5 py-1.5">
            <Logo className="h-9 w-fit" />
          </div>
          <p className="font-semibold text-white">Admin</p>
        </div>
        {nav}
        <div className="mt-auto space-y-3 text-sm">
          <Link href="/" className="block px-3 font-semibold text-white underline underline-offset-4 hover:no-underline">
            View storefront
          </Link>
          <p className="px-3 text-white/85">Signed in as admin.</p>
          <button className="btn btn-sm w-full !border-white !bg-white !text-lacquer hover:!bg-blush" onClick={logout}>
            Log out
          </button>
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
          <div id="admin-menu" className="lg:hidden bg-lacquer p-4 animate-rise">
            {nav}
            <Link href="/" className="mt-4 inline-block px-3 font-semibold text-white underline underline-offset-4">
              View storefront
            </Link>
            <button className="btn btn-sm mt-4 ml-4 !border-white !bg-white !text-lacquer" onClick={logout}>
              Log out
            </button>
          </div>
        )}
        <main id="main" className="max-w-[92rem] p-4 text-[0.95rem] sm:p-5 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
