import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Cart", description: "Review the sets and essentials in your X-ON cart.", robots: { index: false } };

export default function Page() {
  return <CartView />;
}
