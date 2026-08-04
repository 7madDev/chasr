import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const goal = await prisma.goal.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  // Compute fingerprint
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = headersList.get("user-agent") || "unknown";
  const salt = process.env.CRON_SECRET || "chasr-salt";
  const fingerprint = createHash("sha256")
    .update(`${ip}:${ua}:${salt}`)
    .digest("hex");

  try {
    await prisma.reaction.create({
      data: {
        goalId: goal.id,
        emoji: "🔥",
        fingerprint,
      },
    });
  } catch {
    // Unique constraint violation — already reacted
    const count = await prisma.reaction.count({ where: { goalId: goal.id } });
    return NextResponse.json({ count, alreadyReacted: true });
  }

  const count = await prisma.reaction.count({ where: { goalId: goal.id } });
  return NextResponse.json({ count, alreadyReacted: false });
}
