import { Suspense } from "react";
import { AutoReveal } from "@/components/AutoReveal";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] btn">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      {/* Reads the current path, so it sits in Suspense and never holds up a page. */}
      <Suspense fallback={null}>
        <AutoReveal />
      </Suspense>
    </>
  );
}
