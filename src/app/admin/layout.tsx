import type { Metadata } from "next";
import { Shell } from "@/components/admin/Shell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | X-ON Admin" },
  robots: { index: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <Shell>{children}</Shell>;
}
