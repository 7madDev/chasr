"use client";

import { useState } from "react";
import { updateProgress } from "./actions";

interface EditFormProps {
  slug: string;
  currentAmount: number;
  currency: string;
}

export function EditForm({ slug, currentAmount, currency }: EditFormProps) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currencySymbol = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  })
    .format(0)
    .replace("0", "")
    .trim();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      await updateProgress(slug, formData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <label htmlFor="amount" className="block text-xs font-medium text-muted-foreground mb-1">
            New current amount ({currencySymbol}) *
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            required
            min="0"
            step="any"
            defaultValue={currentAmount}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm font-mono placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/100/20 focus:border-primary/100 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="note" className="block text-xs font-medium text-muted-foreground mb-1">
            What happened? <span className="text-muted-foreground/70">({140 - note.length} chars left, optional)</span>
          </label>
          <textarea
            id="note"
            name="note"
            maxLength={140}
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder='e.g. "Closed 2 annual deals this week"'
            className="w-full px-3 py-2 rounded-lg border border-border text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/100/20 focus:border-primary/100 transition-colors resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2.5 rounded-lg bg-primary/100 text-white text-sm font-medium hover:bg-primary disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading ? "Updating..." : "Update progress →"}
      </button>
    </form>
  );
}
