import Link from "next/link";
import { BRAND } from "@/lib/data";
import { Logo } from "./Header";
import { Newsletter } from "./Newsletter";

const COLS = [
  {
    title: "Shop",
    links: [
      ["/collections/handmade-press-on-nails", "Handmade press-on nails"],
      ["/collections/nail-essentials", "Nail essentials"],
      ["/collections/best-sellers", "Best sellers"],
      ["/bundle-and-save", "Bundle and save"],
      ["/sizing-chart", "Sizing chart"],
    ],
  },
  {
    title: "X-ON",
    links: [
      ["/about", "About"],
      ["/gallery-product", "Gallery"],
      ["/blog", "Blog"],
      ["/wholesale-signup", "Wholesale signup"],
      ["/contact-us", "Contact us"],
    ],
  },
  {
    title: "Account",
    links: [
      ["/my-account", "Admin log in"],
      ["/cart", "Cart"],
      ["/legal/terms", "Terms of service"],
      ["/legal/privacy", "Privacy policy"],
    ],
  },
];

const SOCIAL = [
  ["Instagram", "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.500a3.500 3.500 0 1 0 0 7 3.500 3.500 0 0 0 0-7Zm5-1.700h.01"],
  ["TikTok", "M14 3v11.500a3.500 3.500 0 1 1-3.500-3.500M14 3c.3 2.700 2 4.500 5 4.800"],
  ["Facebook", "M14 21v-8h3l.500-3.500H14V7.500c0-1 .500-1.800 1.800-1.800H17.500V3H15c-2.800 0-4.500 1.800-4.500 4.500v2H8V13h2.500v8"],
];

export function Footer() {
  return (
    <>
      <Newsletter />
      <footer className="bg-white">
        {/* On phones the link lists sit two across, so the footer stays short. */}
        <div className="wrap py-10 md:py-14 grid grid-cols-2 gap-x-6 gap-y-8 md:gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <Logo className="h-16 w-fit" />
            <p className="mt-3 font-display italic text-xl">{BRAND.line}</p>
            <address className="mt-5 not-italic leading-relaxed">
              <a href={BRAND.mapHref} target="_blank" rel="noopener noreferrer" className="hover:text-lacquer">
                {BRAND.street}
                <br />
                {BRAND.city}
              </a>
              <br />
              <a href={BRAND.phoneHref} className="font-semibold hover:text-lacquer">
                {BRAND.phone}
              </a>
            </address>
            <ul className="mt-5 flex gap-2">
              {SOCIAL.map(([name, d]) => (
                <li key={name}>
                  <a href="#" aria-label={`X-ON on ${name}`} className="grid place-items-center size-11 rounded-full border border-petal hover:bg-blush hover:border-rose">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={d} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {COLS.map((c) => (
            <nav key={c.title} aria-label={c.title} className={c.title === "Account" ? "col-span-2 md:col-span-1" : ""}>
              <h2 className="font-display text-xl mb-2 md:mb-3">{c.title}</h2>
              <ul className={`text-[0.95rem] md:text-base ${c.title === "Account" ? "grid grid-cols-2 gap-x-6 gap-y-1.5 md:block md:space-y-2" : "space-y-1.5 md:space-y-2"}`}>
                {c.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-mauve hover:text-lacquer">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-line">
          <p className="wrap py-5 text-sm text-mauve">© 2026 X-ON. Handmade press-on nails and nail essentials. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
