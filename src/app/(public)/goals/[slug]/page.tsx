import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Confetti } from "@/components/ui/Confetti";
import { ReactionButton } from "@/components/ReactionButton";
import { ShareButton } from "@/components/ShareButton";
import { EmbedSnippet } from "@/components/EmbedSnippet";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://open.announcify.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const goal = await prisma.goal.findUnique({ where: { slug } });
  if (!goal) return { title: "Goal not found" };

  const progress = Math.round(
    Math.min(
      Math.max(((goal.currentAmount - goal.startAmount) / (goal.targetAmount - goal.startAmount)) * 100, 0),
      100
    )
  );

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: goal.currency,
    minimumFractionDigits: 0,
  });

  return {
    title: `${goal.productName} — ${progress}% to ${currency.format(goal.targetAmount)}`,
    description: `${goal.founderName} is publicly chasing ${currency.format(goal.targetAmount)} for ${goal.productName}. ${goal.why}`,
    openGraph: {
      title: `${goal.productName} — ${progress}% to ${currency.format(goal.targetAmount)}`,
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
  });
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
    },
  });

  if (!goal) notFound();

  // Increment view count
  await prisma.goal.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });

  const user = await getSession();
  const isOwner = user?.id === goal.ownerId;
  const isHit = goal.status === "HIT";
  const isArchived = goal.status === "ARCHIVED";
  const isPastDeadline = new Date() > new Date(goal.deadline) && !isHit;
  const daysLeft = Math.ceil(
    (new Date(goal.deadline).getTime() - Date.now()) / 86400000
  );

  const goalUrl = `${APP_URL}/goals/${slug}`;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: goal.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <>
      {isHit && <Confetti />}
      <div className={`max-w-xl mx-auto px-4 py-12 ${isArchived ? "opacity-70" : ""}`}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold">
                {goal.productUrl ? (
                  <a
                    href={goal.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {goal.productName} ↗
                  </a>
                ) : (
                  goal.productName
                )}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                by{" "}
                {goal.founderLink ? (
                  <a
                    href={goal.founderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary transition-colors"
                  >
                    {goal.founderName}
                  </a>
                ) : (
                  goal.founderName
                )}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3 italic">
            &ldquo;{goal.why}&rdquo;
          </p>
        </div>

        {/* Progress */}
        <div className="rounded-xl border border-border bg-card p-5 mb-4">
          <ProgressBar
            start={goal.startAmount}
            current={goal.currentAmount}
            target={goal.targetAmount}
            currency={goal.currency}
            status={goal.status}
            size="lg"
          />

          <div className="mt-3 text-sm">
            {isHit ? (
              <p className="text-green-700 font-medium">
                🎉 Goal hit on {formatDate(goal.lastUpdatedAt)}
              </p>
            ) : isPastDeadline ? (
              <p className="text-muted-foreground/70">
                Deadline passed — still chasing it
              </p>
            ) : (
              <p className="text-muted-foreground">
                <span className="font-mono tabular-nums font-medium">{daysLeft}</span>{" "}
                day{daysLeft !== 1 ? "s" : ""} remaining
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {isOwner && goal.status === "ACTIVE" ? (
            <Link
              href={`/dashboard/goals/${slug}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/100 text-white hover:bg-primary transition-colors"
            >
              Update progress →
            </Link>
          ) : (
            <ReactionButton slug={slug} initialCount={goal._count.reactions} />
          )}
          <ShareButton url={goalUrl} productName={goal.productName} />
          <EmbedSnippet slug={slug} />
        </div>

        {/* Update log */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            Update log
          </h2>
          {goal.updates.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground/70">
                No updates yet{isOwner ? " — go make some money" : ""} 💸
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {goal.updates.map((update) => (
                <div
                  key={update.id}
                  className="rounded-lg border border-border bg-card px-4 py-3 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-mono font-medium tabular-nums">
                      {currencyFormatter.format(update.amount)}
                    </p>
                    {update.note && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {update.note}
                      </p>
                    )}
                  </div>
                  <time className="text-xs text-muted-foreground/70 whitespace-nowrap flex-shrink-0">
                    {formatDate(update.createdAt)}
                  </time>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
