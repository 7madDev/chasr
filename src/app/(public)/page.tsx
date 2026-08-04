import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GoalCard } from "@/components/GoalCard";
import { GoalStatus, Prisma } from "@/generated/prisma/client";

type SortTab = "closest" | "newest" | "updated" | "past";

const TAB_CONFIG: Record<SortTab, { label: string; where: Prisma.GoalWhereInput; orderBy: Prisma.GoalOrderByWithRelationInput }> = {
  closest: {
    label: "Closest to goal",
    where: { status: { in: ["ACTIVE", "HIT"] } },
    orderBy: { currentAmount: "desc" }, // We'll sort by % in-memory since Prisma can't do computed sorts easily
  },
  newest: {
    label: "Newest",
    where: { status: { in: ["ACTIVE", "HIT"] } },
    orderBy: { createdAt: "desc" },
  },
  updated: {
    label: "Recently updated",
    where: { status: { in: ["ACTIVE", "HIT"] } },
    orderBy: { lastUpdatedAt: "desc" },
  },
  past: {
    label: "Past goals",
    where: { status: "ARCHIVED" as GoalStatus },
    orderBy: { lastUpdatedAt: "desc" },
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const tab = (resolvedParams.tab as SortTab) || "closest";
  const page = Math.max(1, parseInt(resolvedParams.page || "1", 10));
  const perPage = 20;

  const config = TAB_CONFIG[tab] || TAB_CONFIG.closest;

  const [goals, total] = await Promise.all([
    prisma.goal.findMany({
      where: config.where,
      orderBy: config.orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.goal.count({ where: config.where }),
  ]);

  // For "closest" tab, sort by % progress descending in-memory
  const sortedGoals =
    tab === "closest"
      ? [...goals].sort((a, b) => {
          const pctA =
            a.targetAmount - a.startAmount > 0
              ? (a.currentAmount - a.startAmount) / (a.targetAmount - a.startAmount)
              : 0;
          const pctB =
            b.targetAmount - b.startAmount > 0
              ? (b.currentAmount - b.startAmount) / (b.targetAmount - b.startAmount)
              : 0;
          return pctB - pctA;
        })
      : goals;

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
          Publicly commit to a revenue goal.
          <br />
          <span className="text-primary/100">Track it in the open.</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Set a target, share your progress, and hold yourself accountable. Free for solo founders and indie hackers.
        </p>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center text-sm font-medium bg-primary/100 text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary transition-colors"
        >
          Start your goal →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border overflow-x-auto">
        {(Object.entries(TAB_CONFIG) as [SortTab, typeof TAB_CONFIG[SortTab]][]).map(
          ([key, conf]) => (
            <Link
              key={key}
              href={`/?tab=${key}`}
              className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === key
                  ? "border-primary/100 text-primary"
                  : "border-transparent text-muted-foreground/70 hover:text-muted-foreground"
              }`}
            >
              {conf.label}
            </Link>
          )
        )}
      </div>

      {/* Goal list */}
      {sortedGoals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <div className="text-3xl mb-3">🏁</div>
          <h2 className="font-semibold mb-1">
            {tab === "past" ? "No archived goals yet" : "No goals yet"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tab === "past"
              ? "Goals that go 90 days without an update get archived here."
              : "Be the first to publicly commit to a revenue goal."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              slug={goal.slug}
              productName={goal.productName}
              founderName={goal.founderName}
              startAmount={goal.startAmount}
              currentAmount={goal.currentAmount}
              targetAmount={goal.targetAmount}
              currency={goal.currency}
              status={goal.status}
              deadline={goal.deadline}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/?tab=${tab}&page=${page - 1}`}
              className="px-3 py-1.5 rounded-md border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
            >
              ← Previous
            </Link>
          )}
          <span className="text-xs text-muted-foreground/70 px-2">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/?tab=${tab}&page=${page + 1}`}
              className="px-3 py-1.5 rounded-md border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
