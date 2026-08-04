import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { NewGoalWizard } from "./NewGoalWizard";

export const metadata: Metadata = {
  title: "Create a Goal",
};

export default async function NewGoalPage() {
  const user = await requireAuth();

  const defaultFounderName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "";

  return <NewGoalWizard defaultFounderName={defaultFounderName} />;
}
