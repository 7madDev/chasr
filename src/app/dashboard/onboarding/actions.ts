"use server";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
  const user = await requireAuth();
  const founderName = formData.get("founderName") as string;
  const founderLink = formData.get("founderLink") as string;

  if (!founderName || founderName.trim().length === 0) {
    throw new Error("name is required.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      founderName: founderName.trim(),
      founderLink: founderLink ? founderLink.trim() : null,
    },
  });

  redirect("/dashboard/new");
}
