import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Bits";
import { Photo } from "@/components/Photo";
import { POSTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, how-tos and behind-the-scenes from the X-ON studio.",
};

export default function Blog() {
  // Newest first; drafts stay in the admin.
  const [lead, ...rest] = POSTS.filter((p) => p.status === "Published");
  return (
    <>
      <PageHero title="News" intro="How-tos, new collections and notes from the X-ON studio." image="/IMG_7105.JPG" />
      <section className="wrap py-14 md:py-20">
        <article className="grid gap-6 md:grid-cols-2 md:gap-12 items-center pb-12 mb-12 border-b border-line">
          <Link href={`/blog/${lead.slug}`} className="box block aspect-[4/3]" aria-hidden="true" tabIndex={-1}>
            <Photo src={lead.cover} sizes="(min-width: 768px) 50vw, 100vw" zoom={1.6} />
          </Link>
          <div>
            <time className="text-sm text-mauve">{lead.date}</time>
            <h2 className="d2 mt-2">
              <Link href={`/blog/${lead.slug}`} className="hover:text-lacquer">
                {lead.title}
              </Link>
            </h2>
            <p className="lede mt-4">{lead.excerpt}</p>
            <Link href={`/blog/${lead.slug}`} className="link mt-5 inline-block" aria-label={`Read more: ${lead.title}`}>
              Read more
            </Link>
          </div>
        </article>

        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((p) => (
            <li key={p.slug}>
              <article className="flex h-full flex-col">
                <Link href={`/blog/${p.slug}`} className="box block aspect-[4/3]" aria-hidden="true" tabIndex={-1}>
                  <Photo src={p.cover} sizes="(min-width: 1024px) 25vw, 50vw" zoom={1.6} />
                </Link>
                <time className="mt-4 text-sm text-mauve">{p.date}</time>
                <h2 className="mt-1 font-display text-2xl leading-tight">
                  <Link href={`/blog/${p.slug}`} className="hover:text-lacquer">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-2 text-mauve">{p.excerpt}</p>
                <Link href={`/blog/${p.slug}`} className="link mt-auto pt-3 self-start" aria-label={`Read more: ${p.title}`}>
                  Read more
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
