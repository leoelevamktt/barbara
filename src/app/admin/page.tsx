import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = { title: "Administração", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return <AdminLogin />;
  const content = await getSiteContent();
  return <AdminDashboard initial={content} />;
}
