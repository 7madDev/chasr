"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface SupportWidgetProps {
  slug: string;
  initialCount: number;
  initialAvatars: string[];
  initialReacted?: boolean;
  isLoggedIn: boolean;
}

export function SupportWidget({ slug, initialCount, initialAvatars, initialReacted = false, isLoggedIn }: SupportWidgetProps) {
  const [count, setCount] = useState(initialCount);
  const [avatars, setAvatars] = useState<string[]>(initialAvatars);
  const [reacted, setReacted] = useState(initialReacted);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

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
      // Try to remove their avatar optimistically if they are in the list.
      // But we don't know their fingerprint exactly on the client without passing it,
      // so it's safer to just rely on the server response to fix the avatars list,
      // or we can leave it as is until the API responds.
    } else {
      setReacted(true);
      setCount(prev => prev + 1);
    }
    
    try {
      const res = await fetch(`/api/goals/${slug}/react`, { method: "POST" });
      const data = await res.json();
      
      setCount(data.count);
      setReacted(data.alreadyReacted);
      
      if (data.alreadyReacted && data.fingerprint && !avatars.includes(data.fingerprint)) {
        setAvatars(prev => [data.fingerprint, ...prev].slice(0, 4));
      } else if (!data.alreadyReacted && data.fingerprint) {
        setAvatars(prev => prev.filter(f => f !== data.fingerprint));
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
    <div className="w-full max-w-xs mb-24 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both delay-500">
      <button
        onClick={handleReact}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        disabled={loading}
        className={`w-full h-12 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex justify-center items-center shadow-lg ${
          reacted
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

      <div className="mt-5 flex flex-col items-center">
        {avatars.length > 0 && (
          <div className="flex -space-x-2 mb-3">
            {avatars.map((fingerprint, i) => (
              <img 
                key={fingerprint}
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${fingerprint}`} 
                className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-950 bg-neutral-100 dark:bg-zinc-800 grayscale transition-transform hover:scale-110" 
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
