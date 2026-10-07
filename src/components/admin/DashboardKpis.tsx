"use client";

import Link from "next/link";
import { CUSTOMERS, INQUIRIES, ORDERS, WHOLESALE } from "@/lib/data";
import { useProducts } from "@/lib/store";

export function DashboardKpis() {
  const products = useProducts();
  const kpis = [
    ["/admin/products", "Total products", products.length, `${products.filter((p) => p.status === "Draft").length} in draft`],
    ["/admin/products", "Active products", products.filter((p) => p.status === "Active").length, `${products.filter((p) => p.status === "Out of stock").length} out of stock`],
    ["/admin/orders", "Orders", ORDERS.length, `${ORDERS.filter((o) => o.status === "Pending" || o.status === "Paid").length} to ship`],
    ["/admin/users", "Customers", CUSTOMERS.length, "2 joined this month"],
    ["/admin/users#wholesale", "Wholesale applications", WHOLESALE.length, `${WHOLESALE.filter((w) => w.status === "New").length} to review`],
    ["/admin/users#inquiries", "Inquiries", INQUIRIES.length, `${INQUIRIES.filter((q) => q.status === "Open").length} open`],
  ] as const;

  return (
    <section aria-label="Overview">
      <dl className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 overflow-hidden rounded-xl bg-blush gap-px [&>div]:bg-white border-[1.5px] border-blush">
        {kpis.map(([href, label, value, note]) => (
          <div key={label} className="relative p-5 hover:!bg-blush">
            <dt className="text-sm font-semibold text-mauve">
              <Link href={href} className="after:absolute after:inset-0">
                {label}
              </Link>
            </dt>
            <dd className="mt-2 font-display text-5xl leading-none">{value}</dd>
            <dd className="mt-2 text-sm text-mauve">{note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
