"use client";

import { useState } from "react";

export function EmbedSnippet({ slug }: { slug: string }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://open.announcify.app";
  const snippet = `<script src="${appUrl}/embed.js" data-goal="${slug}" async></script>`;

  function handleCopy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-primary/10 transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Embed badge
      </button>

      {show && (
        <div className="mt-3 rounded-lg border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground/70 mb-2">
            Paste this in your site&apos;s HTML to show a live progress badge:
          </p>
          <div className="relative">
            <pre className="text-xs font-mono bg-secondary rounded-md p-3 pr-16 overflow-x-auto text-muted-foreground">
              {snippet}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded bg-primary/100 text-white hover:bg-primary transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
