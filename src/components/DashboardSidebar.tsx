"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, Plus, Trophy, LayoutDashboard, Target, Settings, ChevronRight } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

const NAV_ITEMS = [
  {
    label: "Leaderboard",
    href: "/",
    icon: Trophy,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    exact: true,
    icon: LayoutDashboard,
  },
  {
    label: "My Goals",
    href: "/dashboard/goals",
    icon: Target,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#09090b] border-r border-neutral-200 dark:border-zinc-800/50 flex flex-col z-30 hidden md:flex">

      {/* Brand Header */}
      <div className="p-6 pb-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#C13D19] flex items-center justify-center shadow-lg shadow-[#C13D19]/20 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-white leading-none">chasr.</span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#C13D19] dark:text-[#E85D38] font-bold mt-1">
              stay accountable
            </span>
          </div>
        </Link>
      </div>

      {/* Main Action */}
      <div className="px-5 mb-8">
        <Link
          href="/dashboard/new"
          className="group relative flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-gradient-to-r from-[#C13D19] to-[#E85D38] text-white text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(193,61,25,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative flex items-center gap-2">
            <Plus className="w-4 h-4" />
            new goal
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        <p className="px-4 text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500 font-bold mb-4 mt-2">
          menu
        </p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${active
                  ? "bg-neutral-100 dark:bg-zinc-900 text-neutral-900 dark:text-white shadow-sm"
                  : "text-neutral-500 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-zinc-900/50 hover:text-neutral-900 dark:hover:text-zinc-200"
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${active ? "text-[#C13D19] dark:text-[#E85D38]" : "group-hover:text-[#C13D19]"}`} />
                <span>{item.label}</span>
              </div>
              {active && (
                <ChevronRight className="w-4 h-4 text-[#C13D19] dark:text-[#E85D38]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 mt-auto border-t border-neutral-100 dark:border-zinc-800/50">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-200/50 dark:border-zinc-800/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-white dark:border-zinc-700">
              <img
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`}
                alt={userName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col truncate pr-2">
              <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                {userName}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-zinc-500 truncate mt-0.5">
                founder
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="scale-90">
              <ThemeToggle />
            </div>
            <button
              onClick={() => signOutAction()}
              className="p-2 rounded-xl text-neutral-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}