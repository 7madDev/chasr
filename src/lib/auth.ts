import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth() {
  const user = await getSession();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

export async function requireGoalOwnership(slug: string) {
  const user = await requireAuth();

  const goal = await prisma.goal.findUnique({
    where: { slug },
    include: {
      updates: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Treat ownership mismatch the same as not found — don't reveal the goal exists
  if (!goal || goal.ownerId !== user.id) {
    notFound();
  }

  return { user, goal };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
