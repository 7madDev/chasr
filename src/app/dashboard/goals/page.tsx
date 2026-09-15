import { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Goal } from "@/generated/prisma/client";
import { DeleteGoalButton } from "./DeleteGoalButton";
import { Plus, Settings, ExternalLink, PenSquare, Eye, Users } from "lucide-react";

type GoalWithCount = Goal & { _count: { updates: number; reactions: number } };

export const metadata: Metadata = {
  title: "my goals | chasr",
};

export default async function MyGoalsPage() {
  const user = await requireAuth();

  const goals: GoalWithCount[] = await prisma.goal.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { updates: true, reactions: true } } },
  });

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-in fade-in duration-500">

      {/* clean header without distracting pills */}
      <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-100 dark:border-zinc-800/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-zinc-50">
            my goals
          </h1>
        </div>

        <Link
          href="/dashboard/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">new goal</span>
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-zinc-800 p-12 text-center flex flex-col items-center">
          <h2 className="font-semibold text-lg text-neutral-900 dark:text-zinc-100 mb-2">no goals yet</h2>
          <p className="text-sm text-neutral-500 dark:text-zinc-400 mb-6 max-w-sm">
            set a public revenue goal and start tracking your progress in the open.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C13D19] text-white text-sm font-medium hover:bg-[#a63214] transition-colors"
          >
            create first goal
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
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
                className={`group flex flex-col rounded-2xl border bg-white dark:bg-zinc-900/30 p-6 sm:p-7 transition-all ${isArchived
                    ? "border-neutral-200 dark:border-zinc-800/50 opacity-60 grayscale"
                    : "border-neutral-200 dark:border-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-700"
                  }`}
              >
                {/* header: visual weight on the title */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-xl text-neutral-900 dark:text-zinc-50 tracking-tight mb-1">
                      {goal.productName}
                    </h3>
                    <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-neutral-500 dark:text-zinc-400 mt-1">
                      <span>
                        {isHit ? "target hit" : isPastDeadline ? "deadline passed" : `${daysLeft} days left`}
                      </span>
                      <span className="opacity-40">•</span>
                      <span>{goal._count.updates} update{goal._count.updates !== 1 ? "s" : ""}</span>
                      <span className="opacity-40">•</span>
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {goal.views || 0}</span>
                      <span className="opacity-40">•</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {goal._count.reactions || 0}</span>
                    </div>
                  </div>

                  {/* subtle status badge */}
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${isHit
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : isArchived
                          ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-500"
                          : "bg-[#FFF5F2] dark:bg-[#C13D19]/10 text-[#C13D19] dark:text-[#E85D38]"
                      }`}>
                      {goal.status}
                    </span>
                  </div>
                </div>

                {/* progress bar */}
                <div className="mb-6">
                  <ProgressBar
                    start={goal.startAmount}
                    current={goal.currentAmount}
                    target={goal.targetAmount}
                    currency={goal.currency}
                    status={goal.status}
                    size="md"
                  />
                </div>

                {/* actions: hierarchy established by keeping secondary actions subtle */}
                <div className="flex items-center gap-4 pt-5 border-t border-neutral-100 dark:border-zinc-800/60 mt-auto">
                  {goal.status === "ACTIVE" && !isPastDeadline && (
                    <Link
                      href={`/dashboard/goals/${goal.slug}/edit`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-zinc-100 text-sm font-medium hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <PenSquare className="w-3.5 h-3.5" />
                      update
                    </Link>
                  )}

                  <Link
                    href={`/dashboard/goals/${goal.slug}/settings`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">settings</span>
                  </Link>

                  <Link
                    href={`/goals/${goal.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-[#C13D19] dark:hover:text-[#E85D38] transition-colors"
                  >
                    <span className="hidden sm:inline">view</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
                    <DeleteGoalButton slug={goal.slug} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}