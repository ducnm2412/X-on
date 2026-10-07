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

// The nail plate for each shape as it sits on a fingertip: cuticle at the bottom, tip up.
const PLATES: Record<Shape, string> = {
  Round: "M15 80V38Q15 20 30 20Q45 20 45 38V80Q30 90 15 80Z",
  Oval: "M15 80V40C15 22 22 8 30 8C38 8 45 22 45 40V80Q30 90 15 80Z",
  Square: "M15 80V16Q15 12 19 12H41Q45 12 45 16V80Q30 90 15 80Z",
  Coffin: "M15 80V46L22 10Q23 6 26 6H34Q37 6 38 10L45 46V80Q30 90 15 80Z",
  Almond: "M15 80V48C15 30 22 12 30 4C38 12 45 30 45 48V80Q30 90 15 80Z",
  Stiletto: "M15 80V52C16 36 24 16 30 0C36 16 44 36 45 52V80Q30 90 15 80Z",
};

/**
 * A nail shape drawn on a fingertip: the finger behind, the nail plate with its free edge,
 * the half-moon at the cuticle and a line of shine, so each shape reads at a glance.
 */
export function NailIcon({ shape, className, filled }: { shape: Shape; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 60 104" className={className} aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* fingertip and knuckle crease */}
      <path d="M8 104V64Q8 45 30 45Q52 45 52 64V104" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" />
      <path d="M17 99Q30 95 43 99" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* nail plate */}
      <path d={PLATES[shape]} fill="currentColor" fillOpacity={filled ? 1 : 0.28} stroke="currentColor" strokeWidth="2.5" />
      {/* free edge: where the nail leaves the finger */}
      <path d="M15.500 47Q30 40 44.500 47" stroke={filled ? "#fff" : "currentColor"} strokeOpacity={filled ? 0.55 : 0.5} strokeWidth="1.5" />
      {/* half-moon at the cuticle */}
      <path d="M21 81Q30 70 39 81Q30 87 21 81Z" fill="#fff" fillOpacity={filled ? 0.38 : 0.75} />
      {/* shine */}
      <path d="M21 72V52" stroke="#fff" strokeOpacity={filled ? 0.7 : 0.95} strokeWidth="2.5" />
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
