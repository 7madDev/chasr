import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";
import { Settings2 } from "lucide-react";

export const metadata: Metadata = {
  title: "profile settings | chasr",
};

export default async function SettingsPage() {
  const authUser = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-zinc-900 text-neutral-500 dark:text-zinc-400 mb-4">
          <Settings2 className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
            global settings
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-zinc-50 mb-2">
          public profile.
        </h1>
        <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed max-w-md mx-auto sm:mx-0">
          manage your identity. this information will be displayed as the author on all your public goal pages.
        </p>
      </div>

      <div className="rounded-3xl border border-neutral-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-6 sm:p-10 shadow-sm">
        <SettingsForm
          initialData={{
            founderName: user?.founderName || "founder",
            founderLink: user?.founderLink || null,
          }}
        />
      </div>
    </div>
  );
}