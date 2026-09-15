"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const supabase = createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${appUrl}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });
  }

  if (sent) {
    return (
      <div className="min-h-[70dvh] flex flex-col items-center justify-center p-4 selection:bg-[#C13D19] selection:text-white">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-neutral-100 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/30 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 mx-auto bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-100 dark:border-green-500/20">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-zinc-50 mb-3">
            check your email.
          </h1>
          <p className="text-sm text-neutral-500 dark:text-zinc-400 mb-8 leading-relaxed">
            we sent a magic link to <span className="font-bold text-neutral-900 dark:text-zinc-100">{email}</span>. click it to securely sign in.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-zinc-100 transition-colors"
          >
            ← try a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70dvh] flex flex-col items-center justify-center p-4 selection:bg-[#C13D19] selection:text-white relative overflow-hidden">

      {/* background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#C13D19]/5 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">

        {/* brand header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C13D19] shadow-lg shadow-[#C13D19]/20 mb-6">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-white mb-2">
            chasr.
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-neutral-400 dark:text-zinc-500">
            stay accountable
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-neutral-200/50 dark:shadow-black/50">

          <button
            onClick={handleGoogleSignIn}
            className="group flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 text-sm font-bold text-neutral-900 dark:text-white transition-all hover:bg-neutral-50 dark:hover:bg-zinc-900 hover:border-neutral-300 dark:hover:border-zinc-700 active:scale-[0.98] shadow-sm"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            continue with google
          </button>

          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t border-neutral-100 dark:border-zinc-800"></div>
            <span className="flex-shrink-0 px-4 text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-neutral-400 dark:text-zinc-600">or email</span>
            <div className="flex-grow border-t border-neutral-100 dark:border-zinc-800"></div>
          </div>

          <form onSubmit={handleMagicLink} className="space-y-6">
            <div className="space-y-3 group">
              <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-zinc-400 group-focus-within:text-[#C13D19] transition-colors flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> work email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@startup.com"
                className="w-full h-14 px-4 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-950/50 focus:outline-none focus:ring-2 focus:ring-[#C13D19]/20 focus:border-[#C13D19] transition-all text-neutral-900 dark:text-zinc-50 font-medium placeholder:text-neutral-400 dark:placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200/50 dark:border-red-900/30 bg-red-50/80 dark:bg-red-900/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-3 animate-in zoom-in-95">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="font-semibold text-xs">{error}</p>
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
                    sending...
                  </>
                ) : (
                  <>
                    send magic link <Sparkles className="w-4 h-4 ml-1 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}