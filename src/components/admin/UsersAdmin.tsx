"use client";

import { useState } from "react";
import { CUSTOMERS, INQUIRIES, money, WHOLESALE, type Customer, type Inquiry, type Wholesale } from "@/lib/data";
import { toast } from "@/lib/store";
import { clearHash, Drawer, Empty, Field, PageTitle, Status, TableWrap, Tabs, useHash } from "./ui";

type Tab = "customers" | "wholesale" | "inquiries";
type Open = { tab: Tab; id: string; status: string; note: string };

export function UsersAdmin() {
  const hash = useHash();
  const [picked, setPicked] = useState<Tab | null>(null);
  const tab: Tab = picked ?? (hash === "#wholesale" ? "wholesale" : hash === "#inquiries" ? "inquiries" : "customers");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [wholesale, setWholesale] = useState(WHOLESALE);
  const [inquiries, setInquiries] = useState(INQUIRIES);
  const [open, setOpen] = useState<Open | null>(null);

  const q = query.trim().toLowerCase();
  const match = (text: string, s: string) => (!q || text.toLowerCase().includes(q)) && (status === "All" || s === status);
  const cRows = customers.filter((c) => match(`${c.name} ${c.email}`, c.status));
  const wRows = wholesale.filter((w) => match(`${w.business} ${w.username} ${w.email}`, w.status));
  const iRows = inquiries.filter((i) => match(`${i.name} ${i.email} ${i.order} ${i.message}`, i.status));
  const options = { customers: ["Active", "Suspended"], wholesale: ["New", "Approved", "Declined"], inquiries: ["Open", "Replied", "Closed"] }[tab];

  const c = open?.tab === "customers" ? customers.find((x) => x.id === open.id) : undefined;
  const w = open?.tab === "wholesale" ? wholesale.find((x) => x.id === open.id) : undefined;
  const i = open?.tab === "inquiries" ? inquiries.find((x) => x.id === open.id) : undefined;

  function save() {
    if (!open) return;
    if (c) setCustomers(customers.map((x) => (x.id === c.id ? { ...x, status: open.status as Customer["status"] } : x)));
    if (w) setWholesale(wholesale.map((x) => (x.id === w.id ? { ...x, status: open.status as Wholesale["status"], notes: open.note } : x)));
    if (i) setInquiries(inquiries.map((x) => (x.id === i.id ? { ...x, status: open.status as Inquiry["status"], note: open.note } : x)));
    toast(`Changes saved: ${c?.name ?? w?.business ?? i?.name}`);
    setOpen(null);
  }

  const row = (label: string, value: React.ReactNode) => (
    <div className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
      <dt className="text-mauve">{label}</dt>
      <dd>{value}</dd>
    </div>
  );

  return (
    <>
      <PageTitle title="Users, wholesale and inquiries" text="Open a record to change its status or leave a note for the team." />

      <Tabs
        label="Record type"
        value={tab}
        onChange={(t) => {
          setPicked(t);
          setStatus("All");
          setQuery("");
          clearHash();
        }}
        tabs={[
          ["customers", "Customers", customers.length],
          ["wholesale", "Wholesale", wholesale.filter((x) => x.status === "New").length],
          ["inquiries", "Contact inquiries", inquiries.filter((x) => x.status === "Open").length],
        ]}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,24rem)_auto] sm:justify-between">
        <div>
          <label htmlFor="u-q" className="sr-only">
            Search {tab}
          </label>
          <input id="u-q" type="search" className="input" placeholder={tab === "customers" ? "Search by name or email" : tab === "wholesale" ? "Search by business, username or email" : "Search by name, order number or message"} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div>
          <label htmlFor="u-status" className="sr-only">
            Filter by status
          </label>
          <select id="u-status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All statuses</option>
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {tab === "customers" &&
        (cRows.length ? (
          <TableWrap>
            <table className="table-x min-w-[44rem]">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Joined</th>
                  <th>Orders</th>
                  <th>Spent</th>
                  <th>Account</th>
                  <th className="!text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {cRows.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <span className="font-semibold">{x.name}</span>
                      <span className="block text-sm text-mauve">{x.email}</span>
                    </td>
                    <td className="whitespace-nowrap text-mauve">{x.joined}</td>
                    <td>{x.orders}</td>
                    <td>{money(x.spent)}</td>
                    <td>
                      <Status value={x.status} />
                    </td>
                    <td className="text-right">
                      <button className="link" aria-label={`View ${x.name}`} onClick={() => setOpen({ tab, id: x.id, status: x.status, note: "" })}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty title="No customers match" text="Try another name, or clear the status filter." />
        ))}

      {tab === "wholesale" &&
        (wRows.length ? (
          <TableWrap>
            <table className="table-x min-w-[48rem]">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Contact</th>
                  <th>Applied</th>
                  <th>Membership</th>
                  <th>Status</th>
                  <th className="!text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {wRows.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <span className="font-semibold">{x.business}</span>
                      <span className="block text-sm text-mauve">{x.username}</span>
                    </td>
                    <td>
                      {x.email}
                      <span className="block text-sm text-mauve">{x.phone}</span>
                    </td>
                    <td className="whitespace-nowrap text-mauve">{x.date}</td>
                    <td>{x.membership}</td>
                    <td>
                      <Status value={x.status} />
                    </td>
                    <td className="text-right">
                      <button className="link" aria-label={`Review ${x.business}`} onClick={() => setOpen({ tab, id: x.id, status: x.status, note: x.notes })}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty title="No applications match" text="New applications from the Wholesale Signup page appear here." />
        ))}

      {tab === "inquiries" &&
        (iRows.length ? (
          <TableWrap>
            <table className="table-x min-w-[48rem]">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Order</th>
                  <th>Message</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th className="!text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {iRows.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <span className="font-semibold">{x.name}</span>
                      <span className="block text-sm text-mauve">{x.email}</span>
                    </td>
                    <td className="whitespace-nowrap">{x.order || <span className="text-mauve">None</span>}</td>
                    <td className="max-w-[18rem]">
                      <span className="line-clamp-2">{x.message}</span>
                    </td>
                    <td className="whitespace-nowrap text-mauve">{x.date}</td>
                    <td>
                      <Status value={x.status} />
                    </td>
                    <td className="text-right">
                      <button className="link" aria-label={`Open inquiry from ${x.name}`} onClick={() => setOpen({ tab, id: x.id, status: x.status, note: x.note })}>
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty title="No inquiries match" text="Messages from the Contact Us form appear here." />
        ))}

      {open && (c || w || i) && (
        <Drawer
          title={c?.name ?? w?.business ?? `Inquiry from ${i?.name}`}
          onClose={() => setOpen(null)}
          footer={
            <>
              <button className="btn btn-line btn-sm" onClick={() => setOpen(null)}>
                Cancel
              </button>
              <button className="btn btn-sm" onClick={save}>
                Save changes
              </button>
            </>
          }
        >
          <dl className="divide-y divide-line border-y border-line">
            {c && (
              <>
                {row("Email", c.email)}
                {row("Joined", c.joined)}
                {row("Orders", c.orders)}
                {row("Total spent", money(c.spent))}
              </>
            )}
            {w && (
              <>
                {row("Username", w.username)}
                {row("Email", w.email)}
                {row("Business name", w.business)}
                {row("Business address", w.address)}
                {row("Phone", w.phone)}
                {row("Membership", w.membership)}
                {row("Applied", w.date)}
              </>
            )}
            {i && (
              <>
                {row("Name", i.name)}
                {row("Email", i.email)}
                {row("Order number", i.order || "None given")}
                {row("Received", i.date)}
                {row("Message", i.message)}
              </>
            )}
          </dl>

          <Field label={c ? "Account status" : "Status"}>
            <select className="input" value={open.status} onChange={(e) => setOpen({ ...open, status: e.target.value })}>
              {options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
          {!c && (
            <Field label={w ? "Notes" : "Admin note"} hint="Only the team sees this.">
              <textarea className="input" rows={4} value={open.note} onChange={(e) => setOpen({ ...open, note: e.target.value })} />
            </Field>
          )}
        </Drawer>
      )}
    </>
  );
}
