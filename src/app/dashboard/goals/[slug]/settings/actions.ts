"use server";

import { redirect } from "next/navigation";
import { requireGoalOwnership } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateGoalSettings(slug: string, formData: FormData) {
  const { goal } = await requireGoalOwnership(slug);

  const productName = formData.get("productName") as string;
  const productUrl = (formData.get("productUrl") as string)?.trim() || null;
  const why = formData.get("why") as string;
  const deadlineStr = formData.get("deadline") as string;

  if (!productName || !why || !deadlineStr) {
    throw new Error("Missing required fields.");
  }

  const deadline = new Date(deadlineStr);
  if (isNaN(deadline.getTime())) {
    throw new Error("Invalid deadline date.");
  }

  if (why.length > 280) {
    throw new Error("Reason must be 280 characters or less.");
  }

  await prisma.goal.update({
    where: { id: goal.id },
    data: {
      productName,
      productUrl,
      why,
      deadline,
    },
  });

  redirect(`/dashboard/goals`);
}
