"use client";

import { useState, useRef } from "react";
import { completeOnboarding } from "./actions";
import { User, Link as LinkIcon, AlertCircle, ArrowRight } from "lucide-react";

interface OnboardingFormProps {
  initialData: {
    founderName: string;
    founderLink: string | null;
    avatarUrl: string | null;
  };
}

export function OnboardingForm({ initialData }: OnboardingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [founderName, setFounderName] = useState(initialData.founderName);
  const [avatarData, setAvatarData] = useState<string | null>(initialData.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setAvatarData(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      await completeOnboarding(formData);
    } catch (err: any) {
      setError(err.message || "failed to save profile.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      {/* interactive avatar preview */}
      <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 dark:bg-zinc-900/50 rounded-2xl border border-neutral-100 dark:border-zinc-800/50 mb-8 transition-colors">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
        <input type="hidden" name="avatarUrl" value={avatarData || ""} />
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-zinc-800 overflow-hidden mb-4 border-2 border-white dark:border-zinc-950 shadow-lg cursor-pointer transition-transform hover:scale-105 hover:rotate-3 duration-300 relative group"
        >
          <img
            src={avatarData || `https://api.dicebear.com/7.x/notionists/svg?seed=${founderName || 'founder'}`}
            alt="avatar preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-[9px] font-bold uppercase tracking-widest text-center px-2">Change Image</span>
          </div>
        </div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">click to upload avatar</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3 group">
          <label htmlFor="founderName" className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> your name
          </label>
          <input
            id="founderName"
            name="founderName"
            type="text"
            required
            value={founderName}
            onChange={(e) => setFounderName(e.target.value)}
            className="w-full h-14 px-4 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-[#C13D19]/20 focus:border-[#C13D19] transition-all text-neutral-900 dark:text-zinc-50 font-semibold"
          />
        </div>

        <div className="space-y-3 group">
          <label htmlFor="founderLink" className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-focus-within:text-[#C13D19] transition-colors flex items-center gap-2">
            <LinkIcon className="w-3.5 h-3.5" /> X (Twitter) URL <span className="opacity-40">(optional)</span>
          </label>
          <input
            id="founderLink"
            name="founderLink"
            type="url"
            defaultValue={initialData.founderLink || ""}
            placeholder="https://x.com/yourhandle"
            className="w-full h-14 px-4 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-[#C13D19]/20 focus:border-[#C13D19] transition-all text-neutral-900 dark:text-zinc-50 font-semibold"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200/50 dark:border-red-900/30 bg-red-50/80 dark:bg-red-900/10 px-5 py-4 text-sm text-red-600 dark:text-red-400 flex items-center gap-3 animate-in zoom-in-95">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="group relative flex items-center justify-center w-full px-10 h-14 rounded-2xl bg-gradient-to-r from-[#C13D19] to-[#E85D38] text-white font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(193,61,25,0.4)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
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
                continue to dashboard <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
