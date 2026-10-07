import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductView } from "@/components/ProductView";
import { PRODUCTS } from "@/lib/data";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  return { title: p?.name ?? "Product", description: p?.description };
}

async function Content({ params }: Pick<PageProps<"/product/[slug]">, "params">) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}

// The slug is URL data, so it is read inside Suspense to keep navigation to this route instant.
export default function Page({ params }: PageProps<"/product/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Content params={params} />
    </Suspense>
  );
}
