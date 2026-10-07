"use client";

import { useEffect, useRef, useState } from "react";

// Background video for the home hero: no blur and no tint. It covers the hero edge to
// edge, so whatever does not fit the screen's shape is trimmed evenly from the centre.
// Decorative, so it is hidden from screen readers; the pause control is not.
export function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {});
    // Stop while the hero is off screen, so it does not compete with the clips further down.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <video ref={ref} src={src} muted loop playsInline poster="/essentials/set.jpg" preload="auto" aria-hidden="true" tabIndex={-1} className="absolute inset-0 size-full object-cover" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <button
        onClick={() => (ref.current?.paused ? ref.current.play().catch(() => {}) : ref.current?.pause())}
        aria-label={playing ? "Pause background video" : "Play background video"}
        className="absolute bottom-5 right-5 z-10 grid place-items-center size-12 rounded-full bg-white text-wine hover:bg-blush"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
          {playing ? <path d="M7 5h3.500v14H7zM13.500 5H17v14h-3.500z" /> : <path d="M8 5v14l11-7z" />}
        </svg>
      </button>
    </>
  );
}
