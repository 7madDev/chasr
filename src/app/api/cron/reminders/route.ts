import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminderEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Find active goals that need reminders
  const goals = await prisma.goal.findMany({
    where: {
      status: "ACTIVE",
      lastUpdatedAt: { lt: sevenDaysAgo },
      deadline: { gt: thirtyDaysFromNow },
      OR: [
        { lastReminderSentAt: null },
        { lastReminderSentAt: { lt: sevenDaysAgo } },
      ],
    },
  });

  const supabaseAdmin = await createAdminClient();
  let sent = 0;

  for (const goal of goals) {
    try {
      const { data } = await supabaseAdmin.auth.admin.getUserById(goal.ownerId);
      if (data?.user?.email) {
        await sendReminderEmail(data.user.email, goal.productName);
        await prisma.goal.update({
          where: { id: goal.id },
          data: { lastReminderSentAt: new Date() },
        });
        sent++;
      }
    } catch {
      // Log but continue with other goals
      console.error(`Failed to send reminder for goal ${goal.id}`);
    }
  }

  return NextResponse.json({ sent, total: goals.length });
}
