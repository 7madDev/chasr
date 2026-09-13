"use client";

import { useState } from "react";
import { createGoal } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ArrowRight, Check, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

import { formatAmount } from "@/lib/format";

const PRESET_UNITS = ["MRR", "USD", "EUR", "GBP", "X/Twitter followers", "Total users", "Paying users", "Other..."] as const;

interface GoalFormData {
  productName: string;
  why: string;
  productUrl: string;
  currency: string;
  customUnit: string;
  startAmount: string;
  targetAmount: string;
  deadline: string;
}

const STEPS = [
  { num: 1, label: "vision" },
  { num: 2, label: "targets" },
  { num: 3, label: "commit" },
];

export function NewGoalWizard({ defaultFounderName = "" }: { defaultFounderName?: string }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<GoalFormData>({
    productName: "",
    why: "",
    productUrl: "",
    currency: "MRR",
    customUnit: "",
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
        founderName: defaultFounderName,
        why: form.why.trim(),
        startAmount: parseFloat(form.startAmount),
        targetAmount: parseFloat(form.targetAmount),
        currency: form.currency === "Other..." ? (form.customUnit.trim() || "unit") : form.currency,
        deadline: form.deadline,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "something went wrong.");
      setLoading(false);
    }
  }

  const formatAmountLocal = (amt: string) => {
    const n = parseFloat(amt);
    const unit = form.currency === "Other..." ? (form.customUnit || "unit") : form.currency;
    if (isNaN(n)) return formatAmount(0, unit);
    return formatAmount(n, unit);
  };

  const deadlineDisplay = form.deadline
    ? new Date(form.deadline + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).toLowerCase()
    : "—";

  return (
    <div className="relative max-w-2xl mx-auto w-full pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[400px] bg-gradient-to-b from-[#C13D19]/10 via-[#C13D19]/5 to-transparent blur-3xl -z-10 rounded-full pointer-events-none transition-opacity duration-1000" />

      {/* Modern Pill Stepper */}
      <div className="flex justify-center mb-12 sm:mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="inline-flex items-center p-1.5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-full border border-neutral-200 dark:border-zinc-800 shadow-sm">
          {STEPS.map((s) => {
            const isComplete = step > s.num;
            const isCurrent = step === s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => { if (isComplete) setStep(s.num); }}
                disabled={!isComplete && !isCurrent}
                className={cn(
                  "relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 ease-out",
                  isCurrent
                    ? "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-zinc-50 shadow-sm border border-neutral-200 dark:border-zinc-700/50 scale-100"
                    : isComplete
                      ? "text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800/50 cursor-pointer scale-95"
                      : "text-neutral-400 dark:text-zinc-600 cursor-not-allowed opacity-50 scale-95"
                )}
              >
                {isComplete ? (
                  <Check className="w-3.5 h-3.5 text-[#C13D19] dark:text-[#E85D38]" strokeWidth={3} />
                ) : (
                  <span className={cn(
                    "flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black",
                    isCurrent ? "bg-[#C13D19] text-white" : "bg-neutral-200 dark:bg-zinc-800 text-neutral-500"
                  )}>
                    {s.num}
                  </span>
                )}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black tracking-tight mb-4 text-neutral-900 dark:text-zinc-50 bg-clip-text">
                set your sights high.
              </h1>
              <p className="text-sm text-neutral-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                transform your ambition into a public commitment. define your destination and start the countdown.
              </p>
            </div>

            <Card className="border-0 shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-neutral-200 dark:ring-zinc-800">
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3 group">
                    <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors">
                      product name
                    </Label>
                    <Input
                      value={form.productName}
                      onChange={(e) => update("productName", e.target.value)}
                      placeholder="e.g. chasr"
                      className="h-12 bg-neutral-50 border dark:bg-zinc-950/50 border-neutral-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-[#C13D19]/20 focus-visible:border-[#C13D19] rounded-xl transition-all duration-300 hover:border-neutral-300 dark:hover:border-zinc-700"
                    />
                  </div>
                  <div className="space-y-3 group">
                    <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors">
                      product url <span className="opacity-40">(optional)</span>
                    </Label>
                    <Input
                      value={form.productUrl}
                      onChange={(e) => update("productUrl", e.target.value)}
                      placeholder="https://"
                      className="h-12 bg-neutral-50 dark:bg-zinc-950/50 border border-neutral-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-[#C13D19]/20 focus-visible:border-[#C13D19] rounded-xl transition-all duration-300 hover:border-neutral-300 dark:hover:border-zinc-700"
                    />
                  </div>
                </div>

                <div className="space-y-3 group relative">
                  <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors">
                    one-liner "why"
                  </Label>
                  <textarea
                    value={form.why}
                    onChange={(e) => update("why", e.target.value)}
                    maxLength={280}
                    rows={3}
                    placeholder="i am building this because..."
                    className="flex min-h-[120px] w-full rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-950/50 px-4 py-4 text-sm text-neutral-900 dark:text-zinc-100 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C13D19]/20 focus-visible:border-[#C13D19] transition-all duration-300 hover:border-neutral-300 dark:hover:border-zinc-700 resize-none"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-900 shadow-sm border border-neutral-100 dark:border-zinc-800">
                    <span className={`text-[9px] font-bold font-mono ${form.why.length > 250 ? 'text-[#C13D19] animate-pulse' : 'text-neutral-400'}`}>
                      {form.why.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && <ErrorBanner message={error} />}

            <div className="flex justify-end mt-10">
              <Button
                onClick={goNext}
                className="group h-14 px-8 bg-neutral-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl transition-all duration-300"
              >
                next step
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black tracking-tight mb-4 text-neutral-900 dark:text-zinc-50">
                define your targets.
              </h1>
              <p className="text-sm text-neutral-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                set the numbers that will track your success. be ambitious but realistic.
              </p>
            </div>

            <Card className="border-0 shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-neutral-200 dark:ring-zinc-800">
              <CardContent className="p-8 space-y-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    tracking unit
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_UNITS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update("currency", c)}
                        className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${form.currency === c
                          ? "text-[#C13D19] shadow-sm bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-zinc-300 border border-transparent"
                          }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  {form.currency === "Other..." && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Input
                        value={form.customUnit}
                        onChange={(e) => update("customUnit", e.target.value)}
                        placeholder="e.g. app downloads, pizzas eaten"
                        className="h-12 bg-neutral-50 dark:bg-zinc-950/50 border-neutral-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-[#C13D19]/20 focus-visible:border-[#C13D19] rounded-xl transition-all duration-300"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3 group">
                    <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors">
                      start amount
                    </Label>
                    <Input
                      type="number"
                      value={form.startAmount}
                      onChange={(e) => update("startAmount", e.target.value)}
                      min="0"
                      step="1"
                      className="h-14 text-lg font-mono font-bold bg-neutral-50 dark:bg-zinc-950/50 border-neutral-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-[#C13D19]/20 focus-visible:border-[#C13D19] rounded-xl transition-all duration-300 px-4"
                    />
                  </div>
                  <div className="space-y-3 group">
                    <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors">
                      target amount
                    </Label>
                    <Input
                      type="number"
                      value={form.targetAmount}
                      onChange={(e) => update("targetAmount", e.target.value)}
                      min="1"
                      step="1"
                      className="h-14 text-lg font-mono font-bold bg-[#FFF5F2] dark:bg-[#C13D19]/5 border-[#FADCD5] dark:border-[#C13D19]/30 text-[#C13D19] focus-visible:ring-2 focus-visible:ring-[#C13D19]/40 focus-visible:border-[#C13D19] rounded-xl transition-all duration-300 px-4"
                    />
                  </div>
                </div>

                <div className="space-y-3 flex flex-col group">
                  <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors">
                    target completion date
                  </Label>
                  <Popover>
                    <PopoverTrigger
                      className={cn(
                        "inline-flex items-center h-14 w-full sm:w-1/2 justify-start text-left font-bold bg-neutral-50 dark:bg-zinc-950/50 border border-neutral-200 dark:border-zinc-800 rounded-xl hover:border-neutral-300 transition-all duration-300 px-4 text-sm",
                        !form.deadline ? "text-neutral-400 font-normal" : "text-neutral-900 dark:text-zinc-100"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 opacity-50" />
                      {form.deadline ? format(new Date(form.deadline + "T12:00:00"), "PPP") : <span>select a date</span>}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-neutral-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden" align="start">
                      <Calendar
                        mode="single"
                        selected={form.deadline ? new Date(form.deadline + "T12:00:00") : undefined}
                        onSelect={(date) => { if (date) update("deadline", date.toISOString().split("T")[0]); }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {error && <ErrorBanner message={error} />}

            <div className="flex items-center justify-between mt-10">
              <button
                onClick={goBack}
                className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-zinc-100 transition-colors py-2 px-4 hover:-translate-x-1"
              >
                ← back
              </button>
              <Button
                onClick={goNext}
                className="group h-14 px-8 bg-neutral-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl transition-all duration-300"
              >
                next step
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C13D19]/10 text-[#C13D19] mb-4">
                <Rocket className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
                  launch sequence
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight mb-4 text-neutral-900 dark:text-zinc-50">
                lock it in.
              </h1>
              <p className="text-sm text-neutral-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                this is your public commitment. once you launch, there is no turning back — only moving forward.
              </p>
            </div>

            <Card className="relative overflow-hidden mb-8 border-0 shadow-2xl shadow-[#C13D19]/20 bg-gradient-to-br from-[#C13D19] to-[#E85D38] text-white rounded-3xl transform hover:scale-[1.01] transition-transform duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <CardContent className="pt-12 pb-12 text-center relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-6">
                  {form.productName || "your product"}
                </p>
                <div className="space-y-4">
                  <p className="text-6xl sm:text-7xl font-black tracking-tighter font-mono tabular-nums text-white drop-shadow-md">
                    {formatAmountLocal(form.targetAmount)}
                  </p>
                  <p className="text-sm font-mono uppercase tracking-widest text-white/90 pt-2 font-semibold">
                    by {deadlineDisplay}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-0 shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl ring-1 ring-neutral-200 dark:ring-zinc-800 group hover:ring-[#C13D19]/50 transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <label className="flex items-start gap-5 cursor-pointer">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-6 h-6 border-2 border-neutral-300 dark:border-zinc-700 rounded-lg flex items-center justify-center peer-checked:bg-[#C13D19] peer-checked:border-[#C13D19] transition-all duration-300 group-hover:border-[#C13D19]/50 peer-checked:shadow-[0_0_15px_rgba(193,61,25,0.4)]">
                      <Check className={`w-4 h-4 text-white transition-transform duration-300 ${agreed ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} strokeWidth={3} />
                    </div>
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-zinc-400 leading-relaxed select-none group-hover:text-neutral-900 dark:group-hover:text-zinc-200 transition-colors">
                    i understand that my progress will be public. my wins and my failures will be broadcasted to the community for ultimate accountability.
                  </span>
                </label>
              </CardContent>
            </Card>

            {error && <ErrorBanner message={error} />}

            <div className="flex items-center justify-between mt-10">
              <button
                onClick={goBack}
                disabled={loading}
                className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-zinc-100 transition-colors py-2 px-4 hover:-translate-x-1 disabled:opacity-50"
              >
                ← back
              </button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !agreed}
                className="group relative h-14 px-10 rounded-2xl bg-gradient-to-r from-[#C13D19] to-[#E85D38] text-white font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(193,61,25,0.4)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      launching...
                    </>
                  ) : (
                    <>
                      launch goal <Rocket className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-red-200/50 dark:border-red-900/30 bg-red-50/80 dark:bg-red-900/10 backdrop-blur-sm px-5 py-4 text-sm text-red-600 dark:text-red-400 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="font-semibold">{message}</p>
    </div>
  );
}