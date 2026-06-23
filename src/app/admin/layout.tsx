import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { env } from "@/lib/env";
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
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
      const res = await fetch(`${env.appwrite.endpoint}/account`, {
        headers: {
          "X-Appwrite-Project": env.appwrite.projectId,
          Cookie: cookieHeader,
        },
        cache: "no-store",
      });
      if (!res.ok) {
        redirect("/admin/login");
      }
    } catch {
      redirect("/admin/login");
    }
  }

  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
