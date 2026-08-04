import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Goal } from "@/generated/prisma/client";

type GoalWithCount = Goal & { _count: { updates: number } };

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await requireAuth();

  const goals: GoalWithCount[] = await prisma.goal.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { updates: true } } },
  });

  const activeGoals = goals.filter((g) => g.status === "ACTIVE");
  const completedGoals = goals.filter((g) => g.status === "HIT");
  const totalUpdates = goals.reduce((sum, g) => sum + g._count.updates, 0);

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your public revenue goals.
          </p>
        </div>
        {goals.length > 0 && (
          <Link
            href="/dashboard/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm w-full sm:w-auto active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Goal
          </Link>
        )}
      </div>

      {/* stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Revenue Chased</p>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-primary">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: goals.length > 0 ? goals[0].currency : "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0))}
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Active Goals</p>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-foreground">{activeGoals.length}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Completed</p>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-green-600 dark:text-green-500">{completedGoals.length}</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Page Views</p>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-foreground">
            {goals.reduce((sum, g) => sum + (g.views || 0), 0)}
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Total Updates</p>
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-foreground">
            {totalUpdates}
          </p>
        </div>
      </div>

      {/* goals list / empty state */}
      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 sm:p-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
            <span className="text-3xl">🎯</span>
          </div>
          <h2 className="font-bold text-xl mb-2 text-foreground">No goals yet</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            Time to put a number on it. Create your first public revenue goal and start tracking your progress in the open.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            Create your first goal →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const isHit = goal.status === "HIT";
            const isPastDeadline = new Date() > new Date(goal.deadline) && !isHit;
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000);

            return (
              <div
                key={goal.id}
                className="group rounded-xl border border-border/60 bg-card p-6 shadow-sm hover:border-primary/20 hover:shadow-md transition-all flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground tracking-tight">{goal.productName}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-medium text-muted-foreground">
                        {goal._count.updates} update{goal._count.updates !== 1 ? "s" : ""}
                      </span>
                      <span className="text-muted-foreground/30 text-xs">•</span>
                      <span className={`text-xs font-medium ${isHit ? "text-green-600" : isPastDeadline ? "text-destructive" : "text-muted-foreground"}`}>
                        {isHit
                          ? "🎉 target hit"
                          : isPastDeadline
                            ? "deadline passed"
                            : `${daysLeft} days left`}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    {isHit && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
                        Hit
                      </span>
                    )}
                    {goal.status === "ARCHIVED" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground border border-border">
                        Archived
                      </span>
                    )}
                    {goal.status === "ACTIVE" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6 flex-grow">
                  <ProgressBar
                    start={goal.startAmount}
                    current={goal.currentAmount}
                    target={goal.targetAmount}
                    currency={goal.currency}
                    status={goal.status}
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border/60 mt-auto">
                  {goal.status === "ACTIVE" && (
                    <Link
                      href={`/dashboard/goals/${goal.slug}/edit`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                    >
                      Update progress
                    </Link>
                  )}
                  <Link
                    href={`/goals/${goal.slug}`}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border/60 bg-transparent text-foreground text-xs font-semibold hover:bg-secondary transition-colors"
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