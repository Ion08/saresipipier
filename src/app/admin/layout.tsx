import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/admin-auth";
import AdminLayoutClient from "@/components/layout/admin-layout";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let pathname = "";
  try {
    pathname = (await headers()).get("x-invoke-path") || "";
  } catch {
    // headers unavailable during static generation
  }

  if (pathname && !pathname.startsWith("/admin/login")) {
    await requireAdmin();
  }

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
