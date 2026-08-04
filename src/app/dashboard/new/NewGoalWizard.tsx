"use client";

import { useState } from "react";
import { createGoal } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const CURRENCIES = ["USD", "EUR", "GBP"] as const;
type Currency = (typeof CURRENCIES)[number];

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

interface GoalFormData {
  productName: string;
  why: string;
  productUrl: string;
  founderName: string;
  founderLink: string;
  currency: Currency;
  startAmount: string;
  targetAmount: string;
  deadline: string;
}

const STEPS = [
  { num: 1, label: "Vision" },
  { num: 2, label: "Targets" },
  { num: 3, label: "Commit" },
];

export function NewGoalWizard({ defaultFounderName }: { defaultFounderName: string }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<GoalFormData>({
    productName: "",
    why: "",
    productUrl: "",
    founderName: defaultFounderName,
    founderLink: "",
    currency: "USD",
    startAmount: "0",
    targetAmount: "10000",
    deadline: "",
  });

  function update(field: keyof GoalFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function goNext() {
    if (step === 1) {
      if (!form.productName.trim()) return setError("product name is required.");
      if (!form.why.trim()) return setError("tell us why you're chasing this.");
      if (form.why.length > 280) return setError("why must be 280 characters or less.");
    }
    if (step === 2) {
      const start = parseFloat(form.startAmount);
      const target = parseFloat(form.targetAmount);
      if (isNaN(target) || target <= 0) return setError("enter a valid target amount.");
      if (isNaN(start) || start < 0) return setError("enter a valid start amount.");
      if (target <= start) return setError("target must be greater than start.");
      if (!form.deadline) return setError("pick a deadline.");
      if (new Date(form.deadline) <= new Date()) return setError("deadline must be in the future.");
    }
    setError("");
    setStep((s) => Math.min(s + 1, 3));
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    if (!agreed) return setError("you must agree to the public commitment.");
    setLoading(true);
    setError("");
    try {
      await createGoal({
        productName: form.productName.trim(),
        productUrl: form.productUrl.trim(),
        founderName: form.founderName.trim() || defaultFounderName,
        founderLink: form.founderLink.trim(),
        why: form.why.trim(),
        startAmount: parseFloat(form.startAmount),
        targetAmount: parseFloat(form.targetAmount),
        currency: form.currency,
        deadline: form.deadline,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "something went wrong.");
      setLoading(false);
    }
  }

  const sym = CURRENCY_SYMBOLS[form.currency];

  const formatAmount = (amt: string) => {
    const n = parseFloat(amt);
    if (isNaN(n)) return `${sym}0`;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: form.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  };

  const deadlineDisplay = form.deadline
    ? new Date(form.deadline + "T00:00:00").toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "—";

  return (
    <div className="max-w-2xl mx-auto">
      {/* step tabs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-10">
        {STEPS.map((s) => {
          const isComplete = step > s.num;
          const isCurrent = step === s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                if (isComplete) setStep(s.num);
              }}
              disabled={!isComplete && !isCurrent}
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl border transition-all ${isCurrent
                  ? "border-primary bg-card shadow-sm ring-1 ring-primary/10"
                  : isComplete
                    ? "border-border bg-card cursor-pointer hover:border-primary/40 hover:bg-secondary/50"
                    : "border-border/50 bg-secondary/30 cursor-not-allowed opacity-60"
                }`}
            >
              {isComplete ? (
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              ) : (
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${isCurrent ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground border border-border"
                    }`}
                >
                  {s.num}
                </span>
              )}
              <span
                className={`text-sm font-medium ${isCurrent ? "text-foreground" : isComplete ? "text-muted-foreground" : "text-muted-foreground/60"
                  }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* step 1: vision */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            set your sights high.
          </h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-md leading-relaxed">
            transform your ambition into a public commitment. define your destination, set the stakes, and start the countdown.
          </p>

          <Card className="relative overflow-hidden border-border/60 shadow-sm">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    product name
                  </Label>
                  <Input
                    value={form.productName}
                    onChange={(e) => update("productName", e.target.value)}
                    placeholder="e.g. project orion"
                    className="bg-secondary/30 transition-colors focus-visible:bg-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    product url (optional)
                  </Label>
                  <Input
                    value={form.productUrl}
                    onChange={(e) => update("productUrl", e.target.value)}
                    placeholder="https://"
                    className="bg-secondary/30 transition-colors focus-visible:bg-background h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    founder name
                  </Label>
                  <Input
                    value={form.founderName}
                    onChange={(e) => update("founderName", e.target.value)}
                    placeholder="your name"
                    className="bg-secondary/30 transition-colors focus-visible:bg-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    founder link (optional)
                  </Label>
                  <Input
                    value={form.founderLink}
                    onChange={(e) => update("founderLink", e.target.value)}
                    placeholder="x.com/yourhandle"
                    className="bg-secondary/30 transition-colors focus-visible:bg-background h-11"
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  one-liner &quot;why&quot;
                </Label>
                <textarea
                  value={form.why}
                  onChange={(e) => update("why", e.target.value)}
                  maxLength={280}
                  rows={3}
                  placeholder="i am building this because..."
                  className="flex min-h-[96px] w-full rounded-lg border border-input bg-secondary/30 px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 resize-none focus-visible:bg-background"
                />
                <span className={`absolute bottom-3 right-3 text-[10px] font-mono ${form.why.length > 250 ? 'text-destructive' : 'text-muted-foreground/60'}`}>
                  {form.why.length}/280
                </span>
              </div>
            </CardContent>
          </Card>

          {error && <ErrorBanner message={error} />}

          <div className="flex justify-end mt-8">
            <Button onClick={goNext} className="px-6 h-11">
              next: targets →
            </Button>
          </div>
        </div>
      )}

      {/* step 2: targets */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            define your targets.
          </h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-md leading-relaxed">
            set the numbers that will track your success. be ambitious but realistic.
          </p>

          <Card className="relative overflow-hidden border-border/60 shadow-sm">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />

            <CardContent className="pt-6 space-y-8">
              {/* currency toggle */}
              <div className="space-y-3">
                <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  base currency
                </Label>
                <div className="inline-flex rounded-lg border bg-secondary/50 p-1 w-full sm:w-auto">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => update("currency", c)}
                      className={`flex-1 sm:flex-none px-6 py-2 text-sm font-medium transition-all rounded-md ${form.currency === c
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* start / target amounts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    start amount ⊙
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                      {sym}
                    </span>
                    <Input
                      type="number"
                      value={form.startAmount}
                      onChange={(e) => update("startAmount", e.target.value)}
                      min="0"
                      step="any"
                      className="pl-8 font-mono h-11 bg-secondary/30 focus-visible:bg-background"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                    target amount ↗
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                      {sym}
                    </span>
                    <Input
                      type="number"
                      value={form.targetAmount}
                      onChange={(e) => update("targetAmount", e.target.value)}
                      min="1"
                      step="any"
                      className="pl-8 font-mono h-11 bg-secondary/30 focus-visible:bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* deadline */}
              <div className="space-y-2">
                <Label className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                  target completion date 📅
                </Label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => update("deadline", e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                  className="h-11 bg-secondary/30 focus-visible:bg-background w-full sm:w-1/2"
                />
              </div>

              {/* motivational tip */}
              <div className="rounded-xl bg-primary/5 border border-primary/10 px-5 py-4 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 19h20L12 2zm0 4l6.5 11h-13L12 6z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">momentum multiplier</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    goals with clear metrics are 80% more likely to be achieved in the first 90 days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && <ErrorBanner message={error} />}

          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" onClick={goBack} className="text-muted-foreground hover:text-foreground h-11 px-6">
              ← back
            </Button>
            <Button onClick={goNext} className="h-11 px-6">
              next: final commitment →
            </Button>
          </div>
        </div>
      )}

      {/* step 3: commit */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold mb-2">
            launch sequence
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            lock it in.
          </h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-md leading-relaxed">
            this is your public commitment. once you launch, there&apos;s no turning back — only moving forward.
          </p>

          {/* summary card */}
          <Card className="text-center mb-6 border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="pt-8 pb-8">
              <p className="text-sm font-medium text-muted-foreground mb-6">
                {form.productName || "your product"}
              </p>
              <div className="space-y-2">
                <p className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold">
                  target objective
                </p>
                <p className="text-4xl sm:text-5xl font-bold tracking-tight font-mono tabular-nums text-foreground">
                  {formatAmount(form.targetAmount)} mrr
                </p>
                <p className="text-sm text-muted-foreground font-medium pt-2">
                  by {deadlineDisplay}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* agreement checkbox */}
          <Card className="mb-6 border-border/60">
            <CardContent className="pt-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-muted-foreground/30 rounded flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary transition-all group-hover:border-primary/50">
                    <svg
                      className={`w-3 h-3 text-primary-foreground transition-opacity ${agreed ? "opacity-100" : "opacity-0"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed select-none group-hover:text-foreground transition-colors">
                  i understand that my progress will be public. my wins and my failures will be broadcasted to the community for ultimate accountability.
                </span>
              </label>
            </CardContent>
          </Card>

          {error && <ErrorBanner message={error} />}

          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" onClick={goBack} disabled={loading} className="text-muted-foreground hover:text-foreground h-12 px-6">
              ← back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !agreed}
              className="h-12 px-8 font-bold uppercase tracking-wide shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  launching...
                </span>
              ) : (
                "launch goal 🚀"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-center gap-3">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>{message}</p>
    </div>
  );
}