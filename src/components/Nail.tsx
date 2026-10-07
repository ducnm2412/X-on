import type { CSSProperties } from "react";
import type { Shape } from "@/lib/data";

// One silhouette per nail shape, tip up, in a 60 × 100 box.
export const NAIL_PATHS: Record<Shape, string> = {
  Round: "M10 92V32Q10 6 30 6Q50 6 50 32V92Q30 102 10 92Z",
  Oval: "M10 92V40Q10 2 30 2Q50 2 50 40V92Q30 102 10 92Z",
  Square: "M10 92V10Q10 6 14 6H46Q50 6 50 10V92Q30 102 10 92Z",
  Coffin: "M10 92V52L19 8Q20 4 24 4H36Q40 4 41 8L50 52V92Q30 102 10 92Z",
  Almond: "M10 92V56Q12 20 30 3Q48 20 50 56V92Q30 102 10 92Z",
  Stiletto: "M10 92V64Q16 30 30 0Q44 30 50 64V92Q30 102 10 92Z",
};

export function NailIcon({ shape, className, filled }: { shape: Shape; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 60 104" className={className} aria-hidden="true">
      <path
        d={NAIL_PATHS[shape]}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Clips any element to a nail shape, stretched to the element's box.
export function nailMask(shape: Shape): CSSProperties {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='10 0 40 98' preserveAspectRatio='none'><path d='${NAIL_PATHS[shape]}'/></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return { maskImage: url, maskSize: "100% 100%", maskRepeat: "no-repeat", WebkitMaskImage: url, WebkitMaskSize: "100% 100%", WebkitMaskRepeat: "no-repeat" };
}

// The four-point sparkle from the logo.
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0c.9 7 4 10.600 12 12-8 1.400-11.100 5-12 12-.9-7-4-10.600-12-12 8-1.400 11.100-5 12-12Z" fill="currentColor" />
    </svg>
  );
}

export function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Sparkle key={n} className={`size-3.5 ${n <= value ? "text-rose" : "text-petal"}`} />
      ))}
    </span>
  );
}
