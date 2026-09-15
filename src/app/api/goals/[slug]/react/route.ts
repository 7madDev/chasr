import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

  const user = await getSession();
  
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fingerprint = user.id;

  const dbUser = await prisma.user.findUnique({
    where: { id: fingerprint },
    select: { avatarUrl: true }
  });
  const avatarUrl = dbUser?.avatarUrl || "/avatar.svg";
  const supporter = { id: fingerprint, avatarUrl };

  try {
    const existing = await prisma.reaction.findUnique({
      where: {
        goalId_fingerprint: {
          goalId: goal.id,
          fingerprint,
        },
      },
    });

    if (existing) {
      await prisma.reaction.delete({
        where: { id: existing.id },
      });
      const count = await prisma.reaction.count({ where: { goalId: goal.id } });
      return NextResponse.json({ count, alreadyReacted: false, supporter });
    } else {
      await prisma.reaction.create({
        data: {
          goalId: goal.id,
          fingerprint,
        },
      });
      const count = await prisma.reaction.count({ where: { goalId: goal.id } });
      return NextResponse.json({ count, alreadyReacted: true, supporter });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to react" }, { status: 500 });
  }
}
