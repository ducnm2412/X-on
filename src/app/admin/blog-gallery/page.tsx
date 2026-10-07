import type { Metadata } from "next";
import { BlogGalleryAdmin } from "@/components/admin/BlogGalleryAdmin";

export const metadata: Metadata = { title: "Blog & Gallery" };

export default function Page() {
  return <BlogGalleryAdmin />;
}
