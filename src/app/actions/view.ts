"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function trackView(slug: string) {
  try {
    const cookieStore = await cookies();
    const cookieName = `viewed_${slug}`;

    if (!cookieStore.has(cookieName)) {
      await prisma.goal.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
      // Set a cookie that expires in 24 hours to prevent duplicate views from the same browser
      cookieStore.set(cookieName, "true", { maxAge: 60 * 60 * 24 });
    }
  } catch (error) {
    console.error("Failed to track view:", error);
  }
}
