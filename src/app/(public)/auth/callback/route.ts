import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && session) {
      const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
      
      if (!dbUser) {
        const defaultFounderName = 
          session.user.user_metadata?.full_name || 
          session.user.user_metadata?.name || 
          session.user.email?.split("@")[0] || 
          "Founder";

        await prisma.user.create({
          data: {
            id: session.user.id,
            founderName: defaultFounderName,
          }
        });
        
        return NextResponse.redirect(new URL("/dashboard/onboarding", appUrl));
      }

      return NextResponse.redirect(new URL(redirectTo, appUrl));
    }
  }

  // If there's no code or exchange failed, redirect to sign-in
  return NextResponse.redirect(new URL("/sign-in", appUrl));
}
