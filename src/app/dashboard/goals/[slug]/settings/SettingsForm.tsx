"use client";

import { useState } from "react";
import { updateGoalSettings } from "./actions";
import { Save, Link as LinkIcon, Calendar, Target, AlertCircle, Settings2 } from "lucide-react";

interface SettingsFormProps {
  slug: string;
  initialData: {
    productName: string;
    productUrl: string | null;
    why: string;
    deadline: Date;
  };
}

export function SettingsForm({ slug, initialData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whyText, setWhyText] = useState(initialData.why);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      await updateGoalSettings(slug, formData);
    } catch (err: any) {
      setError(err.message || "failed to update goal settings.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-zinc-900 text-neutral-500 dark:text-zinc-400 mb-4">
          <Settings2 className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
            configuration
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-zinc-50">
          adjust parameters.
        </h1>
      </div>

      <div className="relative rounded-3xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 overflow-hidden space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3 group">
            <label htmlFor="productName" className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> product name
            </label>
            <input
              id="productName"
              name="productName"
              type="text"
              required
              defaultValue={initialData.productName}
              className="w-full h-12 px-4 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-[#C13D19]/20 focus:border-[#C13D19] transition-all text-neutral-900 dark:text-zinc-50 font-semibold"
            />
          </div>

          <div className="space-y-3 group">
            <label htmlFor="productUrl" className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5" /> project url <span className="opacity-40">(optional)</span>
            </label>
            <input
              id="productUrl"
              name="productUrl"
              type="url"
              defaultValue={initialData.productUrl || ""}
              className="w-full h-12 px-4 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-[#C13D19]/20 focus:border-[#C13D19] transition-all text-neutral-900 dark:text-zinc-50 font-semibold"
            />
          </div>
        </div>



        <div className="space-y-3 group relative">
          <div className="flex items-center justify-between">
            <label htmlFor="why" className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors">
              the public stake
            </label>
            <span className={`text-[10px] font-mono font-bold ${whyText.length > 250 ? 'text-[#C13D19] animate-pulse' : 'text-neutral-400'}`}>
              {whyText.length}/280
            </span>
          </div>
          <textarea
            id="why"
            name="why"
            required
            maxLength={280}
            rows={3}
            value={whyText}
            onChange={(e) => setWhyText(e.target.value)}
            placeholder="ship $10k mrr or publicly apologize to 5,000 followers."
            className="flex min-h-[96px] w-full rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900/50 px-4 py-3 text-sm text-neutral-900 dark:text-zinc-100 placeholder:text-neutral-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#C13D19]/20 focus:border-[#C13D19] transition-all resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200/50 dark:border-red-900/30 bg-red-50/80 dark:bg-red-900/10 px-5 py-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-3 animate-in zoom-in-95">
          <AlertCircle className="w-5 h-5" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative flex items-center justify-center w-full h-14 rounded-2xl bg-gradient-to-r from-[#C13D19] to-[#E85D38] text-white font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(193,61,25,0.4)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        <span className="relative flex items-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              saving...
            </>
          ) : (
            <>
              save settings <Save className="w-4 h-4 ml-1 group-hover:scale-110 transition-transform" />
            </>
          )}
        </span>
      </button>
    </form>
  );
}