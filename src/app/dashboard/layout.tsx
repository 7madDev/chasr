import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Founder";

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar userName={userName} />
      <main className="flex-1 ml-60 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
