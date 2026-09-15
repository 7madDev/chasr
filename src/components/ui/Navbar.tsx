import Link from "next/link";
import { Trophy, LayoutDashboard, Plus } from "lucide-react";
import { getSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

export async function Navbar() {
  const user = await getSession();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/chasr.png" alt="Chasr Logo" className="h-7 w-auto object-contain" />
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-100 transition-colors sm:mr-2 flex items-center gap-1"
            title="Leaderboard"
          >
            <Trophy className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">leaderboard</span>
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1"
                title="Dashboard"
              >
                <LayoutDashboard className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">dashboard</span>
              </Link>
              <Link
                href="/dashboard/new"
                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg bg-[#C13D19] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#a63214] transition-colors"
                title="New Goal"
              >
                <Plus className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">new goal</span>
              </Link>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-neutral-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              login
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
