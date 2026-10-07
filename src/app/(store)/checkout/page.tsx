import type { Metadata } from "next";
import { CheckoutView } from "@/components/CheckoutView";

export const metadata: Metadata = { title: "Checkout", description: "Enter your delivery and payment details to place your X-ON order.", robots: { index: false } };

export default function Page() {
  return <CheckoutView />;
}
