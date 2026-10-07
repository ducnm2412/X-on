"use client";

import { useEffect, useRef } from "react";

/**
 * Glides its children into place when they scroll into view and back out when they leave,
 * in both directions: content below the viewport rises in, content above it drops in.
 */
export function Reveal({ children, className = "", delay = 0, from }: { children: React.ReactNode; className?: string; delay?: number; from?: "left" | "right" | "zoom" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.dataset.rv = "in";
        else el.dataset.rv = entry.boundingClientRect.top > window.innerHeight / 2 ? "below" : "above";
      },
      // "In view" means inside the middle of the screen, so the glide happens where it can be seen.
      { rootMargin: "-10% 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-rv="below" data-from={from} className={`rv ${className}`} style={delay ? ({ "--rv-delay": `${delay}ms` } as React.CSSProperties) : undefined}>
      {children}
    </div>
  );
}
