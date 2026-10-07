import type { Metadata } from "next";
import { Shell } from "@/components/admin/Shell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | X-ON Admin" },
  robots: { index: false },
};

// The admin sits behind the log in check, which only runs in the browser, so its pages are
// deliberately not rendered until the visitor is known to be signed in. That means there is
// nothing for instant-navigation validation to inspect here; opt this section out.
export const instant = false;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <Shell>{children}</Shell>;
}
