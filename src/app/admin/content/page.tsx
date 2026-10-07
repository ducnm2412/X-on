import type { Metadata } from "next";
import { ContentAdmin } from "@/components/admin/ContentAdmin";

export const metadata: Metadata = { title: "Website Content" };

export default function Page() {
  return <ContentAdmin />;
}
