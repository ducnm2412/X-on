import type { Metadata } from "next";
import { ShopBrowser } from "@/components/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop every X-ON handmade press-on set and nail essential. Filter by price, shape and product type.",
};

export default function Shop() {
  return (
    <>
      <div className="deco deco-leaf bg-blush">
        <div className="wrap py-10 md:py-14">
          <h1 className="d1 !text-[clamp(2.6rem,6.4vw,5rem)]">Shop</h1>
          <p className="lede mt-4 text-wine/80">Every handmade set, essential and bundle we have in stock today.</p>
        </div>
      </div>
      <ShopBrowser />
    </>
  );
}
