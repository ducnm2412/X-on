import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/Bits";
import { ShopBrowser } from "@/components/ShopBrowser";
import { COLLECTIONS } from "@/lib/data";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = COLLECTIONS.find((x) => x.slug === slug);
  return { title: c?.title ?? "Collection", description: c?.blurb };
}

// Product type, shape and design theme pages all reuse the Shop template with a different filter context.
async function Content({ params }: Pick<PageProps<"/collections/[slug]">, "params">) {
  const { slug } = await params;
  const c = COLLECTIONS.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <div className="deco deco-leaf bg-blush">
        <div className="wrap py-10 md:py-14">
          <Crumbs items={[["Shop", "/shop"], [c.title]]} />
          <h1 className="d1 !text-[clamp(2.6rem,6.4vw,5rem)] mt-4">{c.title}</h1>
          <p className="lede mt-4 text-wine/80">{c.blurb}</p>
        </div>
      </div>
      <ShopBrowser key={c.slug} context={c.filter} />
    </>
  );
}

// The slug is URL data, so it is read inside Suspense to keep navigation to this route instant.
export default function Page({ params }: PageProps<"/collections/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Content params={params} />
    </Suspense>
  );
}
