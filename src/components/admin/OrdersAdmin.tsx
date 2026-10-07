"use client";

import { useState } from "react";
import { money, ORDERS, orderTotal, type Order } from "@/lib/data";
import { toast } from "@/lib/store";
import { Drawer, Empty, Field, PageTitle, Status, TableWrap } from "./ui";

const STATUSES: Order["status"][] = ["Pending", "Paid", "Shipped", "Delivered", "Refunded"];

export function OrdersAdmin() {
  const [orders, setOrders] = useState(ORDERS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | Order["status"]>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [next, setNext] = useState<Order["status"]>("Pending");

  const q = query.trim().toLowerCase();
  const rows = orders.filter((o) => (filter === "All" || o.status === filter) && (!q || `${o.id} ${o.customer} ${o.email}`.toLowerCase().includes(q)));
  const open = orders.find((o) => o.id === openId);
  const revenue = orders.filter((o) => o.status !== "Refunded").reduce((s, o) => s + orderTotal(o), 0);
  const count = (s: Order["status"]) => orders.filter((o) => o.status === s).length;

  const update = (id: string, status: Order["status"]) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    toast(`Order ${id} set to ${status.toLowerCase()}`);
  };

  return (
    <>
      <PageTitle title="Orders" text="Open an order to see its items and change its status." />

      <dl className="mb-7 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-line py-5 md:grid-cols-4">
        {[
          ["Revenue, last 7 days", money(revenue)],
          ["To ship", count("Pending") + count("Paid")],
          ["In transit", count("Shipped")],
          ["Refunded", count("Refunded")],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm font-semibold text-mauve">{label}</dt>
            <dd className="mt-1 font-display text-4xl leading-none">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,22rem)_1fr] md:items-center">
        <div>
          <label htmlFor="o-q" className="sr-only">
            Search orders
          </label>
          <input id="o-q" type="search" className="input" placeholder="Search by order ID, name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {(["All", ...STATUSES] as const).map((s) => (
            <button key={s} aria-pressed={filter === s} onClick={() => setFilter(s)} className={`rounded-md border-[1.5px] px-3.5 py-1.5 text-sm font-semibold ${filter === s ? "border-lacquer bg-lacquer text-white" : "border-petal hover:border-rose"}`}>
              {s}
              {s !== "All" && <span className="ml-1.5 opacity-70">{count(s)}</span>}
            </button>
          ))}
        </div>
      </div>

      {rows.length ? (
        <TableWrap>
          <table className="table-x min-w-[50rem]">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Created</th>
                <th>Payment</th>
                <th>Status</th>
                <th className="!text-right">Total</th>
                <th className="!text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id}>
                  <td className="font-semibold">{o.id}</td>
                  <td>
                    {o.customer}
                    <span className="block text-sm text-mauve">{o.email}</span>
                  </td>
                  <td className="whitespace-nowrap text-mauve">{o.date}</td>
                  <td className="whitespace-nowrap">{o.payment}</td>
                  <td>
                    <Status value={o.status} />
                  </td>
                  <td className="text-right font-semibold">{money(orderTotal(o))}</td>
                  <td className="text-right">
                    <button
                      className="link whitespace-nowrap"
                      aria-label={`View order ${o.id}`}
                      onClick={() => {
                        setOpenId(o.id);
                        setNext(o.status);
                      }}
                    >
                      View order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      ) : (
        <Empty title="No orders match" text="Try another status or a shorter search." />
      )}

      {open && (
        <Drawer
          title={`Order ${open.id}`}
          onClose={() => setOpenId(null)}
          footer={
            <>
              <button className="btn btn-line btn-sm" onClick={() => setOpenId(null)}>
                Close
              </button>
              <button
                className="btn btn-sm"
                disabled={next === open.status}
                onClick={() => {
                  update(open.id, next);
                  setOpenId(null);
                }}
              >
                Save status
              </button>
            </>
          }
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-mauve">Placed {open.date}</p>
            <Status value={open.status} />
          </div>

          <section>
            <h3 className="label">Customer</h3>
            <p>{open.customer}</p>
            <p className="text-mauve">{open.email}</p>
          </section>

          <section>
            <h3 className="label">Items</h3>
            <ul className="divide-y divide-line border-y border-line">
              {open.items.map((i) => (
                <li key={i.name} className="flex justify-between gap-4 py-3">
                  <span>
                    {i.name}
                    <span className="block text-sm text-mauve">
                      {i.size ? `Size ${i.size}, ` : ""}quantity {i.qty}
                    </span>
                  </span>
                  <span className="font-semibold">{money(i.qty * i.price)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 grid grid-cols-[1fr_auto] gap-y-1">
              <dt className="text-mauve">Subtotal</dt>
              <dd className="text-right">{money(orderTotal(open))}</dd>
              <dt className="text-mauve">Shipping</dt>
              <dd className="text-right">{orderTotal(open) >= 75 ? "Free" : money(6)}</dd>
              <dt className="font-semibold">Total</dt>
              <dd className="text-right font-semibold">{money(orderTotal(open) + (orderTotal(open) >= 75 ? 0 : 6))}</dd>
            </dl>
          </section>

          <section className="grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="label">Ship to</h3>
              <p>{open.address}</p>
            </div>
            <div>
              <h3 className="label">Payment</h3>
              <p>{open.payment}</p>
              <p className="text-sm text-mauve">Reference ch_{open.id.slice(3)}A7</p>
            </div>
          </section>

          <Field label="Order status">
            <select className="input" value={next} onChange={(e) => setNext(e.target.value as Order["status"])}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        </Drawer>
      )}
    </>
  );
}
