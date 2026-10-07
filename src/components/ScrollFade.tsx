"use client";

import { useEffect, useRef } from "react";

// Fades its children out and lifts them slightly as the page scrolls down past them,
// and brings them back on the way up. Used for the hero text over the video.
export function ScrollFade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Fully gone once about half a screen has been scrolled.
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.5)));
      el.style.opacity = String(1 - p);
      el.style.transform = still ? "" : `translateY(${-p * 70}px)`;
      el.style.pointerEvents = p > 0.9 ? "none" : "";
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
