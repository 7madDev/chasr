"use client";

import { GoalStatus } from "@/generated/prisma/enums";
import { formatAmount } from "@/lib/format";

interface ProgressBarProps {
  start: number;
  current: number;
  target: number;
  currency: string;
  status: GoalStatus;
  size?: "sm" | "md" | "lg";
}

// formatCurrency removed in favor of formatAmount

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

  const heightClass = size === "sm" ? "h-2" : size === "lg" ? "h-6" : "h-4";
  const isHit = status === "HIT" || clampedProgress >= 100;

  return (
    <div className="w-full group">
      {size !== "sm" && (
        <div className="flex items-baseline justify-between mb-3">
          <span className="font-mono text-2xl font-black tracking-tighter text-neutral-900 dark:text-zinc-50 tabular-nums">
            {formatAmount(current, currency)}
          </span>
          <span className="font-mono text-sm font-bold text-neutral-400 dark:text-zinc-500 tabular-nums">
            / {formatAmount(target, currency)}
          </span>
        </div>
      )}

      <div className={`relative w-full ${heightClass} bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner`}>
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${isHit
              ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
              : "bg-gradient-to-r from-[#C13D19] to-[#E85D38] shadow-[0_0_15px_rgba(193,61,25,0.4)]"
            }`}
          style={{ width: `${Math.max(clampedProgress, 2)}%` }}
        />
      </div>

      {size !== "sm" && (
        <div className="flex justify-end mt-2">
          <span className={`font-mono text-xs font-bold tabular-nums transition-colors ${isHit ? 'text-green-500' : 'text-[#C13D19]'}`}>
            {Math.round(clampedProgress)}% complete
          </span>
        </div>
      )}
    </div>
  );
}