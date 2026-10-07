import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Bits";
import { ClipRow } from "@/components/Clips";
import { GalleryGrid } from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Product Gallery",
  description: "Every X-ON set on sale now, photographed up close.",
};

export default function GalleryProduct() {
  return (
    <>
      <PageHero title="Now selling" intro="Every set in stock today, photographed up close so you can see the hand work before you buy." image="/IMG_7101.JPG">
        <Link href="/shop" className="btn">
          Shop now
        </Link>
        <Link href="/gallery-coming-soon" className="btn btn-line">
          See what is coming
        </Link>
      </PageHero>
      <section className="wrap py-14 md:py-20">
        <div className="mb-10">
          <h2 className="d2">Product gallery</h2>
          <p className="lede mt-3">Each photo links to its set. The size labels show what is in stock.</p>
        </div>
        <GalleryGrid />
      </section>
      <section aria-labelledby="in-motion" className="bg-blush">
        <div className="wrap py-14 md:py-20">
          <h2 id="in-motion" className="d2">
            In motion
          </h2>
          <p className="lede mt-3 mb-10">Photos flatten chrome and cat-eye. These clips show how the colours move in the light.</p>
          <ClipRow clips={["cateye", "pearl", "box"]} />
        </div>
      </section>
    </>
  );
}
