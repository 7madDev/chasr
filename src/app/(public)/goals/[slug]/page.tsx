import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Confetti } from "@/components/ui/Confetti";
import { SupportWidget } from "@/components/SupportWidget";
import { ShareButton } from "@/components/ShareButton";
import { EmbedSnippet } from "@/components/EmbedSnippet";
import { formatAmount } from "@/lib/format";
import { Target, TrendingUp, Calendar, Zap, Clock } from "lucide-react";
import { ViewTracker } from "@/components/ViewTracker";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://open.announcify.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const goal = await prisma.goal.findUnique({
    where: { slug },
    include: { owner: true }
  });
  if (!goal) return { title: "Goal not found" };

  const progress = Math.round(
    Math.min(
      Math.max(((goal.currentAmount - goal.startAmount) / (goal.targetAmount - goal.startAmount)) * 100, 0),
      100
    )
  );

  const formattedTarget = formatAmount(goal.targetAmount, goal.currency);

  return {
    title: `${goal.productName} — ${progress}% to ${formattedTarget}`,
    description: `${goal.owner.founderName} is publicly chasing ${formattedTarget} for ${goal.productName}. ${goal.why}`,
    openGraph: {
      title: `${goal.productName} — ${progress}% to ${formattedTarget}`,
      description: goal.why,
      url: `${APP_URL}/goals/${slug}`,
      images: [
        {
          url: `${APP_URL}/goals/${slug}/opengraph-image?t=${goal.lastUpdatedAt.getTime()}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toLowerCase();
}

export const dynamic = "force-dynamic";

export default async function GoalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const goal = await prisma.goal.findUnique({
    where: { slug },
    include: {
      updates: { orderBy: { createdAt: "desc" } },
      _count: { select: { reactions: true } },
      owner: true,
      reactions: {
        take: 4,
        orderBy: { createdAt: "desc" },
        select: { fingerprint: true },
      },
    },
  });

  if (!goal) notFound();


  const user = await getSession();
  const isOwner = user?.id === goal.ownerId;
  const isHit = goal.status === "HIT";
  const isArchived = goal.status === "ARCHIVED";
  const isPastDeadline = new Date() > new Date(goal.deadline) && !isHit;
  const daysLeft = Math.ceil(
    (new Date(goal.deadline).getTime() - Date.now()) / 86400000
  );

  let hasReacted = false;
  if (user?.id) {
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        goalId_fingerprint: {
          goalId: goal.id,
          fingerprint: user.id,
        }
      }
    });
    hasReacted = !!existingReaction;
  }

  const reactionUserIds = goal.reactions.map(r => r.fingerprint);
  const reactingUsers = await prisma.user.findMany({
    where: { id: { in: reactionUserIds } },
    select: { id: true, avatarUrl: true }
  });

  const initialSupporters = goal.reactions.map(r => {
    const reactingUser = reactingUsers.find(u => u.id === r.fingerprint);
    return {
      id: r.fingerprint,
      avatarUrl: reactingUser?.avatarUrl || "/avatar.svg"
    };
  });

  const daysElapsed = Math.max(1, (Date.now() - new Date(goal.createdAt).getTime()) / 86400000);
  const dailyPace = Math.round((goal.currentAmount - goal.startAmount) / daysElapsed);

  const range = goal.targetAmount - goal.startAmount;
  const progress = range > 0 ? ((goal.currentAmount - goal.startAmount) / range) * 100 : 0;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const goalUrl = `${APP_URL}/goals/${slug}`;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-neutral-900 dark:text-zinc-100 font-sans selection:bg-[#C13D19] selection:text-white pb-32 overflow-hidden transition-colors duration-300">
      <ViewTracker slug={slug} />
      {isHit && <Confetti />}

      <div className={`max-w-2xl mx-auto px-4 pt-16 flex flex-col items-center text-center ${isArchived ? "opacity-70 grayscale transition-all" : ""}`}>

        {/* Avatar & Header */}
        <div className="flex flex-col items-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-zinc-900 overflow-hidden mb-3 border border-neutral-200 dark:border-zinc-800 shadow-sm transition-transform hover:scale-105 hover:shadow-md">
            <img src={goal.owner.avatarUrl || "/avatar.svg"} alt={goal.owner.founderName} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col items-center gap-1">
            {goal.owner.founderLink ? (
              <a href={goal.owner.founderLink} target="_blank" rel="noopener noreferrer" className="font-bold text-base text-neutral-900 dark:text-white hover:text-[#C13D19] dark:hover:text-[#E85D38] transition-colors">
                {goal.owner.founderName}
              </a>
            ) : (
              <h2 className="font-bold text-base text-neutral-900 dark:text-white">{goal.owner.founderName}</h2>
            )}
            <Link href={goalUrl} className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-500 dark:text-zinc-400 hover:text-[#C13D19] dark:hover:text-[#E85D38] transition-colors">
              {goal.productName}
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both delay-100">
          {!isPastDeadline && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${isHit
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
              : "bg-[#FFF5F2] dark:bg-[#C13D19]/10 text-[#C13D19] dark:text-[#E85D38] border-[#FADCD5] dark:border-[#C13D19]/20"
              }`}>
              <Target className="w-3 h-3" />
              {goal.status}
            </span>
          )}
          {isPastDeadline && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 animate-pulse">
              <Clock className="w-3 h-3" />
              deadline passed
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-zinc-50 leading-[1.15] mb-8 max-w-xl text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both delay-150">
          {goal.why}
        </h1>
        <div className="flex items-center justify-center gap-6 mb-12 text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-500 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both delay-200">
          <ShareButton url={goalUrl} productName={goal.productName} className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-all hover:-translate-y-0.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            share link
          </ShareButton>
          <span className="opacity-30">•</span>
          <EmbedSnippet slug={slug} className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-all hover:-translate-y-0.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            embed badge
          </EmbedSnippet>
        </div>

        <div className="w-full max-w-xl mb-16 p-6 sm:p-8 rounded-3xl border border-neutral-100 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both delay-300">
          <div className="flex items-baseline justify-center gap-2 mb-6">
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums tracking-tighter text-neutral-900 dark:text-white">
              {formatAmount(goal.currentAmount, goal.currency)}
            </div>
            <div className="text-md sm:text-xl font-bold font-mono text-neutral-400 dark:text-zinc-600">
              / {formatAmount(goal.targetAmount, goal.currency)}
            </div>
          </div>

          <div className="relative w-full h-6 bg-neutral-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-6">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${isHit ? "bg-green-500" : "bg-gradient-to-r from-[#C13D19] to-[#E85D38]"}`}
              style={{ width: `${Math.max(clampedProgress, 2)}%` }}
            />
            {clampedProgress > 8 && (
              <div className="absolute inset-y-0 left-0 flex items-center justify-end px-3 text-[9px] font-bold text-white drop-shadow-md transition-all duration-1000" style={{ width: `${clampedProgress}%` }}>
                {progress.toFixed(1)}%
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 px-2 divide-x divide-neutral-200 dark:divide-zinc-800/50">
            <div className="flex flex-col items-center">
              <span className={`text-xl font-black font-mono ${isPastDeadline ? 'text-red-500' : 'text-neutral-900 dark:text-white'}`}>
                {isPastDeadline ? '0' : daysLeft}
              </span>
              <span className={`flex items-center gap-1 text-[9px] font-bold tracking-[0.1em] uppercase mt-1.5 ${isPastDeadline ? 'text-red-500/70 animate-pulse' : 'text-neutral-500 dark:text-zinc-400'}`}>
                <Calendar className="w-3 h-3" /> {isPastDeadline ? 'passed' : 'days left'}
              </span>
              <span className="text-[9px] text-neutral-400 dark:text-zinc-500 uppercase mt-0.5 tracking-widest">{formatDate(goal.deadline)}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-xl font-black font-mono ${dailyPace > 0 ? 'text-[#C13D19] dark:text-[#E85D38]' : 'text-neutral-900 dark:text-white'}`}>
                {dailyPace > 0 ? '+' : ''}{formatAmount(dailyPace, goal.currency)}
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold tracking-[0.1em] uppercase text-neutral-500 dark:text-zinc-400 mt-1.5">
                <Zap className="w-3 h-3" /> daily pace
              </span>
            </div>
          </div>
        </div>

        <SupportWidget
          slug={slug}
          initialCount={goal._count.reactions}
          initialSupporters={initialSupporters}
          initialReacted={hasReacted}
          isLoggedIn={!!user?.id}
          isPastDeadline={isPastDeadline}
        />

        {/* Timeline (Momentum Log) */}
        <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both delay-700 text-left">

          <div className="flex items-center gap-3 mb-10">
            <div className="h-px bg-neutral-200 dark:bg-zinc-800/60 flex-grow" />
            <p className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-[#C13D19] dark:text-[#E85D38] font-bold whitespace-nowrap">
              <TrendingUp className="w-3 h-3" /> momentum log
            </p>
            <div className="h-px bg-neutral-200 dark:bg-zinc-800/60 flex-grow" />
          </div>

          {goal.updates.length === 0 ? (
            <div className="p-6 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/30">
              <p className="text-xs font-medium text-neutral-500 dark:text-zinc-400">
                no updates logged yet{isOwner ? " — go hit your first milestone." : "."}
              </p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-10 before:absolute before:inset-y-2 before:left-[9px] before:w-px before:bg-neutral-200 dark:before:bg-zinc-800">
              {goal.updates.map((update, i) => (
                <div
                  key={update.id}
                  className="relative group"
                >
                  {/* Timeline Node */}
                  <div className={`absolute -left-[28px] top-1 w-2.5 h-2.5 rounded-full border-2 transition-colors duration-300 z-10 ${i === 0
                    ? "bg-[#C13D19] border-white dark:border-zinc-950"
                    : "bg-white dark:bg-zinc-950 border-neutral-300 dark:border-zinc-700 group-hover:border-[#C13D19]"
                    }`} />

                  {/* Timeline Content */}
                  <div className="flex flex-col">
                    <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500 mb-1.5">
                      {formatDate(update.createdAt)}
                    </div>
                    <h3 className="text-lg font-black text-neutral-900 dark:text-zinc-100 mb-2 group-hover:text-[#C13D19] dark:group-hover:text-[#E85D38] transition-colors">
                      reached {formatAmount(update.amount, goal.currency)}
                    </h3>
                    {update.note && (
                      <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-100 dark:border-zinc-800/60 inline-block">
                        <p className="text-xs text-neutral-600 dark:text-zinc-300 leading-relaxed">
                          {update.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {goal.updates.length > 0 && (
            <div className="mt-12 text-center">
              <button className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-500 hover:text-neutral-900 dark:hover:text-zinc-100 hover:-translate-y-0.5 transition-all">
                load older updates ↓
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}