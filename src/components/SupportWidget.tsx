"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export interface Supporter {
  id: string;
  avatarUrl: string;
}

interface SupportWidgetProps {
  slug: string;
  initialCount: number;
  initialSupporters: Supporter[];
  initialReacted?: boolean;
  isLoggedIn: boolean;
  isPastDeadline?: boolean;
}

export function SupportWidget({ slug, initialCount, initialSupporters, initialReacted = false, isLoggedIn, isPastDeadline = false }: SupportWidgetProps) {
  const [count, setCount] = useState(initialCount);
  const [supporters, setSupporters] = useState<Supporter[]>(initialSupporters);
  const [reacted, setReacted] = useState(initialReacted);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [justSupported, setJustSupported] = useState(false);

  async function handleReact() {
    if (!isLoggedIn) {
      window.location.href = `/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    if (loading) return;
    setLoading(true);

    const isUnsupporting = reacted;

    // Optimistic UI update
    if (isUnsupporting) {
      setReacted(false);
      setCount(prev => Math.max(0, prev - 1));
      setJustSupported(false);
      // Try to remove their avatar optimistically if they are in the list.
      // But we don't know their fingerprint exactly on the client without passing it,
      // so it's safer to just rely on the server response to fix the avatars list,
      // or we can leave it as is until the API responds.
    } else {
      setReacted(true);
      setCount(prev => prev + 1);
      setJustSupported(true);
      setTimeout(() => setJustSupported(false), 1500);
    }

    try {
      const res = await fetch(`/api/goals/${slug}/react`, { method: "POST" });
      const data = await res.json();

      setCount(data.count);
      setReacted(data.alreadyReacted);

      if (data.alreadyReacted && data.supporter && !supporters.find(s => s.id === data.supporter.id)) {
        setSupporters(prev => [data.supporter, ...prev].slice(0, 4));
      } else if (!data.alreadyReacted && data.supporter) {
        setSupporters(prev => prev.filter(s => s.id !== data.supporter.id));
      }
    } catch {
      // Revert optimistic update on failure
      setReacted(isUnsupporting);
      setCount(prev => isUnsupporting ? prev + 1 : Math.max(0, prev - 1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xs mb-24 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both delay-500 relative">
      <style>{`
        @keyframes floatUpAndFade {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          15% { opacity: 1; transform: translate(-50%, 0px); }
          100% { opacity: 0; transform: translate(-50%, -40px); }
        }
        .animate-float-reaction {
          animation: floatUpAndFade 1.2s ease-out forwards;
        }
      `}</style>

      {justSupported && (
        <div className="absolute top-0 left-1/2 pointer-events-none animate-float-reaction flex items-center gap-1.5 z-20">
          <span className="text-[#C13D19] dark:text-[#E85D38] font-black text-sm drop-shadow-sm">+1</span>
          <span className="text-sm drop-shadow-sm">🎉</span>
        </div>
      )}

      {!isPastDeadline && (
        <button
          onClick={handleReact}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          disabled={loading}
          className={`w-full h-12 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex justify-center items-center shadow-lg ${reacted
              ? hover
                ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-none hover:bg-red-500/20"
                : "bg-neutral-200 dark:bg-zinc-800 text-neutral-500 dark:text-zinc-400 shadow-none hover:bg-neutral-300 dark:hover:bg-zinc-700"
              : "bg-neutral-900 dark:bg-white text-white dark:text-zinc-950 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl dark:shadow-white/10 cursor-pointer"
            }`}
        >
          {reacted ? (
            hover ? (
              "unsupport"
            ) : (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> supported 🎉
              </span>
            )
          ) : (
            "support the build"
          )}
        </button>
      )}

      <div className="mt-5 flex flex-col items-center">
        {supporters.length > 0 && (
          <div className="flex -space-x-2 mb-3">
            {supporters.map((supporter, i) => (
              <img
                key={supporter.id}
                src={supporter.avatarUrl}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-neutral-100 dark:bg-zinc-800 transition-transform hover:scale-110 animate-in zoom-in-50 fade-in duration-500 object-cover"
                alt="supporter"
                style={{ zIndex: 10 - i }}
              />
            ))}
          </div>
        )}
        <p className="text-[10px] text-neutral-500 dark:text-zinc-400 font-medium text-center leading-relaxed">
          <span className="font-bold text-neutral-900 dark:text-white tabular-nums">{count.toLocaleString()} {count === 1 ? 'person is' : 'others are'}</span> cheering.<br />
          every cheer adds momentum.
        </p>
      </div>
    </div>
  );
}
