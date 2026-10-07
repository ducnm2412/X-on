import type { Metadata } from "next";
import { AccountForms } from "@/components/AccountForms";

export const metadata: Metadata = {
  title: "Admin log in",
  description: "Log in for the X-ON team.",
};

export default function MyAccount() {
  return (
    <>
      <section className="deco deco-leaf bg-blush">
        <div className="wrap py-12 md:py-16">
          <h1 className="d1 !text-[clamp(2.6rem,6.4vw,5rem)]">Admin log in</h1>
          <p className="lede mt-5 text-wine/80">For the X-ON team: manage products, orders and what the site shows.</p>
        </div>
      </section>
      <AccountForms />
    </>
  );
}
