"use client";

import Link from "next/link";
import { useState } from "react";
import { GALLERY } from "@/lib/data";
import { Pagination } from "./Bits";
import { Photo } from "./Photo";

const PER_PAGE = 9;

export function GalleryGrid() {
  const [page, setPage] = useState(1);
  const items = GALLERY.filter((g) => g.status === "Published");
  const pages = Math.ceil(items.length / PER_PAGE);
  const shown = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div id="gallery" className="scroll-mt-32">
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {shown.map((g) => {
          return (
            <li key={g.id}>
              <Link href={`/product/${g.product}`} className="group block">
                <div className="box aspect-square">
                  <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
                    <Photo src={g.image} sizes="(min-width: 768px) 33vw, 50vw" zoom={1} />
                  </div>
                  <ul className="absolute left-3 bottom-3 flex gap-1.5" aria-label={`Available in sizes ${g.sizes.join(", ")}`}>
                    {g.sizes.map((s) => (
                      <li key={s} aria-hidden="true" className="grid place-items-center h-7 min-w-7 px-1.5 rounded-full bg-white text-xs font-bold">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="font-semibold group-hover:text-lacquer">{g.title}</span>
                  <span className="text-sm text-lacquer font-semibold underline underline-offset-4 whitespace-nowrap">Shop now</span>
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
      <Pagination
        page={page}
        pages={pages}
        label="Gallery pages"
        onPage={(p) => {
          setPage(p);
          document.getElementById("gallery")?.scrollIntoView({ block: "start" });
        }}
      />
    </div>
  );
}
