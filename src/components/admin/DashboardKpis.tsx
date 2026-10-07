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
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map(([href, label, value, note]) => (
          <div key={label} className="relative rounded-xl border-[1.5px] border-line border-l-4 border-l-lacquer bg-white px-4 py-3 hover:bg-blush">
            <dt className="text-sm font-semibold">
              <Link href={href} className="after:absolute after:inset-0">
                {label}
              </Link>
            </dt>
            <dd className="mt-1 text-3xl font-bold leading-none text-lacquer">{value}</dd>
            <dd className="mt-1.5 text-sm text-mauve">{note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
