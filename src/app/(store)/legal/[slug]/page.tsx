import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL } from "@/lib/data";

export function generateStaticParams() {
  return LEGAL.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: LEGAL.find((d) => d.slug === slug)?.title ?? "Legal" };
}

// One text-only template, reused for Terms, Privacy and any other rich text page.
async function Content({ params }: Pick<PageProps<"/legal/[slug]">, "params">) {
  const { slug } = await params;
  const doc = LEGAL.find((d) => d.slug === slug);
  if (!doc) notFound();
  const other = LEGAL.find((d) => d.slug !== slug)!;
  return (
    <>
      <section className="deco deco-leaf bg-blush">
        <div className="wrap !max-w-[60rem] py-12 md:py-16">
          <h1 className="d1 !text-[clamp(2.4rem,5.6vw,4.5rem)]">{doc.title}</h1>
          <p className="mt-4 text-mauve">Last updated {doc.updated}</p>
        </div>
      </section>
      <div className="wrap !max-w-[60rem] py-10 md:py-14 grid gap-10 md:grid-cols-[14rem_1fr]">
        <nav aria-label="Sections" className="md:sticky md:top-36 self-start">
          <ul className="space-y-2 text-sm">
            {doc.sections.map((s, i) => (
              <li key={s.h}>
                <a href={`#s${i}`} className="text-mauve hover:text-lacquer">
                  {s.h}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="prose-x [&>section:first-child>h2]:mt-0">
          {doc.sections.map((s, i) => (
            <section key={s.h} id={`s${i}`} className="scroll-mt-36">
              <h2>{s.h}</h2>
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <p className="mt-10">
            Read our{" "}
            <Link href={`/legal/${other.slug}`} className="link">
              {other.title}
            </Link>{" "}
            or{" "}
            <Link href="/contact-us" className="link">
              contact us
            </Link>{" "}
            with a question. Card payments are handled by{" "}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="link">
              Stripe
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}

// The slug is URL data, so it is read inside Suspense to keep navigation to this route instant.
export default function Page({ params }: PageProps<"/legal/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Content params={params} />
    </Suspense>
  );
}
