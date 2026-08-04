import { Metadata } from "next";
import { requireGoalOwnership } from "@/lib/auth";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EditForm } from "./EditForm";

export const metadata: Metadata = {
  title: "Update Progress",
};

export default async function EditGoalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { goal } = await requireGoalOwnership(slug);

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Update progress</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{goal.productName}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <ProgressBar
          start={goal.startAmount}
          current={goal.currentAmount}
          target={goal.targetAmount}
          currency={goal.currency}
          status={goal.status}
        />
      </div>

      <EditForm slug={slug} currentAmount={goal.currentAmount} currency={goal.currency} />
    </div>
  );
}
