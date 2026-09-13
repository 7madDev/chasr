"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check } from "lucide-react";

export function EmbedSnippet({ slug, className, children }: { slug: string; className?: string; children?: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://open.announcify.app";
  const snippet = `<script src="${appUrl}/embed.js" data-goal="${slug}" async></script>`;

  function handleCopy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className={className || "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-primary/10 transition-all"}
      >
        {children || (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Embed badge
          </>
        )}
      </button>

      {show && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShow(false)}>
          <div 
            className="w-full max-w-lg mx-4 bg-white dark:bg-zinc-950 rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 dark:border-zinc-800 relative animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#C13D19]/10 text-[#C13D19] dark:bg-[#E85D38]/10 dark:text-[#E85D38] mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">embed this goal.</h3>
              <p className="text-sm text-neutral-500 dark:text-zinc-400">
                paste this snippet into your website's HTML to show a live progress badge.
              </p>
            </div>

            <div className="relative group">
              <pre className="text-xs sm:text-sm font-mono bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-4 pr-16 overflow-x-auto text-neutral-700 dark:text-zinc-300">
                {snippet}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-1/2 -translate-y-1/2 right-3 p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 shadow-sm text-neutral-700 dark:text-zinc-300 hover:text-[#C13D19] dark:hover:text-[#E85D38] hover:border-[#C13D19]/30 hover:shadow-md transition-all active:scale-95"
                title="copy snippet"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShow(false)}
                className="px-6 py-2.5 rounded-xl bg-neutral-100 dark:bg-zinc-900 text-neutral-700 dark:text-zinc-300 text-sm font-bold hover:bg-neutral-200 dark:hover:bg-zinc-800 transition-colors"
              >
                close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
