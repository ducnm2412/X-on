import type { Metadata } from "next";
import { UsersAdmin } from "@/components/admin/UsersAdmin";

export const metadata: Metadata = { title: "Users, Wholesale, Inquiries" };

export default function Page() {
  return <UsersAdmin />;
}
