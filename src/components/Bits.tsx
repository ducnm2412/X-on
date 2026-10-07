import Link from "next/link";
import { Photo } from "./Photo";

// Page opener used by the content pages: title and intro on the left, one photo on the right.
export function PageHero({ title, intro, image, children }: { title: string; intro?: string; image?: string; children?: React.ReactNode }) {
  return (
    <section className="deco deco-leaf bg-blush">
      <div className={`wrap grid items-center gap-8 py-12 md:py-16 ${image ? "md:grid-cols-[1.2fr_1fr]" : ""}`}>
        <div>
          <h1 className="d1 !text-[clamp(2.6rem,6.4vw,5rem)]">{title}</h1>
          {intro && <p className="lede mt-5 text-wine/80">{intro}</p>}
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
        {image && (
          <div className="box aspect-[4/3] md:aspect-[5/4]">
            <Photo src={image} sizes="(min-width: 768px) 40vw, 100vw" priority />
          </div>
        )}
      </div>
    </section>
  );
}

export function Crumbs({ items }: { items: [string, string?][] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-mauve">
      <ol className="flex flex-wrap gap-x-2">
        {items.map(([label, href], i) => (
          <li key={label} className="flex gap-2">
            {href ? (
              <Link href={href} className="hover:text-lacquer underline underline-offset-4">
                {label}
              </Link>
            ) : (
              <span aria-current="page" className="text-wine">
                {label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Pagination({ page, pages, onPage, label }: { page: number; pages: number; onPage: (p: number) => void; label: string }) {
  if (pages <= 1) return null;
  const item = "grid place-items-center h-11 min-w-11 px-3 rounded-md font-semibold border-[1.5px]";
  return (
    <nav aria-label={label} className="mt-12 flex items-center justify-center gap-2">
      <button className={`${item} border-transparent hover:bg-blush disabled:text-mauve/50 disabled:hover:bg-transparent`} disabled={page === 1} onClick={() => onPage(page - 1)}>
        Previous
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button key={n} aria-current={n === page ? "page" : undefined} aria-label={`Page ${n}`} className={`${item} ${n === page ? "border-lacquer bg-lacquer text-white" : "border-petal hover:border-rose hover:bg-blush"}`} onClick={() => onPage(n)}>
          {n}
        </button>
      ))}
      <button className={`${item} border-transparent hover:bg-blush disabled:text-mauve/50 disabled:hover:bg-transparent`} disabled={page === pages} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </nav>
  );
}
