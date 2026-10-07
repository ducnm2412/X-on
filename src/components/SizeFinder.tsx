"use client";

import Link from "next/link";
import { useState } from "react";
import { FINGERS, SIZE_CHART, SIZES, type Size } from "@/lib/data";
import { Clip } from "./Clips";
import { nailMask } from "./Nail";

/**
 * Home section: a studio clip on one side, a live size picker on the other.
 * Choosing a size redraws the five nails at that size's real widths.
 */
export function SizeFinder() {
  const [size, setSize] = useState<Size>("M");
  const mm = SIZE_CHART[size];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
      <div className="relative mx-auto w-full max-w-md lg:max-w-none">
        <Clip clip="cateye" ratio="4 / 5" className="[&_figcaption]:hidden [&_.box]:rounded-xl" />
        {/* The chosen size, pinned to the corner of the video. */}
        <p className="absolute -right-3 -top-4 grid size-24 place-items-center rounded-full bg-lacquer text-center text-white sm:-right-6 sm:size-28" aria-hidden="true">
          <span>
            <span className="block text-xs">Size</span>
            <span className="block font-display text-4xl leading-none sm:text-5xl">{size}</span>
          </span>
        </p>
      </div>

      <div>
        <h2 id="fit" className="d2">
          Sized to your fingers
        </h2>
        <p className="lede mt-5">Every set comes in four sizes, cut to real nail widths from thumb to pinky. Pick one to see how the set changes.</p>

        <fieldset className="mt-8">
          <legend className="label">Choose a size</legend>
          <div className="flex flex-wrap gap-2.5">
            {SIZES.map((s) => (
              <label key={s} className={`grid h-12 min-w-16 cursor-pointer place-items-center rounded-full border-[1.5px] px-5 font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-lacquer ${size === s ? "border-lacquer bg-lacquer text-white" : "border-rose bg-white hover:bg-petal"}`}>
                <input type="radio" name="home-size" value={s} className="sr-only" checked={size === s} onChange={() => setSize(s)} />
                {s}
              </label>
            ))}
          </div>
        </fieldset>

        <dl className="mt-8 flex items-end gap-3 sm:gap-5" aria-live="polite">
          {mm.map((w, i) => (
            <div key={FINGERS[i]} className="text-center">
              <div className="mx-auto bg-rose transition-[width] duration-500 ease-out" style={{ width: `${w * 3.1}px`, aspectRatio: "10 / 21", ...nailMask("Almond") }} aria-hidden="true" />
              <dt className="mt-3 text-xs text-mauve">{FINGERS[i]}</dt>
              <dd className="font-display text-2xl leading-tight">
                {w}
                <span className="text-[0.6em] text-mauve"> mm</span>
              </dd>
            </div>
          ))}
        </dl>

        <Link href="/sizing-chart" className="btn btn-line mt-9">
          Open the sizing chart
        </Link>
      </div>
    </div>
  );
}
