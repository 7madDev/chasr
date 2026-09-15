"use server";

import { redirect } from "next/navigation";
import { requireGoalOwnership } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendMilestoneEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/server";

export async function updateProgress(slug: string, formData: FormData) {
  const { user, goal } = await requireGoalOwnership(slug);

  if (goal.status === "ACTIVE" && new Date() > new Date(goal.deadline)) {
    throw new Error("Deadline has passed. You can no longer update this goal.");
  }

  const amount = parseFloat(formData.get("amount") as string);
  const note = (formData.get("note") as string)?.trim() || null;

  if (isNaN(amount) || amount < 0) {
    throw new Error("Please enter a valid amount.");
  }
  if (note && note.length > 140) {
    throw new Error("Note must be 140 characters or less.");
  }

  // Create the update
  await prisma.goalUpdate.create({
    data: {
      goalId: goal.id,
      amount,
      note,
    },
  });

  // Update the goal
  const isGoalHit = amount >= goal.targetAmount;
  await prisma.goal.update({
    where: { id: goal.id },
    data: {
      currentAmount: amount,
      lastUpdatedAt: new Date(),
      ...(isGoalHit && goal.status !== "HIT" ? { status: "HIT" } : {}),
    },
  });

  // If goal was just hit, send milestone email
  if (isGoalHit && goal.status !== "HIT") {
    try {
      const supabaseAdmin = await createAdminClient();
      const { data } = await supabaseAdmin.auth.admin.getUserById(user.id);
      if (data?.user?.email) {
        await sendMilestoneEmail(data.user.email, goal.productName, slug);
      }
    } catch {
      // Non-critical
    }
  }

  redirect(`/goals/${slug}`);
}
