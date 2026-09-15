import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Trophy, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Leaderboard | Chasr",
  description: "The Unstoppable Leaderboard",
};

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { sort = "closest" } = await searchParams;

  const activeGoalsCount = await prisma.goal.count({
    where: { status: "ACTIVE" },
  });

  const recentGoals = await prisma.goal.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      owner: {
        select: { avatarUrl: true, id: true },
      }
    }
  });

  // Unique avatars for the stack
  const stackAvatars = Array.from(new Set(recentGoals.map(g => g.owner.avatarUrl || "/avatar.svg"))).slice(0, 3);

  // Fetch users with their active and hit goals
  const rawUsers = await prisma.user.findMany({
    include: {
      goals: {
        where: { status: { in: ["ACTIVE", "HIT"] } },
      }
    }
  });

  // Calculate aggregated stats for each user
  const usersWithStats = rawUsers
    .filter(u => u.goals.length > 0)
    .map(user => {
      const hitGoals = user.goals.filter(g => g.status === "HIT");
      const activeGoals = user.goals.filter(g => g.status === "ACTIVE");

      let totalProgress = 0;
      activeGoals.forEach(g => {
        const range = g.targetAmount - g.startAmount;
        const current = g.currentAmount - g.startAmount;
        const p = range > 0 ? Math.max(0, Math.min(100, (current / range) * 100)) : 0;
        totalProgress += p;
      });

      const avgProgress = activeGoals.length > 0 ? totalProgress / activeGoals.length : (hitGoals.length > 0 ? 100 : 0);

      // Score: heavily weight achieved goals, then use total active progress as the tie-breaker
      const score = (hitGoals.length * 10000) + totalProgress;

      const mostRecentUpdated = [...user.goals].sort((a, b) => b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime())[0];
      const newestCreated = [...user.goals].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

      // For display purposes, pick the most relevant goal to show as their "current focus"
      // Prefer the active goal with the highest progress, or just the most recently updated one
      const displayGoal = activeGoals.sort((a, b) => b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime())[0] || mostRecentUpdated;

      return {
        ...user,
        hitCount: hitGoals.length,
        avgProgress,
        score,
        mostRecentUpdated,
        newestCreated,
        displayGoal
      };
    });

  if (sort === "closest") {
    usersWithStats.sort((a, b) => b.score - a.score);
  } else if (sort === "newest") {
    usersWithStats.sort((a, b) => b.newestCreated.createdAt.getTime() - a.newestCreated.createdAt.getTime());
  } else if (sort === "updated") {
    usersWithStats.sort((a, b) => b.mostRecentUpdated.lastUpdatedAt.getTime() - a.mostRecentUpdated.lastUpdatedAt.getTime());
  }

  const displayUsers = usersWithStats;

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-zinc-50 pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-24">

        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
            The Unstoppable<br />Leaderboard
          </h1>
          <div className="flex items-center justify-center gap-3 text-sm font-semibold text-neutral-500 dark:text-zinc-400">
            <div className="flex -space-x-2">
              {stackAvatars.map((url, i) => (
                <img key={i} src={url} alt="Creator" className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0a0a0a] bg-neutral-200 dark:bg-zinc-800 object-cover" style={{ zIndex: 3 - i }} />
              ))}
            </div>
            {activeGoalsCount.toLocaleString()} Active Goals This Week
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          {(['closest', 'newest', 'updated'] as const).map((tab) => {
            const labels = {
              closest: "Closest to Goal",
              newest: "Newest",
              updated: "Recently Updated"
            };
            const isSelected = sort === tab;
            return (
              <Link
                key={tab}
                href={`/leaderboard?sort=${tab}`}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${isSelected
                  ? "bg-[#C13D19] dark:bg-[#E85D38] text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
              >
                {labels[tab]}
              </Link>
            );
          })}
        </div>

        {/* List */}
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {displayUsers.map((user, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const avatarUrl = user.avatarUrl || "/avatar.svg";
            const isFire = user.avgProgress >= 80 || user.hitCount > 0;

            return (
              <Link
                key={user.id}
                href={`/goals/${user.displayGoal.slug}`}
                className="group flex items-center gap-4 sm:gap-6 py-6 border-b border-neutral-200 dark:border-zinc-800/50 hover:bg-neutral-100/50 dark:hover:bg-zinc-800/20 transition-colors px-4 -mx-4 rounded-2xl"
              >
                {/* Rank */}
                <div className={`w-8 font-black text-xl sm:text-2xl text-right ${isTop3 ? 'text-[#C13D19] dark:text-[#E85D38]' : 'text-neutral-300 dark:text-zinc-700'}`}>
                  #{rank}
                </div>

                {/* Avatar & Info */}
                <div className="flex-1 flex items-center gap-4 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img src={avatarUrl} alt={user.founderName} className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-zinc-800 object-cover" />
                    {rank === 1 && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#C13D19] dark:bg-[#E85D38] rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white dark:border-zinc-950">
                        <Trophy className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 dark:text-white truncate">
                        {user.founderName}
                      </span>
                      {isFire && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex-shrink-0">
                          <Flame className="w-2.5 h-2.5" /> on fire
                        </span>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 truncate mt-0.5">
                      {user.hitCount > 0 && <span className="font-semibold text-[#C13D19] dark:text-[#E85D38]">{user.hitCount} Achieved • </span>}
                      {user.displayGoal.status === 'HIT' ? 'All goals completed! 🏆' : user.displayGoal.why}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0 w-20 sm:w-24">
                  <span className={`font-bold text-sm sm:text-base ${isTop3 ? 'text-[#C13D19] dark:text-[#E85D38]' : 'text-neutral-500 dark:text-zinc-400'}`}>
                    {Math.round(user.avgProgress)}%
                  </span>
                  <div className="w-full h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${isTop3 ? 'bg-[#C13D19] dark:bg-[#E85D38]' : 'bg-neutral-400 dark:bg-zinc-500'}`}
                      style={{ width: `${user.avgProgress}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
