"use client";

import { useState } from "react";

interface ReactionButtonProps {
  slug: string;
  initialCount: number;
  className?: string;
  children?: React.ReactNode;
}

export function ReactionButton({ slug, initialCount, className, children }: ReactionButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [reacted, setReacted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReact() {
    if (reacted || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/goals/${slug}/react`, { method: "POST" });
      const data = await res.json();
      setCount(data.count);
      setReacted(data.alreadyReacted || true);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleReact}
      disabled={reacted || loading}
      className={className || `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
        reacted
          ? "bg-primary/10 border-primary/30 text-primary cursor-default"
          : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:bg-primary/10 cursor-pointer"
      }`}
      title="Cheer them on!"
    >
      {children || (
        <>
          <span className="text-base">🔥</span>
          <span className="font-mono tabular-nums">{count}</span>
        </>
      )}
    </button>
  );
}
