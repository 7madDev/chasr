"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateGlobalSettings(formData: FormData) {
  const user = await requireAuth();

  const founderName = formData.get("founderName") as string;
  const founderLink = (formData.get("founderLink") as string)?.trim() || null;
  const avatarUrl = (formData.get("avatarUrl") as string)?.trim() || null;

  if (!founderName || founderName.trim() === "") {
    throw new Error("Founder name is required.");
  }

  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      founderName,
      founderLink,
      avatarUrl,
    },
    create: {
      id: user.id,
      founderName,
      founderLink,
      avatarUrl,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  
  return { success: true };
}
