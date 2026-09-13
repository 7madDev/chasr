"use client";

import { useState } from "react";
import { updateProgress } from "./actions";
import { formatAmount } from "@/lib/format";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

interface EditFormProps {
  slug: string;
  productName: string;
  startAmount: number;
  currentAmount: number;
  targetAmount: number;
  currency: string;
}

export function EditForm({ slug, productName, startAmount, currentAmount, targetAmount, currency }: EditFormProps) {
  const [amount, setAmount] = useState(currentAmount);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // formatting is handled by formatAmount inline

  const progressPercentage = Math.min(
    100,
    Math.max(0, ((amount - startAmount) / (targetAmount - startAmount)) * 100)
  ).toFixed(1);

  const isComplete = amount >= targetAmount;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      await updateProgress(slug, formData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "something went wrong.");
      setLoading(false);
    }
  }

  function increment(val: number) {
    setAmount((prev) => Math.min(targetAmount, prev + val));
  }

  return (
    <form action={handleSubmit} className="w-full space-y-6">
      <div className="text-center mb-6">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C13D19] font-bold mb-2 animate-pulse">
          live update
        </p>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          {productName}
        </h1>
      </div>

      <div className="relative rounded-3xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 overflow-hidden transform transition-all duration-300 hover:shadow-[#C13D19]/10">

        {/* massive interactive number */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline justify-center gap-2 group">
            <input
              id="amount"
              name="amount"
              type="number"
              required
              min={startAmount}
              max={targetAmount}
              step="any"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-48 bg-transparent text-6xl font-black font-mono tracking-tighter text-neutral-900 dark:text-zinc-50 focus:outline-none text-center p-0 border-0 ring-0 selection:bg-[#C13D19]/20 transition-all scale-100 focus:scale-105"
            />
            <span className="text-xl text-neutral-400 dark:text-zinc-500 font-mono font-bold mb-1 transition-colors group-focus-within:text-[#C13D19] uppercase tracking-widest">{currency}</span>
          </div>

          <div className="flex gap-2 mt-4">
            {[5, 10, 49, 99].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => increment(val)}
                className="px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-zinc-900 border border-transparent text-xs font-mono font-bold text-neutral-500 dark:text-zinc-400 hover:border-[#C13D19] hover:text-[#C13D19] hover:bg-[#C13D19]/10 transition-all active:scale-95"
              >
                +{val}
              </button>
            ))}
          </div>
        </div>

        {/* unified progress slider */}
        <div className="relative w-full mb-8 group cursor-pointer">
          <div className="flex justify-between mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
            <span>{progressPercentage}%</span>
            <span>{formatAmount(targetAmount, currency)}</span>
          </div>
          <div className="relative h-4 bg-neutral-100 dark:bg-zinc-900 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-[#C13D19] to-[#E85D38]'}`}
              style={{ width: `${Math.max(Number(progressPercentage), 2)}%` }}
            />
          </div>
          <input
            type="range"
            min={startAmount}
            max={targetAmount}
            step="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="absolute bottom-0 left-0 w-full h-4 opacity-0 cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* compact story input */}
        <div className="relative flex items-center bg-neutral-50 dark:bg-zinc-900/50 rounded-xl border border-neutral-100 dark:border-zinc-800 focus-within:border-[#C13D19]/50 focus-within:ring-1 focus-within:ring-[#C13D19]/50 transition-all">
          <div className="pl-4">
            <Sparkles className="w-4 h-4 text-neutral-400" />
          </div>
          <input
            type="text"
            id="note"
            name="note"
            maxLength={140}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="what happened? (optional)"
            className="w-full bg-transparent border-0 ring-0 px-3 py-4 text-sm text-neutral-900 dark:text-zinc-100 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
          />
          <span className={`pr-4 text-[9px] font-mono font-bold ${note.length > 120 ? 'text-[#C13D19]' : 'text-neutral-400'}`}>
            {note.length}/140
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200/50 dark:border-red-900/30 bg-red-50/80 dark:bg-red-900/10 px-5 py-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-3 animate-in zoom-in-95">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`group relative flex items-center justify-center w-full h-14 rounded-2xl text-white font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none ${isComplete
            ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            : "bg-gradient-to-r from-[#C13D19] to-[#E85D38] shadow-[0_0_20px_rgba(193,61,25,0.3)] hover:shadow-[0_0_30px_rgba(193,61,25,0.5)]"
          }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">syncing...</span>
        ) : isComplete ? (
          <span className="flex items-center gap-2">
            claim victory <CheckCircle2 className="w-5 h-5 ml-1" />
          </span>
        ) : (
          <span className="flex items-center gap-2">
            log update <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </button>
    </form>
  );
}