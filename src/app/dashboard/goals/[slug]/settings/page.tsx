import { Metadata } from "next";
import Link from "next/link";
import { requireGoalOwnership } from "@/lib/auth";
import { SettingsForm } from "./SettingsForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "goal settings | chasr",
};

export default async function SettingsGoalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { goal } = await requireGoalOwnership(slug);

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)] max-w-2xl mx-auto px-4 justify-center relative animate-in fade-in duration-500 ease-out">
      <Link
        href="/dashboard/goals"
        className="absolute top-4 left-4 sm:left-0 group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        back to goals
      </Link>

      <SettingsForm
        slug={slug}
        initialData={{
          productName: goal.productName,
          productUrl: goal.productUrl,
          why: goal.why,
          deadline: goal.deadline,
        }}
      />
    </div>
  );
}