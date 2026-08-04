import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { GoalStatus } from "@/generated/prisma/enums";

interface GoalCardProps {
  slug: string;
  productName: string;
  founderName: string;
  startAmount: number;
  currentAmount: number;
  targetAmount: number;
  currency: string;
  status: GoalStatus;
  deadline: Date;
}

export function GoalCard({
  slug,
  productName,
  founderName,
  startAmount,
  currentAmount,
  targetAmount,
  currency,
  status,
  deadline,
}: GoalCardProps) {
  const isHit = status === "HIT";
  const isArchived = status === "ARCHIVED";
  const isPastDeadline = new Date() > new Date(deadline) && !isHit;

  return (
    <Link
      href={`/goals/${slug}`}
      className={`block rounded-lg border bg-card p-4 hover:border-primary/40 transition-all group ${
        isArchived ? "opacity-60 border-border" : "border-border hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
            {productName}
          </h3>
          <p className="text-xs text-muted-foreground/70 mt-0.5">{founderName}</p>
        </div>
        <div className="flex-shrink-0 ml-3">
          {isHit && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              🎉 Hit
            </span>
          )}
          {isPastDeadline && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-50 text-stone-600 border border-stone-200">
              Past deadline
            </span>
          )}
          {isArchived && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-50 text-stone-500 border border-stone-200">
              Archived
            </span>
          )}
        </div>
      </div>
      <ProgressBar
        start={startAmount}
        current={currentAmount}
        target={targetAmount}
        currency={currency}
        status={status}
        size="sm"
      />
      <div className="flex items-baseline justify-between mt-2">
        <span className="font-mono text-xs text-muted-foreground/70 tabular-nums">
          {Math.round(
            Math.min(
              Math.max(
                ((currentAmount - startAmount) / (targetAmount - startAmount)) * 100,
                0
              ),
              100
            )
          )}
          %
        </span>
        <span className="font-mono text-xs text-muted-foreground/70 tabular-nums">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(currentAmount)}{" "}
          /{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(targetAmount)}
        </span>
      </div>
    </Link>
  );
}
