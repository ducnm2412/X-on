import Link from "next/link";
import { Clip, ClipRow } from "@/components/Clips";
import { HeroVideo } from "@/components/HeroVideo";
import { Reveal } from "@/components/Reveal";
import { ScrollFade } from "@/components/ScrollFade";
import { EssentialTiles } from "@/components/HomeTiles";
import { Sparkle, Stars } from "@/components/Nail";
import { Photo } from "@/components/Photo";
import { ProductRow } from "@/components/ProductCard";
import { SizeFinder } from "@/components/SizeFinder";
import { BRAND, REVIEWS } from "@/lib/data";

function SectionHead({
  id,
  title,
  text,
  href,
  link,
}: {
  id: string;
  title: string;
  text?: string;
  href?: string;
  link?: string;
}) {
  return (
    <Reveal className="mb-8 md:mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div>
        <h2 id={id} className="d2">
          {title}
        </h2>
        {text && <p className="lede mt-3">{text}</p>}
      </div>
      {href && (
        <Link href={href} className="link">
          {link}
        </Link>
      )}
    </Reveal>
  );
}

export default function Home() {
  const [lead, ...rest] = REVIEWS;
  return (
    <>
      {/* Pulled up under the floating header: exactly one screen wide and one screen tall
          (less the pink bar above it). The video covers that area edge to edge. */}
      <section className="relative -mt-[5.75rem] grid h-[calc(100svh-2rem)] min-h-[30rem] place-items-center overflow-hidden bg-blush text-white">
        <HeroVideo src="/1K34PRO8E_DMCL0D.mp4" />
        <ScrollFade className="wrap relative pt-24 pb-10 text-center">
          <h1 className="d1 !text-[clamp(2.4rem,6.3vw,5.75rem)] sm:whitespace-nowrap [text-shadow:0_2px_4px_rgb(58_15_31/0.85),0_6px_30px_rgb(58_15_31/0.75)]">
            {["Press on.", "Slay on.", "Repeat."].map((phrase, i) => (
              <span
                key={phrase}
                className="inline-block animate-reveal"
                style={{ animationDelay: `${200 + i * 260}ms` }}
              >
                {phrase}
                {i < 2 && " "}
              </span>
            ))}
          </h1>
          <p
            style={{ animationDelay: "1050ms" }}
            className="animate-reveal mx-auto mt-6 max-w-xl text-lg font-medium [text-shadow:0_1px_3px_rgb(58_15_31/0.95),0_2px_16px_rgb(58_15_31/0.9)]"
          >
            Handmade press-on nails and the essentials to wear them well,
            painted and sculpted by hand in Kissimmee.
          </p>
          <div
            style={{ animationDelay: "1300ms" }}
            className="animate-reveal mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link href="/collections/handmade-press-on-nails" className="btn">
              Shop press-ons
            </Link>
            <Link
              href="/sizing-chart"
              className="btn !border-white !bg-white !text-wine hover:!border-petal hover:!bg-petal"
            >
              Find your size
            </Link>
          </div>
        </ScrollFade>
      </section>

      <section aria-labelledby="fit" className="deco deco-flora bg-blush">
        <Reveal from="zoom" className="wrap py-16 md:py-24">
          <SizeFinder />
        </Reveal>
      </section>

      <section
        aria-labelledby="best"
        className="deco deco-leaf [--deco-o:0.22]"
      >
        <div className="wrap py-20 md:py-28">
          <SectionHead
            id="best"
            title="Best sellers"
            text="What customers reorder most, including this week's sale prices."
            href="/collections/best-sellers"
            link="See all best sellers"
          />
          <Reveal delay={120}>
            <ProductRow pick="best" limit={4} />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="studio" className="deco deco-paper bg-petal">
        <div className="wrap py-16 md:py-24">
          <SectionHead
            id="studio"
            title="From the studio"
            text="New colours, supplies and sets, filmed at our desks in Kissimmee the week they arrive."
            href="/gallery-product"
            link="See the gallery"
          />
          <Reveal delay={120}>
            <ClipRow />
          </Reveal>
        </div>
      </section>

      {/* Feature block: a solid card with a photo overlapping its edge, and a note beside it. */}
      <section aria-labelledby="handmade" className="wrap py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <Reveal from="left" className="relative md:min-h-[26rem]">
            <div className="rounded-xl bg-lacquer p-8 pb-12 text-white md:flex md:min-h-[26rem] md:w-[70%] md:flex-col md:justify-center md:p-11 md:pr-24">
              <h2 id="handmade" className="d2 !text-[clamp(2rem,3.2vw,2.9rem)]">
                Handmade press‑on nails
              </h2>
              <p className="mt-4 max-w-sm text-white/90">
                Ten nails a set, painted and sculpted by hand. Small batches, so
                the popular ones go quickly.
              </p>
              <Link
                href="/collections/handmade-press-on-nails"
                className="btn mt-7 self-start !border-white !bg-white !text-lacquer hover:!border-wine hover:!bg-wine hover:!text-white"
              >
                Shop all press-ons
              </Link>
            </div>
            <div className="box relative z-10 -mt-6 ml-auto aspect-[4/3] w-[86%] shadow-[0_24px_50px_-20px_rgb(58_15_31/0.5)] md:absolute md:right-0 md:top-1/2 md:mt-0 md:aspect-[4/5] md:w-[42%] md:-translate-y-1/2">
              <Photo
                src="/IMG_7106.JPG"
                sizes="(min-width: 1024px) 25vw, 80vw"
              />
            </div>
          </Reveal>
          <Reveal from="right" delay={150}>
            <span className="grid size-11 place-items-center rounded-full bg-rose text-white">
              <Sparkle className="size-5" />
            </span>
            <h3 className="d3 mt-5">Four to six hours go into every set</h3>
            <p className="mt-3 text-mauve">
              Base colour in three thin coats. Flowers, bows and serpents built
              up in gel and cured in stages. Chrome rubbed in last, then every
              tip capped and checked under a lamp.
            </p>
            <Link
              href="/blog/how-a-handmade-set-gets-made"
              className="link mt-4 inline-block"
            >
              See how a set gets made
            </Link>
          </Reveal>
        </div>
        <Reveal className="mt-14 md:mt-20">
          <ProductRow pick="handmade" limit={4} />
        </Reveal>
      </section>

      {/* Mosaic: a tall clip, two product tiles, and the words for the section underneath. */}
      <section
        aria-labelledby="essentials"
        className="deco deco-leaf-l bg-blush"
      >
        <div className="wrap grid gap-4 py-16 md:gap-6 md:py-24 lg:grid-cols-[1fr_1.9fr]">
          <Reveal from="left" className="mx-auto w-full max-w-sm lg:max-w-none">
            <Clip
              clip="pearl"
              ratio="3 / 4"
              className="[&_.box]:rounded-xl [&_figcaption]:hidden"
            />
          </Reveal>
          <div className="flex min-w-0 flex-col gap-8 md:gap-10">
            <Reveal from="zoom" delay={120}>
              <EssentialTiles />
            </Reveal>
            <Reveal delay={200} className="lg:pl-2">
              <h2 id="essentials" className="d2">
                Nail essentials
              </h2>
              <p className="lede mt-4 !max-w-2xl">
                The glue, builder gels and prep tools we use at our own desks.
                Chosen for nail lovers and professionals who want supplies that
                simply work.
              </p>
              <Link href="/collections/nail-essentials" className="btn mt-7">
                Shop essentials
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Two wide cards side by side: what customers say, and where to find us. */}
      <section className="deco deco-flora [--deco-o:0.2]">
        <div className="wrap grid gap-6 py-20 md:py-28 lg:grid-cols-2">
          <Reveal
            from="left"
            className="flex flex-col rounded-xl bg-lacquer p-8 text-white md:p-11"
          >
            <h2 id="reviews" className="d2">
              Our reviews
            </h2>
            <figure className="mt-7">
              <Stars
                value={lead.rating}
                className="[&_svg]:size-5 [&_svg]:!text-white"
              />
              <blockquote className="mt-4 font-display text-[clamp(1.35rem,2.2vw,1.85rem)] italic leading-snug">
                “{lead.text}”
              </blockquote>
              <figcaption className="mt-4 text-white/90">
                <span className="font-semibold text-white">{lead.name}</span>,{" "}
                {lead.place}. Bought {lead.product}.
              </figcaption>
            </figure>
            <ul className="mt-8 divide-y divide-white/35 border-t border-white/35">
              {rest.slice(0, 2).map((r) => (
                <li key={r.name} className="py-4">
                  <figure>
                    <blockquote>{r.text}</blockquote>
                    <figcaption className="mt-1.5 text-sm text-white/90">
                      <span className="font-semibold text-white">{r.name}</span>
                      , {r.place}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            from="right"
            delay={150}
            className="flex flex-col overflow-hidden rounded-xl bg-blush"
          >
            <Clip
              clip="box"
              ratio="16 / 9"
              className="[&_.box]:rounded-none [&_figcaption]:hidden"
            />
            <div className="p-8 md:p-11">
              <h2 id="find" className="d2">
                Find us
              </h2>
              <address className="mt-4 font-display text-[clamp(1.35rem,2.2vw,1.85rem)] not-italic leading-tight">
                {BRAND.street}, {BRAND.city}
              </address>
              <p className="mt-3 text-mauve">
                Tuesday to Saturday, 10 am to 6 pm. Closed Sunday and Monday.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={BRAND.mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  Get directions
                </a>
                <a href={BRAND.phoneHref} className="btn btn-line">
                  Call {BRAND.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
