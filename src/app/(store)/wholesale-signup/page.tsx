import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Bits";
import { DemoForm } from "@/components/Form";

export const metadata: Metadata = {
  title: "Wholesale Signup",
  description: "Apply for an X-ON wholesale account. Salon and reseller pricing on handmade press-on nails and nail essentials.",
};

const TERMS = [
  ["30% off", "retail on every set and essential"],
  ["$300", "minimum first order, $150 after that"],
  ["2 business days", "to review your application"],
];

export default function WholesaleSignup() {
  return (
    <>
      <PageHero title="Wholesale signup" intro="Stock X-ON in your salon or shop. Approved businesses get wholesale pricing on every handmade set and essential." image="/IMG_7104.JPG" />
      <section className="wrap py-14 md:py-20 grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div>
          <h2 className="d2">Register</h2>
          <p className="lede mt-4">Tell us about your business. We check each application by hand and email you once your account is approved.</p>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {TERMS.map(([n, t]) => (
              <div key={n} className="py-4">
                <dt className="font-display text-2xl">{n}</dt>
                <dd className="text-mauve">{t}</dd>
              </div>
            ))}
          </dl>
        </div>
        <DemoForm
          id="ws"
          submitLabel="Submit application"
          loadingLabel="Submitting application…"
          successTitle="Application submitted"
          successBody="We review wholesale applications within two business days and will email you when your account is approved."
          again="Submit another application"
          footer={
            <p className="text-sm text-mauve">
              Already approved?{" "}
              <Link href="/my-account" className="link">
                Log in
              </Link>
            </p>
          }
          fields={[
            { name: "username", label: "Username", required: true, half: true, autoComplete: "username", minLength: 3 },
            { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
            { name: "business", label: "Business name", required: true, autoComplete: "organization" },
            { name: "address", label: "Business address", required: true, autoComplete: "street-address", placeholder: "Street, city, state, ZIP" },
            { name: "phone", label: "Phone", type: "tel", required: true, half: true, autoComplete: "tel", placeholder: "689-555-0100" },
            { name: "membership", label: "Membership", type: "select", options: ["Wholesale customer"], value: "Wholesale customer", half: true, readOnly: true },
            { name: "password", label: "Password", type: "password", required: true, half: true, autoComplete: "new-password", minLength: 8, hint: "At least 8 characters." },
            { name: "confirm", label: "Confirm password", type: "password", required: true, half: true, autoComplete: "new-password", match: "password" },
          ]}
        />
      </section>
    </>
  );
}
