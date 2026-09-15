"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, Plus, Trophy, LayoutDashboard, Target, Settings, ChevronRight, Menu, X } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

const NAV_ITEMS = [
  {
    label: "Leaderboard",
    href: "/leaderboard",
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

export function DashboardSidebar({ userName, avatarUrl }: { userName: string, avatarUrl?: string | null }) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-neutral-200 dark:border-zinc-800/50 z-40 flex items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex flex-col gap-1 hover:opacity-80 transition-opacity">
          <img src="/chasr.png" alt="Chasr Logo" className="h-6 w-auto object-contain self-start ml-1" />
        </Link>
        <button onClick={() => setIsOpen(true)} className="p-2 -mr-2 text-neutral-600 dark:text-zinc-400">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#09090b] border-r border-neutral-200 dark:border-zinc-800/50 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Mobile Close Button */}
        <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-5 right-5 p-2 text-neutral-500">
          <X className="w-5 h-5" />
        </button>

      {/* Brand Header */}
      <div className="p-6 pb-8">
        <Link href="/" className="flex flex-col gap-2 group hover:opacity-80 transition-opacity">
          <img
            src="/chasr.png"
            alt="Chasr Logo"
            className="h-8 w-auto object-contain self-start ml-1"
          />
          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 dark:text-zinc-500 font-bold ml-1">
            stay accountable
          </span>
        </Link>
      </div>

      {/* Main Action */}
      <div className="px-5 mb-8">
        <Link
          href="/dashboard/new"
          className="group relative flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-gradient-to-r from-[#C13D19] to-[#E85D38] text-white text-xs font-bold uppercase tracking-widest transition-all hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
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
                ? "bg-neutral-100 dark:bg-zinc-900 text-neutral-900 dark:text-white"
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
                src={avatarUrl || "/avatar.svg"}
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
    </>
  );
}