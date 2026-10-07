import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/Bits";
import { DemoForm } from "@/components/Form";
import { Photo } from "@/components/Photo";
import { POSTS } from "@/lib/data";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  return { title: post?.title ?? "Article", description: post?.excerpt };
}

async function Content({ params }: Pick<PageProps<"/blog/[slug]">, "params">) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  const more = POSTS.filter((p) => p.slug !== slug && p.status === "Published").slice(0, 3);

  return (
    <>
      <article>
        <header className="deco deco-leaf bg-blush">
          <div className="wrap !max-w-[60rem] py-12 md:py-16">
            <Crumbs items={[["Blog", "/blog"], [post.title]]} />
            <h1 className="d1 !text-[clamp(2.3rem,5.4vw,4.25rem)] mt-5">{post.title}</h1>
            <p className="mt-5 text-mauve">
              <time>{post.date}</time>, {post.minutes} minute read
            </p>
          </div>
        </header>

        {/* Blocks come straight from the editor: heading, paragraph, image or list, in any order. */}
        <div className="wrap !max-w-[60rem] py-12 md:py-16 prose-x">
          {post.blocks.map((b, i) => {
            if (b.kind === "h") return <h2 key={i}>{b.text}</h2>;
            if (b.kind === "p") return <p key={i}>{b.text}</p>;
            if (b.kind === "list")
              return (
                <ul key={i}>
                  {b.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            return (
              <figure key={i} className="my-9">
                <div className="box aspect-[16/10]">
                  <Photo src={b.src} sizes="(min-width: 1024px) 900px, 100vw" zoom={1.5} />
                </div>
                <figcaption className="mt-3 text-sm text-mauve">{b.caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </article>

      <section aria-labelledby="comment" className="wrap !max-w-[60rem] pb-16">
        <div className="border-t border-line pt-12">
          <h2 id="comment" className="d2">
            Leave a comment
          </h2>
          <p className="text-mauve mt-2 mb-7">Your email is not published.</p>
          <DemoForm
            id="comment"
            submitLabel="Post comment"
            loadingLabel="Posting comment…"
            successTitle="Comment posted"
            successBody="Thank you. Comments appear once our team has read them, usually within a day."
            again="Write another comment"
            fields={[
              { name: "comment", label: "Comment", type: "textarea", required: true },
              { name: "name", label: "Name", required: true, half: true, autoComplete: "name" },
              { name: "email", label: "Email", type: "email", required: true, half: true, autoComplete: "email" },
              { name: "save", label: "Save my name and email in this browser for next time.", type: "checkbox" },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="more" className="wrap pb-20 md:pb-28">
        <h2 id="more" className="d2 mb-8">
          Keep reading
        </h2>
        <ul className="grid gap-8 md:grid-cols-3">
          {more.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group block">
                <div className="box aspect-[4/3]">
                  <Photo src={p.cover} sizes="(min-width: 768px) 33vw, 100vw" zoom={1.6} />
                </div>
                <time className="mt-4 block text-sm text-mauve">{p.date}</time>
                <span className="mt-1 block font-display text-2xl leading-tight group-hover:text-lacquer">{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

// The slug is URL data, so it is read inside Suspense to keep navigation to this route instant.
export default function Page({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Content params={params} />
    </Suspense>
  );
}
