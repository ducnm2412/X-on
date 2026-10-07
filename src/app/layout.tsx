import type { Metadata } from "next";
import { Bodoni_Moda, Instrument_Sans } from "next/font/google";
import { Toaster } from "@/components/Toaster";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "X-ON | Handmade press-on nails and nail essentials", template: "%s | X-ON" },
  description:
    "X-ON is where modern nail artistry meets effortless beauty. Handmade press-on nails and carefully selected nail essentials from Kissimmee, Florida.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bodoni.variable} ${instrument.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <noscript>
          <style>{".rv{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
