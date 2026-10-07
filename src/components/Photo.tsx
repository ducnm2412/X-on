import Image from "next/image";
import { PHOTOS, type Art } from "@/lib/data";

// A product photo cropped in on the nails. The wrapper sets the aspect ratio so nothing shifts on load.
export function Photo({
  src,
  alt,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className = "",
  zoom,
  origin,
  priority,
  focus,
}: {
  src: string;
  alt?: string;
  sizes?: string;
  className?: string;
  zoom?: number;
  origin?: string;
  priority?: boolean;
  /** Centre the crop on a point of the photo: [x, y] from 0 to 1, plus degrees of rotation. */
  focus?: [number, number, number?];
}) {
  const meta = PHOTOS[src];
  const z = zoom ?? meta?.zoom ?? 1.3;
  const style = focus
    ? { transform: `rotate(${focus[2] ?? 0}deg) translate(${(0.5 - focus[0]) * z * 100}%, ${(0.5 - focus[1]) * z * 100}%) scale(${z})` }
    : { transform: `scale(${z})`, transformOrigin: origin ?? meta?.origin ?? "center" };
  return <Image src={src} alt={alt ?? meta?.alt ?? ""} fill sizes={sizes} preload={priority} className={`object-cover ${className}`} style={style} />;
}

// Drawn stand-ins for essentials that have no photography yet.
const ART: Record<Art, React.ReactNode> = {
  glue: (
    <>
      <rect x="44" y="52" width="32" height="50" rx="9" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
      <rect x="51" y="30" width="18" height="22" rx="3" fill="var(--color-rose)" />
      <path d="M56 30V18q4-6 8 0v12" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M52 70h16M52 80h10" stroke="var(--color-rose)" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  tabs: (
    <>
      <rect x="30" y="26" width="60" height="72" rx="8" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={38 + c * 12} y={36 + r * 19} width="8" height="13" rx="4" fill="var(--color-rose)" opacity={0.45 + c * 0.18} />
        )),
      )}
    </>
  ),
  prep: (
    <>
      <rect x="30" y="22" width="13" height="80" rx="6.5" fill="var(--color-rose)" />
      <rect x="52" y="22" width="13" height="80" rx="3" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
      <path d="M82 102V34l-4-12h8l-4 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </>
  ),
  file: (
    <>
      <path d="M52 20h16v70q0 12-8 12t-8-12Z" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
      <path d="M52 20h16v46H52Z" fill="var(--color-rose)" opacity=".55" />
      <path d="M56 28v30M60 28v30M64 28v30" stroke="#fff" strokeWidth="1.5" />
    </>
  ),
  oil: (
    <>
      <rect x="53" y="40" width="14" height="62" rx="6" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
      <rect x="53" y="62" width="14" height="40" rx="6" fill="var(--color-rose)" opacity=".6" />
      <path d="M56 40V28h8v12M58 28l2-10 2 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </>
  ),
  remover: (
    <>
      <path d="M40 54q0-8 8-8h24q8 0 8 8v40q0 8-8 8H48q-8 0-8-8Z" fill="#fff" stroke="currentColor" strokeWidth="2.5" />
      <rect x="52" y="32" width="16" height="14" rx="3" fill="var(--color-rose)" />
      <path d="M60 62c7 9 9 13 9 17a9 9 0 0 1-18 0c0-4 2-8 9-17Z" fill="var(--color-rose)" opacity=".6" />
    </>
  ),
};

export function ProductArt({ art, label }: { art: Art; label: string }) {
  return (
    <svg viewBox="0 0 120 120" className="absolute inset-0 size-full text-wine" role="img" aria-label={`Illustration of ${label}`}>
      {ART[art]}
    </svg>
  );
}

export function ProductImage({ p, sizes, priority }: { p: { image?: string; art?: Art; name: string }; sizes?: string; priority?: boolean }) {
  if (p.image) return <Photo src={p.image} sizes={sizes} priority={priority} />;
  return <ProductArt art={p.art ?? "glue"} label={p.name} />;
}
