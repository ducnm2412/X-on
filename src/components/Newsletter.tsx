"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkle } from "./Nail";

type Status = "idle" | "loading" | "success" | "error";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    if (!EMAIL.test(email)) {
      setStatus("error");
      setError("Enter an email address like name@example.com.");
      return;
    }
    if (!data.get("consent")) {
      setStatus("error");
      setError("Tick the box to agree before signing up.");
      return;
    }
    setError("");
    setStatus("loading");
    setTimeout(() => setStatus("success"), 900);
  }

  return (
    <section aria-labelledby="updates-title" className="deco deco-flora deco-white bg-petal">
      <div className="wrap py-14 md:py-20 grid gap-8 lg:grid-cols-2 lg:gap-16 items-start">
        <div>
          <Sparkle className="size-7 text-lacquer mb-4" />
          <h2 id="updates-title" className="d2">
            X-ON updates
          </h2>
          <p className="mt-4 text-lg max-w-md">New sets go up most Fridays and the small batches sell out. Sign up to hear first, and take 10% off your first order.</p>
        </div>

        {status === "success" ? (
          <div role="status" className="rounded-xl bg-white p-7 animate-rise">
            <p className="font-display text-2xl">You are on the list.</p>
            <p className="mt-2 text-mauve">Your 10% code is on its way to your inbox. It can take a few minutes.</p>
            <button className="link mt-4" onClick={() => setStatus("idle")}>
              Sign up another address
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nl-email" className="label">
                Email
              </label>
              <input id="nl-email" name="email" type="email" autoComplete="email" placeholder="name@example.com" className="input" aria-invalid={status === "error" && error.startsWith("Enter")} aria-describedby="nl-msg" />
            </div>
            <div>
              <label htmlFor="nl-phone" className="label">
                Phone <span className="font-normal text-mauve">(optional)</span>
              </label>
              <input id="nl-phone" name="phone" type="tel" autoComplete="tel" placeholder="689-555-0100" className="input" />
            </div>
            <label className="sm:col-span-2 flex gap-3 text-sm">
              <input type="checkbox" name="consent" className="check" />
              <span>
                I agree to receive emails and texts from X-ON about new sets and offers. Message rates may apply. Unsubscribe at any time. See our{" "}
                <Link href="/legal/terms" className="link">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="link">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
              <button className="btn" disabled={status === "loading"}>
                {status === "loading" ? "Signing up…" : "Sign up for updates"}
              </button>
              <p id="nl-msg" role="alert" className="text-sm font-semibold text-[#8a1c35]">
                {status === "error" ? error : ""}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
