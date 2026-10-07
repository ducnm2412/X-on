"use client";

import { useEffect, useRef, useState } from "react";

export const CLIPS = {
  pearl: { src: "/1K34PRO84_DMCL0D.mp4", poster: "/essentials/pearl.jpg", title: "Unboxing the pearl shades", note: "48 new colours arrive at the studio.", wide: false },
  box: { src: "/1K34PRO8E_DMCL0D.mp4", poster: "/essentials/set.jpg", title: "Opening the acrygel set", note: "Twelve builder colours, boxed for the desk.", wide: true },
  cateye: { src: "/1K34PRO8K_DMCL0D.mp4", poster: "/essentials/cateye.jpg", title: "Cat-eye colours, up close", note: "The magnetic gels behind our cat-eye sets.", wide: false },
} as const;
export type ClipKey = keyof typeof CLIPS;

/**
 * A silent, looping clip. It plays only while on screen, never for visitors who ask for
 * reduced motion, and always has a visible pause control.
 *
 * The video file is attached only while the clip is on screen and let go when it scrolls
 * away. A browser keeps just a few connections open per site, and a page with many videos
 * would otherwise use them all up: later clips stayed blank and links stopped responding.
 * A still frame stands in whenever the video is not loaded.
 */
export function Clip({ clip, className = "", ratio }: { clip: ClipKey; className?: string; ratio?: string }) {
  const c = CLIPS[clip];
  const box = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const paused = useRef(false); // set when the visitor pauses, so scrolling does not restart it
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (near) {
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!still && !paused.current) video.play().catch(() => {});
    } else {
      video.pause();
      // With the src attribute gone, load() drops the download and frees the connection.
      video.load();
    }
  }, [near]);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      paused.current = false;
      video.play().catch(() => {});
    } else {
      paused.current = true;
      video.pause();
    }
  }

  return (
    <figure className={className}>
      <div ref={box} className="box bg-petal" style={{ aspectRatio: ratio ?? (c.wide ? "16 / 9" : "9 / 16") }}>
        <video ref={ref} src={near ? c.src : undefined} poster={c.poster} muted loop playsInline preload="none" aria-label={c.title} className="absolute inset-0 size-full object-cover" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
        <button onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} video: ${c.title}`} className="absolute bottom-3 right-3 grid place-items-center size-11 rounded-full bg-white text-wine hover:bg-blush">
          <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
            {playing ? <path d="M7 5h3.500v14H7zM13.500 5H17v14h-3.500z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>
      </div>
      <figcaption className="mt-3">
        <span className="block font-semibold">{c.title}</span>
        <span className="block text-sm text-mauve">{c.note}</span>
      </figcaption>
    </figure>
  );
}

// Three clips side by side; a swipeable row on phones.
export function ClipRow({ clips = ["pearl", "box", "cateye"] }: { clips?: ClipKey[] }) {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
      {clips.map((k) => (
        <Clip key={k} clip={k} ratio="4 / 5" className="w-[72vw] shrink-0 snap-center md:w-auto" />
      ))}
    </div>
  );
}
