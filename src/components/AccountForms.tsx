"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DemoForm } from "./Form";

// Admin log in only: shoppers check out as guests, so there is no customer registration.
// Mock auth for the demo: any username and password opens the admin.
export function AccountForms() {
  const router = useRouter();
  const [lost, setLost] = useState(false);
  return (
    <section className="wrap py-14 md:py-20 grid gap-12 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-20">
      <div>
        <h2 className="d2 mb-7">{lost ? "Reset your password" : "Log in"}</h2>
        {lost ? (
          <>
            <p className="text-mauve mb-6 max-w-md">Enter the email on your admin account and we will send a link to choose a new password.</p>
            <DemoForm
              key="lost"
              id="lost"
              submitLabel="Email reset link"
              loadingLabel="Sending link…"
              successTitle="Reset link sent"
              successBody="Check your inbox. The link works for one hour."
              again="Send the link again"
              footer={
                <button type="button" className="link" onClick={() => setLost(false)}>
                  Back to log in
                </button>
              }
              fields={[{ name: "email", label: "Email", type: "email", required: true, autoComplete: "email" }]}
            />
          </>
        ) : (
          <DemoForm
            key="login"
            id="login"
            submitLabel="Log in"
            loadingLabel="Logging in…"
            successTitle="Logged in"
            successBody="Opening the admin…"
            again="Log in again"
            onSuccess={() => router.push("/admin")}
            footer={
              <button type="button" className="link" onClick={() => setLost(true)}>
                Lost your password?
              </button>
            }
            fields={[
              { name: "user", label: "Username or email", required: true, autoComplete: "username" },
              { name: "password", label: "Password", type: "password", required: true, autoComplete: "current-password" },
              { name: "remember", label: "Remember me", type: "checkbox" },
            ]}
          />
        )}
      </div>

      <div className="self-start rounded-xl bg-blush p-7 md:p-9">
        <h2 className="d3">This log in is for the X-ON team</h2>
        <p className="mt-3 text-mauve max-w-md">Shoppers do not need an account. Add a set to your cart and check out as a guest; your receipt and tracking arrive by email.</p>
        <p className="mt-3 text-mauve max-w-md">Demo: any username and password opens the admin.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn-sm">
            Go to the shop
          </Link>
          <Link href="/wholesale-signup" className="btn btn-line btn-sm">
            Apply for wholesale
          </Link>
        </div>
        <p className="mt-6 text-sm text-mauve">
          Your personal data is used as described in our{" "}
          <Link href="/legal/privacy" className="link">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
