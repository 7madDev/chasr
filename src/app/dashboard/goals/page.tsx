import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Goal } from "@/generated/prisma/client";

type GoalWithCount = Goal & { _count: { updates: number; reactions: number } };

export const metadata: Metadata = {
  title: "My Goals",
};

export default async function MyGoalsPage() {
  const user = await requireAuth();

  const goals: GoalWithCount[] = await prisma.goal.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { updates: true, reactions: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Goals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and update your public revenue goals.
          </p>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <div className="text-4xl mb-4">🏁</div>
          <h2 className="font-bold text-lg mb-1">Start your journey</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Set a public revenue goal and hold yourself accountable. Your progress will be visible to the community.
          </p>
          <Link href="/dashboard/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-sm">
            Create your first goal →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const isHit = goal.status === "HIT";
            const isArchived = goal.status === "ARCHIVED";
            const isPastDeadline = new Date() > new Date(goal.deadline) && !isHit;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - Date.now()) / 86400000
            );

            return (
              <div
                key={goal.id}
                className={`rounded-xl border bg-card p-5 transition-all ${
                  isArchived ? "border-border opacity-60" : "border-border hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{goal.productName}</h3>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">
                      {isHit
                        ? "🎉 Goal hit!"
                        : isArchived
                          ? "Archived"
                          : isPastDeadline
                            ? "Deadline passed"
                            : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {isHit && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                        ✓ Hit
                      </span>
                    )}
                    {isArchived && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-50 text-stone-500 border border-stone-200">
                        Archived
                      </span>
                    )}
                    {goal.status === "ACTIVE" && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <ProgressBar
                  start={goal.startAmount}
                  current={goal.currentAmount}
                  target={goal.targetAmount}
                  currency={goal.currency}
                  status={goal.status}
                />

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                  {goal.status === "ACTIVE" && (
                    <Link
                      href={`/dashboard/goals/${goal.slug}/edit`}
                      className="text-xs font-medium text-primary hover:text-primary transition-colors"
                    >
                      Update progress →
                    </Link>
                  )}
                  <Link
                    href={`/goals/${goal.slug}`}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View public page ↗
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
