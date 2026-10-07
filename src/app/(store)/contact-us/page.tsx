import type { Metadata } from "next";
import Link from "next/link";
import { DemoForm } from "@/components/Form";
import { Photo } from "@/components/Photo";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact X-ON about an order, sizing or wholesale. 3168 Bill Beck Blvd, Kissimmee, FL 34744. 689-212-8888.",
};

const PROMISES = [
  ["Quality, style and performance", "Every set is checked under a lamp before it is boxed."],
  ["For nail lovers and professionals", "The same products go to customers at home and to salon desks."],
  ["Easier, faster, more accessible", "A salon finish in ten minutes, at a third of the price."],
];

export default function ContactUs() {
  return (
    <>
      <section className="deco deco-leaf bg-blush">
        <div className="wrap py-12 md:py-20 grid gap-10 lg:grid-cols-[1.3fr_1fr] items-end">
          <div>
            <h1 className="d1 !text-[clamp(2.6rem,6.4vw,5rem)]">Talk to X-ON</h1>
            <p className="mt-5 text-xl font-semibold max-w-xl">Handmade press-on nails and carefully selected nail essentials.</p>
            <p className="lede mt-3 text-wine/80">X-ON is where modern nail artistry meets effortless beauty. Ask us about an order, a size or stocking X-ON in your salon.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={BRAND.phoneHref} className="btn">
                Call {BRAND.phone}
              </a>
              <Link href="/wholesale-signup" className="btn btn-line">
                Apply for wholesale
              </Link>
            </div>
          </div>
          <address className="not-italic lg:text-right">
            <p className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">
              {BRAND.street}
              <br />
              {BRAND.city}
            </p>
            <p className="mt-3 text-mauve">Tuesday to Saturday, 10 am to 6 pm</p>
            <a href={BRAND.mapHref} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-block">
              Get directions
            </a>
          </address>
        </div>
      </section>

      <section className="wrap py-14 md:py-20 grid gap-6 md:grid-cols-2">
        <div className="grid grid-cols-[7rem_1fr] sm:grid-cols-[10rem_1fr] gap-5 items-center rounded-xl border-[1.5px] border-petal p-5">
          <div className="box aspect-square">
            <Photo src="/IMG_7103.JPG" sizes="160px" zoom={1.6} />
          </div>
          <div>
            <h2 className="d3">Handmade press-on nails</h2>
            <p className="mt-2 text-mauve">Statement-making sets, painted and sculpted by hand, sized to your fingers and reusable three times or more.</p>
          </div>
        </div>
        <div className="grid grid-cols-[7rem_1fr] sm:grid-cols-[10rem_1fr] gap-5 items-center rounded-xl border-[1.5px] border-petal p-5">
          <div className="box aspect-square">
            <Photo src="/essentials/set.jpg" sizes="160px" />
          </div>
          <div>
            <h2 className="d3">Nail essentials</h2>
            <p className="mt-2 text-mauve">Everyday professional supplies: glue, builder gels and prep tools we have tested at our own desks.</p>
          </div>
        </div>
        <ul className="md:col-span-2 grid gap-x-10 md:grid-cols-3 border-y border-line divide-y md:divide-y-0 divide-line">
          {PROMISES.map(([t, d]) => (
            <li key={t} className="py-6">
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1 text-mauve">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="contact-form" className="wrap pb-20 md:pb-28 grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div>
          <h2 id="contact-form" className="d2">
            Contact X-ON
          </h2>
          <p className="lede mt-4">We reply within one business day. For anything about an order, include the order number from your confirmation email.</p>
          <p className="mt-6 text-mauve">A polished, luxury finish is the standard. If a set arrives and falls short of it, tell us and we will remake it.</p>
        </div>
        <DemoForm
          id="contact"
          submitLabel="Send message"
          loadingLabel="Sending message…"
          successTitle="Message sent"
          successBody="We reply within one business day, to the email address you gave us."
          again="Send another message"
          fields={[
            { name: "name", label: "First and last name", required: true, autoComplete: "name" },
            { name: "email", label: "Email address", type: "email", required: true, half: true, autoComplete: "email" },
            { name: "order", label: "Phone or order number", half: true, placeholder: "XO-10482" },
            { name: "message", label: "Message", type: "textarea", required: true, minLength: 10, placeholder: "How can we help?" },
          ]}
        />
      </section>
    </>
  );
}
