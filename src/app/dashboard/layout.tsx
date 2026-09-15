import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  const userName =
    dbUser?.founderName ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Founder";

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar userName={userName} avatarUrl={dbUser?.avatarUrl || null} />
      <main className="flex-1 md:ml-72 min-h-screen pt-16 md:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10">{children}</div>
      </main>
    </div>
  );
}
