import type { Metadata } from "next";
import { BundleList } from "@/components/BundleList";

export const metadata: Metadata = {
  title: "Bundle and Save",
  description: "Buy X-ON sets and essentials together and save up to 25%.",
};

export default function BundleAndSave() {
  return (
    <>
      <section className="deco deco-leaf bg-blush">
        <div className="wrap py-12 md:py-16">
          <h1 className="d1 !text-[clamp(2.6rem,6.4vw,5rem)]">Bundle and save</h1>
          <p className="lede mt-5 text-wine/80">Buy sets together and save up to 25%. Every bundle ships free within the US.</p>
        </div>
      </section>
      <section className="wrap py-12 md:py-16">
        <BundleList />
      </section>
    </>
  );
}
