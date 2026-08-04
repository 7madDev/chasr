"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function randomSuffix(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 4 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

async function generateUniqueSlug(productName: string): Promise<string> {
  const base = slugify(productName);
  for (let i = 0; i < 10; i++) {
    const slug = `${base}-${randomSuffix()}`;
    const exists = await prisma.goal.findUnique({ where: { slug } });
    if (!exists) return slug;
  }
  throw new Error("Could not generate unique slug");
}

interface GoalData {
  productName: string;
  productUrl: string;
  founderName: string;
  founderLink: string;
  why: string;
  startAmount: number;
  targetAmount: number;
  currency: string;
  deadline: string;
}

export async function createGoal(data: GoalData) {
  const user = await requireAuth();

  // Rate-limit: max 5 goals per user per day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const goalCountToday = await prisma.goal.count({
    where: {
      ownerId: user.id,
      createdAt: { gte: today },
    },
  });
  if (goalCountToday >= 5) {
    throw new Error("You can create up to 5 goals per day. Try again tomorrow.");
  }

  const {
    productName,
    productUrl,
    founderName,
    founderLink,
    why,
    startAmount,
    targetAmount,
    currency,
    deadline: deadlineStr,
  } = data;

  const deadline = new Date(deadlineStr);

  // Validation
  if (!productName || !founderName || !why) {
    throw new Error("Product name, founder name, and why are required.");
  }
  if (why.length > 280) {
    throw new Error("Why must be 280 characters or less.");
  }
  if (isNaN(startAmount) || isNaN(targetAmount)) {
    throw new Error("Start and target amounts must be valid numbers.");
  }
  if (targetAmount <= startAmount) {
    throw new Error("Target amount must be greater than start amount.");
  }
  if (deadline <= new Date()) {
    throw new Error("Deadline must be in the future.");
  }

  const slug = await generateUniqueSlug(productName);

  await prisma.goal.create({
    data: {
      slug,
      ownerId: user.id,
      productName,
      productUrl: productUrl || null,
      founderName,
      founderLink: founderLink || null,
      why,
      startAmount,
      currentAmount: startAmount,
      targetAmount,
      currency,
      deadline,
    },
  });

  // Send confirmation email
  try {
    const supabaseAdmin = await createAdminClient();
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(user.id);
    if (userData?.user?.email) {
      await sendConfirmationEmail(userData.user.email, slug, productName);
    }
  } catch {
    // Non-critical
  }

  redirect(`/goals/${slug}`);
}
