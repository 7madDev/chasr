import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const result = await prisma.goal.updateMany({
    where: {
      status: "ACTIVE",
      lastUpdatedAt: { lt: ninetyDaysAgo },
    },
    data: {
      status: "ARCHIVED",
    },
  });

  return NextResponse.json({ archived: result.count });
}
