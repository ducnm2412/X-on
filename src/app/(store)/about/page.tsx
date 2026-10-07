import type { Metadata } from "next";
import Link from "next/link";
import { Clip } from "@/components/Clips";
import { Photo } from "@/components/Photo";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "X-ON is where modern nail artistry meets effortless beauty. Read the story behind our handmade press-on nails and nail essentials.",
};

const FACTS = [
  ["4 to 6 hours", "of hand work in every set"],
  ["10 nails", "filed to your size, not a one-size kit"],
  ["3 or more wears", "from each set with gentle removal"],
];

export default function About() {
  return (
    <>
      <section className="deco deco-flora bg-blush">
        <div className="wrap py-14 md:py-24">
          <h1 className="d1 !text-[clamp(2.4rem,6.3vw,5.75rem)] lg:whitespace-nowrap">Press On. Slay On. Repeat.</h1>
          <p className="mt-8 font-display italic text-[clamp(1.4rem,2.6vw,2.1rem)] leading-snug max-w-2xl">X-ON is where modern nail artistry meets effortless beauty.</p>
        </div>
      </section>

      <section className="wrap py-16 md:py-24 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20 items-start">
        <div className="grid grid-cols-2 gap-4">
          <div className="box aspect-[3/4]">
            <Photo src="/IMG_7106.JPG" sizes="(min-width: 1024px) 25vw, 50vw" />
          </div>
          <div className="box aspect-[3/4] mt-12">
            <Photo src="/IMG_7098.JPG" sizes="(min-width: 1024px) 25vw, 50vw" />
          </div>
        </div>
        <div>
          <h2 className="d2">Made for nail lovers and professionals alike</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed max-w-xl">
            <p>Created for nail lovers and professionals alike, X-ON offers handmade press-on nails and carefully selected nail essentials designed with quality, style, and performance in mind.</p>
            <p>From statement-making nail sets to everyday professional supplies, every X-ON product is chosen to make beautiful nails easier, faster, and more accessible, without compromising on a polished, luxury finish.</p>
          </div>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {FACTS.map(([n, t]) => (
              <div key={n} className="flex flex-wrap items-baseline gap-x-4 py-4">
                <dt className="font-display text-3xl">{n}</dt>
                <dd className="text-mauve">{t}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/shop" className="btn">
              Shop the collection
            </Link>
            <Link href="/contact-us" className="btn btn-line">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="watch" className="deco deco-paper bg-petal">
        <div className="wrap py-16 md:py-24">
          <h2 id="watch" className="d2">
            Watch us work
          </h2>
          <p className="lede mt-3">Short clips from the studio: what arrives, how it is packed and the colours we reach for.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_2.2fr_1fr] md:items-end">
            <Clip clip="pearl" />
            <Clip clip="box" />
            <Clip clip="cateye" />
          </div>
        </div>
      </section>

      <section className="wrap py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="d3">Handmade press-on nails</h2>
            <p className="mt-3 text-mauve max-w-md">Painted, sculpted and finished at our desks in Kissimmee. No printing, no stickers. If a flower looks raised in the photo, it is.</p>
          </div>
          <div>
            <h2 className="d3">Carefully selected nail essentials</h2>
            <p className="mt-3 text-mauve max-w-md">We stock only what we use ourselves: a glue that does not flood, a file that lasts, and prep tools that make a set stay on.</p>
          </div>
        </div>
        <p className="mt-14 text-mauve">
          Visit the studio at {BRAND.address}, or call{" "}
          <a href={BRAND.phoneHref} className="link">
            {BRAND.phone}
          </a>
          .
        </p>
      </section>
    </>
  );
}
