import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Bits";
import { NailIcon } from "@/components/Nail";
import { FINGERS, SHAPES, SIZE_CHART, SIZES, type Shape } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sizing Chart",
  description: "Find your X-ON press-on size. Nail widths for XS, S, M and L, plus shapes and lengths.",
};

const SHAPE_NOTES: Record<Shape, string> = {
  Almond: "Tapered sides, soft point. Lengthens short fingers.",
  Coffin: "Tapered sides, flat tip. Room for detailed art.",
  Oval: "Rounded and classic. The easiest long shape to wear.",
  Round: "Follows the fingertip. Best for a first set.",
  Square: "Straight sides, flat tip. Strong at short lengths.",
  Stiletto: "Long and pointed. Our statement shape.",
};

const LENGTHS = [
  { name: "Short", mm: 14, note: "Just past the fingertip. Type, text and open cans as normal." },
  { name: "Medium", mm: 21, note: "The everyday length for almond, oval and round." },
  { name: "Long", mm: 28, note: "For coffin and stiletto sets. Allow a day to adjust." },
];

const TABS = [
  ["#size", "Size"],
  ["#shapes", "Nail Shapes & Length"],
  ["#length", "Length Details"],
];

export default function SizingChart() {
  return (
    <>
      <PageHero title="Sizing chart" intro="Measure once, then order every set in the same size. All you need is clear tape, a pen and a ruler." image="/IMG_7099.JPG" />

      <nav aria-label="On this page" className="sticky top-[5.5rem] z-30 border-b border-line bg-white">
        <ul className="wrap flex gap-1 overflow-x-auto">
          {TABS.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="block whitespace-nowrap px-4 py-3.5 font-semibold hover:text-lacquer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="size" className="wrap py-14 md:py-20 scroll-mt-40">
        <h2 className="d2">Size</h2>
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16 [&>*]:min-w-0">
          <ol className="space-y-5">
            {["Stick clear tape across the widest part of your nail.", "Mark the left and right edges of the nail with a pen.", "Lay the tape flat on a ruler and read the width in millimetres.", "Repeat for all five fingers, then match the row below."].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="grid place-items-center size-9 shrink-0 rounded-full bg-petal font-display text-lg">{i + 1}</span>
                <span className="pt-1">{step}</span>
              </li>
            ))}
          </ol>

          <div>
            <div className="overflow-x-auto rounded-xl border-[1.5px] border-petal">
              <table className="w-full min-w-[32rem] text-center">
                <caption className="sr-only">Nail width in millimetres for each size, thumb to pinky</caption>
                <thead className="bg-blush">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-left font-semibold">
                      Size
                    </th>
                    {FINGERS.map((f) => (
                      <th key={f} scope="col" className="px-3 py-3.5 font-semibold">
                        {f}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SIZES.map((s) => (
                    <tr key={s} className="border-t border-petal">
                      <th scope="row" className="px-4 py-4 text-left font-display text-2xl font-medium">
                        {s}
                      </th>
                      {SIZE_CHART[s].map((mm, i) => (
                        <td key={i} className="px-3 py-4">
                          {mm} <span className="text-sm text-mauve">mm</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t border-petal bg-blush">
                    <th scope="row" className="px-4 py-4 text-left font-display text-2xl font-medium">
                      Custom
                    </th>
                    <td colSpan={5} className="px-3 py-4 text-left">
                      Send us your five measurements and we make the set to fit. Add 3 days.{" "}
                      <Link href="/contact-us" className="link">
                        Request a custom size
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-mauve">Between two sizes? Choose the larger one and file the sides. A nail that is too narrow will lift.</p>
          </div>
        </div>
      </section>

      <section id="shapes" className="bg-blush scroll-mt-40">
        <div className="wrap py-14 md:py-20">
          <h2 className="d2">Nail shapes and length</h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
            {SHAPES.map((s) => (
              <li key={s}>
                <NailIcon shape={s} filled className="h-32 text-rose" />
                <h3 className="mt-4 font-display text-2xl">{s}</h3>
                <p className="mt-1 text-sm text-mauve">{SHAPE_NOTES[s]}</p>
                <Link href={`/collections/${s.toLowerCase()}`} className="link mt-2 inline-block text-sm">
                  Shop {s.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="length" className="wrap py-14 md:py-20 scroll-mt-40">
        <h2 className="d2">Length details</h2>
        <p className="lede mt-4">Length is measured from the cuticle edge to the tip of the middle finger nail.</p>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {LENGTHS.map((l) => (
            <li key={l.name} className="flex items-end gap-5 rounded-xl border-[1.5px] border-petal p-6">
              <div className="flex h-44 items-end">
                <div className="w-12 rounded-t-[50%_32%] rounded-b-xl bg-petal" style={{ height: `${l.mm * 5.6}px` }} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-2xl">{l.name}</h3>
                <p className="font-semibold">{l.mm} mm</p>
                <p className="mt-2 text-sm text-mauve">{l.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
