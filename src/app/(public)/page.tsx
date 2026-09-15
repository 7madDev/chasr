import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatAmount } from "@/lib/format";
import type { Prisma } from "@/generated/prisma/client";
import { Users, Rocket, ShoppingCart, LayoutTemplate, Megaphone, CheckCircle2, TrendingUp, Notebook, Zap, Eye, Info } from "lucide-react";

type SortTab = "closest" | "newest" | "updated";

const TAB_CONFIG: Record<SortTab, { label: string; where: Prisma.GoalWhereInput; orderBy?: Prisma.GoalOrderByWithRelationInput }> = {
  closest: {
    label: "Closest",
    where: { status: "ACTIVE" },
  },
  newest: {
    label: "Newest",
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  },
  updated: {
    label: "Recently Updated",
    where: { status: "ACTIVE" },
    orderBy: { lastUpdatedAt: "desc" },
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; code?: string }>;
}) {
  const resolvedParams = await searchParams;

  if (resolvedParams.code) {
    redirect(`/auth/callback?code=${resolvedParams.code}`);
  }
  const tab = (resolvedParams.tab as SortTab) || "closest";
  const config = TAB_CONFIG[tab] || TAB_CONFIG.closest;

  // We only fetch 6 goals for the grid
  const rawGoals = await prisma.goal.findMany({
    where: config.where,
    orderBy: config.orderBy,
    include: { owner: true, _count: { select: { reactions: true } } },
  });

  const goalsWithProgress = rawGoals.map((goal) => {
    const progress = Math.min(
      Math.max(((goal.currentAmount - goal.startAmount) / (goal.targetAmount - goal.startAmount)) * 100, 0),
      100
    );
    return { ...goal, progress };
  });

  if (tab === "closest") {
    goalsWithProgress.sort((a, b) => b.progress - a.progress);
  }

  const displayGoals = goalsWithProgress.slice(0, 6);

  // Helper for random icons based on goal ID for visual flair
  const icons = [Rocket, ShoppingCart, LayoutTemplate, Megaphone, TrendingUp, Notebook, Zap];

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0a0a0a] text-neutral-900 dark:text-zinc-50 overflow-hidden relative">

      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[800px] bg-gradient-to-b from-[#C13D19]/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      <main className="max-w-6xl mx-auto px-4 py-20 sm:py-32">

        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-zinc-400 mb-8">
            <Users className="w-3.5 h-3.5 text-[#C13D19]" />
            Join 2,400+ Unstoppable Founders
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-6 text-neutral-900 dark:text-white leading-[1.1]">
            Chase your goal.{" "}
            <span className="italic text-[#C13D19] pr-4">Publicly.</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-500 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The accountability engine for solo founders. Turn your private struggles into public momentum and build in the open.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/new"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C13D19] text-white font-bold tracking-wide hover:bg-[#a63214] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#C13D19]/20 flex items-center justify-center"
            >
              Start Your Journey
            </Link>
            <Link
              href="/leaderboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 dark:bg-zinc-100 text-white dark:text-neutral-900 font-bold tracking-wide hover:opacity-90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              View Active Goal Cards
            </Link>
          </div>
        </section>

        {/* LIVE LEADERBOARD SECTION */}
        <section className="mb-32 animate-in fade-in duration-1000 delay-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white mb-2">Live Leaderboard</h2>
              <p className="text-sm text-neutral-500 dark:text-zinc-400">Founder performance and accountability streaks.</p>
            </div>

            <div className="flex bg-neutral-100 dark:bg-zinc-900 p-1.5 rounded-full self-start md:self-auto border border-neutral-200 dark:border-zinc-800">
              {(['closest', 'newest', 'updated'] as SortTab[]).map((t) => {
                const isActive = tab === t;
                return (
                  <Link
                    key={t}
                    href={`/?tab=${t}`}
                    className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isActive
                        ? "bg-white dark:bg-zinc-800 text-[#C13D19] shadow-sm"
                        : "text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      }`}
                  >
                    {TAB_CONFIG[t].label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGoals.map((goal, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Link
                  key={goal.id}
                  href={`/goals/${goal.slug}`}
                  className="group relative bg-white dark:bg-zinc-900/50 rounded-3xl p-6 border border-neutral-100 dark:border-zinc-800 hover:border-neutral-200 dark:hover:border-zinc-700 transition-all hover:shadow-xl hover:shadow-neutral-200/50 dark:hover:shadow-none hover:-translate-y-1 flex flex-col h-full overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-zinc-800 flex items-center justify-center border border-neutral-100 dark:border-zinc-700">
                      <Icon className="w-5 h-5 text-neutral-700 dark:text-zinc-300 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 text-[10px] font-bold text-green-700 dark:text-green-400">
                      <Eye className="w-3 h-3" />
                      {goal._count.reactions} Spectators
                    </div>
                  </div>

                  <div className="mb-8 flex-grow">
                    <h3 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white mb-2">{goal.productName}</h3>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 dark:text-zinc-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      @{goal.owner.founderName.toLowerCase().replace(/\s+/g, '_')}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-end justify-between mb-3">
                      <div className="text-xs font-medium text-neutral-500 dark:text-zinc-400">
                        Target: {formatAmount(goal.targetAmount, goal.currency)}
                      </div>
                      <div className="text-2xl font-black text-[#C13D19] leading-none flex flex-col items-end">
                        {Math.round(goal.progress)}
                        <span className="text-[10px] uppercase tracking-widest">%</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C13D19] to-[#E85D38] rounded-full transition-all duration-1000"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* YOUR GOAL HERE SECTION */}
        <section className="mb-32">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-red-50/50 dark:bg-[#C13D19]/5 border-2 border-dashed border-red-200 dark:border-[#C13D19]/20 p-12 md:p-20 text-center flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-900 dark:text-white mb-4">Your Goal Here?</h2>
            <p className="text-neutral-500 dark:text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              The leaderboard is updated in real-time. Connect your Stripe, Twitter, or GitHub to automate your progress updates.
            </p>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-neutral-900 dark:bg-zinc-100 text-white dark:text-neutral-900 font-bold tracking-wide hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Info className="w-5 h-5" />
              Create Your Public Goal
            </Link>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-neutral-900 dark:text-white mb-6 leading-[1.15]">
              Publicity is the <br />
              <span className="underline decoration-[#C13D19] decoration-4 underline-offset-8">Ultimate Fuel.</span>
            </h2>
            <p className="text-lg text-neutral-500 dark:text-zinc-400 mb-10 leading-relaxed max-w-md">
              Solo founding is lonely. Chasr connects you with a community that watches your progress, celebrates your wins, and keeps you honest during the slumps.
            </p>
            <ul className="space-y-6">
              {[
                "Verified Revenue Hooks",
                "Spectator Engagement Loops",
                "Daily Accountability Pings"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-900 dark:text-zinc-100 font-bold tracking-wide text-sm">
                  <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-[#C13D19]/10 flex items-center justify-center text-[#C13D19] shadow-sm border border-red-100 dark:border-[#C13D19]/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:-translate-y-2">
              <img
                src="/founder_night_work.jpg"
                alt="Founder working at night"
                className="w-full h-auto object-cover aspect-square sm:aspect-[4/3] lg:aspect-square"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-5 flex items-center gap-4 shadow-2xl">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Marcus" className="w-12 h-12 rounded-full bg-white border border-white/30" />
                  <div>
                    <p className="text-white font-black text-sm tracking-wide">"Publicity forced me to ship."</p>
                    <p className="text-white/80 text-xs mt-1 font-medium">Marcus K, Founder of SaaS Flow</p>
                  </div>
                </div>
              </div> */}
            </div>
            {/* Decorative blurs */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#C13D19] rounded-full blur-[120px] opacity-20 -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-500 rounded-full blur-[120px] opacity-20 -z-10" />
          </div>
        </section>

      </main>
    </div>
  );
}
