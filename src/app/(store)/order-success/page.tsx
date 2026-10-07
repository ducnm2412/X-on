import type { Metadata } from "next";
import { OrderSuccess } from "@/components/OrderSuccess";

export const metadata: Metadata = { title: "Order placed", description: "Your X-ON order is confirmed.", robots: { index: false } };

export default function Page() {
  return <OrderSuccess />;
}
