import type { Metadata } from "next";
import Link from "next/link";
import { DashboardKpis } from "@/components/admin/DashboardKpis";
import { PageTitle, Status, TableWrap } from "@/components/admin/ui";
import { INQUIRIES, money, ORDERS, orderTotal, WHOLESALE } from "@/lib/data";

export const metadata: Metadata = { title: "Dashboard" };

const ACTIONS = [
  ["/admin/products#add", "Add product"],
  ["/admin/blog-gallery#add-post", "Add blog post"],
  ["/admin/blog-gallery#add-gallery", "Add gallery item"],
  ["/admin/content", "Edit home content"],
];

export default function Dashboard() {
  return (
    <>
      <PageTitle title="Dashboard" text="Tuesday, October 6, 2026. Here is where the shop stands today." />

      <DashboardKpis />

      <section aria-labelledby="quick" className="mt-5">
        <h2 id="quick" className="sr-only">
          Quick actions
        </h2>
        <ul className="flex flex-wrap gap-2">
          {ACTIONS.map(([href, label], i) => (
            <li key={href}>
              <Link href={href} className={`btn btn-sm ${i ? "btn-line" : ""}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <section aria-labelledby="recent-orders">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="recent-orders" className="text-lg font-bold">
              Recent orders
            </h2>
            <Link href="/admin/orders" className="link text-sm">
              All orders
            </Link>
          </div>
          <TableWrap>
            <table className="table-x min-w-[34rem]">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="!text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td className="font-semibold">{o.id}</td>
                    <td>{o.customer}</td>
                    <td className="text-mauve whitespace-nowrap">{o.date}</td>
                    <td>
                      <Status value={o.status} />
                    </td>
                    <td className="text-right font-semibold">{money(orderTotal(o))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="recent-ws">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 id="recent-ws" className="text-lg font-bold">
                Wholesale applications
              </h2>
              <Link href="/admin/users#wholesale" className="link text-sm">
                Review
              </Link>
            </div>
            <ul className="divide-y divide-line rounded-xl border-[1.5px] border-line bg-white px-4">
              {WHOLESALE.slice(0, 3).map((w) => (
                <li key={w.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{w.business}</p>
                    <p className="text-sm text-mauve">{w.date}</p>
                  </div>
                  <Status value={w.status} />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="recent-inq">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 id="recent-inq" className="text-lg font-bold">
                Contact inquiries
              </h2>
              <Link href="/admin/users#inquiries" className="link text-sm">
                Reply
              </Link>
            </div>
            <ul className="divide-y divide-line rounded-xl border-[1.5px] border-line bg-white px-4">
              {INQUIRIES.slice(0, 3).map((q) => (
                <li key={q.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{q.name}</p>
                    <Status value={q.status} />
                  </div>
                  <p className="mt-1 text-sm text-mauve line-clamp-1">{q.message}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
