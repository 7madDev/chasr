"use server";

import { requireGoalOwnership } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteGoal(slug: string) {
  const { goal } = await requireGoalOwnership(slug);
  
  await prisma.goal.delete({
    where: { id: goal.id },
  });
  
  revalidatePath("/dashboard/goals");
}
