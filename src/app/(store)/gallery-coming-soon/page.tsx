import type { Metadata } from "next";
import { Clip } from "@/components/Clips";
import { Photo } from "@/components/Photo";
import { UPCOMING } from "@/lib/data";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "Upcoming and seasonal X-ON collections, and when they arrive.",
};

export default function GalleryComingSoon() {
  const live = UPCOMING.filter((c) => c.enabled);
  const featured = live.find((c) => c.featured);
  const seasonal = live.filter((c) => !c.featured);
  return (
    <>
      <section className="deco deco-leaf bg-blush">
        <div className="wrap py-12 md:py-16">
          <h1 className="d1 !text-[clamp(2.6rem,6.4vw,5rem)]">Coming soon</h1>
          <p className="lede mt-5 text-wine/80">The collections on our desks right now, in the order they will arrive.</p>
        </div>
      </section>

      {featured && (
        <section aria-labelledby="featured" className="wrap py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14 items-end">
            <div>
              <p className="chip chip-bad">New collection</p>
              <h2 id="featured" className="d1 !text-[clamp(2.6rem,6vw,4.75rem)] mt-4">
                {featured.name}
              </h2>
              <p className="mt-3 font-display italic text-2xl text-lacquer">{featured.when}</p>
              <p className="lede mt-4">{featured.note}</p>
              <a href="#updates-title" className="btn mt-7">
                Tell me when it arrives
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {featured.images.map((src, i) => (
                <div key={src} className={`box aspect-[3/5] ${i === 1 ? "mb-10" : "mt-10"}`}>
                  <Photo src={src} sizes="(min-width: 1024px) 20vw, 33vw" zoom={1.7} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="preview" className="bg-blush">
        <div className="wrap py-14 md:py-20 grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-14 items-center">
          <div>
            <h2 id="preview" className="d2">
              A first look at the colours
            </h2>
            <p className="lede mt-4">The pearl and cat-eye gels for the next collections have landed. Here they are before a single nail is painted.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <Clip clip="pearl" ratio="4 / 5" />
            <Clip clip="cateye" ratio="4 / 5" />
          </div>
        </div>
      </section>

      <section aria-labelledby="seasonal" className="wrap py-14 md:py-20">
        <h2 id="seasonal" className="d2 mb-10">
          Seasonal collections
        </h2>
        <ol className="grid gap-x-6 gap-y-12 md:grid-cols-3">
          {seasonal.map((c) => (
            <li key={c.id}>
              <div className="grid grid-cols-2 gap-2">
                {c.images.map((src) => (
                  <div key={src} className="box aspect-[3/4]">
                    <Photo src={src} sizes="(min-width: 768px) 17vw, 50vw" zoom={1.8} />
                  </div>
                ))}
              </div>
              <p className="mt-5 font-semibold text-lacquer">{c.when}</p>
              <h3 className="d3 mt-1">{c.name}</h3>
              <p className="mt-2 text-mauve">{c.note}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
