"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Gives every storefront page the same scroll behaviour as the home page without wrapping
 * each block by hand: the blocks inside a page's content columns glide in as they enter the
 * screen and glide back out as they leave, scrolling down or up.
 *
 * Blocks that are on screen when the page opens are left alone, so nothing flickers on load.
 * Blocks already handled by <Reveal>, and anything fixed or sticky, are skipped.
 */
export function AutoReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.getElementById("main");
    if (!main) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.dataset.rv = "in";
          else el.dataset.rv = entry.boundingClientRect.top > window.innerHeight / 2 ? "below" : "above";
        }
      },
      { rootMargin: "-8% 0px -8% 0px" },
    );

    function scan() {
      const blocks = main!.querySelectorAll<HTMLElement>(".wrap > *");
      blocks.forEach((el) => {
        if (el.dataset.arv !== undefined) return;
        if (el.closest(".rv, [data-arv]") || el.querySelector(".rv")) return;
        const position = getComputedStyle(el).position;
        if (position === "fixed" || position === "sticky") return;
        // Stagger the items of a row a little so they do not all move as one.
        const index = Array.prototype.indexOf.call(el.parentElement!.children, el);
        el.style.setProperty("--rv-delay", `${Math.min(index, 3) * 70}ms`);
        el.dataset.arv = "";
        const top = el.getBoundingClientRect().top;
        el.dataset.rv = top < window.innerHeight * 0.92 ? "in" : "below";
        io.observe(el);
      });
    }

    scan();
    // Content that streams in or renders after hydration is picked up shortly afterwards.
    const timers = [window.setTimeout(scan, 350), window.setTimeout(scan, 1300)];
    return () => {
      timers.forEach(clearTimeout);
      io.disconnect();
      // Unmark everything, so the next run (a new page, or a re-run of this effect) starts
      // clean and no block is left hidden with nothing watching it.
      main.querySelectorAll<HTMLElement>("[data-arv]").forEach((el) => {
        delete el.dataset.arv;
        delete el.dataset.rv;
      });
    };
  }, [pathname]);

  return null;
}
