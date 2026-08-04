"use client";

import { GoalStatus } from "@/generated/prisma/enums";

interface ProgressBarProps {
  start: number;
  current: number;
  target: number;
  currency: string;
  status: GoalStatus;
  size?: "sm" | "md" | "lg";
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProgressBar({
  start,
  current,
  target,
  currency,
  status,
  size = "md",
}: ProgressBarProps) {
  const range = target - start;
  const progress = range > 0 ? ((current - start) / range) * 100 : 0;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const heightClass = size === "sm" ? "h-2" : size === "lg" ? "h-5" : "h-3";
  const isHit = status === "HIT";

  return (
    <div className="w-full">
      {size !== "sm" && (
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="font-mono text-sm font-medium tabular-nums">
            {formatCurrency(current, currency)}
          </span>
          <span className="font-mono text-xs text-muted-foreground/70 tabular-nums">
            / {formatCurrency(target, currency)}
          </span>
        </div>
      )}
      <div
        className={`w-full ${heightClass} bg-secondary rounded-full overflow-hidden`}
      >
        <div
          className={`${heightClass} rounded-full progress-bar-fill transition-all duration-700 ${
            isHit
              ? "bg-gradient-to-r from-primary/60 to-green-400"
              : "bg-primary/100"
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {size !== "sm" && (
        <div className="flex justify-end mt-1">
          <span className="font-mono text-xs text-muted-foreground/70 tabular-nums">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}
