import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingForm } from "./OnboardingForm";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "welcome | chasr",
};

export default async function OnboardingPage() {
  const user = await requireAuth();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-4 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-zinc-50 mb-2">
          welcome to chasr.
        </h1>
        <p className="text-sm text-neutral-500 dark:text-zinc-400">
          let's set up your profile before creating your first goal.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-6 sm:p-8">
        <OnboardingForm initialData={dbUser} />
      </div>
    </div>
  );
}
